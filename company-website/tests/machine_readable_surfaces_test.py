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
DRAFT_URL = "https://digitaltechnologypartner.ai/news/2026-02-22-netlify-governance-checklist/"
FULL_GUIDE_URL = "https://digitaltechnologypartner.ai/llms-full.txt"
EXPECTED_SITEMAP_URLS = {
    "https://digitaltechnologypartner.ai/",
    "https://digitaltechnologypartner.ai/home/",
    "https://digitaltechnologypartner.ai/solutions/",
    "https://digitaltechnologypartner.ai/programmes/",
    "https://digitaltechnologypartner.ai/programmes/ai-adoption-readiness/",
    "https://digitaltechnologypartner.ai/programmes/ai-foundry/",
    "https://digitaltechnologypartner.ai/programmes/leadership-ai-coaching/",
    "https://digitaltechnologypartner.ai/process/",
    "https://digitaltechnologypartner.ai/case-studies/",
    "https://digitaltechnologypartner.ai/insights/",
    "https://digitaltechnologypartner.ai/news/",
    "https://digitaltechnologypartner.ai/why-dtp/",
    "https://digitaltechnologypartner.ai/contact/",
    "https://digitaltechnologypartner.ai/news/2026-02-22-aberdeen-decommissioning-ai/",
    "https://digitaltechnologypartner.ai/news/2026-02-22-field-teams-knowledge-retention/",
    "https://digitaltechnologypartner.ai/news/2026-02-22-why-ai-pilots-fail/",
    "https://digitaltechnologypartner.ai/news/2026-02-23-openai-personal-agents-openclaw-foundation/",
    "https://digitaltechnologypartner.ai/news/2026-02-24-vibe-coding-enterprise-risks/",
    "https://digitaltechnologypartner.ai/news/2026-03-04-what-ctos-actually-need-from-ai-vendors-in-2026/",
    "https://digitaltechnologypartner.ai/news/2026-03-07-prompting-after-autonomous-agents/",
    "https://digitaltechnologypartner.ai/news/2026-06-15-the-ai-off-switch-how-anthropics-export-controls-sparked-a-global-ai-sov/",
    "https://digitaltechnologypartner.ai/news/2026-06-17-europes-largest-cybersecurity-seed-neuraltrust-raises-20m-to-govern-ente/",
    "https://digitaltechnologypartner.ai/news/2026-06-18-midjourney-goes-from-generating-cat-images-to-full-body-ultrasound-scans/",
    "https://digitaltechnologypartner.ai/news/2026-06-19-rolling-out-ai-agents-4-ways-to-move-fast-and-furious-but-with-extreme-c/",
    "https://digitaltechnologypartner.ai/news/2026-06-25-70-of-companies-deploying-customer-service-ai-agents-see-roi-in-60-days/",
    "https://digitaltechnologypartner.ai/news/2026-06-29-asian-ai-startups-launch-mythos-like-models-as-anthropics-export-ban-dra/",
    "https://digitaltechnologypartner.ai/news/2026-07-31-as-ai-agents-multiply-identity-becomes-the-enterprise-control-plane-tngl/",
}


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
        self.assertEqual(len(urls), len(set(urls)), "sitemap contains duplicate URLs")
        self.assertEqual(set(urls), EXPECTED_SITEMAP_URLS)
        for url in urls:
            self.assertIsNotNone(url)
            parsed = urlparse(url or "")
            self.assertEqual(parsed.scheme, "https")
            self.assertEqual(parsed.netloc, CANONICAL_HOST)

    def test_robots_points_to_curated_sitemap(self) -> None:
        robots = read_utf8_without_bom(PUBLIC_ROOT / "robots.txt")
        self.assertIn("User-agent: *", robots)
        self.assertIn("Disallow: /news/2026-02-22-netlify-governance-checklist/", robots)
        self.assertIn("Allow: /", robots)
        self.assertIn(f"Sitemap: https://{CANONICAL_HOST}/sitemap.xml", robots)

    def test_llms_links_are_unique_and_in_the_curated_sitemap(self) -> None:
        llms = read_utf8_without_bom(PUBLIC_ROOT / "llms.txt")
        links = re.findall(r"\]\((https://[^)]+)\)", llms)
        self.assertEqual(len(links), len(set(links)), "llms.txt contains duplicate links")
        self.assertIn(FULL_GUIDE_URL, links)
        self.assertTrue((set(links) - {FULL_GUIDE_URL}).issubset(EXPECTED_SITEMAP_URLS))
        self.assertIn("## Start here", llms)
        self.assertIn("## Programmes", llms)
        self.assertIn("## Evidence and commentary", llms)
        self.assertIn("## More detail", llms)
        self.assertNotIn(DRAFT_URL, llms)
        self.assertNotIn("localhost", llms)
        self.assertNotIn("/about/", llms)
        self.assertNotIn("/case-study)", llms)

    def test_llms_full_indexes_the_complete_approved_inventory(self) -> None:
        full = read_utf8_without_bom(PUBLIC_ROOT / "llms-full.txt")
        links = re.findall(r"\]\((https://[^)]+)\)", full)
        self.assertEqual(len(links), len(set(links)), "llms-full.txt contains duplicate links")
        self.assertEqual(set(links), EXPECTED_SITEMAP_URLS)
        self.assertNotIn(DRAFT_URL, full)

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
