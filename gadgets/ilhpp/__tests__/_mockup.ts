/// <reference types="requirejs" />
import '../../../server/mockup_mw';
import * as MobileStartup from '../../../server/mockup_mobile_startup';

// Mockup mw.loader.using by redirecting to requirejs
Object.defineProperty(window.mw, 'loader', {
  value: {
    using(outerName: string) {
      return new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require([outerName], () => {
          resolve(window.require);
        });
      });
    },
  },
});

define('mobile.startup', () => {
  return MobileStartup;
});
