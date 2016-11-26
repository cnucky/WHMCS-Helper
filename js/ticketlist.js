/*jslint browser: true*/
/*global $, jQuery, alert*/
/*jslint regexp: true*/
function GetColumnText(column) {
    "use strict";
    var ele = column.firstChild;
    var text = ele.text;
    if (ele.childNodes.length === 0) text = ele.textContent;
    if (typeof text === "undefined") text = ele.innerText;
    return text;
}

function getColorBetween(start, end, percent) {
    start = start.slice(1, 7);
    end = end.slice(1, 7);
    var r1 = hex2dec(start.slice(0, 2));
    var g1 = hex2dec(start.slice(2, 4));
    var b1 = hex2dec(start.slice(4, 6));
    var r2 = hex2dec(end.slice(0, 2));
    var g2 = hex2dec(end.slice(2, 4));
    var b2 = hex2dec(end.slice(4, 6));
    r = Math.floor(r1 + (percent * (r2 - r1)) + .5);
    g = Math.floor(g1 + (percent * (g2 - g1)) + .5);
    b = Math.floor(b1 + (percent * (b2 - b1)) + .5);
    return ("#" + dec2hex(r) + dec2hex(g) + dec2hex(b));
}
var hexDigit = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");

function dec2hex(dec) {
    return (hexDigit[dec >> 4] + hexDigit[dec & 15]);
}

function hex2dec(hex) {
    return (parseInt(hex, 16))
}
var activeTechs = new Array();
var ignoreTechs = new Array("Caroline Helvey", "Peter Holden", "Michael Brower", "Guy Hopkins", "Christopher Murdock");
var specialTickets = new Array("Dedicated Server Setup", "Dedicated Server Tracker", "Dedi Setup", "Dedi Tracker", "AutoReply:", "[SpamCop] Alert");
var ticketStatuses = {
    "Customer-Reply": "customerReply1",
    "Customer-Reply": "customerReply2",
    "Management": "management",
    "On Hold": "onHold",
    "In Progress": "inProgress",
    "Open": "open"
};

function ColorBoard(colors) {
    var table = document.getElementById("sortabletbl2");
    if (table != null) {
        //Get the old tickets to compare later for displaying notifications
        var newTickets = new Object();
        var techsIn = colors['techsIn'];
        activeTechs = new Array();
        for (var tech in techsIn) {
            if (techsIn[tech]) activeTechs.push(tech);
        }
        if (typeof colors.colors !== "undefined") colors = colors.colors;
        var inactiveTechColor = colors.inactive;
        var openTicketColor = colors.unassigned;
        var assignedTicketColor = colors.assigned;
        var ignoreTicket = colors.ignoreTicket;
        var noMessage = colors.noMessage;
        var customerReply1 = colors.customerReply1;
        var customerReply2 = colors.customerReply2;
        var ticketSortInfo = [];
        for (var i = 1, row; row = table.rows[i]; i++) {
            var status = $(row.cells[5]).text();
            var col = row.cells[2];
            if (col != null && col.firstChild != null) {
                var text = GetColumnText(col);
                var firstResponseText = $(row.cells[3]).find("a").attr("title");
                var match = text.match(/([a-zA-Z ]+) \(([a-zA-Z ]+)\)/),
                    tech = "",
                    dept = "";
                if (match != null) {
                    dept = match[1];
                    tech = match[2];
                    if ($.inArray(tech, activeTechs) == -1 && $.inArray(tech, ignoreTechs) == -1) col.setAttribute('style', 'background:' + inactiveTechColor);
                    else {
                        if ($.inArray(status, ticketStatuses)) {
                            if (status == "Customer-Reply") {
                                var timeMatch = $(row.cells[6]).text().match(/([0-9]+)h ([0-9]+)m/);
                                var m = timeMatch[2];
                                col.setAttribute('style', 'background:' + getColorBetween(customerReply1, customerReply2, m <= 30 ? m / 30 : 1));
                            } else {
                                col.setAttribute('style', 'background:' + colors[ticketStatuses[status]]);
                            }
                        } else col.setAttribute('style', 'background:' + assignedTicketColor);
                    }
                } else {
                    if ($(row.cells[3]).find('a').attr('title').indexOf("No message found.") > -1 || $(row.cells[3]).find('a').attr('title') == "") col.setAttribute('style', 'background:' + noMessage);
                    else {
                        col.setAttribute('style', 'background:' + openTicketColor);
                        var ignore = false;
                        var subject = $(row.cells[3]).text().replace(/\s\s/g, ' ');
                        for (var q = 0; q < specialTickets.length; q++) {
                            if (subject.indexOf(specialTickets[q]) > -1) {
                                col.setAttribute('style', 'background:' + ignoreTicket);
                                ignore = true;
                                break;
                            }
                        }
                    }
                }
                ticketSortInfo.push([tech, status, $(row).html(), $(row.cells[6]).text()]);
            }
        }
        ticketSortInfo.sort(function(a, b) {
            aa = a[0] + a[1];
            bb = b[0] + b[1];
            if (a[1] == "Customer-Reply") aa = "#" + aa;
            if (b[1] == "Customer-Reply") bb = "#" + bb;
            if (a[1] == "Open") aa = "!" + aa;
            if (b[1] == "Open") bb = "!" + bb;
            if (a[0] == "") aa = " " + aa;
            if (b[0] == "") bb = " " + bb;
            aa += a[2];
            bb += b[2];
            return aa < bb ? -1 : (aa > bb ? 1 : 0);
        });
        var rows = '<tr><th width="20"><input type="checkbox" id="checkall2"></th><th width="20"></th><th><a href="/3610hw8138/supporttickets.php?orderby=deptname">Department</a></th><th><a href="/3610hw8138/supporttickets.php?orderby=title">Subject</a></th><th>Submitter</th><th><a href="/3610hw8138/supporttickets.php?orderby=status">Status</a></th><th><a href="/3610hw8138/supporttickets.php?orderby=lastreply">Last Reply</a> <img src="images/desc.gif" class="absmiddle" /></th></tr>';
        for (var i = 0; i < ticketSortInfo.length; i++) rows += "<tr>" + ticketSortInfo[i][2] + "<tr>";
        $(table).html(rows);
    }
}
var getTicketWeights = false;

function ListTechs() {
    var totalTechCount = 0;
    var mytable = document.getElementById("sortabletbl1");
    if (mytable != null) totalTechCount += Math.floor(mytable.rows.length / 2);
    var table = document.getElementById("sortabletbl2");
    if (table != null) {
        totalTechCount += Math.floor(table.rows.length / 2);
        //Get the old tickets to compare later for displaying notifications
        var newTickets = new Object();
        var techsWithTickets = [];
        //Get all required ticket data from the board
        var assignedCount = {};
        for (var i = 1, row; row = table.rows[i]; i += 2) {
            var _dept = $(row.cells[2]).text(),
                _status = $(row.cells[5]).text(),
                _priority = row.cells[1],
                _clientGroup = $(row.cells[4]).html(),
                _lastResponse = $(row.cells[6]).text();
            if (_priority != null) _priority = _priority.getElementsByTagName("img")[0].alt;
            var clientGroupColorMap = {};
            clientGroupColorMap["24bd1c"] = "First 30 Days";
            clientGroupColorMap["00bff3"] = "VIP";
            clientGroupColorMap["ff0000"] = "Super VIP";
            if (_clientGroup != null && _clientGroup.trim() != "") {
                var clientGroupMatch = _clientGroup.match(/<a href="clientssummary\.php\?userid=\d+" style="background-color:#([a-zA-Z0-9]{6})">/);
                _clientGroup = clientGroupMatch == null ? "" : clientGroupColorMap[clientGroupMatch[1].toLowerCase()];
                if (_clientGroup === undefined) _clientGroup = "";
            }
            if (_clientGroup.trim() == "") _clientGroup = "None";
            var lastResponseMatch = _lastResponse.match(/(\d{1,2})h (\d{1,2})m/);
            _lastResponse = lastResponseMatch == null ? "" : (lastResponseMatch[1] > 0 ? "60" : lastResponseMatch[2]);
            //console.log(row.cells.length + "Department: " + _dept + "\nStatus: " + _status + "\nPriority: " + _priority + "\nClient Group: " + _clientGroup + "\nLast Response: " + _lastResponse);
            var col = row.cells[2];
            if (col != null && col.firstChild != null) {
                var text = GetColumnText(col);
                var match = text.match(/([a-zA-Z ]+) \(([a-zA-Z ]+)\)/),
                    tech, dept;
                if (match != null) {
                    dept = match[1];
                    tech = match[2];
                    techsWithTickets.push(tech);
                    if ($.inArray(tech, activeTechs) > -1 && status == "Customer-Reply") {
                        var timeMatch = $(row.cells[6]).text().match(/([0-9]+)h ([0-9]+)m/);
                        var h = timeMatch[1],
                            m = timeMatch[2];
                        $(row.cells[2]).text(text + " " + (m <= 30 && h == 0 ? m + "m" : ">30m"));
                    }
                } else tech = "Unassigned";
                if (assignedCount[tech] === undefined) assignedCount[tech] = {
                    'count': 0,
                    'l': 0,
                    'm': 0,
                    'h': 0,
                    'w': 0
                };
                if (assignedCount[tech]['count'] === undefined) assignedCount[tech]['count'] = 1;
                else assignedCount[tech]['count'] += 1;
            }
            col = row.cells[3];
            if (col != null && status != "Answered" && status != "Closed") {
                var a = $(col).find('a');
                var id = a.attr('href').match(/supporttickets\.php\?action\=view\&id\=([0-9]+)/)[1];
                newTickets[id] = new Object();
                newTickets[id]['dept'] = text;
                newTickets[id]['client'] = $(row.cells[4]).text();
                newTickets[id]['status'] = $(row.cells[5]).text();
                newTickets[id]['title'] = a.text();
            }
            col = row.cells[1];
            if (col != null && col.firstChild != null) {
                var ele = col.getElementsByTagName("img")[0],
                    text;
                if (ele != null) text = ele.alt;
                else text = "Medium";
                if (text == "Low") assignedCount[tech]['l'] += 1;
                else if (text == "Medium") assignedCount[tech]['m'] += 1;
                else if (text == "High") assignedCount[tech]['h'] += 1;
            }
            if (i < table.rows.length) {
                if (getTicketWeights) {
                    console.log("getTicketWeight 1");
                    chrome.runtime.sendMessage({
                        method: "getTicketWeight",
                        tech: tech,
                        dept: _dept,
                        status: _status,
                        priority: _priority,
                        clientGroup: _clientGroup,
                        lastResponse: _lastResponse,
                        assignedCount: assignedCount
                    }, function(response) {
                        var assignedCount = response.assignedCount;
                        console.log("1: " + JSON.stringify(assignedCount));
                        AddTicketStats(activeTechs, ignoreTechs, techsWithTickets, assignedCount);
                    });
                } else {
                    AddTicketStats(activeTechs, ignoreTechs, techsWithTickets, assignedCount);
                }
            } else {
                if (getTicketWeights) {
                    console.log("getTicketWeight 2");
                    chrome.runtime.sendMessage({
                        method: "getTicketWeight",
                        tech: tech,
                        dept: _dept,
                        status: _status,
                        priority: _priority,
                        clientGroup: _clientGroup,
                        lastResponse: _lastResponse,
                        assignedCount: assignedCount
                    }, function(response) {
                        var assignedCount = response.assignedCount;
                        console.log("2: " + JSON.stringify(assignedCount));
                        AddTicketStats(activeTechs, ignoreTechs, techsWithTickets, assignedCount);
                    });
                } else {
                    AddTicketStats(activeTechs, ignoreTechs, techsWithTickets, assignedCount);
                }
            }
        }
        //if (window.location.href == "http://clients.hostwinds.com/3610hw8138/supporttickets.php?view=active")
        {
            //Compare old and new tickets, and send display notifications messages to background.js
            chrome.storage.local.get("tickets", function(tickets) {
                if (tickets != null) {
                    tickets = tickets['tickets'];
                    for (var id in newTickets) {
                        var found = false;
                        for (var id2 in tickets) {
                            if (id == id2) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            var message = newTickets[id]['dept'] + "\nClient: " + newTickets[id]['client'] + "\nStatus: " + newTickets[id]['status'];
                            console.log("New ticket: " + message);
                            chrome.runtime.sendMessage({
                                method: "newTicket",
                                id: id,
                                title: newTickets[id]['title'],
                                message: message
                            });
                        }
                    }
                }
                var storage = new Object();
                storage['tickets'] = newTickets;
                chrome.storage.local.set(storage);
            });
        }
    }
    $("#sidebar").html($("#sidebar").html().replace("All Active Tickets (0)", "All Active Tickets (" + totalTechCount + ")"));
}

function AddTicketStats(activeTechs, ignoreTechs, techsWithTickets, assignedCount) {
    var message = "",
        message2 = "";
    var unassignedCount = null;
    for (var tech in activeTechs) {
        tech = activeTechs[tech];
        if ($.inArray(tech, techsWithTickets) == -1 && $.inArray(tech, ignoreTechs) == -1) message += "<tr><td>" + tech + "</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>";
    }
    var arr = [],
        arr2 = [],
        activeTicketCount = 0,
        otherTicketCount = 0;
    for (var tech in assignedCount) arr.push([tech, assignedCount[tech]['count'], assignedCount[tech]['l'], assignedCount[tech]['m'], assignedCount[tech]['h'], assignedCount[tech]['w'].toFixed(2)]);
    //Sort counts by lowest->highest and parse priorities
    arr.sort(function(a, b) {
        return (a[1] % 1000) - (b[1] % 1000);
    });
    for (var tech in arr) {
        var count = arr[tech][1];
        if (arr[tech][0] != "Unassigned") {
            var L = arr[tech][2],
                M = arr[tech][3],
                H = arr[tech][4],
                W = arr[tech][5];
            if ($.inArray(arr[tech][0], ignoreTechs) == -1) {
                message += "<tr><td>" + arr[tech][0] + "</td><td>" + count + "</td><td>" + L + "</td><td>" + M + "</td><td>" + H + "</td><td>" + W + "</td></tr>";
                activeTicketCount += count;
            } else {
                message2 += "<tr><td>" + arr[tech][0] + "</td><td>" + count + "</td><td>" + L + "</td><td>" + M + "</td><td>" + H + "</td><td>" + W + "</td></tr>";
                otherTicketCount += count;
            }
        } else unassignedCount = arr[tech];
    }
    if (unassignedCount != null) {
        var L = unassignedCount[2],
            M = unassignedCount[3],
            H = unassignedCount[4],
            W = unassignedCount[5];
        message += "<tr><td><hr></td><td><hr></td><td><hr></td><td><hr></td><td><hr></td></tr><tr><td>Unassigned</td><td>" + unassignedCount[1] + "</td><td>" + L + "</td><td>" + M + "</td><td>" + H + "</td><td>" + W + "</td></tr>";
    }
    //Display counts in-page
    var tabs = $("#tabs"),
        tabHTML = "<div style=\"width:480px;\"><div style=\"width:240px; float:left\"><h3>Active Techs (" + activeTicketCount + " Tickets)</h3><table id=\"output\"><tr><td>Name</td><td>Count</td><td>L</td><td>M</td><td>H</td><td>W</td></tr>" + message + "\n</table>\n</div>";
    if (message2 != "") tabHTML += "<div style=\"width:240px; float:right\"><h3>Other Techs (" + otherTicketCount + " Tickets)</h3><table id=\"output\">\n<tr><td>Name</td><td>Count</td><td>L</td><td>M</td><td>H</td><td>W</td></tr>" + message2 + "\n</table>\n</div>";
    tabs.html(tabs.html() + tabHTML + "</div>");
}

function AddOpenAllButton() {
    var h1 = $("#content").find("h1");
    h1.html("<a id=\"Refresh\" style=\"color:#2E6194;cursor:pointer\">Support Tickets</a>");
    $("#Refresh").click(function() {
        window.location = "supporttickets.php?view=active";
    });
    $("#OpenAllTickets").click(function() {
        var table = document.getElementById("sortabletbl1");
        if (table != null) {
            for (var i = 1, row; row = table.rows[i]; i++) {
                if ($(row).text() != "") window.open($(row.cells[3]).find('a').attr('href'));
            }
        }
        table = document.getElementById("sortabletbl2");
        if (table != null) {
            for (var i = 1, row; row = table.rows[i]; i++) {
                if ($(row).text() != "") window.open($(row.cells[3]).find('a').attr('href'));
            }
        }
    });
}
AddOpenAllButton();
var table = document.getElementById("sortabletbl2");
if (table != null) {
    chrome.runtime.sendMessage({
        method: "getColors"
    }, function(response) {});
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.method == "updateColors") {
            ColorBoard(request.colors);
            ListTechs();
        } else if (request.method == "getTicketWeight") {}
    });
}