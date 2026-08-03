from __future__ import annotations

import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
PUBLIC = ROOT / "public"
REQUIRED = ("robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt")
SITE_ORIGIN = "https://digitaltechnologypartner.ai"
# This is deliberately the reviewed public/canonical inventory, not every static
# route emitted by Astro (which also includes labs, previews and utility pages).
EXPECTED_SITEMAP_URLS = {
    f"{SITE_ORIGIN}/",
    f"{SITE_ORIGIN}/case-studies/",
    f"{SITE_ORIGIN}/contact/",
    f"{SITE_ORIGIN}/home/",
    f"{SITE_ORIGIN}/insights/",
    f"{SITE_ORIGIN}/news/",
    f"{SITE_ORIGIN}/news/2026-02-22-aberdeen-decommissioning-ai/",
    f"{SITE_ORIGIN}/news/2026-02-22-field-teams-knowledge-retention/",
    f"{SITE_ORIGIN}/news/2026-02-22-netlify-governance-checklist/",
    f"{SITE_ORIGIN}/news/2026-02-22-why-ai-pilots-fail/",
    f"{SITE_ORIGIN}/news/2026-02-23-openai-personal-agents-openclaw-foundation/",
    f"{SITE_ORIGIN}/news/2026-02-24-vibe-coding-enterprise-risks/",
    f"{SITE_ORIGIN}/news/2026-03-04-what-ctos-actually-need-from-ai-vendors-in-2026/",
    f"{SITE_ORIGIN}/news/2026-03-07-prompting-after-autonomous-agents/",
    f"{SITE_ORIGIN}/news/2026-06-15-the-ai-off-switch-how-anthropics-export-controls-sparked-a-global-ai-sov/",
    f"{SITE_ORIGIN}/news/2026-06-17-europes-largest-cybersecurity-seed-neuraltrust-raises-20m-to-govern-ente/",
    f"{SITE_ORIGIN}/news/2026-06-18-midjourney-goes-from-generating-cat-images-to-full-body-ultrasound-scans/",
    f"{SITE_ORIGIN}/news/2026-06-19-rolling-out-ai-agents-4-ways-to-move-fast-and-furious-but-with-extreme-c/",
    f"{SITE_ORIGIN}/news/2026-06-25-70-of-companies-deploying-customer-service-ai-agents-see-roi-in-60-days/",
    f"{SITE_ORIGIN}/news/2026-06-29-asian-ai-startups-launch-mythos-like-models-as-anthropics-export-ban-dra/",
    f"{SITE_ORIGIN}/news/2026-07-31-as-ai-agents-multiply-identity-becomes-the-enterprise-control-plane-tngl/",
    f"{SITE_ORIGIN}/process/",
    f"{SITE_ORIGIN}/programmes/",
    f"{SITE_ORIGIN}/programmes/ai-adoption-readiness/",
    f"{SITE_ORIGIN}/programmes/ai-foundry/",
    f"{SITE_ORIGIN}/programmes/leadership-ai-coaching/",
    f"{SITE_ORIGIN}/solutions/",
    f"{SITE_ORIGIN}/why-dtp/",
}
REVIEWED_MACHINE_URLS = {
    f"{SITE_ORIGIN}/sitemap.xml",
    f"{SITE_ORIGIN}/llms.txt",
    f"{SITE_ORIGIN}/llms-full.txt",
    f"{SITE_ORIGIN}/robots.txt",
}
EXPECTED_CONTENT_TYPES = {
    "/robots.txt": "text/plain; charset=utf-8",
    "/sitemap.xml": "application/xml; charset=utf-8",
    "/llms.txt": "text/plain; charset=utf-8",
    "/llms-full.txt": "text/plain; charset=utf-8",
}


class MachineReadableSurfaceTests(unittest.TestCase):
    def test_required_files_are_copied_to_dist_unchanged(self) -> None:
        for name in REQUIRED:
            with self.subTest(name=name):
                built = DIST / name
                self.assertTrue(built.is_file(), f"missing build output: {built}")
                self.assertEqual(built.read_bytes(), (PUBLIC / name).read_bytes())

    def test_text_outputs_are_utf8_and_not_gallery_html(self) -> None:
        gallery_markers = ("<!doctype html", "<html")
        for name in REQUIRED:
            with self.subTest(name=name):
                text = (DIST / name).read_bytes().decode("utf-8")
                lowered = text.lower()
                self.assertFalse(any(marker in lowered for marker in gallery_markers))

    def test_sitemap_is_valid_and_exactly_matches_approved_inventory(self) -> None:
        root = ET.parse(DIST / "sitemap.xml").getroot()
        namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = {element.text for element in root.findall("sm:url/sm:loc", namespace)}
        self.assertEqual(urls, EXPECTED_SITEMAP_URLS)

    def test_no_competing_generated_sitemap_is_published(self) -> None:
        self.assertFalse((DIST / "sitemap-index.xml").exists())
        self.assertFalse((DIST / "sitemap-0.xml").exists())

    def test_all_embedded_public_urls_are_reviewed(self) -> None:
        allowed = EXPECTED_SITEMAP_URLS | REVIEWED_MACHINE_URLS
        for name in REQUIRED:
            text = (DIST / name).read_text(encoding="utf-8")
            urls = set(re.findall(r"https://digitaltechnologypartner\.ai[^\s)<]+", text))
            with self.subTest(name=name):
                self.assertLessEqual(urls, allowed)

    def test_netlify_serves_direct_files_with_explicit_content_types(self) -> None:
        config = (ROOT / "netlify.toml").read_text(encoding="utf-8")
        redirect_blocks = re.findall(
            r"\[\[redirects\]\](.*?)(?=\n\[\[|\Z)", config, re.DOTALL
        )
        redirect_paths = {
            match.group(1)
            for block in redirect_blocks
            if (match := re.search(r'^\s*from\s*=\s*"([^"]+)"', block, re.MULTILINE))
        }
        self.assertNotIn("/*", redirect_paths)
        for path, content_type in EXPECTED_CONTENT_TYPES.items():
            with self.subTest(path=path):
                header_block = re.search(
                    rf'\[\[headers\]\]\s+for\s*=\s*"{re.escape(path)}"'
                    r"(.*?)(?=\n\[\[|\Z)",
                    config,
                    re.DOTALL,
                )
                if header_block is None:
                    self.fail(f"missing Netlify header block for {path}")
                block = header_block.group(1)
                self.assertIn(f'Content-Type = "{content_type}"', block)
                self.assertIn(
                    'Cache-Control = "public, max-age=0, must-revalidate"', block
                )


if __name__ == "__main__":
    unittest.main()
