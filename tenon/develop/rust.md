---
title: Rust Plugin from Source
sidebar_position: 2
description: Build, install, and run a Rust Tenon plugin using the source checkout.
---

# Build a Rust plugin from source

Complete [Build and install from source](/tenon/docs/development/get-started/build/) first, then [configure and start the Runner](/tenon/docs/development/user-guide/operations/#configure-and-start). Keep it running in one terminal and run the following commands from the Tenon source checkout in another.

## Generate and build

This example uses the checkout's SDK, IPC crate, scaffold, and bundler. Install the third-party template generator, then generate a combined Source-and-sink plugin in a fresh directory:

```sh
export TENON_ROOT="$PWD"
cargo install cargo-generate --version 0.24.0 --locked
demo_root="$(mktemp -d "${TMPDIR:-/tmp}/tenon-plugin.XXXXXX")"
cd "$demo_root"
cargo generate --path "$TENON_ROOT/sdk/rust/rust-plugin-scaffold" \
  --name example-plugin --define interface=source-and-sink \
  --silent --vcs none --no-workspace
cd example-plugin
cargo tenon bundle \
  --config "patch.crates-io.tenon-plugin-sdk.path=\"$TENON_ROOT/sdk/rust/plugin-sdk\"" \
  --config "patch.crates-io.tenon-ipc.path=\"$TENON_ROOT/ipc/rust/tenon-ipc\"" \
  > "$demo_root/bundle.json"
```

The default identity is `com.example.example-plugin@0.1.0`. Its configuration requires a nonempty `message` and an absolute `outputFile`. The Source sends once on channel 0; the Sink appends messages and synchronizes the file before reporting success.

## Install and run

```sh
rust_bundle="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["bundle"])' "$demo_root/bundle.json")"
curl --fail -X POST http://127.0.0.1:18080/plugins \
  -H 'Content-Type: application/vnd.apache.tenon.plugin+tar+gzip' \
  --data-binary "@$rust_bundle"
```

Create a Tenon Document that binds both interfaces of the same Instance. Lua copies the Source payload into the Sink's Builder:

```sh
python3 - "$demo_root" <<'PYTHON'
import json, pathlib, sys
root = pathlib.Path(sys.argv[1]).resolve()
(root / "rust.jsonc").write_text(json.dumps({
    "specVersion": "1",
    "id": "rust-example",
    "pluginInstances": {
        "example": {
            "programName": "com.example.example-plugin", "exactVersion": "0.1.0",
            "config": {"message": "Hello from Rust", "outputFile": str(root / "rust-messages.txt")}
        }
    },
    "flows": {
        "example": {
            "source": "example", "sinks": ["example"],
            "process": {"script": """local b = registry:getBuilder('com.example.example-plugin@0.1.0')
function main(event)
  if event.type == 'source' then
    b:setMessage(event.payload.message)
    emit(b:build())
  end
end"""}
        }
    }
}, indent=2))
PYTHON
curl --fail -X PUT http://127.0.0.1:18080/documents/rust-example \
  -H 'Content-Type: application/jsonc' -H 'If-None-Match: *' \
  --data-binary "@$demo_root/rust.jsonc"
```

## Verify delivery

Application is asynchronous. Wait briefly for the first message, then inspect the Pipeline and file:

```sh
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  test -s "$demo_root/rust-messages.txt" && break
  sleep 1
done
curl --fail http://127.0.0.1:18080/pipelines/rust-example
cat "$demo_root/rust-messages.txt"
```

The Pipeline must be `running`, with `appliedDocumentEtag` equal to `documentEtag`. The file must contain `Hello from Rust`; a running process alone does not prove delivery. If application takes longer, repeat the check. For persistent failure, inspect [plugin diagnostics](/tenon/docs/development/user-guide/troubleshooting/), the exact installed Program version, and output-directory permissions.

## Stop and continue developing

Delete only this example's Tenon Document with its current ETag:

```sh
etag="$(curl --fail -sS -D - -o /dev/null http://127.0.0.1:18080/documents/rust-example | tr -d '\r' | sed -n 's/^[Ee][Tt][Aa][Gg]: //p')"
curl --fail -X DELETE http://127.0.0.1:18080/documents/rust-example -H "If-Match: $etag"
```

The Runner stops its plugin processes. The installed bundle and output file remain for inspection. When finished, stop the Runner with Ctrl-C in its terminal.

Edit the generated factory, configuration schema, and payload definitions for your external system. Use `source`, `sink`, or `source-and-sink` when generating a different interface. Follow the [Rust SDK lifecycle reference](/tenon/docs/development/reference/rust-sdk/) and [test and package guide](/tenon/docs/development/develop/test-package/) for delivery, failure, replay, and shutdown checks. Record your tested platform and preserve license and notice files. You can keep the plugin in your own repository and [propose an Awesome Tenon Plugins entry](/tenon/plugins/#add-your-plugin).
