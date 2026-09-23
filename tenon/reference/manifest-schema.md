---
title: "Plugin Manifest Schema"
description: "Plugin manifest fields, types, and constraints."
mdx:
  format: md
---

# Plugin Manifest Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://tenon.dev/contracts/plugin/manifest.schema.json",
  "title": "Tenon Plugin Program Manifest",
  "description": "The canonical identity, display metadata, implemented interface capability, and launch command for one immutable Tenon Plugin Program package.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "programName",
    "exactVersion",
    "displayName",
    "description",
    "interface",
    "platforms",
    "command"
  ],
  "properties": {
    "programName": {
      "type": "string",
      "pattern": "^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?){2,}$",
      "description": "The reverse-domain logical program name. Together with exactVersion it is the complete immutable Program identity."
    },
    "exactVersion": {
      "type": "string",
      "pattern": "^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(?:-(?:0|[1-9][0-9]*|[0-9a-z-]*[a-z-][0-9a-z-]*)(?:\\.(?:0|[1-9][0-9]*|[0-9a-z-]*[a-z-][0-9a-z-]*))*)?$",
      "description": "The immutable strict SemVer program version. Together with programName it is the complete immutable Program identity."
    },
    "interface": {
      "enum": [
        "source",
        "sink",
        "source-and-sink"
      ],
      "description": "The exact standard interface capability implemented by this Program. Source-and-sink means both standard interfaces in one process."
    },
    "command": {
      "type": "array",
      "minItems": 1,
      "prefixItems": [
        {
          "type": "string",
          "minLength": 1,
          "pattern": "^[^\\u0000]+$",
          "not": {
            "enum": [
              "--sdk-config"
            ]
          }
        }
      ],
      "items": {
        "type": "string",
        "pattern": "^[^\\u0000]*$",
        "not": {
          "enum": [
            "--sdk-config"
          ]
        }
      },
      "description": "The exact executable and static argument vector. Pipeline appends its reserved startup document without shell interpretation."
    },
    "platforms": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "description": "Supported operating system and CPU architecture pairs for this package when its documented runtime dependencies are available. Only linux/darwin and amd64/arm64 are supported; names use GOOS/GOARCH spelling and order expresses no preference.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "os",
          "architecture"
        ],
        "properties": {
          "os": {
            "type": "string",
            "enum": [
              "darwin",
              "linux"
            ]
          },
          "architecture": {
            "type": "string",
            "enum": [
              "amd64",
              "arm64"
            ]
          }
        }
      }
    },
    "displayName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 80,
      "pattern": "[^\\u0009-\\u000d\\u0020\\u0085\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000]",
      "description": "Required single-line display name, measured in Unicode code points. Must contain a non-whitespace character. Control characters and line separators are forbidden. Preserved without trimming or normalization; not part of Program identity.",
      "not": {
        "pattern": "[\\u0000-\\u001f\\u007f-\\u009f\\u2028\\u2029]"
      }
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "maxLength": 1024,
      "pattern": "[^\\u0009-\\u000d\\u0020\\u0085\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000]",
      "description": "Required plain-text description, measured in Unicode code points. Must contain a non-whitespace character. LF and CR line breaks are allowed; other control characters are forbidden. Preserved without trimming or normalization; not HTML or Markdown.",
      "not": {
        "pattern": "[\\u0000-\\u0009\\u000b\\u000c\\u000e-\\u001f\\u007f-\\u009f]"
      }
    }
  }
}
```
