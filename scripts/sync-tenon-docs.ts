/// <reference types="node" />
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { tenonDocsBase, tenonGuidePages, tenonImports, tenonSource, type TenonImport } from '../tenonSource';

const args = process.argv.slice(2);
const check = args.includes('--check');
const checkout = args.find((arg) => !arg.startsWith('--'));
if (!checkout || args.some((arg) => arg.startsWith('--') && arg !== '--check')) {
  throw new Error('Usage: pnpm sync:tenon /path/to/bifromq-tenon [--check]');
}
const siteRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(checkout);
const importedBySource = new Map(tenonImports.map((entry) => [entry.source, entry]));
const verifiedPaths = new Set<string>();

function sourceUrl(file: string): string {
  return `${tenonSource.repository}/blob/${tenonSource.commit}/${file}`;
}

function verifySource(file: string): void {
  if (verifiedPaths.has(file)) return;
  execFileSync('git', ['-C', sourceRoot, 'cat-file', '-e', `${tenonSource.commit}:${file}`], { stdio: 'pipe' });
  verifiedPaths.add(file);
}

function rewriteTarget(target: string, source: string, image: boolean): string {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(target)) return target;
  const [relative, fragment] = target.split('#', 2);
  const file = path.posix.normalize(path.posix.join(path.posix.dirname(source), relative));
  verifySource(file);
  if (image) {
    throw new Error(`Import ${source} needs a checked-in local image: ${target}`);
  }
  const imported = importedBySource.get(file);
  const guidePage = tenonGuidePages[file];
  if (guidePage) {
    const url = `${tenonDocsBase}/${guidePage}/`;
    return fragment ? `${url}#${fragment}` : url;
  }
  if (file.startsWith('guide/') && !imported) {
    throw new Error(`Add a website page for guide link in ${source}: ${target}`);
  }
  // Excerpts only own their included headings; other links stay with the source.
  const url = imported && !imported.startHeading ? `${tenonDocsBase}/${imported.id}/` : sourceUrl(file);
  return fragment ? `${url}#${fragment}` : url;
}

function render(entry: TenonImport): string {
  let body = execFileSync('git', ['-C', sourceRoot, 'show', `${tenonSource.commit}:${entry.source}`], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (entry.startHeading) {
    const start = body.indexOf(`\n${entry.startHeading}\n`);
    const end = entry.endHeading ? body.indexOf(`\n${entry.endHeading}\n`, start + 1) : body.length;
    if (start < 0 || end < 0) throw new Error(`Missing excerpt boundary: ${entry.source}`);
    const license = body.match(/^<!--[\s\S]*?-->\s*/)?.[0] ?? '';
    body = `${license}# ${entry.title}\n\n${body.slice(start, end).trim()}\n`;
  }
  if (entry.source.endsWith('.json')) {
    JSON.parse(body);
    body = `# ${entry.title}\n\n\`\`\`json\n${body.trim()}\n\`\`\`\n`;
  } else {
    // The site footer carries the incubation notice; do not repeat it in each article.
    body = body.replace(/^(?:Apache BifroMQ )?Tenon is part of Apache BifroMQ \(Incubating\)\. See the \[incubation disclaimer\]\([^\n]+\)\.\r?\n\r?\n/gm, '');
    let fence = '';
    body = body.split('\n').map((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/);
      if (marker) {
        if (!fence) fence = marker[1];
        else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = '';
        return line;
      }
      if (fence) return line;
      return line.split(/(`+[^`]*`+)/).map((part, index) => index % 2 ? part : part.replace(/(?<!Tenon )\bDocuments?\b/g, 'Tenon $&')).join('')
        .replace(/\/tenon\/plugins\/#community\b/g, '/tenon/plugins/#add-your-plugin')
        .replace(/(!?\[[^\]]*\]\()([^\s)]+)(\))/g, (_all, prefix: string, target: string, suffix: string) =>
        `${prefix}${rewriteTarget(target, entry.source, prefix.startsWith('!'))}${suffix}`)
        .replace(/^(\s*\[[^\]]+\]:\s*)(\S+)/, (_all, prefix: string, target: string) =>
          `${prefix}${rewriteTarget(target, entry.source, false)}`);
    }).join('\n');
  }
  return `---\ntitle: ${JSON.stringify(entry.title)}\ndescription: ${JSON.stringify(entry.description)}\nmdx:\n  format: md\n---\n\n${body.trim()}\n`;
}

const stale: string[] = [];
for (const entry of tenonImports) {
  const destination = path.join(siteRoot, 'tenon', `${entry.id}.md`);
  const expected = render(entry);
  if (check) {
    if (!existsSync(destination) || readFileSync(destination, 'utf8') !== expected) stale.push(entry.id);
  } else {
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, expected);
  }
}
if (stale.length) throw new Error(`Tenon imports differ from the pinned source: ${stale.join(', ')}`);
console.log(`${check ? 'Verified' : 'Imported'} ${tenonImports.length} Tenon documents at ${tenonSource.commit}.`);
