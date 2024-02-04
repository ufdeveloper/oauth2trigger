// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

function setAlarm(event) {
  const minutes = parseFloat(event.target.value);
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.alarms.create({ delayInMinutes: minutes });
  chrome.storage.sync.set({ minutes: minutes });
  window.close();
}

async function authorize() {
  console.log("authorize");
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    console.log("url = ", tab.url);
  let { hostname } = new URL(tab.url);
    hostname = hostname.replace('-admin', '');
    const baseUrl = "http://" +  hostname
  const clientId = document.getElementById('clientId').value;
    const redirectUri = document.getElementById('redirectUri').value;
  const scope = 'openid profile'
    const response_type= 'code';
    const response_mode= 'fragment';
    const state= 'state';
    const nonce='qz7wonzk0w8';
    const challenge = document.getElementById("pkceChallenge").value;

  let authorizeUrl = baseUrl + '/oauth2/default/v1/authorize?client_id=' + clientId +
      "&redirect_uri=" + redirectUri +
      "&scope=" + scope +
      "&response_type=" + response_type +
      "&response_mode=" + response_mode +
      "&state=" + state +
        "&code_challenge_method=S256" +
        "&code_challenge=" + challenge;
      // "&nonce=" + nonce;
  chrome.tabs.create({ url: authorizeUrl });
  //   chrome.windows.create({ url: authorizeUrl, incognito: true });
}

async function token() {
//     curl --location 'https://dev-565937.okta.com/oauth2/v1/token' \
// --header 'Accept: application/json' \
// --header 'Authorization: Basic e3tjbGllbnRJZH19Ont7Y2xpZW50U2VjcmV0fX0=' \
// --header 'Content-Type: application/x-www-form-urlencoded' \
// --header 'Cookie: DT=DI0ahJS-MkNSVuF-W_PCND0Vg' \
// --data-urlencode 'grant_type=authorization_code' \
// --data-urlencode 'redirect_uri={{redirectUri}}' \
// --data-urlencode 'code={{authorizationCode}}'

    // construct form data
    var formBody = [];
    formBody.push('client_id=' + document.getElementById('clientId').value);
    formBody.push('grant_type=authorization_code');
    formBody.push('redirect_uri=' + document.getElementById('redirectUri').value);
    formBody.push('code=-nJSJg9zH3ljdztQnu-i-Bk2TXCXaW5s27MaoIhTEuk');
    formBody.push('code_verifier=' + document.getElementById('pkceVerifier').value);
    formBody = formBody.join("&");

    // construct auth header
    // const authHeader = btoa(clientId + ':' + clientSecret);

    let tokenUrl = 'https://shantanu-ok11.okta.com/oauth2/default/v1/token';
    const response = await fetch(tokenUrl, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
            // "Authorization": "Basic " + authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formBody, // body data type must match "Content-Type" header
    });
    console.log("token response = ", response.json());
}

function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2)
}

function generateRandomString() {
    var array = new Uint32Array(56/2);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join('');
}


function sha256(plain) { // returns promise ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a) {
    var str = "";
    var bytes = new Uint8Array(a);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

async function challenge_from_verifier(v) {
    let hashed = await sha256(v);
    let base64encoded = base64urlencode(hashed);
    return base64encoded;
}

document.getElementById('authorize').addEventListener('click', authorize);

document.getElementById('token').addEventListener('click', token);

// (async () => {
//     let response = await chrome.runtime.sendMessage({});
//     console.log("response =", response);
// })();

(async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {});
    console.log("response = ", response);
    if (response.clientId) {
        document.getElementById('clientId').value = response.clientId;
    }
    if (response.redirectUri) {
        document.getElementById('redirectUri').value = response.redirectUri;
    }
    if (response.clientSecret) {
        document.getElementById('clientSecret').value = response.clientSecret;
    }
    var verifier = generateRandomString();
    var challenge = await challenge_from_verifier(verifier);
    document.getElementById('pkceChallenge').value = challenge;
    document.getElementById('pkceVerifier').value = verifier;
    console.log("url = ", tab.url);
    const { hostname } = new URL(tab.url); // TODO - extract domain from url
    console.log("hostname = ", hostname);
})();