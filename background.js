// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// 'use strict';

chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'stay_hydrated.png',
    title: 'Time to Hydrate',
    message: "Everyday I'm Guzzlin'!",
    buttons: [{ title: 'Keep it Flowing.' }],
    priority: 0
  });
});

chrome.notifications.onButtonClicked.addListener(async () => {
  const item = await chrome.storage.sync.get(['minutes']);
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.alarms.create({ delayInMinutes: item.minutes });
});

let clientId = '';
//
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       console.log("received message from content script", request);
//       if (request.clientId) {
//         console.log("clientid present");
//         // save client id
//         clientId = request.clientId;
//       } else {
//         console.log("clientid absent");
//       }
//     }
// );
//
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from content script:" + sender.tab.url :
//             "from the extension");
//         if (!sender.tab) {
//             console.log("received message from popup");
//             chrome.runtime.sendMessage({clientId: clientId});
//         }
//     }
// );
