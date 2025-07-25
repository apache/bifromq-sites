---
sidebar_position: 3
title: "Configuration Printing"
---

When BifroMQ starts, it prints the values of various configurations in the info logs. Printing configuration information helps you understand the specific settings of the BifroMQ service, facilitating troubleshooting. It is also recommended
to include the printed configuration information when seeking help in the community.

For information on how to view logs, refer to: [Logging](../observability/logging.md)

## Printed Content

The printed configuration information in the logs consists of four main parts:

### JVM Parameters

JVM parameters refer to the parameters passed to the JVM when starting BifroMQ using the `-D` parameter. An example of the printed output is as follows:

```text
15:21:46.890 [main] INFO o.a.b.starter.StandaloneStarter - JVM arguments:
-Xms1045m
-Xmx4096m
-Xlog:gc:file=/usr/share/bifromq-standalone/bin/../logs/gc-%t.log:time,tid,tags:filecount=5,filesize=50m
-DLOG_DIR=/usr/share/bifromq-standalone/bin/../logs
-DCONF_DIR=/usr/share/bifromq-standalone/bin/../conf
-DDATA_DIR=/usr/share/bifromq-standalone/bin/../data
-Dpf4j.pluginsDir=/usr/share/bifromq-standalone/bin/../plugins
-Dfile.encoding=UTF-8
```

### Setting Initial Values

For information about Settings and their initial values, refer to: [Setting Provider Plugin](../../plugin/setting_provider/intro.md).

It is important to note that the printed values here represent the initial values of Setting when BifroMQ starts. These values can be modified at runtime using your custom Setting Provider Plugin, so the values printed here may not
necessarily be the actual runtime values. An example of the printed output is as follows:

```text
15:21:46.890 [main] INFO o.a.b.starter.StandaloneStarter - Settings, which can be modified at runtime, allowing for dynamic adjustment of BifroMQ's service behavior per tenant. See https://bifromq.io/docs/plugin/setting_provider/
15:21:46.890 [main] INFO o.a.b.starter.StandaloneStarter - Following is the initial value of each setting:
15:21:46.913 [main] INFO o.a.b.starter.StandaloneStarter - Setting: DebugModeEnabled=false
15:21:46.913 [main] INFO o.a.b.starter.StandaloneStarter - Setting: MaxTopicLevelLength=40
15:21:46.913 [main] INFO o.a.b.starter.StandaloneStarter - Setting: MaxTopicLevels=16
15:21:46.913 [main] INFO o.a.b.starter.StandaloneStarter - Setting: MaxTopicLength=255
15:21:46.913 [main] INFO o.a.b.starter.StandaloneStarter - Setting: MaxSharedGroupMembers=200
15:21:46.913 [main] INFO o.a.b.starter.StandaloneStarter - Setting: MaxTopicFiltersPerInbox=100
15:21:46.913 [main] INFO o.a.b.starter.StandaloneStarter - Setting: MsgPubPerSec=200
...
```

### BifroMQ[System Properties](./bifromq_sys_props.md)

An example of the printed output is as follows:

```text
17:21:34.067 [main] INFO  o.a.b.starter.StandaloneStarter - BifroMQ system properties:
17:21:34.070 [main] INFO  o.a.b.starter.StandaloneStarter - BifroMQSysProp: mqtt_utf8_sanity_check=false
17:21:34.070 [main] INFO  o.a.b.starter.StandaloneStarter - BifroMQSysProp: max_client_id_length=65535
17:21:34.070 [main] INFO  o.a.b.starter.StandaloneStarter - BifroMQSysProp: session_register_num=1000
17:21:34.070 [main] INFO  o.a.b.starter.StandaloneStarter - BifroMQSysProp: data_plane_burst_latency_ms=1000
17:21:34.070 [main] INFO  o.a.b.starter.StandaloneStarter - BifroMQSysProp: control_plane_burst_latency_ms=5000
...
```

### BifroMQ Configuration File

The configuration file section will include the consolidated complete content of the configuration file, with an example of the output as follows:

```text
17:21:34.098 [main] INFO  o.a.b.starter.StandaloneStarter - Consolidated Config:
---
clusterConfig:
  env: "Test"
  host: "127.0.0.1"
  port: 0
mqttServerConfig:
  connTimeoutSec: 20
  maxConnPerSec: 2000
  maxDisconnPerSec: 1000
  maxMsgByteSize: 262144
  maxResendTimes: 5
  maxConnBandwidth: 524288
  defaultKeepAliveSec: 300
  qos2ConfirmWindowSec: 5
  bossELGThreads: 1
  workerELGThreads: 4
...
```
