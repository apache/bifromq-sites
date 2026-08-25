---
sidebar_position: 2
title: "Documentation Contribution"
---

## Contribute to Documentation

We welcome and encourage all kinds of documentation improvements.

### What You Can Contribute

Here are some ways you can help improve the documentation:

- Fix typos, grammar, or formatting issues
- Clarify instructions or explanations
- Update outdated content
- Add new sections (e.g., feature usage, configuration examples, deployment tips)
- Improve the structure or navigation
- Improve English-language documentation and terminology
- Update or improve the project website

No contribution is too small — even fixing a broken link makes a difference!

### How the Documentation is Organized

BifroMQ’s documentation is hosted in the main [GitHub repository](https://github.com/apache/bifromq-sites) under: `docs/`

- `docs/` contains technical guides, usage examples, and system architecture.

### How to Contribute Documentation

1. **Fork the Repository**

   Fork [bifromq-sites](https://github.com/apache/bifromq-sites) to your own GitHub account.

2. **Create a Branch**

   ```bash
   git checkout -b feat-xyz
   ```

3. **Edit or Add Content**
   - Use Markdown for most files.
   - Follow the existing writing style and structure.
   - Preview locally if making website changes (e.g., using `pnpm install` then running `pnpm start`).

4. **Open a Pull Request**
   - Push your branch and open a PR targeting the `master` branch.
   - Use a clear title like: `[Docs] Clarify broker configuration options`.
   - Explain what you changed and why.

### Writing Guidelines

- Use clear, concise language.
- Favor practical examples and command-line snippets.
- Be consistent in tone (neutral and helpful).
- Link to relevant code or external references when useful.

### Documentation Language and Versions

The project currently maintains official documentation in English only. A localization proposal needs identified maintainers and reviewers, together with a sustainable update process, before localized pages are published as official documentation.

The current release documentation is the primary, indexable documentation set. Version 3.3.x remains indexable as the latest historical 3.x reference and is clearly marked as unmaintained. Versions 3.2.x and earlier remain available for existing users, but are marked as archived and excluded from search indexing and the sitemap to avoid presenting outdated instructions as current guidance.

Archived pages keep their version-specific URLs and must not be canonicalized to current documentation unless the content is verified to be equivalent.

### Need Help?

If you're unsure about what or how to contribute:

- **Check open issues** labeled `documentation` or `good first issue`
- **Ask on the mailing list:** [dev@bifromq.apache.org](mailto:dev@bifromq.apache.org)
