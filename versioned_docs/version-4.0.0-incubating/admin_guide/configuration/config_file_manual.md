---
sidebar_position: 1
title: "Config File Manual"
---

The configuration file for BifroMQ is a YAML file located in the `conf` directory under `standalone.yml`. This file contains all the configuration parameters for BifroMQ. When starting BifroMQ, you can specify the path to the configuration
file with the command-line parameter `-c` or `--config`. If the configuration file path is not specified, BifroMQ will attempt to load the `standalone.yml` file from the `conf` directory.

The complete configuration file is defined by a set of configuration objects, with the top-level object being `StandaloneConfig`.

## StandaloneConfig

| Configuration Name           | Value Type | Default Value                                                                      | Description                                                                                                                                           |
| ---------------------------- | ---------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authProviderFQN`            | String     | null                                                                               | Fully qualified class name of the custom Auth Provider implementation. If not configured, authentication and authorization will not be performed.     |
| `clientBalancerFQN`          | String     | null                                                                               | Fully qualified class name of the custom Client Balancer implementation. If not configured, no active redirection happens.                            |
| `resourceThrottlerFQN`       | String     | null                                                                               | Fully qualified class name of the custom Resource Throttler implementation. If not configured, resource limiting will not be performed.               |
| `settingProviderFQN`         | String     | null                                                                               | Fully qualified class name of the custom Setting Provider implementation. If not configured, default initial values defined in Settings will be used. |
| `bgTaskThreads`              | Integer    | max(available processor cores/4, 1)                                                | Threads reserved for the starter's background task executor.                                                                                          |
| `clusterConfig.*`            | Object     | See [ClusterConfig](#clusterconfig-clusterconfig)                                  | Cluster join and addressing options.                                                                                                                  |
| `rpcConfig.*`                | Object     | See [RPCConfig](#rpcconfig-rpcconfig)                                              | RPC client/server options.                                                                                                                            |
| `mqttServiceConfig.*`        | Object     | See [MQTTServiceConfig](#mqttserviceconfig-mqttserviceconfig)                      | MQTT service settings.                                                                                                                                |
| `distServiceConfig.*`        | Object     | See [DistServiceConfig](#distserviceconfig-distserviceconfig)                      | Dist service settings.                                                                                                                                |
| `inboxServiceConfig.*`       | Object     | See [InboxServiceConfig](#inboxserviceconfig-inboxserviceconfig)                   | Inbox service settings.                                                                                                                               |
| `retainServiceConfig.*`      | Object     | See [RetainServiceConfig](#retainserviceconfig-retainserviceconfig)                | Retain service settings.                                                                                                                              |
| `sessionDictServiceConfig.*` | Object     | See [SessionDictServiceConfig](#sessiondictserviceconfig-sessiondictserviceconfig) | Session dictionary service settings.                                                                                                                  |
| `apiServerConfig.*`          | Object     | See [APIServerConfig](#apiserverconfig-apiserverconfig)                            | API server settings.                                                                                                                                  |

### ClusterConfig (`clusterConfig.*`)

| Configuration Name                | Value Type | Default Value | Description                                                                                                                                                                                                                          |
| --------------------------------- | ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `clusterConfig.env`               | String     | ""            | Cluster environment name. Cluster nodes with different environment names are isolated from each other. Cannot be null or empty.                                                                                                      |
| `clusterConfig.host`              | String     | null          | Communication address of the node as a cluster node. Resolution order: if `mqttServiceConfig.server.tcpListener.host` is not "0.0.0.0", use it; else if `rpcConfig.host` is set, use it; else use the SiteLocal address of the host. |
| `clusterConfig.port`              | Integer    | 0             | Communication port number of the node as a cluster node. `0` selects a free port. For bootstrap nodes, configure a fixed port.                                                                                                       |
| `clusterConfig.seedEndpoints`     | String     | null          | Seed node addresses to join the cluster, formatted as `ip:port` and separated by commas. Non-bootstrap nodes should point to a bootstrap node.                                                                                       |
| `clusterConfig.clusterDomainName` | String     | null          | Cluster domain name. If set, BifroMQ resolves the domain to find cluster contact nodes, simplifying fixed-domain deployments.                                                                                                        |

### RPCConfig (`rpcConfig.*`)

| Configuration Name                 | Value Type                                                              | Default Value                       | Description                                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `rpcConfig.host`                   | String                                                                  | null                                | Host used for intra-cluster RPC. If null, follows the same host resolution rule as `clusterConfig`. |
| `rpcConfig.port`                   | Integer                                                                 | 0                                   | RPC server port. `0` lets the system pick a free port.                                              |
| `rpcConfig.enableSSL`              | Boolean                                                                 | false                               | Whether to enable TLS for RPC.                                                                      |
| `rpcConfig.clientEventLoopThreads` | Integer                                                                 | max(4, available processor cores/8) | Netty client event-loop threads for RPC clients.                                                    |
| `rpcConfig.serverEventLoopThreads` | Integer                                                                 | max(4, available processor cores/8) | Netty server event-loop threads for RPC servers.                                                    |
| `rpcConfig.clientSSLConfig`        | See [SSLContextConfig](#sslcontextconfig--serversslcontextconfig)       | null                                | TLS settings for RPC clients (used when `enableSSL` is true).                                       |
| `rpcConfig.serverSSLConfig`        | See [ServerSSLContextConfig](#sslcontextconfig--serversslcontextconfig) | null                                | TLS settings for RPC servers (used when `enableSSL` is true).                                       |

### MQTTServiceConfig (`mqttServiceConfig.*`)

| Configuration Name                                          | Value Type                                                              | Default Value                       | Description                                                                            |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| `mqttServiceConfig.client.workerThreads`                    | Integer                                                                 | 0                                   | Worker threads for MQTT internal clients (0 = use caller thread).                      |
| `mqttServiceConfig.server.enable`                           | Boolean                                                                 | true                                | Whether to enable the MQTT server.                                                     |
| `mqttServiceConfig.server.connTimeoutSec`                   | Integer                                                                 | 20                                  | Timeout from TCP connect to MQTT CONNECT completion; exceeded connections are closed.  |
| `mqttServiceConfig.server.maxConnPerSec`                    | Integer                                                                 | 2000                                | Max MQTT connect operations per second; excess connections are throttled/disconnected. |
| `mqttServiceConfig.server.maxDisconnPerSec`                 | Integer                                                                 | 1000                                | Max disconnect operations per second during graceful shutdown.                         |
| `mqttServiceConfig.server.maxMsgByteSize`                   | Integer                                                                 | 262144                              | Max MQTT CONNECT packet size (including Will); larger packets are rejected.            |
| `mqttServiceConfig.server.maxConnBandwidth`                 | Integer                                                                 | 524288                              | Max per-connection bandwidth (inbound/outbound), in bytes per second.                  |
| `mqttServiceConfig.server.bossELGThreads`                   | Integer                                                                 | 1                                   | Netty boss threads for accepting MQTT TCP connections.                                 |
| `mqttServiceConfig.server.workerELGThreads`                 | Integer                                                                 | max(available processor cores/2, 2) | Netty worker threads for MQTT protocol processing.                                     |
| `mqttServiceConfig.server.userPropsCustomizerFactoryConfig` | `Map<String, Struct>`                                                   | {}                                  | Customizer factory settings for MQTT 5 user properties.                                |
| `mqttServiceConfig.server.tcpListener.enable`               | Boolean                                                                 | true                                | Enable MQTT over TCP.                                                                  |
| `mqttServiceConfig.server.tcpListener.host`                 | String                                                                  | "0.0.0.0"                           | Listen address for MQTT over TCP.                                                      |
| `mqttServiceConfig.server.tcpListener.port`                 | Integer                                                                 | 1883                                | Listen port for MQTT over TCP.                                                         |
| `mqttServiceConfig.server.tlsListener.enable`               | Boolean                                                                 | false                               | Enable MQTT over TLS.                                                                  |
| `mqttServiceConfig.server.tlsListener.host`                 | String                                                                  | null                                | Listen address for MQTT over TLS (defaults to resolved host when null).                |
| `mqttServiceConfig.server.tlsListener.port`                 | Integer                                                                 | 1884                                | Listen port for MQTT over TLS.                                                         |
| `mqttServiceConfig.server.tlsListener.sslConfig`            | See [ServerSSLContextConfig](#sslcontextconfig--serversslcontextconfig) | null                                | TLS settings for MQTT over TLS.                                                        |
| `mqttServiceConfig.server.wsListener.enable`                | Boolean                                                                 | true                                | Enable MQTT over WebSocket.                                                            |
| `mqttServiceConfig.server.wsListener.host`                  | String                                                                  | null                                | Listen address for MQTT over WebSocket (defaults to resolved host when null).          |
| `mqttServiceConfig.server.wsListener.port`                  | Integer                                                                 | 8080                                | Listen port for MQTT over WebSocket.                                                   |
| `mqttServiceConfig.server.wsListener.wsPath`                | String                                                                  | "/mqtt"                             | WebSocket path for MQTT over WebSocket.                                                |
| `mqttServiceConfig.server.wssListener.enable`               | Boolean                                                                 | false                               | Enable MQTT over WebSocket Secure.                                                     |
| `mqttServiceConfig.server.wssListener.host`                 | String                                                                  | null                                | Listen address for MQTT over WebSocket Secure (defaults to resolved host when null).   |
| `mqttServiceConfig.server.wssListener.port`                 | Integer                                                                 | 8443                                | Listen port for MQTT over WebSocket Secure.                                            |
| `mqttServiceConfig.server.wssListener.wsPath`               | String                                                                  | "/mqtt"                             | WebSocket path for MQTT over WebSocket Secure.                                         |
| `mqttServiceConfig.server.wssListener.sslConfig`            | See [ServerSSLContextConfig](#sslcontextconfig--serversslcontextconfig) | null                                | TLS settings for MQTT over WebSocket Secure.                                           |

### DistServiceConfig (`distServiceConfig.*`)

| Configuration Name                                     | Value Type                                      | Default Value                                 | Description                                                                           |
| ------------------------------------------------------ | ----------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------- |
| `distServiceConfig.client.workerThreads`               | Integer                                         | 0                                             | Worker threads for Dist client.                                                       |
| `distServiceConfig.server.enable`                      | Boolean                                         | true                                          | Whether to enable Dist server.                                                        |
| `distServiceConfig.server.workerThreads`               | Integer                                         | max(2, available processor cores/4)           | Dist server worker threads (0 = run on caller thread).                                |
| `distServiceConfig.server.attributes`                  | `Map<String,String>`                            | {}                                            | Custom attributes attached to Dist server nodes.                                      |
| `distServiceConfig.server.defaultGroups`               | `Set<String>`                                   | []                                            | Default groups served by this Dist server.                                            |
| `distServiceConfig.workerClient.workerThreads`         | Integer                                         | max(2, available processor cores/4)           | Worker client threads for Dist worker communication.                                  |
| `distServiceConfig.workerClient.queryPipelinePerStore` | Integer                                         | 1000                                          | Query pipelines per Dist store.                                                       |
| `distServiceConfig.worker.enable`                      | Boolean                                         | true                                          | Whether to enable Dist worker.                                                        |
| `distServiceConfig.worker.workerThreads`               | Integer                                         | 0                                             | Dist worker threads (0 = use caller thread).                                          |
| `distServiceConfig.worker.tickerThreads`               | Integer                                         | max(1, available processor cores/20)          | Background ticker threads.                                                            |
| `distServiceConfig.worker.maxWALFetchSize`             | Integer                                         | 10MB                                          | Max WAL fetch size in bytes.                                                          |
| `distServiceConfig.worker.compactWALThreshold`         | Integer                                         | 256MB                                         | WAL compaction threshold in bytes.                                                    |
| `distServiceConfig.worker.minGCIntervalSeconds`        | Integer                                         | 30                                            | Minimum GC interval in seconds.                                                       |
| `distServiceConfig.worker.maxGCIntervalSeconds`        | Integer                                         | 86400                                         | Maximum GC interval in seconds.                                                       |
| `distServiceConfig.worker.dataEngineConfig`            | See [StorageEngineConfig](#storageengineconfig) | rocksdb with default settings for data engine | Data store engine settings for Dist worker.                                           |
| `distServiceConfig.worker.walEngineConfig`             | See [StorageEngineConfig](#storageengineconfig) | rocksdb with default settings for wal engine  | WAL store engine settings for Dist worker.                                            |
| `distServiceConfig.worker.balanceConfig`               | See [BalancerOptions](#balanceroptions)         | Default balancers for dist worker             | Balancer settings for Dist worker.                                                    |
| `distServiceConfig.worker.splitHinterConfig`           | See [SplitHinterOptions](#splithinteroptions)   | Default split hinters for dist worker         | Split hinter settings for Dist worker. See [SplitHinterOptions](#splithinteroptions). |
| `distServiceConfig.worker.attributes`                  | `Map<String,String>`                            | \{\}                                          | Custom attributes attached to Dist worker.                                            |

### InboxServiceConfig (`inboxServiceConfig.*`)

| Configuration Name                                     | Value Type                                      | Default Value                                 | Description                                                                           |
| ------------------------------------------------------ | ----------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------- |
| `inboxServiceConfig.client.workerThreads`              | Integer                                         | 0                                             | Worker threads for Inbox client.                                                      |
| `inboxServiceConfig.server.enable`                     | Boolean                                         | true                                          | Whether to enable Inbox server.                                                       |
| `inboxServiceConfig.server.workerThreads`              | Integer                                         | max(2, available processor cores/4)           | Inbox server worker threads.                                                          |
| `inboxServiceConfig.server.attributes`                 | `Map<String,String>`                            | {}                                            | Custom attributes attached to Inbox server.                                           |
| `inboxServiceConfig.server.defaultGroups`              | `Set<String>`                                   | []                                            | Default groups served by this Inbox server.                                           |
| `inboxServiceConfig.storeClient.workerThreads`         | Integer                                         | max(2, available processor cores/4)           | Inbox store client worker threads.                                                    |
| `inboxServiceConfig.storeClient.queryPipelinePerStore` | Integer                                         | 1000                                          | Query pipelines per Inbox store.                                                      |
| `inboxServiceConfig.store.enable`                      | Boolean                                         | true                                          | Whether to enable Inbox store.                                                        |
| `inboxServiceConfig.store.workerThreads`               | Integer                                         | 0                                             | Inbox store worker threads.                                                           |
| `inboxServiceConfig.store.tickerThreads`               | Integer                                         | max(1, available processor cores/20)          | Inbox store ticker threads.                                                           |
| `inboxServiceConfig.store.maxWALFetchSize`             | Integer                                         | -1                                            | Max WAL fetch size in bytes (-1 means no limit).                                      |
| `inboxServiceConfig.store.compactWALThreshold`         | Integer                                         | 256MB                                         | WAL compaction threshold in bytes.                                                    |
| `inboxServiceConfig.store.expireRateLimit`             | Integer                                         | 1000                                          | Max expired Session cleanup rate per second.                                          |
| `inboxServiceConfig.store.minGCIntervalSeconds`        | Integer                                         | 30                                            | Minimum GC interval in seconds.                                                       |
| `inboxServiceConfig.store.maxGCIntervalSeconds`        | Integer                                         | 86400                                         | Maximum GC interval in seconds.                                                       |
| `inboxServiceConfig.store.dataEngineConfig`            | See [StorageEngineConfig](#storageengineconfig) | rocksdb with default settings for data engine | Data store engine settings for Inbox store.                                           |
| `inboxServiceConfig.store.walEngineConfig`             | See [StorageEngineConfig](#storageengineconfig) | rocksdb with default settings for wal engine  | WAL store engine settings for Inbox store.                                            |
| `inboxServiceConfig.store.balanceConfig`               | See [BalancerOptions](#balanceroptions)         | Default balancers for inbox store             | Balancer settings for Inbox store.                                                    |
| `inboxServiceConfig.store.splitHinterConfig`           | See [SplitHinterOptions](#splithinteroptions)   | Default split hinter for inbox store          | Split hinter settings for Inbox store. See [SplitHinterOptions](#splithinteroptions). |
| `inboxServiceConfig.store.attributes`                  | `Map<String,String>`                            | \{\}                                          | Custom attributes attached to Inbox store.                                            |

### RetainServiceConfig (`retainServiceConfig.*`)

| Configuration Name                                      | Value Type                                      | Default Value                                 | Description                                                                            |
| ------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------- |
| `retainServiceConfig.client.workerThreads`              | Integer                                         | 0                                             | Worker threads for Retain client.                                                      |
| `retainServiceConfig.server.enable`                     | Boolean                                         | true                                          | Whether to enable Retain server.                                                       |
| `retainServiceConfig.server.workerThreads`              | Integer                                         | max(2, available processor cores/4)           | Retain server worker threads.                                                          |
| `retainServiceConfig.server.attributes`                 | `Map<String,String>`                            | {}                                            | Custom attributes attached to Retain server.                                           |
| `retainServiceConfig.server.defaultGroups`              | `Set<String>`                                   | []                                            | Default groups served by this Retain server.                                           |
| `retainServiceConfig.storeClient.workerThreads`         | Integer                                         | max(2, available processor cores/4)           | Retain store client worker threads.                                                    |
| `retainServiceConfig.storeClient.queryPipelinePerStore` | Integer                                         | 1000                                          | Query pipelines per Retain store.                                                      |
| `retainServiceConfig.store.enable`                      | Boolean                                         | true                                          | Whether to enable Retain store.                                                        |
| `retainServiceConfig.store.workerThreads`               | Integer                                         | 0                                             | Retain store worker threads.                                                           |
| `retainServiceConfig.store.tickerThreads`               | Integer                                         | max(1, available processor cores/20)          | Retain store ticker threads.                                                           |
| `retainServiceConfig.store.maxWALFetchSize`             | Integer                                         | 50MB                                          | Max WAL fetch size in bytes.                                                           |
| `retainServiceConfig.store.compactWALThreshold`         | Integer                                         | 256MB                                         | WAL compaction threshold in bytes.                                                     |
| `retainServiceConfig.store.gcIntervalSeconds`           | Integer                                         | 600                                           | GC interval in seconds.                                                                |
| `retainServiceConfig.store.dataEngineConfig`            | See [StorageEngineConfig](#storageengineconfig) | rocksdb with default settings for data engine | Data store engine settings for Retain store.                                           |
| `retainServiceConfig.store.walEngineConfig`             | See [StorageEngineConfig](#storageengineconfig) | rocksdb with default settings for wal engine  | WAL store engine settings for Retain store.                                            |
| `retainServiceConfig.store.balanceConfig`               | See [BalancerOptions](#balanceroptions)         | Default balancers for retain store            | Balancer settings for Retain store.                                                    |
| `retainServiceConfig.store.splitHinterConfig`           | See [SplitHinterOptions](#splithinteroptions)   | Default split hinter for retain store         | Split hinter settings for Retain store. See [SplitHinterOptions](#splithinteroptions). |
| `retainServiceConfig.store.attributes`                  | `Map<String,String>`                            | \{\}                                          | Custom attributes attached to Retain store.                                            |

### SessionDictServiceConfig (`sessionDictServiceConfig.*`)

| Configuration Name                              | Value Type           | Default Value | Description                                                |
| ----------------------------------------------- | -------------------- | ------------- | ---------------------------------------------------------- |
| `sessionDictServiceConfig.client.workerThreads` | Integer              | 0             | Worker threads for SessionDict client.                     |
| `sessionDictServiceConfig.server.enable`        | Boolean              | true          | Whether to enable SessionDict server.                      |
| `sessionDictServiceConfig.server.workerThreads` | Integer              | 0             | SessionDict server worker threads (0 = use caller thread). |
| `sessionDictServiceConfig.server.attributes`    | `Map<String,String>` | \{\}          | Custom attributes attached to SessionDict server.          |
| `sessionDictServiceConfig.server.defaultGroups` | `Set<String>`        | []            | Default groups served by this SessionDict server.          |

### APIServerConfig (`apiServerConfig.*`)

| Configuration Name                 | Value Type                                                              | Default Value | Description                                                         |
| ---------------------------------- | ----------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| `apiServerConfig.enable`           | Boolean                                                                 | true          | Whether to enable HTTP API access.                                  |
| `apiServerConfig.host`             | String                                                                  | null          | API listen address; if null, follows the same host resolution rule. |
| `apiServerConfig.httpPort`         | Integer                                                                 | 8091          | HTTP API port.                                                      |
| `apiServerConfig.maxContentLength` | Integer                                                                 | 262144        | Max request body size in bytes.                                     |
| `apiServerConfig.workerThreads`    | Integer                                                                 | 2             | Worker threads handling HTTP API requests.                          |
| `apiServerConfig.enableSSL`        | Boolean                                                                 | false         | Whether to enable HTTPS for the API.                                |
| `apiServerConfig.sslConfig`        | See [ServerSSLContextConfig](#sslcontextconfig--serversslcontextconfig) | null          | TLS settings for the API server when HTTPS is enabled.              |

## SSLContextConfig & ServerSSLContextConfig

SSLContextConfig is used to configure the SSL connection parameters for the client, while ServerSSLContextConfig is used to configure the SSL connection parameters for the server.

If you leave SSLContextConfig or ServerSSLContextConfig set to null while the corresponding `enable` flags are set to true, a self-signed certificate will be generated, which is not recommended for production environments.

| Configuration Name | Value Type | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `certFile`         | String     | null          | The filename of the public certificate for the client or server.                                                                                                                                                                                                                                                                                                                                 |
| `keyFile`          | String     | null          | The filename of the private key for the client or server.                                                                                                                                                                                                                                                                                                                                        |
| `trustCertsFile`   | String     | null          | The filename of the root certificate for the client or server. If null, peer certification will not be verified, when clientAuth is OPTIONAL or REQUIRE.                                                                                                                                                                                                                                         |
| `clientAuth`       | String     | "OPTIONAL"    | Only valid for ServerSSLContextConfig. Whether the server requires client verification. Possible values include: <br/>NONE: No verification required; <br/>OPTIONAL: Server requests client verification, but if the client does not provide a certificate, it will not fail; <br/>REQUIRE: Server requires client verification, and if the client does not provide a certificate, it will fail. |

## StorageEngineConfig

StorageEngineConfig is used to set the configuration parameters for the data engine and WAL engine of the built-in stateful service. The shape of `props` depends on the engine type; defaults are applied per service in code.

| Configuration Name | Value Type            | Default Value             | Description                                                                                                |
| ------------------ | --------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `type`             | String                | `rocksdb`                 | Storage engine type. `rocksdb` enables persistence; `memory` keeps state in memory only (lost on restart). |
| `props` (rocksdb)  | `Map<String, Object>` | Service-specific defaults | Additional selectively exposed RocksDB options. Tune only if you understand RocksDB well.                  |
| `props` (memory)   | `Map<String, Object>` | \{\}                      | No options for `memory` currently, normally for testing purpose                                            |

## BalancerOptions

BalancerOptions is used to set the configuration parameters for the Balancer of the built-in stateful service.

| Configuration Name     | Value Type            | Default Value                        | Description                                                                                                                                            |
| ---------------------- | --------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bootstrapDelayInMS`   | Long                  | 15000                                | Delay before the balancer starts; helps avoid rebalancing during initial bootstrap.                                                                    |
| `zombieProbeDelayInMS` | Long                  | 15000                                | Interval for probing zombie (stale) replicas.                                                                                                          |
| `retryDelayInMS`       | Long                  | 5000                                 | Delay between rebalance retries.                                                                                                                       |
| `balancers`            | `Map<String, Struct>` | Service-specific defaults (see code) | Map of balancer implementation FQNs to their config. Multiple balancers can be enabled; defaults are set in each service (Dist/Inbox/Retain) per code. |

## SplitHinterOptions

SplitHinterOptions configures how ranges are split for built-in stateful services.

| Configuration Name | Value Type            | Default Value                        | Description                                                                                 |
| ------------------ | --------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `hinters`          | `Map<String, Struct>` | Service-specific defaults (see code) | A map of split hinter implementation FQNs to their config. Multiple hinters can be enabled. |

Note: Adjusting the parameters related to StorageEngineConfig, BalancerOptions, and SplitHinterOptions requires an in-depth understanding of the storage engine implementation of BifroMQ. Improper configuration may lead to abnormal behavior of the state storage
service.
