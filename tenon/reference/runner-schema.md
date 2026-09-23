---
title: "Runner Configuration Schema"
description: "Runner configuration fields, types, and constraints."
mdx:
  format: md
---

# Runner Configuration Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://tenon.dev/contracts/runner/config.schema.json",
  "title": "Tenon Runner Configuration",
  "description": "Shared runtime environment configuration read and frozen once when Tenon Runner starts.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "stateDirectory",
    "http",
    "pipeline",
    "lua"
  ],
  "properties": {
    "stateDirectory": {
      "type": "string",
      "minLength": 1,
      "description": "Absolute path to the Runner private state root."
    },
    "http": {
      "$ref": "#/$defs/http"
    },
    "pipeline": {
      "$ref": "#/$defs/pipeline"
    },
    "lua": {
      "$ref": "#/$defs/lua"
    },
    "extra": {
      "type": "object",
      "description": "Opaque distribution-specific startup configuration supplied to the Runner initializer."
    },
    "metrics": {
      "$ref": "#/$defs/metrics"
    }
  },
  "$defs": {
    "positiveU32": {
      "type": "integer",
      "minimum": 1,
      "maximum": 4294967295
    },
    "positiveU64": {
      "type": "integer",
      "minimum": 1,
      "maximum": 18446744073709551615
    },
    "http": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "listenAddress"
      ],
      "properties": {
        "listenAddress": {
          "type": "string",
          "minLength": 1,
          "description": "IP literal and port bound by the HTTP or HTTPS server, such as 127.0.0.1:8080 or [::1]:8080."
        },
        "tls": {
          "$ref": "#/$defs/tls"
        }
      }
    },
    "pipeline": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "retryBackoff"
      ],
      "properties": {
        "startupTimeoutMs": {
          "$ref": "#/$defs/positiveU64",
          "description": "Deadline in milliseconds from Pipeline child creation through Attach and the first structurally applied status; defaults to 30000 when omitted."
        },
        "shutdownTimeoutMs": {
          "$ref": "#/$defs/positiveU64",
          "description": "Total planned Pipeline shutdown deadline in milliseconds; defaults to 30000 when omitted."
        },
        "reconfigureTimeoutMs": {
          "$ref": "#/$defs/positiveU64",
          "description": "Non-resettable deadline in milliseconds for each subsequent target validation and apply, including failure cleanup; expiry terminates the entire Pipeline process group. Defaults to 30000 when omitted."
        },
        "retryBackoff": {
          "$ref": "#/$defs/retryBackoff"
        }
      }
    },
    "retryBackoff": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "initialDelayMs",
        "maximumDelayMs"
      ],
      "properties": {
        "initialDelayMs": {
          "$ref": "#/$defs/positiveU64",
          "description": "Initial delay in milliseconds for child process restarts."
        },
        "maximumDelayMs": {
          "$ref": "#/$defs/positiveU64",
          "description": "Maximum delay in milliseconds for child process restarts."
        }
      }
    },
    "lua": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "cpuTimeLimitMs",
        "memoryLimitBytes"
      ],
      "properties": {
        "cpuTimeLimitMs": {
          "$ref": "#/$defs/positiveU64",
          "description": "CPU time limit in milliseconds for Lua top-level initialization and each main call."
        },
        "memoryLimitBytes": {
          "$ref": "#/$defs/positiveU64",
          "description": "Complete Lua VM state-space memory limit in bytes."
        }
      }
    },
    "tls": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "certificateChainFile",
        "privateKeyFile"
      ],
      "properties": {
        "certificateChainFile": {
          "type": "string",
          "minLength": 1,
          "description": "Absolute path to a PEM certificate chain, with the server certificate first. Loaded once at startup; presence of tls selects HTTPS only."
        },
        "privateKeyFile": {
          "type": "string",
          "minLength": 1,
          "description": "Absolute path to the matching unencrypted PEM private key. Loaded once at startup; deployment protects and renews the identity files."
        },
        "handshakeTimeoutMs": {
          "$ref": "#/$defs/positiveU64",
          "description": "Total TLS handshake deadline in milliseconds; defaults to 10000 when omitted and is not renewed by partial input."
        },
        "clientCaFile": {
          "type": "string",
          "minLength": 1,
          "description": "Absolute path to a PEM bundle of client trust anchors. When present, every HTTP connection requires a trusted client certificate. Loaded once at startup; omitted for server-only HTTPS."
        }
      }
    },
    "metrics": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "nodeId": {
          "type": "string",
          "minLength": 1,
          "maxLength": 128,
          "description": "Optional deployment label; omission leaves tenon.node.id absent."
        },
        "collectionTimeoutMs": {
          "$ref": "#/$defs/positiveU64",
          "description": "Shared wait budget for one metrics request in milliseconds; omitted value is 2000."
        }
      },
      "description": "Optional core pull metrics settings. Collection is enabled when omitted; Plugin SDKs are not instrumented."
    }
  }
}
```
