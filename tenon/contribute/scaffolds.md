---
title: Scaffold & Packaging Tools
sidebar_position: 4
description: Help plugin authors start from a working project and build an installable Tenon bundle.
---

# Contribute scaffolds and packaging tools

A scaffold gives plugin authors a working starting point. A packaging tool turns their project into a bundle that the Runner can install.

## What to deliver

| Tool | Expected result |
| --- | --- |
| Scaffold | A small Source, Sink, or combined plugin with editable configuration, payloads, tests, and build instructions |
| Bundler | A complete plugin archive with validated metadata, payload descriptors, platform declarations, and license material |

Keep generated code easy to understand. Use the SDK's public API and the shared package definitions rather than reproducing Runner behavior in the template.

## Check the author experience

1. Generate a fresh project in an empty directory.
2. Follow its README to build and bundle it from source.
3. Install it in a Runner and confirm actual input and output.
4. Check normal shutdown and an appropriate failure case.

## Implementation details

- [Rust scaffold](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/rust/rust-plugin-scaffold/README.md) — templates and generation options.
- [cargo-tenon](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/rust/cargo-tenon/README.md) — Rust packaging tool.
- [Java SDK and archetype](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/java/README.md) — project generation and Maven packaging.
- [SDK and packaging contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/SDK-impl-contract.md) — required behavior and package validation.
- [Plugin manifest schema](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/contracts/plugin/manifest.schema.json) — manifest fields and constraints.
