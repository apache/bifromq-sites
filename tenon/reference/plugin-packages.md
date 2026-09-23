---
title: Plugin Package Format
description: Plugin bundle contents, manifest metadata, platform support, and immutable identity.
---

<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# Plugin package format

A plugin bundle installs a **Program**, identified by `programName` and an exact semantic version. A Tenon Document runs that Program through one or more configured instances.

Programs implement `source`, `sink`, or `source-and-sink`.

## Package structure

A bundle is a gzip tar archive with three required files at its root:

| File | Contents |
| --- | --- |
| `manifest.json` | Identity, display metadata, interface, supported platforms, and launch command |
| `config.schema.json` | Allowed plugin configuration |
| `payload.descriptor.pb` | Protobuf descriptors for the implemented Source and/or Sink payloads |

Include the launcher, executable, libraries, and other required resources as ordinary files. The payload descriptor must include source information and the matching top-level `SourceRecordPayload` and/or `SinkRecordPayload` roots. Standard bundling tools generate it.

### Archive rules

- Use relative, canonical paths.
- Do not include absolute paths, `.` or `..` components, duplicate normalized paths, symlinks, hard links, or special files.
- Directory entries and archived permission bits do not affect package identity.
- Installed directories use mode `0700`; ordinary files use `0500`.

### Launch command

The manifest's `command` is an argument array executed from the installation directory, without a shell. Bare command names use the inherited `PATH`.

Tenon appends its reserved `--sdk-config` argument; do not put it in the manifest. Use stdout and stderr for diagnostic text. See the [Manifest Schema](/tenon/docs/development/reference/manifest-schema/) for all fields.

## Display metadata

| Required field | Allowed value |
| --- | --- |
| `displayName` | 1–80 Unicode code points of single-line plain text |
| `description` | 1–1024 Unicode code points of plain text; LF/CR line breaks are allowed |

Both fields must contain a non-whitespace character. C0/C1 controls are forbidden except LF/CR in descriptions; display names also exclude Unicode line and paragraph separators.

Values are preserved exactly, without trimming or inferred defaults. They are plain text, not HTML or Markdown. The Runner returns them in plugin list and detail responses; Console uses them for display.

Platform variants of one Program version must use identical display metadata. Changing the text changes package content and conflicts with an already installed identity. Bundles missing either field are invalid.

## Platform and immutability

| Manifest field | Values |
| --- | --- |
| `os` | `linux`, `darwin` |
| `architecture` | `amd64`, `arm64` |

The platform list must be nonempty, with no aliases, wildcards, or duplicates. One bundle has one launch command, even if it lists several platforms. Installation rejects a bundle that does not support the Runner's platform.

Tenon Document external dependencies, such as a JVM. Installation does not run the plugin to test them; missing dependencies appear as startup failures.

Package identity follows these rules:

- On one Runner, the same identity must have the same normalized ordinary-file paths and bytes. Reinstalling identical content is safe; changed content conflicts.
- Across platform variants, interface, configuration schema, payload descriptors, and business behavior must match. Launchers, bundled runtimes, and platform-specific files may differ.
- Use a new exact version for a semantic change. Display metadata is part of immutable package content too.

## Upgrade a plugin

1. Install the new bundle through `POST /plugins`.
2. Update the Tenon Document to use the new exact version.
3. Confirm application and wait for old processes to stop.
4. Remove the old version after no saved Tenon Document or active process references it.

Do not edit installed files. A damaged package can stop the Runner or leave dependent pipelines unready; restore it by reinstalling the original bundle.

## SDKs and generators

- [Develop a Rust plugin](/tenon/docs/development/develop/rust/) with the Rust scaffold and `cargo tenon`.
- [Develop a Java plugin](/tenon/docs/development/develop/java/) with the Maven archetype and packaging plugin.
- [Use debugging plugins](/tenon/docs/development/plugins/debugging/) to exercise a Flow locally.

Describe when your plugin acknowledges, retries, and rejects records. Test shutdown, recovery, and actual delivery as well as startup. See [Test & Package](/tenon/docs/development/develop/test-package/) and [Verify & Submit](/tenon/docs/development/contribute/verification/).
