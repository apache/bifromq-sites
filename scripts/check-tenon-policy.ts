/// <reference types="node" />
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const build = path.join(root, 'build');
const tenon = path.join(root, 'tenon');

function htmlFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

function contentFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? contentFiles(file) : /\.(md|mdx|tsx|ts)$/.test(entry.name) ? [file] : [];
  });
}

function requireFile(relative: string): string {
  const file = path.join(build, relative);
  if (!existsSync(file)) throw new Error(`Missing generated Tenon page: ${relative}`);
  return readFileSync(file, 'utf8');
}

const landing = requireFile('tenon/index.html');
const plugins = requireFile('tenon/plugins/index.html');
const docs = htmlFiles(path.join(build, 'tenon/docs'));
if (docs.length === 0) throw new Error('No generated Tenon documentation pages found.');
for (const file of docs) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('name="robots" content="noindex, nofollow"')) {
    throw new Error(`Tenon development documentation must be noindex: ${path.relative(build, file)}`);
  }
  if (html.includes('4.0.0-incubating') || html.includes('Development (latest)')) {
    throw new Error(`Broker version metadata leaked into Tenon documentation: ${path.relative(build, file)}`);
  }
}
if (!landing.includes('noindex, nofollow')) {
  throw new Error('The Tenon redirect entry page must be noindex.');
}
if (!landing.includes('/tenon/docs/development/get-started/overview/')) {
  throw new Error('Tenon entry page must redirect directly to the documentation overview.');
}
if (plugins.includes('noindex')) throw new Error('The plugin index must remain discoverable.');
if (!plugins.includes('Awesome Tenon Plugins') || !plugins.includes('Add your plugin')) {
  throw new Error('Tenon plugin index is missing its list or contribution instructions.');
}
const sourceFiles = [...contentFiles(tenon), ...contentFiles(path.join(root, 'src/pages/tenon'))];
const forbiddenTutorialPatterns = [
  'cargo install cargo-tenon --version',
  'cargo generate --git',
  'github.com/apache/bifromq-tenon/releases',
  'GitHub Releases',
  'release acceptance',
  'release schedule',
  'release process',
  'published artifacts',
  'published registry',
  'before distributing',
  'Build artifacts for distribution',
  'Imported from',
  'Imported excerpt',
  'source baseline',
  'incubation disclaimer',
  'guide/quickstart',
];
for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8').toLowerCase();
  if (/https:\/\/github\.com\/apache\/(?:incubator-)?bifromq-tenon\/(?:blob|tree|edit)\/[^/\s)]+\/guide\//.test(content)) {
    throw new Error(`Link to a repository guide instead of website documentation: ${path.relative(root, file)}`);
  }
  for (const pattern of forbiddenTutorialPatterns) {
    if (content.includes(pattern.toLowerCase())) {
      throw new Error(`Unsupported Tenon documentation wording in ${path.relative(root, file)}: ${pattern}`);
    }
  }
}
console.log(`Tenon policy checks passed for ${docs.length} development pages.`);
