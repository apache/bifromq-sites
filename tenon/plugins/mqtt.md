---
title: MQTT Plugin
sidebar_position: 2
description: Build and configure the Tenon MQTT 5 Source and Sink plugin.
---

# MQTT plugin

The MQTT plugin is a Source-and-sink plugin that connects to an MQTT 5 broker. Each Tenon channel owns one client; the Source and Sink sides share that client. Build it from the same Tenon source checkout as the Runner:

```sh
cargo tenon bundle --locked \
  --manifest-path plugin/bifromq-tenon-mqtt-plugin/Cargo.toml > mqtt-bundle.json
```

Choose the target matching the Runner and install the local bundle with `POST /plugins`. The package identity is `org.apache.bifromq.tenon.mqtt@0.1.0` for this plugin build.

## Configuration

```json
{
  "endpoint": "mqtt://127.0.0.1:1883",
  "clientIdPrefix": "tenon-dev-",
  "eventLoopThreads": 1,
  "session": {"cleanStart": false, "expiryIntervalSeconds": 86400},
  "source": {"subscriptions": [{"filter": "devices/+/events", "qos": 1}]},
  "sink": {"defaultQos": 1, "defaultRetain": false}
}
```

`endpoint` accepts `mqtt://` and `mqtts://`. Set a unique `clientIdPrefix`. `source.subscriptions` can be omitted or empty when only publishing. The configured `session.cleanStart` value is used on every connection, including the first connection; Tenon does not override it for an initial startup. Verify broker session behavior with the broker and client IDs in your deployment.

## Payloads

The Source payload contains `message.topic`, binary `message.body`, optional QoS and retain values, the DUP flag, and the receive timestamp. The Sink payload contains a `message` with topic, body, and optional QoS/retain values. The exact proto definitions are in the [source repository](https://github.com/apache/bifromq-tenon/tree/21452dc53be3491567dbe9958294e34bf0fc79f5/plugin/bifromq-tenon-mqtt-plugin/proto).

For a Source-to-Sink pass-through, bind both interfaces and use the exact Sink contract:

```lua
local builder = registry:getBuilder("org.apache.bifromq.tenon.mqtt@0.1.0")

function main(event)
  if event.type == "source" then
    local message = builder:getMessageBuilder()
    message:setTopic(event.payload.message.topic)
    message:setBody(event.payload.message.body)
    emit(builder:build())
  end
end
```

Use `:` for all Builder calls. QoS and reconnect behavior can produce duplicates; downstream consumers should tolerate them. Check actual subscriber output separately from Pipeline `running` state.

## Build and install

The complete schema and package details are maintained in the [Tenon source tree](https://github.com/apache/bifromq-tenon/tree/21452dc53be3491567dbe9958294e34bf0fc79f5/plugin/bifromq-tenon-mqtt-plugin). Install through the normal Runner API; do not edit the Runner's private state directory.
