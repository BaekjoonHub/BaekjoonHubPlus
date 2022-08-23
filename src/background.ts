import { CONSTANT } from './constants/common';
import { Storage } from './repository/storage/Storage';
import 'reflect-metadata';

chrome.runtime.onInstalled.addListener((details) => {
  //   const currentVersion = chrome.runtime.getManifest().version;
  //   const previousVersion = details.previousVersion;
  const reason = details.reason;
  switch (reason) {
    case 'install':
      // console.log('New User installed the extension.');
      chrome.tabs.create({ url: CONSTANT.GITHUB_AUTH_APP.AUTH_URL });
      break;
    // case 'update':
    //   console.log('User has updated their extension.');
    //   break;
    // case 'chrome_update':
    // case 'shared_module_update':
    // default:
    //   console.log('Other install events within the browser');
    //   break;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'closeCurrentTabAndOpenSettings':
      if (sender.tab?.id) {
        chrome.tabs.remove(sender.tab.id);
      }
    case 'openSettings':
      chrome.tabs.create({ url: CONSTANT.EXTENSION_SETTINGS_URL });
      break;
    default:
      throw new Error('Invalid message type');
  }
});
