import type {LoadContext, Plugin} from '@docusaurus/types';

type Options = {
  trackerUrl: string;
  siteId: string;
};

export default function matomoPlugin(
  _context: LoadContext,
  options: Options,
): Plugin | null {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const trackerUrl = new URL(options.trackerUrl);
  if (
    trackerUrl.origin !== 'https://analytics.apache.org' ||
    trackerUrl.pathname !== '/' ||
    trackerUrl.search ||
    trackerUrl.hash
  ) {
    throw new Error('Matomo must use the ASF-hosted analytics endpoint.');
  }
  if (!/^\d+$/.test(options.siteId)) {
    throw new Error('Matomo siteId must be numeric.');
  }

  return {
    name: 'bifromq-matomo',

    getClientModules() {
      return ['./client'];
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
window._paq = window._paq || [];
window._paq.push(['setDoNotTrack', true]);
window._paq.push(['disableCookies']);
window._paq.push(['trackPageView']);
window._paq.push(['enableLinkTracking']);
window._paq.push(['setTrackerUrl', '${trackerUrl.href}matomo.php']);
window._paq.push(['setSiteId', '${options.siteId}']);`.trim(),
          },
          {
            tagName: 'script',
            attributes: {
              async: true,
              src: `${trackerUrl.href}matomo.js`,
            },
          },
        ],
      };
    },
  };
}
