---
title: Connect BifroMQ
sidebar_position: 4
description: Receive messages from BifroMQ, process them with Lua, and publish the result through the MQTT plugin.
---

import {MqttPipelineDiagram} from '@site/src/components/TenonDiagrams';

# Connect BifroMQ with MQTT

The MQTT plugin connects Tenon to BifroMQ as an MQTT 5 client. Its Source subscribes to topics; Lua processes each incoming message; its Sink publishes the result.

This example forwards messages from `tenon/input` to `tenon/output` on the same broker. Lua changes the topic and preserves the message body.

<MqttPipelineDiagram />

One plugin instance, `broker`, supplies both the Source and Sink. Both interfaces are connected in the Flow. Keep input and output topics separate to avoid a forwarding loop.

## 1. Prepare the Runner and broker

You need:

- A [locally built Tenon Runner and bundling tool](/tenon/docs/development/get-started/build/).
- A [running Runner](/tenon/docs/development/user-guide/operations/#configure-and-start) at `127.0.0.1:18080`.
- A BifroMQ MQTT 5 listener at `127.0.0.1:1883`, with access to the two example topics. See [BifroMQ setup](/docs/get_started/intro/).
- The `mosquitto_pub` and `mosquitto_sub` clients for the delivery check.

The commands below use a local listener without credentials. If your broker requires credentials or TLS, apply those settings to both the plugin and the test clients. See [MQTT plugin configuration](/tenon/docs/development/plugins/mqtt/#configuration).

## 2. Build and install the MQTT plugin

From the Tenon repository root:

```sh
cargo tenon bundle --locked \
  --manifest-path plugin/bifromq-tenon-mqtt-plugin/Cargo.toml
```

The command prints a JSON result. Copy its `bundle` path into the request below in place of `/absolute/path/to/mqtt.tar.gz`. Keep `@` to upload the file's contents:

```sh
curl --fail -X POST http://127.0.0.1:18080/plugins \
  -H 'Content-Type: application/vnd.apache.tenon.plugin+tar+gzip' \
  --data-binary @/absolute/path/to/mqtt.tar.gz
```

## 3. Create the Tenon Document

Save the following as `mqtt.jsonc`. The `forward` Flow uses the `broker` instance for both input and output:

```json
{
  "specVersion": "1",
  "id": "mqtt",
  "pluginInstances": {
    "broker": {
      "programName": "org.apache.bifromq.tenon.mqtt",
      "exactVersion": "0.1.0",
      "config": {
        "endpoint": "mqtt://127.0.0.1:1883",
        "clientIdPrefix": "tenon-mqtt-",
        "source": {"subscriptions": [{"filter": "tenon/input", "qos": 1}]},
        "sink": {"defaultQos": 1, "defaultRetain": false}
      }
    }
  },
  "flows": {
    "forward": {
      "source": "broker",
      "sinks": ["broker"],
      "process": {
        "script": "local b = registry:getBuilder('org.apache.bifromq.tenon.mqtt@0.1.0')\nlocal m = b:getMessageBuilder()\nfunction main(event)\n  if event.type == 'source' then\n    m:setTopic('tenon/output')\n    m:setBody(event.payload.message.body)\n    emit(b:build())\n  end\nend"
      }
    }
  }
}
```

Set `endpoint` to your broker address and give `clientIdPrefix` a unique value across Runner instances and channels.

The Lua code in `process.script` does three things: reads `event.payload.message.body`, sets the output topic to `tenon/output`, and emits a new MQTT Sink payload.

## 4. Apply the Tenon Document

```sh
curl --fail -X PUT http://127.0.0.1:18080/documents/mqtt \
  -H 'Content-Type: application/jsonc' \
  -H 'If-None-Match: *' \
  --data-binary @mqtt.jsonc
curl --fail http://127.0.0.1:18080/pipelines/mqtt
```

Check for matching `documentEtag` and `appliedDocumentEtag`, and a `running` state for the `broker` plugin. Then test delivery: a running process alone does not confirm that the broker accepted its subscription.

## 5. Send a message and observe the result

In one terminal, subscribe to the output topic **before** publishing:

```sh
mosquitto_sub -h 127.0.0.1 -p 1883 -V mqttv5 -q 1 \
  -t tenon/output -v
```

In another terminal, publish a message to the input topic:

```sh
mosquitto_pub -h 127.0.0.1 -p 1883 -V mqttv5 -q 1 \
  -t tenon/input -m 'Hello Tenon'
```

The subscriber should print:

```text
tenon/output Hello Tenon
```

If the plugin's subscription was still starting, publish again. If output remains absent, check [plugin diagnostics](/tenon/docs/development/user-guide/observability/#follow-live-diagnostics) and the broker's authentication and topic permissions.

## 6. Stop the example

Stop the subscriber with `Ctrl-C`, then read the current ETag and delete the Tenon Document:

```sh
etag="$(curl --fail -sS -D - -o /dev/null http://127.0.0.1:18080/documents/mqtt | tr -d '\r' | sed -n 's/^[Ee][Tt][Aa][Gg]: //p')"
curl --fail -X DELETE http://127.0.0.1:18080/documents/mqtt -H "If-Match: $etag"
```

The Runner stops this pipeline's plugin processes. The MQTT package remains installed.

## Connect two brokers

Use two MQTT instances with different endpoints and client ID prefixes:

| Flow | Source | Sink | Topic path |
| --- | --- | --- | --- |
| A to B | Instance A | Instance B | `site/a/out` → `site/b/in` |
| B to A | Instance B | Instance A | `site/b/out` → `site/a/in` |

Both interfaces of each instance are then connected. Subscribe each Source only to its local outbound topic, and set the destination topic in Lua. Avoid wildcard subscriptions that would consume forwarded output again. Verify each direction with an external subscriber.

QoS and reconnects can produce duplicate messages. See [Delivery & Recovery](/tenon/docs/development/user-guide/delivery/) when choosing replay and deduplication behavior.
