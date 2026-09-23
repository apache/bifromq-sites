---
title: Awesome Tenon Plugins
description: A community list of Tenon Source and Sink plugins.
---

# Awesome Tenon Plugins

Find a plugin, follow its build instructions, and connect it to your Tenon pipeline.

- **[MQTT](https://github.com/apache/bifromq-tenon/tree/main/plugin/bifromq-tenon-mqtt-plugin)** — Source + Sink. Receive and publish MQTT 5 messages.
  [Setup and compatibility](/tenon/docs/development/plugins/mqtt/) · Maintainer: Apache BifroMQ · License: Apache-2.0.
- **[Dummy Source](https://github.com/apache/bifromq-tenon/tree/main/plugin/bifromq-tenon-dummy-source-plugin)** — Source. An idle input for testing Lua timers and Sink plugins.
  [Setup and compatibility](/tenon/docs/development/plugins/debugging/) · Maintainer: Apache BifroMQ · License: Apache-2.0.
- **[Stdout Sink](https://github.com/apache/bifromq-tenon/tree/main/plugin/bifromq-tenon-stdout-sink-plugin)** — Sink. Print messages to live diagnostics while developing a pipeline.
  [Setup and compatibility](/tenon/docs/development/plugins/debugging/) · Maintainer: Apache BifroMQ · License: Apache-2.0.

## Add your plugin

[Edit this list](https://github.com/apache/bifromq-sites/edit/master/src/pages/tenon/plugins.md) and open a pull request with one entry:

```markdown
- **[Plugin name](https://github.com/owner/repository)** — Source / Sink / Source + Sink. One sentence describing its purpose.
  [Setup and compatibility](https://github.com/owner/repository#readme) · Maintainer: name · License: SPDX identifier.
```

The linked documentation should cover building from source, installation, configuration, and supported Tenon versions and platforms. Plugin authors maintain their entries and provide support through their repositories.

[Back to Tenon documentation](/tenon/docs/development/get-started/overview/)
