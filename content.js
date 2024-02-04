// 'use strict';

// console.log("starting content script");
// // Check for presence of client id on page
// let clientIdEl = document.getElementsByName("client_id");
// let clientId = '';
// console.log("clientId element = ", clientIdEl);
// if (clientIdEl) {
//     console.log("found client id on page");
//     clientId = clientIdEl[0].value;
// } else {
//     console.log("did not find client id on page");
// }
//
// // Send message to extension about presence of client id
// chrome.runtime.sendMessage({clientId: clientId});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from content script:" + sender.tab.url :
            "from the extension");
        if (!sender.tab) {
            console.log("received message from popup");
            // Check for presence of client id on page
            const clientId = document.getElementsByName("client_id")[0].value;
            const redirectUri = document.getElementsByClassName('o-form-input-name-uri o-form-control no-translate')[0].innerHTML;
            const clientSecret = document.getElementsByClassName('disabled-input password-with-toggle')[0].value;
            sendResponse({
                clientId: clientId,
                redirectUri: redirectUri,
                clientSecret: clientSecret
            });
        }
    }
);
