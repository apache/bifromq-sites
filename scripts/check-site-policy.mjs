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
import {join} from 'node:path';

const buildDir = new URL('../build/', import.meta.url).pathname;
const archivedVersions = ['3.2.x', '3.1.x', '3.0.x', '2.1.x', '2.0.0', '1.0.x'];

function fail(message) {
  throw new Error(message);
}

function read(relativePath) {
  return readFileSync(join(buildDir, relativePath), 'utf8');
}

function findHtmlFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? findHtmlFiles(path)
      : path.endsWith('.html')
        ? [path]
        : [];
  });
}

const verification = read('google55353de668345094.html').trim();
if (verification !== 'google-site-verification: google55353de668345094.html') {
  fail('Google Search Console verification file is missing or invalid.');
}

const sitemap = read('sitemap.xml');
if (!sitemap.includes('https://bifromq.apache.org/docs/3.3.x/')) {
  fail('The latest historical 3.x documentation must remain in the sitemap.');
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

console.log('Site policy checks passed.');
