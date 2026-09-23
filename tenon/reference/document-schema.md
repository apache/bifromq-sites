---
title: "Tenon Document Schema"
description: "Tenon Document v1 fields, types, defaults, and constraints."
mdx:
  format: md
---

# Tenon Document Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Tenon Document v1",
  "description": "The outer structure of a Tenon Document with specVersion=1. One Document owns Plugin Instances and one or more directed Flows.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "specVersion",
    "id",
    "pluginInstances",
    "flows"
  ],
  "properties": {
    "specVersion": {
      "const": "1",
      "description": "The exact DSL version."
    },
    "id": {
      "$ref": "#/$defs/stableId"
    },
    "resourceLimits": {
      "type": "object",
      "additionalProperties": false,
      "description": "Optional aggregate limits for the Pipeline process and its Plugin descendants. Unsupported platforms accept but ignore valid limits.",
      "properties": {
        "cpu": {
          "type": "number",
          "minimum": 0.01,
          "multipleOf": 0.01,
          "maximum": 184467440737095.51,
          "description": "CPU time in logical-core equivalents, in increments of 0.01. This aggregate ceiling covers the Pipeline and all Plugin descendants across their allowed CPUs. It does not change Flow channel counts, reserve CPUs, or set affinity."
        },
        "memoryBytes": {
          "type": "integer",
          "minimum": 1,
          "maximum": 18446744073709551615,
          "description": "Aggregate platform-accounted memory in bytes. Host page granularity and ancestor limits apply; swap policy remains with the host."
        }
      }
    },
    "pluginInstances": {
      "type": "object",
      "minProperties": 1,
      "propertyNames": {
        "$ref": "#/$defs/stableId"
      },
      "additionalProperties": {
        "$ref": "#/$defs/pluginInstance"
      },
      "description": "Plugin Instances keyed by their stable Pipeline-local identity."
    },
    "flows": {
      "type": "object",
      "minProperties": 1,
      "propertyNames": {
        "$ref": "#/$defs/stableId"
      },
      "additionalProperties": {
        "$ref": "#/$defs/flow"
      },
      "description": "Directed Source-to-Lua-to-Sinks Flows keyed by stable identity."
    }
  },
  "$defs": {
    "stableId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 128,
      "pattern": "^[^\\u0000-\\u001F\\u007F-\\u009F]+$",
      "description": "The parsed UTF-8 value must contain 1..128 bytes and no C0 or C1 control characters. The complete semantic validator rechecks the byte length."
    },
    "programName": {
      "type": "string",
      "pattern": "^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?){2,}$",
      "description": "The reverse-domain logical Plugin Program name."
    },
    "exactVersion": {
      "type": "string",
      "pattern": "^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?:-(?:0|[1-9][0-9]*|[0-9a-z-]*[a-z-][0-9a-z-]*)(?:\\.(?:0|[1-9][0-9]*|[0-9a-z-]*[a-z-][0-9a-z-]*))*)?$",
      "description": "The immutable strict SemVer Plugin Program version."
    },
    "pluginInstance": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "programName",
        "exactVersion",
        "config"
      ],
      "properties": {
        "programName": {
          "$ref": "#/$defs/programName"
        },
        "exactVersion": {
          "$ref": "#/$defs/exactVersion"
        },
        "extraArgs": {
          "$ref": "#/$defs/extraArgs"
        },
        "env": {
          "type": "object",
          "additionalProperties": {
            "type": "string",
            "pattern": "^[^\\u0000]*$"
          },
          "propertyNames": {
            "type": "string",
            "minLength": 1,
            "pattern": "^[^=\\u0000]*$"
          }
        },
        "config": {
          "description": "Plain JSON configuration validated once for this Instance and passed unchanged to its Plugin Program."
        }
      }
    },
    "extraArgs": {
      "type": "object",
      "additionalProperties": false,
      "required": ["args"],
      "properties": {
        "args": {
          "type": "array",
          "items": { "type": "string", "pattern": "^[^\\u0000]*$" }
        },
        "position": {
          "enum": ["append", "prepend"]
        }
      }
    },
    "delivery": {
      "enum": [
        "at-most-once",
        "at-least-once"
      ],
      "description": "Selects when this Flow returns Source completion OK. The default is at-least-once."
    },
    "process": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "script"
      ],
      "properties": {
        "script": {
          "type": "string",
          "minLength": 1,
          "description": "Embedded Tenon Lua source code owned and executed independently by this Flow."
        }
      }
    },
    "flow": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "source",
        "process",
        "sinks"
      ],
      "properties": {
        "parallelism": {
          "type": "number",
          "exclusiveMinimum": 0,
          "maximum": 10,
          "description": "An optional concurrency multiplier for this Flow, greater than zero and at most ten. When omitted, one independent ordered channel is created. When present, multiply by the Runner startup count of allowed logical CPUs and round up, with a minimum of one channel. CPU-time quotas, including resourceLimits.cpu, do not affect this count. Each channel owns a Submission and Completion Queue pair, a worker thread, and a Lua VM; this multiplier does not reserve CPU time."
        },
        "source": {
          "$ref": "#/$defs/stableId",
          "description": "The Plugin Instance whose Source interface feeds this Flow."
        },
        "maxPendingRecords": {
          "type": "integer",
          "minimum": 1,
          "maximum": 18446744073709551615,
          "description": "Maximum admitted but incomplete Source sends per Channel in this Flow. Defaults to 100. The Source admission queue and all derived Queue capacities must fit the official SDK representations."
        },
        "maxRecordBytes": {
          "type": "integer",
          "minimum": 1024,
          "maximum": 18446744073709551615,
          "description": "Maximum complete encoded IngressRecord or EgressRecord size for this Flow, excluding Queue frame header and padding. Defaults to 262144 (256 KiB). The aligned frame must fit the official SDK array length."
        },
        "delivery": {
          "$ref": "#/$defs/delivery"
        },
        "process": {
          "$ref": "#/$defs/process"
        },
        "sinks": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": {
            "$ref": "#/$defs/stableId"
          },
          "description": "The Plugin Instances whose Sink interfaces receive this Flow's emitted records."
        }
      }
    }
  }
}
```
