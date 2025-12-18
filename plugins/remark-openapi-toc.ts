import fs from "fs";
import path from "path";
import type { Plugin } from "unified";
import type { Root } from "mdast";

const OPERATIONS_JSON = path.resolve(
  __dirname,
  "../src/openapi/generatedOperations.json"
);

const remarkOpenApiToc: Plugin<[], Root> = () => {
  return (tree, file) => {
    const filePath = (file as any).history?.[0] as string | undefined;
    if (!filePath || !filePath.endsWith("docs/user_guide/api/openapi.md")) {
      return;
    }

    if (!fs.existsSync(OPERATIONS_JSON)) {
      return;
    }

    const operations = JSON.parse(fs.readFileSync(OPERATIONS_JSON, "utf8"));
    const makeId = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const headings: any[] = [];
    const groups = new Map<string, any[]>();
    operations.forEach((op: any) => {
      const tag = op.api?.tags?.[0] ?? "APIs";
      if (!groups.has(tag)) {
        groups.set(tag, []);
      }
      groups.get(tag)!.push(op);
    });

    groups.forEach((ops, tag) => {
      const hasTag = tag !== "APIs";
      if (hasTag) {
        headings.push({
          type: "heading",
          depth: 2,
          data: {
            hProperties: {
              id: makeId(tag),
              style: "display:none;",
            },
          },
          children: [{ type: "text", value: tag }],
        });
      }
      ops.forEach((op: any) => {
        headings.push({
          type: "heading",
          depth: hasTag ? 3 : 2,
          data: {
            hProperties: {
              id: op.id,
              style: "display:none;",
            },
          },
          children: [{ type: "text", value: op.title }],
        });
      });
    });

    (tree as any).children = [...headings, ...(tree as any).children];
  };
};

export default remarkOpenApiToc;
