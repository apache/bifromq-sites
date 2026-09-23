---
title: Dummy Source & Stdout Sink
sidebar_position: 3
description: Build and use Tenon debugging plugins to exercise Lua and custom plugins.
---

# Dummy Source and Stdout Sink

These two plugins are maintained in the Tenon source tree and are useful for local development:

- `org.apache.bifromq.tenon.dummy-source@0.1.0` is a Source that emits no records.
- `org.apache.bifromq.tenon.stdout-sink@0.1.0` prints Sink messages to live diagnostics.

Build the Runner, `cargo-tenon`, and both plugins from the same source checkout. The commands create local plugin archives; no prebuilt Tenon artifact is needed:

```sh
cargo install --path sdk/rust/cargo-tenon --locked
cargo tenon bundle --locked \
  --manifest-path plugin/bifromq-tenon-dummy-source-plugin/Cargo.toml > dummy-bundle.json
cargo tenon bundle --locked \
  --manifest-path plugin/bifromq-tenon-stdout-sink-plugin/Cargo.toml > stdout-bundle.json
```

Install the bundle paths reported in those JSON files through `POST /plugins`, then use the [first pipeline](/tenon/docs/development/get-started/first-pipeline/) to drive the Stdout Sink with a Lua timer. Both plugins accept `{}` as their configuration.

## Use Stdout Sink with a custom Source

Replace the `idle` Instance in the first pipeline with your Source's exact Program identity and configuration. Keep `console` as the Sink and subscribe to `target=plugin%3Aconsole` before sending external input. For a Source payload with `string message = 1`:

```lua
local output = registry:getBuilder("org.apache.bifromq.tenon.stdout-sink@0.1.0")
function main(event)
  if event.type == "source" then
    output:setMessage("received: " .. event.payload.message)
    emit(output:build())
  end
end
```

Change the field access and Builder identity to match your contracts. `:` is required for Builder calls. A process running only proves that the plugin stayed alive; the diagnostic line proves the Sink wrote an observable result.

## Use Dummy Source with a custom Sink

Bind Dummy Source as `flows.probe.source`, install your custom Sink, and replace the Stdout Sink Instance and Builder identity. Keep the one-shot timer pattern from the first pipeline. This is a useful local test for a Sink's configuration, payload decoding, output, and shutdown without an external Source system.

The Dummy Source never emits an empty Source record. Timer-generated records have no upstream event to replay after a crash. Timers and Lua state are per channel and are recreated when the VM or Pipeline is restarted.

See [Plugin Package Format](/tenon/docs/development/reference/plugin-packages/) for the manifest and descriptor contract, and [Awesome Tenon Plugins](/tenon/plugins/) for other source repositories.
