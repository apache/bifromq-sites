import type {ClientModule} from '@docusaurus/types';

type MatomoCommand = [string, ...unknown[]];

declare global {
  interface Window {
    _paq?: MatomoCommand[];
  }
}

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (
      previousLocation &&
      (location.pathname !== previousLocation.pathname ||
        location.search !== previousLocation.search ||
        location.hash !== previousLocation.hash)
    ) {
      const previousUrl = new URL(
        previousLocation.pathname +
          previousLocation.search +
          previousLocation.hash,
        window.location.origin,
      ).href;

      // Docusaurus updates the document title on the next tick.
      setTimeout(() => {
        window._paq?.push(['setReferrerUrl', previousUrl]);
        window._paq?.push(['setCustomUrl', window.location.href]);
        window._paq?.push(['setDocumentTitle', document.title]);
        window._paq?.push(['trackPageView']);
      });
    }
  },
};

export default clientModule;
