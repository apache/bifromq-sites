---
title: HTTP API
description: Manage Tenon Documents, pipelines, and plugins through the Runner HTTP API.
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

# Runner HTTP API

The Runner serves its OpenAPI 3.1 description at `GET /openapi.json`. Use that description for exact request and response schemas, filters, and error fields. All responses include `Tenon-Version`.

This API controls plugin execution and exposes saved configuration. Configure [transport and access](/tenon/docs/development/reference/runner/#transport-and-access) for trusted operators.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/documents` | List saved Tenon Document IDs and ETags |
| GET, PUT, DELETE | `/documents/{id}` | Read, save, or remove a Tenon Document |
| GET | `/document-schema` | Read this Runner's Tenon Document Schema |
| GET | `/pipelines` | List runtime status |
| GET | `/pipelines/{id}` | Read state, issues, and plugin details |
| GET | `/pipelines/{id}/diagnostics?target=...` | Follow live diagnostics |
| GET, POST | `/plugins` | List Programs or install a bundle |
| GET, DELETE | `/plugins/{programName}/{exactVersion}` | Inspect or uninstall one Program |
| GET | `/plugins/{programName}/{exactVersion}/config-schema` | Read its configuration schema |
| GET | `/plugins/{programName}/{exactVersion}/payload-contract` | Read its Protobuf FileDescriptorSet |
| GET | `/metrics` | Collect current metrics |

Percent-encode each resource ID as one URL path segment. There is no separate health or validation endpoint; read `/openapi.json` or `/plugins` to check API availability without changing state.

## Conditional Tenon Document writes {#conditional-document-writes}

Read a Tenon Document with GET to obtain its original JSONC bytes and strong ETag. Keep the ETag's surrounding quotes.

| Operation | Required header | Success |
| --- | --- | --- |
| Create with PUT | `If-None-Match: *` | `201`, with the saved ETag |
| Replace with PUT | `If-Match: "current-etag"` | `204`, with the new ETag |
| Delete an existing Tenon Document | `If-Match: "current-etag"` | `204`, after removal from storage |
| Delete an absent Tenon Document | None | `204` |

For PUT, the URL ID must exactly match `id` in the body. Saving checks structure and Lua syntax, then persists the original bytes. Applying the configuration happens asynchronously.

| Rejection | Response |
| --- | --- |
| Missing write condition | `428` |
| Stale ETag | `412` |
| Malformed condition header | `400` |
| Invalid Tenon Document | `422 invalid_tenon_document`, with issues |
| Custom execution policy denies the change | `403`, before persistence |

After a failed or lost write response, GET the Tenon Document and compare its bytes or ETag before retrying. The first write may already have succeeded.

## Runtime status

| Resource | States |
| --- | --- |
| Pipeline | `unready`, `starting`, `updating`, `running`, `restart-backoff` |
| Plugin instance | `starting`, `running`, `start-failed`, `restart-backoff` |

There is no independent Flow health field.

| Field | How to read it |
| --- | --- |
| `documentEtag` | Latest saved Tenon Document |
| `appliedDocumentEtag` | Configuration applied by the live pipeline, when present |
| `runtimeIssues` | Reasons a saved configuration cannot run; identifies the affected Program, instance, or Flow |
| `lastError` | Sanitized failure details during restart backoff; an included ETag identifies the configuration that failed |

Different ETags mean an update is pending or the new configuration is not ready. The previous configuration may still be running. Resource-enforcement status describes the applied configuration.

Check plugin connectivity and destination output separately: pipeline state does not prove external delivery.

## Plugin metadata

`GET /plugins` returns a `plugins` array. Both list entries and single-Program responses include:

- `programName`, `exactVersion`, and `interface`;
- `displayName` and `description` from the installed manifest;
- supported `platforms`.

The API preserves display text as installed. It does not return the launch command or the full manifest. See [display metadata](/tenon/docs/development/reference/plugin-packages/#display-metadata) for field rules.

## Install and remove plugins

POST raw gzip tar bytes to `/plugins` with `Content-Type: application/vnd.apache.tenon.plugin+tar+gzip`. Multipart data, Base64, and download URLs are not accepted. The bundle's manifest supplies its identity and interface.

| Bundle content | Response |
| --- | --- |
| New identity | `201` |
| Same identity and identical normalized files | `204` |
| Same identity with different content | `409` |

Uninstalling is blocked while a saved Tenon Document or active process references the Program. After deleting a Tenon Document, allow its processes to stop before retrying removal. See [package rules](/tenon/docs/development/reference/plugin-packages/).

## Response formats and failures

| Content | Media type |
| --- | --- |
| Saved Tenon Document | `application/jsonc` |
| Ordinary API response | `application/json` |
| Schema | `application/schema+json` |
| Payload descriptor | `application/x-protobuf` |

Ordinary errors contain an `error` object with stable English `code` and `message` fields, plus endpoint-specific details.

- Unknown routes return `404`; shutdown rejects new work with `503`.
- A Tenon Document storage failure returns `500 tenon_document_store_failed`.
- Plugin storage failures can stop the Runner. Keep its stderr and exit status.
- The API sets no total Tenon Document or compressed-upload byte limit. Apply suitable request, rate, connection, and resource limits in your deployment.

For streaming and metric formats, see [Metrics & Diagnostics](/tenon/docs/development/user-guide/observability/).
