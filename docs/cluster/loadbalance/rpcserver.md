---
sidebar_position: 3
title: "Internal RPC Server"
---

# Internal RPC Load Balancing

BifroMQ’s internal RPC framework supports **runtime traffic governing**, allowing operators to control how internal service requests are distributed across nodes at runtime.

The following internal RPC services support runtime traffic governance (the value shown is the required `service_name` header):

| Service             | Internal role             | `<SERVICE_NAME_HEADER>` |
| ------------------- | ------------------------- | ----------------------- |
| Dist Server         | subscription distribution | `DistService`           |
| Inbox Server        | offline message delivery  | `InboxService`          |
| Retain Server       | retain message lookup     | `RetainService`         |
| Session Dict Server | shared session dictionary | `SessionDictService`    |

These services form logically independent subclusters on top of the underlay cluster, each responsible for a specific class of internal workloads.

## Traffic governance API

The traffic governance API provides introspection and control over routing weights and node groups within a service subcluster.

### Service landscape

The Service Landscape API returns all active RPC service instances for a given service_name.
It reflects the runtime topology of the service subcluster on the overlay layer, including node identity, bind address, port, static attributes, and dynamically assigned groups.

##### Request

```
GET /service/landscape
Headers:
  service_name: <SERVICE_NAME_HEADER>
```

##### Response Structure

```json
[
  {
    "hostId": "OTQ0OWE5NzAtNjliOC00ZDI3LTg5MjQtOWU3NDEyMWNhNDFj", // Identity of the node in the Underlay Cluster
    "id": "342586ce-a8d4-4d85-9ae0-3bf596e982d5/1456250665", // Identity of the RPC server instance in the Overlay Cluster
    "address": "10.0.0.2", // RPC server bind address
    "port": 40469, // RPC server bind port
    "attributes": {}, // Static metadata configured at startup (e.g., availability zone, rack ID).
    "groups": [] // Runtime-assigned groups (via `/service/group`)
  }
]
```

### Traffic rules

Traffic rules control how tenant-tagged requests are distributed across RPC service instances at runtime.  
Rules are evaluated based on the `service_name` header and define a per-tenant routing policy.  
Incoming requests from a tenant are distributed across one or more server groups according to their configured weights.  
Each server group forwards requests to its RPC servers. If a selected server group has no available servers, the request is rejected.  
Tenants without an explicit traffic rule use the default server group.

The traffic rule JSON:

```json
{
    "<TENANT_ID>": {          // tenant for which the rule applies
        "<SERVER_GROUP>": <WEIGHT>   // server group name and its routing weight
    }
}
```

#### Get Traffic Rules

Returns the current routing rules for the specified service.

##### Request

```
GET /service/traffic
Headers:
service_name: <SERVICE_NAME_HEADER>
```

##### Response Structure

Same as the traffic rule JSON above.

#### Set Traffic Rules

Updates traffic rules by merging the provided JSON with the existing rules.

##### Request

```
PUT /service/traffic
Headers:
service_name: <SERVICE_NAME_HEADER>
Body: traffic rule JSON shown above.
```

#### Unset Traffic Rule

Removes traffic rules for the specified tenants.
The request body must contain an array of `<TENANT_ID>` values.

```
DELETE /service/traffic
Headers:
service_name: <SERVICE_NAME_HEADER>
```

### Server Groups

Service groups classify RPC server instances into logical buckets (e.g., AZ, rack, region).
Traffic rules reference these groups to determine how tenant traffic is routed.
A server may belong to multiple groups. Servers with no explicit groups are implicitly part of the 'default' group.
Server groups can be set in two ways:

- at startup via configuration file (static initial groups)
- at runtime via the /service/group API (dynamic override)

#### Set Server Groups (runtime)

Assigns one or more group names to a specific RPC server instance.

##### Request

```
PUT /service/group
Headers:
  service_name: <SERVICE_NAME_HEADER>
  server_id: <SERVER_ID>   # Returned from /service/landscape
Body: JSON array of strings, each represents a group name
```

Runtime group assignment:

- replaces any previously assigned groups
- may assign multiple groups
- if the array is empty → server belongs only to the 'default' group

#### Startup Configuration (static group assignment)

Server groups may also be defined in the configuration file.
These groups become the server’s initial group list before any /service/group updates occur.

```yaml
distServiceConfig:
  server:
    attributes:
      - "prod"
      - "az1"
```
