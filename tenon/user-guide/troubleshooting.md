---
title: Troubleshooting
sidebar_position: 6
description: Find missing output, unapplied Tenon Documents, plugin failures, and repeated messages.
---

# Troubleshooting

Start with the pipeline's status. Replace `debug` with the ID in your Tenon Document:

```sh
curl --fail http://127.0.0.1:18080/pipelines/debug
```

## No output

Check the path from input to destination:

1. **Source:** confirm that input exists. Dummy Source is intentionally idle; use a Lua timer as in [First Pipeline](/tenon/docs/development/get-started/first-pipeline/).
2. **Lua:** inspect the Flow's diagnostics. Confirm that `main` accepts the event and calls `emit`.
3. **Sink:** confirm that it is listed in the Flow and that the Builder uses its exact `programName@exactVersion` contract.
4. **Destination:** check connectivity, credentials, and the actual subscriber or service output.

Follow [live diagnostics](/tenon/docs/development/user-guide/observability/#follow-live-diagnostics) to inspect Lua and plugin messages.

## A Tenon Document is saved but not applied

Compare `documentEtag` with `appliedDocumentEtag`, then read `runtimeIssues`:

| Issue | Next step |
| --- | --- |
| Missing plugin or wrong version | Install the exact Program version named in the Tenon Document |
| Platform mismatch | Build the plugin for the Runner's OS and CPU architecture |
| Invalid plugin configuration | Check the installed plugin's configuration schema |
| Missing or unbound interface | Check Source and Sink connections in every Flow |
| Invalid Lua runtime binding | Check the Flow's Sink contracts and Builder lookup |

An older configuration may still be running. Use the current ETag for a replacement PUT.

## A plugin repeatedly restarts

1. Read the plugin's state and `lastError` in pipeline status.
2. Inspect that plugin's stdout and stderr diagnostics.
3. Test the external service independently; `running` alone does not prove connectivity.
4. If the installed package is missing or damaged, rebuild and reinstall the original Program identity and content.

## Messages repeat after recovery

Check the plugin's acknowledgement and replay behavior. Reconnects, failed Sink completion, and process restarts can repeat messages. Use stable IDs and downstream deduplication where duplicates matter; see [Delivery & Recovery](/tenon/docs/development/user-guide/delivery/).
