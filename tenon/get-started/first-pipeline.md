---
title: First Pipeline
sidebar_position: 3
description: Build a complete local Source to Lua to Sink pipeline and inspect its output.
---

import {FirstPipelineDiagram} from '@site/src/components/TenonDiagrams';

# Run your first pipeline

Tenon turns a Tenon Document into a running Pipeline. The Tenon Document names the plugin Programs and connects their Instances; the Runner starts those processes; Lua receives Source events, transforms or creates messages, and emits them to Sink Instances.

This walkthrough uses the repository's Dummy Source and Stdout Sink. The Source stays idle, while a Lua timer creates a record every second, so the pipeline runs without a broker or another external service.

<FirstPipelineDiagram />

## 1. Prepare the Runner and plugins

[Build and install Tenon](/tenon/docs/development/get-started/build/), then [configure and start a Runner](/tenon/docs/development/user-guide/operations/#configure-and-start) on `127.0.0.1:18080`. Leave the Runner running in its terminal.

In another terminal, build both plugins from the Tenon repository root:

```sh
cargo tenon bundle --locked \
  --manifest-path plugin/bifromq-tenon-dummy-source-plugin/Cargo.toml
cargo tenon bundle --locked \
  --manifest-path plugin/bifromq-tenon-stdout-sink-plugin/Cargo.toml
```

Each command prints a JSON result. Its `bundle` field is the absolute path of the created `.tar.gz` file. In the two requests below, replace `/absolute/path/to/dummy-source.tar.gz` and `/absolute/path/to/stdout-sink.tar.gz` with their respective `bundle` paths. Keep the `@`: it tells curl to upload the file's contents.

```sh
curl --fail -X POST http://127.0.0.1:18080/plugins \
  -H 'Content-Type: application/vnd.apache.tenon.plugin+tar+gzip' \
  --data-binary @/absolute/path/to/dummy-source.tar.gz
curl --fail -X POST http://127.0.0.1:18080/plugins \
  -H 'Content-Type: application/vnd.apache.tenon.plugin+tar+gzip' \
  --data-binary @/absolute/path/to/stdout-sink.tar.gz
```

The installed identities are `org.apache.bifromq.tenon.dummy-source@0.1.0` and `org.apache.bifromq.tenon.stdout-sink@0.1.0`. Both use `{}` as their configuration.

## 2. Create the Tenon Document

Save this as `debug.jsonc` in the source checkout. It defines one idle Source, one Stdout Sink, and a Lua timer that emits a message every second:

```json
{
  "specVersion": "1",
  "id": "debug",
  "pluginInstances": {
    "idle": {"programName": "org.apache.bifromq.tenon.dummy-source", "exactVersion": "0.1.0", "config": {}},
    "console": {"programName": "org.apache.bifromq.tenon.stdout-sink", "exactVersion": "0.1.0", "config": {}}
  },
  "flows": {
    "probe": {
      "source": "idle",
      "sinks": ["console"],
      "process": {"script": "local b = registry:getBuilder('org.apache.bifromq.tenon.stdout-sink@0.1.0')\nlocal count = 0\nsetTimeout(1000)\nfunction main(event)\n  if event.type == 'timer' then\n    count = count + 1\n    b:setMessage('probe ' .. count)\n    emit(b:build())\n    setTimeout(1000)\n  end\nend"}
    }
  }
}
```

## 3. Apply the Tenon Document and check the Pipeline

Create the Pipeline through the Runner API:

```sh
curl --fail -X PUT http://127.0.0.1:18080/documents/debug \
  -H 'Content-Type: application/jsonc' \
  -H 'If-None-Match: *' \
  --data-binary @debug.jsonc
curl --fail http://127.0.0.1:18080/pipelines/debug
```

Wait until the response reports `state: "running"` and matching `documentEtag` and `appliedDocumentEtag`. Those fields prove that the Tenon Document has been applied; they do not prove that a Sink has delivered a record.

## 4. Observe Sink output

Open the live diagnostics stream for the `console` Sink:

```sh
curl --fail -N -H 'Accept: text/event-stream' \
  'http://127.0.0.1:18080/pipelines/debug/diagnostics?target=plugin%3Aconsole'
```

The stream should contain `attached` and then diagnostic lines such as `probe 3`. The counter may start above one because diagnostics are live and do not replay earlier output.

## 5. Remove the test Pipeline

Stop the diagnostics request with `Ctrl-C`, read the current ETag, and delete the Tenon Document:

```sh
etag="$(curl --fail -sS -D - -o /dev/null http://127.0.0.1:18080/documents/debug | tr -d '\r' | sed -n 's/^[Ee][Tt][Aa][Gg]: //p')"
curl --fail -X DELETE http://127.0.0.1:18080/documents/debug -H "If-Match: $etag"
```

The Runner stops the Pipeline's plugin processes. Installed Programs remain in its state directory for another local test. Stop the Runner when you are finished.
