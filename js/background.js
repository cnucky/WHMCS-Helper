/*jslint browser: true, nomen: true,regexp: true*/
/*global $, jQuery, alert, chrome, console*/
chrome.runtime.onInstalled.addListener(function () {
    "use strict";
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        urlContains: '//'
                    }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
var lastTabID = 0;
var sendNotifications = true,
    canNotify = [];
function getTicketWeight(tech, _dept, _status, _priority, _clientGroup, _lastResponse, assignedCount) {
    "use strict";
    var weight = 1;
    $.ajax({
        url: 'http://dska.hostwinds.com/Triage/ticketweight/?',
        async: false,
        dataType: 'json',
        method: 'GET',
        data: {
            'pass': '9Tx43Px5xIXK15W',
            'action': 'getweight',
            'dept': _dept,
            'status': _status,
            'priority': _priority,
            'clientGroup': _clientGroup,
            'lastResponse': _lastResponse
        },
        success: function (data) {
            weight = data.Weight;
        },
        error: function (xhr, status, error) {
            weight = "Failure (" + xhr.responseText + "): " + error;
        }
    });
    assignedCount.tech.w += weight;
    return assignedCount;
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    "use strict";
    if (request.method === "newTicket") {
        if (sendNotifications) {
            var options = [];
            options.type = "basic";
            options.title = request.title;
            options.message = request.message;
            options.iconUrl = "icon48.png";
            chrome.notifications.create(request.id, options, function (id) {
                console.error("Error while creating notification");
            });
            sendResponse({
                status: "Request received."
            });
        }
    } else if (request.method === "getColors") {
        chrome.storage.local.get("colors", function (colors) {
            var techsIn = $.get(chrome.extension.getURL("staff.txt"), function (stafftxt) {
                var staff = stafftxt.replace(/\r\n/g, "\n").split("\n"),
                    i = 0,
                    techs = {};
                for (i = 0; i < staff.length; i += 1) {
                    techs[staff[i]] = false;
                    console.log(techs[staff[i]]);
                }
                savecolors();
            });

            if (colors === null || !(colors.hasOwnProperty('colors'))) {
                colors = JSON.parse('{"open":"#99DD99", "unassigned":"#FF9999", "inactive":"#FFAA99", "ignoreTicket":"#0099FF", "noMessage":"#9966FF", "customerReply1":"#B4DD99", "customerReply2":"#FFDD99", "management":"#99DD99", "onHold":"#99DD99", "inProgress":"#99DD99"}');
            } else {
                if (colors.hasOwnProperty('techsIn')) { techsIn = colors.techsIn; }
                colors = colors.colors;
            }
            chrome.tabs.query({
                url: "https://clients.hostwinds.com/3610hw8138/supporttickets.php?view=active"
            }, function (tabs) {
                if (tabs.length > 0) { lastTabID = tabs[0].id; }
                chrome.tabs.sendMessage(lastTabID, {
                    "method": "updateColors",
                    "colors": colors,
                    "techsIn": techsIn
                }, function (response) {});
            });
        });
    } else if (request.method === "canNotify") {
        sendNotifications = request.value;
        canNotify.canNotify = sendNotifications;
        chrome.storage.local.set(canNotify);
        console.log("Can Notify: " + canNotify);
    } else if (request.method === "getTicketWeight") {
        chrome.tabs.query({
            url: "https://clients.hostwinds.com/3610hw8138/supporttickets.php?view=active"
        }, function (tabs) {
            var weight = getTicketWeight(request.tech, request.dept, request.status, request.priority, request.clientGroup, request.lastResponse, request.assignedCount, request.activeTechs, request.techsWithTickets, request.ignoreTechs, request.table),
                count = [];
            count.assignedCount = weight;
            console.log(JSON.stringify(count));
            console.log("TEST");
            sendResponse(count);
        });
    }
});
chrome.storage.local.get("canNotify", function (canNotify) {
    "use strict";
    if (canNotify !== null) { sendNotifications = (canNotify === "true"); }
});
chrome.notifications.onClicked.addListener(function (id) {
    "use strict";
    window.open("https://clients.hostwinds.com/3610hw8138/supporttickets.php?action=view&id=" + id);
});

