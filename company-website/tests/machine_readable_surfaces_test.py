from __future__ import annotations

import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse


SITE_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = SITE_ROOT / "public"
DIST_ROOT = SITE_ROOT / "dist"
REPO_ROOT = SITE_ROOT.parent
SURFACES = {
    "robots.txt": "text/plain; charset=utf-8",
    "sitemap.xml": "application/xml; charset=utf-8",
    "llms.txt": "text/plain; charset=utf-8",
    "llms-full.txt": "text/plain; charset=utf-8",
}
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
CANONICAL_HOST = "digitaltechnologypartner.ai"


def read_utf8_without_bom(path: Path) -> str:
    raw = path.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        raise AssertionError(f"{path} contains a UTF-8 BOM")
    return raw.decode("utf-8")


class MachineReadableSurfacesTest(unittest.TestCase):
    def test_public_sources_are_utf8_non_html_files(self) -> None:
        for name in SURFACES:
            path = PUBLIC_ROOT / name
            self.assertTrue(path.is_file(), f"missing source file: {path}")
            body = read_utf8_without_bom(path)
            self.assertNotIn("<!doctype html", body.lower(), f"{name} contains HTML fallback content")

    def test_built_surfaces_exist_at_root_and_are_not_html(self) -> None:
        for name in SURFACES:
            path = DIST_ROOT / name
            self.assertTrue(path.is_file(), f"missing built root file: {path}; run npm run build first")
            body = read_utf8_without_bom(path)
            self.assertNotIn("<!doctype html", body.lower(), f"{name} built as HTML")

    def test_sitemap_is_valid_and_uses_only_verified_canonical_urls(self) -> None:
        root = ET.parse(PUBLIC_ROOT / "sitemap.xml").getroot()
        self.assertEqual(root.tag, "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset")
        urls = [node.text for node in root.findall("sm:url/sm:loc", SITEMAP_NS)]
        self.assertEqual(len(urls), 34)
        self.assertEqual(len(urls), len(set(urls)), "sitemap contains duplicate URLs")
        for url in urls:
            self.assertIsNotNone(url)
            parsed = urlparse(url or "")
            self.assertEqual(parsed.scheme, "https")
            self.assertEqual(parsed.netloc, CANONICAL_HOST)

    def test_robots_points_to_curated_sitemap(self) -> None:
        robots = read_utf8_without_bom(PUBLIC_ROOT / "robots.txt")
        self.assertIn("User-agent: *", robots)
        self.assertIn("Allow: /", robots)
        self.assertIn(f"Sitemap: https://{CANONICAL_HOST}/sitemap.xml", robots)

    def test_netlify_configs_define_exact_mime_and_cache_contract(self) -> None:
        for config_path in (REPO_ROOT / "netlify.toml", SITE_ROOT / "netlify.toml"):
            config = config_path.read_text(encoding="utf-8")
            header_blocks = {
                route: body
                for route, body in re.findall(
                    r'\[\[headers\]\]\s+for\s*=\s*"([^"]+)"\s+\[headers\.values\](.*?)(?=\n\[\[|\Z)',
                    config,
                    flags=re.DOTALL,
                )
            }
            for name, content_type in SURFACES.items():
                route = f"/{name}"
                self.assertIn(route, header_blocks, f"{config_path} omits {route} headers")
                block = header_blocks[route]
                self.assertIn(f'Content-Type = "{content_type}"', block)
                self.assertIn('Cache-Control = "public, max-age=0, must-revalidate"', block)
                self.assertIn('X-Content-Type-Options = "nosniff"', block)

            fallback_blocks = re.findall(
                r'\[\[redirects\]\](.*?)(?=\n\[\[|\Z)', config, flags=re.DOTALL
            )
            for block in fallback_blocks:
                if re.search(r'from\s*=\s*"/\*"', block):
                    self.assertNotRegex(block, r'force\s*=\s*true', f"{config_path} forces the HTML fallback")


if __name__ == "__main__":
    unittest.main()
