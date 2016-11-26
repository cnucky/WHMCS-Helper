/*jslint browser: true,regexp: true*/
/*global $, chrome, console, alert*/
var statusChartData = {
    labels: [
        "Total", "In Progress", "On Hold", "Customer-Reply", "Other"
    ],
    datasets: [{
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
            "#fff", "#c00", "#248", "#f60", "#0f3"
        ],
        borderColor: [
            "#383C45", "#383C45", "#383C45", "#383C45", "#383C45"
        ],
        borderWidth: [
            8, 8, 8, 8, 8
        ]
    }]
};
var statusChart = new Chart(document.getElementById("chart-status").getContext("2d"), {
    type: 'doughnut',
    data: statusChartData,
    options: {
        legend: {
            position: 'right'
        }
    }
});

function updateticketcounts() {
    "use strict";
    $.get("https://clients.hostwinds.com/TS/funcs.php?func=ticketcount", function (data) {
        var ticketMap = JSON.parse(data),
            dataset = statusChartData.datasets[0],
            total = 0;
        dataset.data = [0, 0, 0, 0, 0];
        
        $.each(ticketMap, function (status, count) {
            total += count;
            if (status === "Total") { dataset.data[0] = count; } else if (status === "In Progress") { dataset.data[1] = count; } else if (status === "On Hold") { dataset.data[2] = count; } else if (status === "Customer-Reply") { dataset.data[3] = count; } else { dataset.data[4] = count; }
        });
        statusChart.update();
    });
    setTimeout(function () {
        updateticketcounts();
    }, 3600000);
}
var techsOnline = {};

function updateonlinetechs() {
    "use strict";
    $.get("https://clients.hostwinds.com/TS/funcs.php?func=techsonline", function (data) {
        var techMap = JSON.parse(data),
            delay = 100;
        $.each(techsOnline, function (id, tech) {
            if ((tech.status === "chat" && !techMap.chat.hasOwnProperty(id)) || (tech.status === "away" && !techMap.away.hasOwnProperty(id)) || (tech.status === "xa" && !techMap.xa.hasOwnProperty(id)) || (tech.status === "dnd" && !techMap.dnd.hasOwnProperty(id))) {
                delete techsOnline[id];
                setTimeout(function () {
                    $("#tech" + id + "." + tech.status).removeClass("vis");
                }, delay);
                setTimeout(function () {
                    $("#tech" + id + "." + tech.status).remove();
                }, delay + 100);
                delay += 400;
            }
        });
        $.each(techMap.chat, function (id, tech) {
            if (!techsOnline.hasOwnProperty(id)) {
                $("#techschat").prepend("<div id=\"tech" + id + "\" class=\"block-value tech " + tech.status + "\">" + tech.name + "</div>");
                setTimeout(function () {
                    $("#tech" + id).addClass("vis");
                }, delay);
                delay += 400;
            }
            techsOnline[id] = tech;
        });
    });
    setTimeout(function () {
        updateonlinetechs();
    }, 60000); //Update staff roster every minute because that's how often the db updates
}

function updateSLAViolations() {
    "use strict";
    $.get("https://clients.hostwinds.com/TS/funcs.php?func=slaviolations", function (data) {
        var violations = JSON.parse(data);
        $("#daysla").text(violations.day);
        $("#hoursla").text(violations.hour);
    });
    setTimeout(function () {
        updateSLAViolations();
    }, 600000); //Update SLA violations every ten minutes
}
var leaderboardOffset = 0;
var leaderboardLength = 15;
var leaderboardTotal = 99;
var leaderboardScrollDelay = 10000;
var i = 0;
for (i = 0; i < leaderboardTotal; i += 1) {
    $("#leaderboard").append("<tr id=\"top" + (i + 1) + "\" class=\"hidden\"><td>" + (i + 1) + ".</td><td></td><td></td><td></td></tr>");
    var ele = $("#top" + (i + 1));
    if (i >= leaderboardOffset && i < leaderboardOffset + leaderboardLength) { ele.removeClass("hidden"); }
}

function updateLeaderboard() {
    "use strict";
    var i = 0,
        ele = 0;
    for (i = 0; i < leaderboardTotal; i += 1) {
        ele = $("#top" + (i + 1));
        if (i >= leaderboardOffset && i < leaderboardOffset + leaderboardLength) { ele.removeClass("hidden"); } else { ele.addClass("hidden"); }
    }
    $.get("https://clients.hostwinds.com/TS/funcs.php?func=leaderboard", function (data) {
        var topten = JSON.parse(data);
        leaderboardTotal = Object.keys(topten).length;
        $.each(topten, function (id, tech) {
            var ele = $("#top" + tech.sort),
                eleName = $("#top" + tech.sort + " td:nth-child(2)"),
                eleTickets = $("#top" + tech.sort + " td:nth-child(3)"),
                eleReplies = $("#top" + tech.sort + " td:nth-child(4)");
            if (eleName.text() !== tech.name || eleTickets.text() !== tech.tickets || eleReplies.text() !== tech.replies) {
                ele.removeClass("vis");
                setTimeout(function () {
                    eleName.text(tech.name);
                    eleTickets.text(tech.tickets);
                    eleReplies.text(tech.replies);
                    ele.addClass("vis");
                }, 400);
            }
        });
    });
    setTimeout(function () {
        updateLeaderboard();
    }, 3600000); //Update the leaderboard every hour
}
var scrollDir = 1;

function scrollLeaderboard() {
    "use strict";
    leaderboardOffset += scrollDir;
    if (leaderboardOffset < 0 || leaderboardOffset + leaderboardLength > leaderboardTotal) {
        scrollDir = -scrollDir;
        leaderboardOffset += scrollDir * 2;
    }
    var i = 0,
        ele = 0;
    for (i = 0; i < leaderboardTotal; i += 1) {
        ele = $("#top" + (i + 1));
        if (i >= leaderboardOffset && i < leaderboardOffset + leaderboardLength) { ele.removeClass("hidden"); } else { ele.addClass("hidden"); }
    }
    setTimeout(function () {
        scrollLeaderboard();
    }, leaderboardScrollDelay);
}
var agentCount = 0;

function updateLivechat() {
    "use strict";
    $.get("https://clients.hostwinds.com/TS/funcs.php?func=livechat", function (data) {
        var livechats = JSON.parse(data);
        if (agentCount !== Object.keys(livechats).length) {
            $("#livechat tr").removeClass("vis");
            $("#livechat tr td:nth-child(1)").html("");
        }
        $.each(livechats, function (id, tech) {
            var ele = $("#chat" + tech.sort),
                eleAccepting = $("#chat" + tech.sort + " td:nth-child(1)"),
                eleName = $("#chat" + tech.sort + " td:nth-child(2)"),
                eleChats = $("#chat" + tech.sort + " td:nth-child(3)");
            if (eleAccepting.hasClass("accepting") !== (tech.acceptingchats === 1) || eleName.text() !== tech.name || eleChats.text() !== tech.numchats || agentCount !== Object.keys(livechats).length) {
                ele.removeClass("vis");
                setTimeout(function () {
                    eleName.text(tech.name);
                    eleChats.text(tech.numchats);
                    eleAccepting.removeClass("accepting");
                    if (tech.numchats > 0) { eleAccepting.html("<img src=\"img/away.png\" alt=\"\" style=\"width:20px; height:20;\">"); } else { eleAccepting.html("<img src=\"img/dnd.png\" alt=\"\" style=\"width:20px; height:20;\">"); }
                    if (tech.acceptingchats === 1) {
                        eleAccepting.addClass("accepting");
                        eleAccepting.html("<img src=\"img/chat.png\" alt=\"\" style=\"width:20px; height:20;\">");
                    }
                    ele.addClass("vis");
                }, 400);
            }
        });
        agentCount = Object.keys(livechats).length;
    });
    setTimeout(function () {
        updateLivechat();
    }, 60000); //Update staff roster every minute because that's how often the db updates
}
setTimeout(function () {
    "use strict";
    scrollLeaderboard();
}, leaderboardScrollDelay);
updateonlinetechs();
updateticketcounts();
updateSLAViolations();
updateLeaderboard();
updateLivechat();