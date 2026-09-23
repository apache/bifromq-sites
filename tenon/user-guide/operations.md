---
title: Run & Manage Tenon
sidebar_position: 4
description: Apply Tenon Documents, inspect runtime state, and stop Tenon safely.
---

# Run and manage Tenon

Use the Runner configuration for startup settings and the HTTP API for pipelines and plugins.

## Configure and start

Save the following as `runner.jsonc`. Replace `/absolute/path/tenon-state` with an absolute, writable path for this Runner's installed plugins and saved Tenon Documents:

```json
{
  "stateDirectory": "/absolute/path/tenon-state",
  "http": {"listenAddress": "127.0.0.1:18080"},
  "pipeline": {"retryBackoff": {"initialDelayMs": 100, "maximumDelayMs": 30000}},
  "lua": {"cpuTimeLimitMs": 50, "memoryLimitBytes": 16777216}
}
```

- Use a separate state directory for each Runner. New directories use mode `0700`; existing directories must use that mode and cannot be symbolic links.
- This local listener accepts requests without authentication. Configure [management access](/tenon/docs/development/reference/security/) before exposing it to other machines.

Start the Runner with the absolute path to the configuration file:

```sh
tenon --config /absolute/path/runner.jsonc
```

In another terminal, check that its API is available:

```sh
curl --fail http://127.0.0.1:18080/openapi.json
```

## Manage pipelines

| Task | API operation |
| --- | --- |
| Install a plugin bundle | `POST /plugins` |
| Save a Tenon Document | `PUT /documents/{id}` |
| Read the saved Tenon Document and its ETag | `GET /documents/{id}` |
| Check runtime state | `GET /pipelines/{id}` |
| Remove a Tenon Document and stop its pipeline | `DELETE /documents/{id}` |

A successful PUT saves the Tenon Document; application is asynchronous. Compare `appliedDocumentEtag` with `documentEtag` in pipeline status and inspect `runtimeIssues` if they differ.

Create with `If-None-Match: *`. For replacement or deletion, read the current ETag and send it, including its quotes, in `If-Match`. See [HTTP API write conditions](/tenon/docs/development/reference/http-api/#conditional-document-writes) for responses and errors.

To change a plugin version:

1. Install the new exact Program version.
2. Update the Tenon Document to reference it.
3. Confirm the update is applied and the old process has stopped.
4. Remove the old version once no saved Tenon Document or active process references it.

Manage saved configuration and packages through the API; do not edit the Runner's private state directory.

## Stop

Press Ctrl-C in the Runner terminal, or send SIGINT or SIGTERM for normal shutdown and allow the configured shutdown deadline. Review the [Runner reference](/tenon/docs/development/reference/runner/) and [HTTP API](/tenon/docs/development/reference/http-api/) for TLS, storage, resource limits, and error responses.
