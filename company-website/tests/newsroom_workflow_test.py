from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DISCOVER = REPO_ROOT / 'scripts' / 'news' / 'discover_topics'
GENERATE = REPO_ROOT / 'scripts' / 'news' / 'generate_draft'
VALIDATE = REPO_ROOT / 'scripts' / 'news' / 'validate_approved'
PREPARE = REPO_ROOT / 'scripts' / 'news' / 'prepare_publish'
GUARD = REPO_ROOT / 'scripts' / 'news' / 'guard_production_domains.py'


class NewsroomWorkflowTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmpdir = tempfile.TemporaryDirectory()
        self.root = Path(self.tmpdir.name)
        (self.root / 'src' / 'content' / 'news' / 'shortlists').mkdir(parents=True, exist_ok=True)

    def tearDown(self) -> None:
        self.tmpdir.cleanup()

    def run_script(self, script: Path, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(script), *args],
            cwd=self.root,
            capture_output=True,
            text=True,
        )

    def test_discover_topics_creates_deterministic_shortlist(self) -> None:
        result = self.run_script(DISCOVER, '--date', '2026-06-14')
        self.assertEqual(result.returncode, 0, result.stderr or result.stdout)

        shortlist = self.root / 'src' / 'content' / 'news' / 'shortlists' / '2026-06-14-topics.json'
        self.assertTrue(shortlist.exists())

        payload = json.loads(shortlist.read_text(encoding='utf-8'))
        self.assertEqual(payload['date'], '2026-06-14')
        self.assertEqual(payload['count'], 10)
        self.assertEqual(len(payload['topics']), 10)

        ids = [topic['id'] for topic in payload['topics']]
        self.assertEqual(ids, [f'topic-{index:02d}' for index in range(1, 11)])

        for topic in payload['topics']:
            self.assertIn('title', topic)
            self.assertIn('category', topic)
            self.assertIn('source', topic)
            self.assertIn('status', topic)

    def test_discover_topics_rerun_does_not_overwrite_without_force(self) -> None:
        first = self.run_script(DISCOVER, '--date', '2026-06-14')
        self.assertEqual(first.returncode, 0, first.stderr or first.stdout)

        shortlist = self.root / 'src' / 'content' / 'news' / 'shortlists' / '2026-06-14-topics.json'
        original_bytes = shortlist.read_bytes()

        second = self.run_script(DISCOVER, '--date', '2026-06-14')
        self.assertNotEqual(second.returncode, 0, second.stdout)
        self.assertEqual(shortlist.read_bytes(), original_bytes)

    def test_generate_draft_uses_shortlist_date_and_selected_topic(self) -> None:
        discover = self.run_script(DISCOVER, '--date', '2026-01-03')
        self.assertEqual(discover.returncode, 0, discover.stderr or discover.stdout)

        shortlist = self.root / 'src' / 'content' / 'news' / 'shortlists' / '2026-01-03-topics.json'
        generate = self.run_script(
            GENERATE,
            '--shortlist',
            str(shortlist),
            '--topic-id',
            'topic-01',
        )
        self.assertEqual(generate.returncode, 0, generate.stderr or generate.stdout)

        payload = json.loads(shortlist.read_text(encoding='utf-8'))
        selected = payload['topics'][0]

        article_files = sorted((self.root / 'src' / 'content' / 'news').glob('*.md'))
        self.assertEqual(len(article_files), 1)

        article = article_files[0]
        self.assertTrue(article.name.startswith('2026-01-03-'))

        text = article.read_text(encoding='utf-8')
        self.assertIn(f'title: "{selected["title"]}"', text)
        self.assertIn('pubDate: 2026-01-03', text)
        self.assertIn('approved: false', text)
        self.assertIn(f'source: "{selected["source"]}"', text)

    def test_generate_draft_blocks_duplicates(self) -> None:
        discover = self.run_script(DISCOVER, '--date', '2026-01-03')
        self.assertEqual(discover.returncode, 0, discover.stderr or discover.stdout)

        shortlist = self.root / 'src' / 'content' / 'news' / 'shortlists' / '2026-01-03-topics.json'
        first = self.run_script(GENERATE, '--shortlist', str(shortlist), '--topic-id', 'topic-01')
        self.assertEqual(first.returncode, 0, first.stderr or first.stdout)

        second = self.run_script(GENERATE, '--shortlist', str(shortlist), '--topic-id', 'topic-01')
        self.assertNotEqual(second.returncode, 0)
        self.assertIn('Duplicate', second.stderr + second.stdout)
        self.assertEqual(len(list((self.root / 'src' / 'content' / 'news').glob('*.md'))), 1)

    def test_generate_draft_fails_cleanly_for_malformed_shortlist(self) -> None:
        shortlist = self.root / 'src' / 'content' / 'news' / 'shortlists' / 'broken.json'
        shortlist.write_text('{"date": "2026-06-14", "topics": [{}]}', encoding='utf-8')

        result = self.run_script(GENERATE, '--shortlist', str(shortlist), '--topic-id', 'topic-01')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(len(list((self.root / 'src' / 'content' / 'news').glob('*.md'))), 0)

    def test_validate_approved_fails_for_placeholder_content(self) -> None:
        article = self.root / 'src' / 'content' / 'news' / '2026-06-14-test.md'
        article.write_text(
            '---\n'
            'title: "Test article"\n'
            'description: "Draft generated from newsroom shortlist."\n'
            'pubDate: 2026-06-14\n'
            'category: "AI"\n'
            'approved: true\n'
            '---\n\n'
            '## Why this topic matters\n\n'
            'Add practical context for operators and decision-makers.\n\n'
            '---\n\n'
            '*AI-assisted draft. Human review and approval required before publish.*\n',
            encoding='utf-8',
        )

        result = self.run_script(VALIDATE)
        self.assertNotEqual(result.returncode, 0)
        output = result.stdout + result.stderr
        self.assertIn('missing source', output)
        self.assertIn('missing approvedBy', output)
        self.assertIn('missing approvedAt', output)
        self.assertIn('default draft description still present', output)
        self.assertIn('draft footer still present', output)
        self.assertIn('missing DTP context section', output)

    def test_validate_approved_fails_for_placeholder_scaffold_sections(self) -> None:
        article = self.root / 'src' / 'content' / 'news' / '2026-06-14-test.md'
        article.write_text(
            '---\n'
            'title: "Test article"\n'
            'description: "A real looking description."\n'
            'pubDate: 2026-06-14\n'
            'category: "AI"\n'
            'approved: true\n'
            'approvedBy: "Steve"\n'
            'approvedAt: 2026-06-14\n'
            'source: "Source note"\n'
            '---\n\n'
            '## Why this topic matters\n\n'
            'Add practical context for operators and decision-makers.\n\n'
            '## What is changing now\n\n'
            '- Change 1\n- Change 2\n- Change 3\n\n'
            '## What to do next\n\n'
            '1. Action one\n2. Action two\n3. Action three\n\n'
            '## Why this matters to Digital Technology Partner\n\n'
            'Useful DTP context.\n',
            encoding='utf-8',
        )

        result = self.run_script(VALIDATE)
        self.assertNotEqual(result.returncode, 0)
        output = result.stdout + result.stderr
        self.assertIn('placeholder scaffold text', output)

    def test_prepare_publish_is_idempotent(self) -> None:
        article = self.root / 'src' / 'content' / 'news' / '2026-06-14-test.md'
        article.write_text(
            '---\n'
            'title: "Test article"\n'
            'description: "Draft generated from newsroom shortlist."\n'
            'pubDate: 2026-06-14\n'
            'category: "AI"\n'
            'approved: false\n'
            'source: "Source note"\n'
            '---\n\n'
            '## Why this topic matters\n\n'
            'Add practical context for operators and decision-makers.\n\n'
            '---\n\n'
            '*AI-assisted draft. Human review and approval required before publish.*\n',
            encoding='utf-8',
        )

        first = self.run_script(PREPARE, '--file', str(article))
        self.assertEqual(first.returncode, 0, first.stderr or first.stdout)
        second = self.run_script(PREPARE, '--file', str(article))
        self.assertEqual(second.returncode, 0, second.stderr or second.stdout)

        text = article.read_text(encoding='utf-8')
        self.assertNotIn('Draft generated from newsroom shortlist.', text)
        self.assertNotIn('*AI-assisted draft. Human review and approval required before publish.*', text)
        self.assertEqual(text.count('## Why this matters to Digital Technology Partner'), 1)

    def test_production_domain_guard_allows_ordinary_live_site_references(self) -> None:
        scripts_dir = self.root / 'scripts' / 'news'
        scripts_dir.mkdir(parents=True, exist_ok=True)
        (self.root / 'tests').mkdir(parents=True, exist_ok=True)
        (self.root / 'package.json').write_text('{"name":"tmp"}\n', encoding='utf-8')
        (scripts_dir / 'ok.sh').write_text(
            'CANONICAL="https://digitaltechnologypartner.ai/news/test"\n'
            'curl -I https://digitaltechnologypartner.ai/sitemap-index.xml\n'
            'curl -I https://dtpwebsite.netlify.app/\n',
            encoding='utf-8',
        )

        result = self.run_script(GUARD, '--root', str(self.root))
        self.assertEqual(result.returncode, 0, result.stderr or result.stdout)
        self.assertIn('PASSED', result.stdout)

    def test_production_domain_guard_blocks_herenow_mount_context(self) -> None:
        scripts_dir = self.root / 'scripts' / 'news'
        scripts_dir.mkdir(parents=True, exist_ok=True)
        (self.root / 'tests').mkdir(parents=True, exist_ok=True)
        (self.root / 'package.json').write_text('{"name":"tmp"}\n', encoding='utf-8')
        (scripts_dir / 'bad.sh').write_text(
            'curl https://api.here.now/custom-domain/mount '
            'digitaltechnologypartner.ai\n',
            encoding='utf-8',
        )

        result = self.run_script(GUARD, '--root', str(self.root))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('FAILED', result.stderr)
        self.assertIn('digitaltechnologypartner.ai', result.stderr)
        self.assertIn('custom-domain', result.stderr)

    def test_production_domain_guard_blocks_explicit_command_text(self) -> None:
        (self.root / 'scripts' / 'news').mkdir(parents=True, exist_ok=True)
        (self.root / 'tests').mkdir(parents=True, exist_ok=True)
        (self.root / 'package.json').write_text('{"name":"tmp"}\n', encoding='utf-8')

        result = self.run_script(
            GUARD,
            '--root',
            str(self.root),
            '--check-text',
            'pair www.digitaltechnologypartner.ai to fallback.here.now',
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('text[1]', result.stderr)
        self.assertIn('www.digitaltechnologypartner.ai', result.stderr)

    def test_production_build_keeps_drafts_off_public_routes_and_disables_preview(self) -> None:
        build = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
        )
        self.assertEqual(build.returncode, 0, build.stderr or build.stdout)

        dist = REPO_ROOT / 'dist'
        approved_route = dist / 'news' / '2026-02-22-aberdeen-decommissioning-ai' / 'index.html'
        draft_route = dist / 'news' / '2026-02-22-ai-assisted-human-approved-model' / 'index.html'
        preview_index = dist / 'news' / 'preview' / 'index.html'
        preview_draft_route = dist / 'news' / 'preview' / '2026-02-22-ai-assisted-human-approved-model' / 'index.html'

        self.assertTrue(approved_route.exists())
        self.assertFalse(draft_route.exists())
        self.assertTrue(preview_index.exists())
        self.assertFalse(preview_draft_route.exists())

        preview_html = preview_index.read_text(encoding='utf-8')
        self.assertIn('Preview unavailable in production', preview_html)
        self.assertIn('Draft preview is limited to local development', preview_html)
        self.assertNotIn('2026-02-22-ai-assisted-human-approved-model', preview_html)


if __name__ == '__main__':
    unittest.main()
