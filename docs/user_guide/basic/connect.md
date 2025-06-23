---
sidebar_position: 1
title: "Connect to BifroMQ"
---

BifroMQ is a standard MQTT messaging middleware, which allows you to connect using any client that supports MQTT version 3.1, 3.1.1 or 5.0.

## Connection Address

Use the IP address or domain name corresponding to the launched service. Below are the default ports and their purposes:

| Port                  | Note           |
| --------------------- | -------------- |
| IP or Domain:1883     | TCP Connection |
| IP or Domain:1884     | TLS Connection |
| IP or Domain:80/mqtt  | WS Connection  |
| IP or Domain:443/mqtt | WSS Connection |

## Authentication and Authorization

By default, without an AuthProvider plugin, BifroMQ does not enforce authentication or authorization. However, you can assign a connection to a specific tenant by specifying the username in the format `<TenantId>/<UserName>`. If you omit the tenant prefix, the connection will be assigned to the default `"DevOnly"` tenant.

For full authentication and authorization support, please refer to the [AuthProvider Plugin](../../plugin/auth_provider.md).
