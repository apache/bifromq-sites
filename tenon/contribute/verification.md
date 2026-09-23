---
title: Verify & Submit
sidebar_position: 5
description: Gather useful verification evidence for a Tenon SDK, IPC, scaffold, or packaging contribution.
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

# Verify and submit your contribution

Show the behavior your change enables or fixes, and give reviewers enough information to reproduce it.

## Choose the relevant checks

| Change | Evidence to include |
| --- | --- |
| SDK behavior | Normal operation, completion results, failure handling, and shutdown with a real Runner |
| IPC | Shared vectors, native process tests, and interoperability between language implementations |
| Scaffold or bundler | A freshly generated project that builds, installs, and runs |
| Shared contracts | Agreement between definitions, examples, and every affected implementation |

Use the repository's pinned toolchains and verification commands. Start with focused checks while iterating, then run the applicable complete verification before proposing the change.

## Prepare the pull request

- Explain the problem and the resulting behavior.
- List the checks run and the platforms tested; identify any untested platforms.
- Include reproducible evidence for runtime or interoperability changes.
- Update affected examples and documentation, and retain license and attribution notices.

## Repository instructions

- [Contributing](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/CONTRIBUTING.md) — setup, coding conventions, and verification commands.
- [SDK contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/sdk/SDK-impl-contract.md) — SDK and generated-project acceptance requirements.
- [IPC contract](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/ipc/README.md) — protocol and cross-process checks.
- [CI configuration](https://github.com/apache/bifromq-tenon/blob/21452dc53be3491567dbe9958294e34bf0fc79f5/.github/workflows/ci.yml) — the project's automated platform checks.

Submit the change to [apache/bifromq-tenon](https://github.com/apache/bifromq-tenon/pulls).
