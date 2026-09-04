// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements. See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership. The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License. You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the
// specific language governing permissions and limitations
// under the License.

import {readFileSync, readdirSync, statSync} from 'node:fs';
import {extname, join, relative} from 'node:path';

const buildDir = new URL('../build/', import.meta.url).pathname;
const canonicalOrigin = 'https://bifromq.apache.org';
const developmentVersion = 'development';
const archivedVersions = ['3.2.x', '3.1.x', '3.0.x', '2.1.x', '2.0.0', '1.0.x'];
const approvedExternalResources = new Set([
  'https://analytics.apache.org/matomo.js',
]);
const matomoRequirementPatterns = [
  /window\._paq/,
  /["']setDoNotTrack["']\s*,\s*(?:true|!0)/,
  /["']disableCookies["']/,
  /["']trackPageView["']/,
  /["']enableLinkTracking["']/,
  /["']setTrackerUrl["']\s*,\s*["']https:\/\/analytics\.apache\.org\/matomo\.php["']/,
  /["']setSiteId["']\s*,\s*["']90["']/,
  /<script\b[^>]*\bsrc=["']https:\/\/analytics\.apache\.org\/matomo\.js["']/,
];

function fail(message) {
  throw new Error(message);
}

function read(relativePath) {
  return readFileSync(join(buildDir, relativePath), 'utf8');
}

function findFiles(directory, extensions) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? findFiles(path, extensions)
      : extensions.includes(extname(path))
        ? [path]
        : [];
  });
}

function findHtmlFiles(directory) {
  return findFiles(directory, ['.html']);
}

function getAttribute(tag, name) {
  return tag.match(new RegExp(`(?:^|\\s)${name}=["']([^"']*)`, 'i'))?.[1] ?? '';
}

function getTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map(
    (match) => match[0],
  );
}

function pagePath(htmlFile) {
  const path = relative(buildDir, htmlFile).split('\\').join('/');
  if (path === 'index.html') {
    return '/';
  }
  return `/${path.replace(/index\.html$/, '').replace(/\.html$/, '')}`;
}

function isLocalSiteUrl(value) {
  try {
    return new URL(value).origin === canonicalOrigin;
  } catch {
    return false;
  }
}

function findExternalResources(file, content) {
  const matches = [];

  if (file.endsWith('.html')) {
    for (const match of content.matchAll(
      /<(script|img|source|video|audio|iframe)\b[^>]*?\s(?:src|srcset|poster)=["'](https?:\/\/[^"'\s,>]+)/gi,
    )) {
      matches.push(match[2]);
    }

    for (const link of getTags(content, 'link')) {
      const rel = getAttribute(link, 'rel');
      const href = getAttribute(link, 'href');
      if (
        href.startsWith('http') &&
        /(?:stylesheet|icon|preload|prefetch|preconnect|modulepreload)/i.test(rel)
      ) {
        matches.push(href);
      }
    }
  }

  for (const match of content.matchAll(
    /(?:url\(|@import\s+)["']?(https?:\/\/[^"')\s]+)/gi,
  )) {
    matches.push(match[1]);
  }

  return matches;
}

const verification = read('google55353de668345094.html').trim();
if (verification !== 'google-site-verification: google55353de668345094.html') {
  fail('Google Search Console verification file is missing or invalid.');
}

const sitemap = read('sitemap.xml');
const sitemapUrls = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]),
);
if (!sitemap.includes('https://bifromq.apache.org/docs/3.3.x/')) {
  fail('The latest historical 3.x documentation must remain in the sitemap.');
}

const developmentUrl = `${canonicalOrigin}/docs/${developmentVersion}/`;
if (sitemap.includes(developmentUrl)) {
  fail('Unreleased development documentation must not be in the sitemap.');
}

const developmentDir = join(buildDir, 'docs', developmentVersion);
const developmentHtmlFiles = findHtmlFiles(developmentDir);
if (developmentHtmlFiles.length === 0) {
  fail('Unreleased development documentation was not built.');
}
for (const htmlFile of developmentHtmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  if (!html.includes('name="robots" content="noindex, nofollow"')) {
    fail(`Development page is missing the Docusaurus noindex directive: ${htmlFile}`);
  }
}

for (const version of archivedVersions) {
  const versionUrl = `https://bifromq.apache.org/docs/${version}/`;
  if (sitemap.includes(versionUrl)) {
    fail(`Archived documentation ${version} must not be in the sitemap.`);
  }

  const versionDir = join(buildDir, 'docs', version);
  const htmlFiles = findHtmlFiles(versionDir);
  if (htmlFiles.length === 0) {
    fail(`Archived documentation ${version} was not built.`);
  }

  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8');
    if (!html.includes('name="robots" content="noindex, nofollow"')) {
      fail(`Archived page is missing the Docusaurus noindex directive: ${htmlFile}`);
    }
    if (!html.includes('which is no longer actively maintained')) {
      fail(`Archived page is missing the unmaintained notice: ${htmlFile}`);
    }
  }
}

const robots = read('robots.txt');
if (!robots.includes('User-agent: *') || !robots.includes('Allow: /')) {
  fail('robots.txt must allow public crawling.');
}
if (!robots.includes('Sitemap: https://bifromq.apache.org/sitemap.xml')) {
  fail('robots.txt must reference the canonical sitemap URL.');
}

const doap = read('doap_BifroMQ.rdf');
for (const requiredValue of [
  '<doap:name>Apache BifroMQ</doap:name>',
  '<asfext:pmc rdf:resource="https://incubator.apache.org/" />',
  '<doap:revision>4.0.0-incubating</doap:revision>',
]) {
  if (!doap.includes(requiredValue)) {
    fail(`The deployed DOAP file is missing: ${requiredValue}`);
  }
}

for (const file of findFiles(buildDir, ['.html', '.css'])) {
  const content = readFileSync(file, 'utf8');
  const unapprovedExternalResources = findExternalResources(
    file,
    content,
  ).filter((resource) => !approvedExternalResources.has(resource));
  if (unapprovedExternalResources.length > 0) {
    fail(
      `External resource request in ${relative(buildDir, file)}: ${unapprovedExternalResources[0]}`,
    );
  }
}

for (const htmlFile of findHtmlFiles(buildDir)) {
  const html = readFileSync(htmlFile, 'utf8');
  if (!html.startsWith('<!doctype html>')) {
    continue;
  }

  for (const requiredPattern of matomoRequirementPatterns) {
    if (!requiredPattern.test(html)) {
      fail(
        `Generated page is missing the approved ASF Matomo configuration: ${htmlFile}`,
      );
    }
  }

  if (html.includes('[https://analytics.apache.org/]')) {
    fail(`Generated page contains a Markdown-wrapped Matomo URL: ${htmlFile}`);
  }
}

const canonicalUrls = new Set();
let indexablePageCount = 0;
let longTitleCount = 0;

for (const htmlFile of findHtmlFiles(buildDir)) {
  const html = readFileSync(htmlFile, 'utf8');
  const path = pagePath(htmlFile);
  if (!html.startsWith('<!doctype html>') || path === '/404') {
    continue;
  }

  const metaTags = getTags(html, 'meta');
  const robotsMeta = metaTags.find((tag) => getAttribute(tag, 'name') === 'robots');
  if (getAttribute(robotsMeta ?? '', 'content').includes('noindex')) {
    continue;
  }

  indexablePageCount += 1;
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  const description = metaTags.find(
    (tag) => getAttribute(tag, 'name') === 'description',
  );
  const canonical = getTags(html, 'link').find(
    (tag) => getAttribute(tag, 'rel') === 'canonical',
  );
  const canonicalUrl = getAttribute(canonical ?? '', 'href');
  const expectedCanonicalUrl = `${canonicalOrigin}${path}`;
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  const openGraphImage = metaTags.find(
    (tag) => getAttribute(tag, 'property') === 'og:image',
  );
  const twitterImage = metaTags.find(
    (tag) => getAttribute(tag, 'name') === 'twitter:image',
  );

  if (!title) {
    fail(`Indexable page is missing a title: ${path}`);
  }
  if (title.length > 70) {
    longTitleCount += 1;
  }
  if (!getAttribute(description ?? '', 'content').trim()) {
    fail(`Indexable page is missing a description: ${path}`);
  }
  if (!isLocalSiteUrl(canonicalUrl) || canonicalUrl !== expectedCanonicalUrl) {
    fail(
      `Indexable page canonical URL does not match its path: ${path} -> ${canonicalUrl}`,
    );
  }
  if (h1Count !== 1) {
    fail(`Indexable page must have exactly one H1 (${h1Count} found): ${path}`);
  }
  if (!isLocalSiteUrl(getAttribute(openGraphImage ?? '', 'content'))) {
    fail(`Indexable page is missing a local Open Graph image: ${path}`);
  }
  if (!isLocalSiteUrl(getAttribute(twitterImage ?? '', 'content'))) {
    fail(`Indexable page is missing a local Twitter image: ${path}`);
  }
  if (canonicalUrls.has(canonicalUrl)) {
    fail(`Duplicate canonical URL: ${canonicalUrl}`);
  }
  canonicalUrls.add(canonicalUrl);

  for (const match of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      fail(`Invalid JSON-LD on ${path}: ${error.message}`);
    }
  }
}

for (const canonicalUrl of canonicalUrls) {
  if (!sitemapUrls.has(canonicalUrl)) {
    fail(`Indexable canonical URL is missing from sitemap.xml: ${canonicalUrl}`);
  }
}
for (const sitemapUrl of sitemapUrls) {
  if (!canonicalUrls.has(sitemapUrl)) {
    fail(`sitemap.xml contains a non-indexable or non-canonical URL: ${sitemapUrl}`);
  }
}

const sharedRequirements = [
  'Apache BifroMQ is an effort undergoing incubation',
  '/img/apache-incubator.svg',
  'https://incubator.apache.org/',
  'https://www.apache.org/',
  'https://www.apache.org/licenses/',
  'https://www.apache.org/security/',
  'https://www.apache.org/foundation/sponsorship.html',
  'https://www.apache.org/foundation/thanks.html',
  'https://www.apache.org/foundation/policies/conduct.html',
  'https://privacy.apache.org/policies/privacy-policy-public.html',
  '/download/',
  '/docs/get_started/intro/',
  'https://github.com/apache/bifromq/issues',
  'mailto:dev@bifromq.apache.org',
];

for (const representativePage of [
  'index.html',
  'docs/get_started/intro/index.html',
  'community/index.html',
]) {
  const html = read(representativePage);
  for (const requiredValue of sharedRequirements) {
    if (!html.includes(requiredValue)) {
      fail(`${representativePage} is missing shared site requirement: ${requiredValue}`);
    }
  }
}

const communityPage = read('community/index.html');
if (
  !communityPage.includes('https://lists.apache.org/list.html?dev@bifromq.apache.org') ||
  !communityPage.includes('Project decisions are made on the public')
) {
  fail('The community page must identify the public dev list and archive as decision channels.');
}

const homepage = read('index.html');
const expectedHomepageTitle =
  'Apache BifroMQ (Incubating) – An Open-Source Apache MQTT Broker';
const homepageTitle =
  homepage.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
const homepageMeta = getTags(homepage, 'meta');
const homepageKeywords = getAttribute(
  homepageMeta.find((tag) => getAttribute(tag, 'name') === 'keywords') ?? '',
  'content',
);
if (homepageTitle !== expectedHomepageTitle) {
  fail(`Homepage title must preserve project status and search intent: ${homepageTitle}`);
}
for (const keyword of ['Apache MQTT broker', 'Apache MQTT', 'Apache BifroMQ']) {
  if (!homepageKeywords.includes(keyword)) {
    fail(`Homepage keywords are missing: ${keyword}`);
  }
}

const mqttPage = read('mqtt/index.html');
const mqttKeywords = getAttribute(
  getTags(mqttPage, 'meta').find((tag) => getAttribute(tag, 'name') === 'keywords') ?? '',
  'content',
);
for (const keyword of ['Apache MQTT', 'Apache MQTT broker', 'MQTT 5.0']) {
  if (!mqttKeywords.includes(keyword)) {
    fail(`MQTT guide keywords are missing: ${keyword}`);
  }
}

const homepageJsonLd = [
  ...homepage.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  ),
].map((match) => JSON.parse(match[1]));
const homepageGraph = homepageJsonLd.flatMap((value) => value['@graph'] ?? [value]);
for (const requiredType of ['WebSite', 'SoftwareApplication']) {
  if (!homepageGraph.some((value) => value['@type'] === requiredType)) {
    fail(`Homepage JSON-LD is missing ${requiredType}.`);
  }
}
const software = homepageGraph.find((value) => value['@type'] === 'SoftwareApplication');
if (software.publisher?.name !== 'The Apache Software Foundation') {
  fail('Homepage software JSON-LD must identify The Apache Software Foundation as publisher.');
}

console.log(
  `Site policy checks passed for ${indexablePageCount} indexable pages ` +
    `(${longTitleCount} titles longer than 70 characters).`,
);
