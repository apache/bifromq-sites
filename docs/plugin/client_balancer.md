---
sidebar_position: 2
title: "Client Balancer"
---

The Client Balancer plugin enables BifroMQ to inject redirection strategies at runtime, providing active control over client connections to manage load distribution.

To integrate the Client Balancer plugin into your BifroMQ deployment, include the following Maven dependency:

```xml
<dependency>
    <groupId>org.apache.bifromq</groupId>
    <artifactId>bifromq-plugin-client-balancer</artifactId>
    <version>X.Y.Z</version> <!-- Replace X.Y.Z with the latest version number -->
</dependency>
```

## Configuration

BifroMQ operates with a single `ClientBalancer` instance. You must specify the fully qualified class name (FQN) of your implementation in the [configuration file](../admin_guide/configuration/config_file_manual.md):

```yaml
clientBalancerFQN: "YOUR_CLIENT_BALANCER_CLASS"
```

## Client Redirection

The `ClientBalancer` interface defines a single method that is invoked by BifroMQ to decide whether a client connection should be redirected:

```java
Optional<Redirection> needRedirect(ClientInfo clientInfo);
```

When BifroMQ determines it's time to evaluate redirection, it calls this method. If a non-empty `Optional` is returned, the client connection will be actively disconnected based on the returned redirection hint.

The `Redirection` record carries the disconnection hint:

```java
public record Redirection(boolean permanentMove, Optional<String> serverReference) { }
```

When the client uses the MQTT 5.0 protocol, BifroMQ maps the redirection information to MQTT disconnect semantics:

- If `permanentMove` is `true`, the client receives `Server moved (0x9D)` reason code.
- If `permanentMove` is `false`, the client receives `Use another server (0x9C)` reason code.
- If `serverReference` is present, its value is included in the `Server Reference` field of the disconnect packet.

## Redirection Evaluation Timing

- **Post-authentication check**: Immediately after a client's authentication, BifroMQ invokes `needRedirect` to determine if the connection should be redirected.
- **Periodic check**: For already established connections, BifroMQ periodically invokes `needRedirect` to evaluate if a redirection is needed.

The default periodic check interval is **600 seconds**. This interval can be adjusted using the [system property](../admin_guide/configuration/bifromq_sys_props.md): `client_redirect_check_interval_seconds`

## Performance Considerations

The `ClientBalancer` executes within BifroMQ's core worker threads. Its implementation should remain lightweight and efficient to avoid degrading system performance.

BifroMQ collects metrics to monitor the plugin's performance:

- **`call.exec.timer`**: Tracks the execution duration and frequency of `needRedirect` invocations.
- **`call.exec.fail.count`**: Counts the number of exceptions thrown during `needRedirect` calls.
