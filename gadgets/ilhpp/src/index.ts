import messages from '../messages.json';

import '../styles/base.less';
import '../styles/links.less';
import '../styles/popups_desktop.less';
import '../styles/popups_mobile.less';

import {
  getPreferences,
  LinkMode,
  OrigLinkColor,
  PopupMode,
  Preferences,
  setPreferences,
} from './prefs';
import { haveConflicts, isMobileDevice } from './utils';
import runDesktop from './index_desktop';
import runMobile from './index_mobile';

// Initialize
mw.messages.set(messages);
const _ = getPreferences();

// Deactivate if MF Visual editor is active, activate otherwise
if (mw.config.get('wgMFMode')) {
  void import('mobile.startup').then(({ getOverlayManager }) => {
    getOverlayManager(); // Forcibly make .mw-overlays-container to be available

    const overlayContainer = document.getElementsByClassName('mw-overlays-container')[0];
    if (!overlayContainer) {
      return;
    }

    const observer = new MutationObserver(() => {
      const veOverlay = overlayContainer.querySelector('.editor-overlay.editor-overlay-ve');
      document.documentElement.classList.toggle(
        'ilhpp-inactive',
        !!veOverlay && window.getComputedStyle(veOverlay).display !== 'none',
      );
    });
    observer.observe(overlayContainer, {
      childList: true,
      attributes: true,
      attributeFilter: ['style'],
    });
  });
}

if (isMobileDevice()) {
  runMobile();
} else {
  runDesktop();
}

export {
  type Preferences,
  LinkMode,
  OrigLinkColor,
  PopupMode,
  getPreferences,
  setPreferences,
  haveConflicts,
};
