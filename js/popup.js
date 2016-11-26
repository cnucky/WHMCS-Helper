/*jslint browser: true,regexp: true*/
/*global $, chrome, console, alert*/
$.ajaxSetup({
    cache: false
});

function setpopupcolors(colors) {
    "use strict";
    $("#colOpen").val(colors.open);
    $("#colUnassigned").val(colors.unassigned);
    $("#colInactive").val(colors.inactive);
    $("#colIgnore").val(colors.ignoreTicket);
    $("#colNomsg").val(colors.noMessage);
    $("#colCR1").val(colors.customerReply1);
    $("#colCR2").val(colors.customerReply2);
    $("#colOnHold").val(colors.onHold);
    $("#colInProgress").val(colors.inProgress);
    $("#colManagement").val(colors.management);
}

function setCookie(cname, cvalue, exdays) {
    "use strict";
    var d = new Date(),
        expires = "";
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
    console.log(document.cookie);
}
var c = null;
var c = [];

function getCookie(cname) {
    "use strict";
    var name = cname + "=",
        ca = document.cookie.split(';'),
        i = 0;
    for (i = 0; i < ca.length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
var TIMEPass = getCookie("TIMEPass"),
    SeaIPMIUser = getCookie("SeaIPMIUser"),
    SeaIPMIPass = getCookie("SeaIPMIPass"),
    DalIPMIUser = getCookie("DalIPMIUser"),
    DalIPMIPass = getCookie("DalIPMIPass"),
    SeaTransUser = getCookie("SeaTransUser"),
    SeaTransPass = getCookie("SeaTransPass"),
    DalTransUser = getCookie("DalTransUser"),
    DalTransPass = getCookie("DalTransPass");
$('#SeaUser').val(SeaIPMIUser);
$('#SeaPass').val(SeaIPMIPass);
$('#DalUser').val(DalIPMIUser);
$('#DalPass').val(DalIPMIPass);
$('#DalTUser').val(DalTransUser);
$('#DalTPass').val(DalTransPass);
$('#SeaTUser').val(SeaTransUser);
$('#SeaTPass').val(SeaTransPass);
$('#TCPass').val(TIMEPass);
var techs = [];

function updatecontentscriptcolor() {
    "use strict";
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            method: "updateColors",
            colors: {
                colors: c,
                techsIn: techs
            }
        }, function (response) {});
    });
}

function savecolors() {
    "use strict";
    var storage = {};
    storage.colors = {
        "colors": c,
        "techsIn": techs
    };
    chrome.storage.local.set(storage);
}

function resettechs() {
    "use strict";
    $.get(chrome.extension.getURL("staff.txt"), function (stafftxt) {
        var staff = stafftxt.replace(/\r\n/g, "\n").split("\n"),
            i = 0;
        techs = {};
        for (i = 0; i < staff.length; i += 1) {
            techs[staff[i]] = false;
            console.log(techs[staff[i]]);
        }
        savecolors();
    });
}
$(document).ready(function () {
    "use strict";
    function loadcolors(colors) {
        
        if (colors === null || !(colors.hasOwnProperty('colors'))) {
            colors = JSON.parse('{"open":"#99DD99", "unassigned":"#FF9999", "inactive":"#FFAA99", "ignoreTicket":"#0099FF", "noMessage":"#9966FF", "customerReply1":"#B4DD99", "customerReply2":"#FFDD99", "management":"#99DD99", "onHold":"#99DD99", "inProgress":"#99DD99"}');
            c = colors;
            resettechs();
        } else {
            colors = colors.colors;
            techs = colors.techsIn;
            colors = colors.colors;
        }
        var colorTypes = {
            open: "colOpen",
            unassigned: "colUnassigned",
            inactive: "colInactive",
            ignoreTicket: "colIgnore",
            noMessage: "colNomsg",
            customerReply1: "colCR1",
            customerReply2: "colCR2",
            onHold: "colOnHold",
            inProgress: "colInProgress",
            management: "colManagement"
        };
        $(".techIn").on('change', function () {
            techs[this.value] = this.checked;
            updatecontentscriptcolor();
            savecolors();
        });
        c = colors;
        setpopupcolors(colors);
        $(".colorSelect").spectrum({
            preferredFormat: "hex",
            showInput: true
        });
        $.each(colorTypes, function (t, s) {
            $("#" + s).on('change.spectrum', function (e, newColor) {
                c[t] = newColor.toHexString();
                updatecontentscriptcolor();
                savecolors();
            });
            $("#" + s).on('move.spectrum', function (e, newColor) {
                c[t] = newColor.toHexString();
                updatecontentscriptcolor();
                savecolors();
            });
            $("#" + s).on('hide.spectrum', function (e, newColor) {
                c[t] = newColor.toHexString();
                updatecontentscriptcolor();
            });
        });
    }
    $("#resettechs").click(function () {
        loadcolors(null);
    });
    chrome.storage.local.get("colors", function (colors) {
        loadcolors(colors);
    });
   
    function reloadtechs() {
        chrome.storage.local.clear();
        loadcolors(null);
        chrome.tabs.reload();
        window.location.reload();
       
    }
    $("#btn_reload").click(function () {
        reloadtechs();
        
    });
});
$("#chkNotify").on('change', function () {
    "use strict";
    var canNotify = this.checked ? 'true' : 'false',
        storage = {};
    
    storage.method = "canNotify";
    storage.value = canNotify;
    console.log(storage.method + " is set to " + storage.value);
    chrome.extension.sendMessage(storage, function (response) {});
});
chrome.storage.local.get("canNotify", function (canNotify) {
    "use strict";
    if (canNotify !== null && canNotify.hasOwnProperty('canNotify')) {
        $("#chkNotify").prop('checked', (canNotify.canNotify === "true"));
    }
});
$(document).ready(function () {
    "use strict";
    $(function () {
        $("#tabs").tabs();
    });
    $(document).on("submit", "form", function (e) {
        var oForm = $(this),
            formId = oForm.attr("id"),
            firstValue = oForm.find("input").first().val();
        setCookie(formId, firstValue, 365);
        return false;
    });

    function play() {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'http://www.drodd.com/big-lebowski-sound/shut_up.wav');
        audioElement.play();
    }
    $(function () {
        $("#tabs").tabs();
    });
    $('#tabs-1').on('click', 'a', function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
 
        return false;
    });
    
    chrome.tabs.onCreated.addListener(function (tab) {
        if (tab.url.indexOf("wext:") >= 0) {
            setTimeout(function () {chrome.tabs.remove(tab.id); }, 300);
        }
    });
    $('#tabs-3').on('click', 'a', function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });
    $("#SEAIPMI").replaceWith('<a id=\"SEAIPMI\" href=\"wext: rdpaurl 104.168.168.20 ' + SeaIPMIUser + ' ' + SeaIPMIPass + '\">Seattle IPMI</a>');
    $("#DALIPMI").replaceWith('<a id=\"DALIPMI\" href=\"wext: rdpaurl 23.238.16.21 ' + DalIPMIUser + ' ' + DalIPMIPass + '\">Dallas IPMI</a>');
    $("#SEAtrans").replaceWith('<a id=\"SEAtrans\" href=\"wext: rdpaurl 104.168.143.94 ' + SeaTransUser + ' ' + SeaTransPass + '\">Seattle Transfer Box</a>');
    $("#DALtrans").replaceWith('<a id=\"DALtrans\" href=\"wext: rdpaurl 23.254.215.254 ' + DalTransUser + ' ' + DalTransPass + '\">Dallas Transfer Box</a>');
    $("#TIME").replaceWith('<a id=\"TIME\" href=\"wext: rdpaurl 23.254.136.43 ' + 'Administrator ' + TIMEPass + '\">Time Clock</a>');
    $('#tab4').ready(function () {
        $("head").append("<link rel='stylesheet' href='/css/dark-theme.css' />");
        $("#search").on("keyup", function () {
            var value = $(this).val();
            $("table tr").each(function (index) {
                if (index !== 0) {
                    var $row = "",
                        id = "";
                    $row = $(this);
                    id = $row.find("td:first").text();
                    if (id.indexOf(value) !== 0) {
                        $row.hide();
                    } else {
                        $row.show();
                    }
                }
            });
        });
        $.ajax({
            url: 'http://devclients.hostwinds.com/voxility/',
            dataType: 'text',
            type: 'get',
            success: function (str, b, xhr) {
                str = str.replace(/.*<meta.*/g, "");
                str = str.replace(/.*<link.*/g, "");
                str = str.replace(/<table>/g, "<table  class=\"tdmod\">");
                $('#DDoS').empty().html(str);
            }
        });
    });
    $('#tab5').ready(function () {
        $.ajax({
            url: 'https://clients.hostwinds.com/TS/',
            dataType: 'text',
            type: 'get',
            async: true,
            cache: false,
            success: function (str, b, xhr) {
                str = str.replace(/.*<meta.*/g, "");
                str = str.replace(/.*<link.*/g, "");
                str = str.replace(/.*images.*/g, "img");
                $('#TS').empty().html(str);
            }
        });
    });
    $('#tab6').ready(function () {
        $.ajax({
            url: 'http://seanetflow.hostwinds.com/network/Overview.php',
            dataType: 'html',
            type: 'get',
            async: true,
            cache: false,
            success: function (str, b, xhr) {
                str = $('<div />').html(str).find('div:eq(0)').html();
                var agg = $(str).first();
                $('#SeaNetFlow').html(str);
                $('#SeaNetFlow').find("img:eq(0)").remove();
                $('#SAggNetFlow').html(agg);
            }
        });
        $.ajax({
            url: 'http://dalnetflow.hostwinds.com/network/Overview.php',
            dataType: 'html',
            type: 'get',
            async: true,
            cache: false,
            success: function (str, b, xhr) {
                str = $('<div />').html(str).find('div:eq(0)').html();
                var agg = $(str).first();

                $('#DalNetFlow').html(str);
                $('#DalNetFlow').find("img:eq(0)").remove();
                $('#DAggNetFlow').html(agg);

            }
        });
    });
    $('#tab7').ready(function () {
        $('#SIP').load('https://clients.hostwinds.com/3610hw8138/addonmodules.php?module=SEAIPadder #content_padded');
        $('#SCIP').load('https://clients.hostwinds.com/3610hw8138/addonmodules.php?module=SEACIPadder #content_padded');
        $('#DIP').load('https://clients.hostwinds.com/3610hw8138/addonmodules.php?module=IPadder #content_padded');
        $('#DCIP').load('https://clients.hostwinds.com/3610hw8138/addonmodules.php?module=CIPadder #content_padded');
        $('#NS').load('https://clients.hostwinds.com/3610hw8138/addonmodules.php?module=nsreg #content_padded');
    });
    $('#tab8').click(function () {
        $('#CF').load('http://www.crimeflare.com/cfs.html #box');
    });
    $('#tab9').click(function () {
        //$('#MT').load('http://mailtester.com/testmail.php #content');
    });
    $('#tabs-10').on('click', 'a', function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
    });
    $('#tab10').ready(function () {
        $("#ZBX").load("http://monitor.hostwinds.com/zabbix/tr_status.php .article", function (str, statusTxt, xhr) {
            str = str.replace(/\n/g, "");
            str = str.replace(/.*Reset<\/button><\/div><\/form><\/div>/g, "");
            str = str.replace(/<div class="footer">.*/g, "");
            str = str.replace(/href="/g, "href=\"http://monitor.hostwinds.com/zabbix/");
            $('#ZBX').empty().html(str);
            $(".list-table thead tr").each(function () {
                $(this).find("th:eq(11)").remove();
            });
            $(".list-table thead tr").each(function () {
                $(this).find("th:eq(7)").remove();
            });
            $(".list-table thead tr").each(function () {
                $(this).find("th:eq(4)").remove();
            });
            $(".list-table thead tr").each(function () {
                $(this).find("th:eq(1)").remove();
            });
            $(".list-table tbody tr").each(function () {
                $(this).find("td:eq(11)").remove();
            });
            $(".list-table tbody tr").each(function () {
                $(this).find("td:eq(7)").remove();
            });
            $(".list-table tbody tr").each(function () {
                $(this).find("td:eq(4)").remove();
            });
            $(".list-table tbody tr").each(function () {
                $(this).find("td:eq(1)").remove();
            });
        });
    });
    var techsOnline = {};
    $('#tab1').ready(function () {
        $(function () {
            $("#WHMCSIN").load("https://clients.hostwinds.com/3610hw8138/supportcenter.php .smallfont", function () {
                $(this).html($(this).text().replace("HWAPIU1,", ""));
                $(this).html($(this).text().replace("HWAPIU1", ""));
                $(this).html($(this).text().replace("hwadmin,", " "));
                $(this).html($(this).text().replace("hwadmin", ""));
                $(this).html($(this).text().replace(/\s/g, ""));
                $(this).html($(this).text().replace("ChrisM", "Christopher Murdoch"));
                $(this).html($(this).text().replace("CarolineH", "Caroline Helvey"));
                $(this).html($(this).text().replace("MatthewA", "Matthew Anderson"));
                $(this).html($(this).text().replace("SimonA", "Simon Alby"));
                $(this).html($(this).text().replace("KyleK", "Kyle Kuban"));
                $(this).html($(this).text().replace("MarkH", "Mark Henderson"));
                $(this).html($(this).text().replace("MarkG", "Mark Gilbert"));
                $(this).html($(this).text().replace("ClaytonF", "Clayton Fletcher"));
                $(this).html($(this).text().replace("DaneleG", "Danele Glaspey"));
                $(this).html($(this).text().replace("MichaelA", "Michael Armstrong"));
                $(this).html($(this).text().replace("PaulJ", "Paul Johnson"));
                $(this).html($(this).text().replace("EricG", "Eric Geranen"));
                $(this).html($(this).text().replace("FrankK", "Frank Kevin"));
                $(this).html($(this).text().replace("MichaelB", "Michael Brower"));
                $(this).html($(this).text().replace("JohnL", "John Low"));
                $(this).html($(this).text().replace("NathanP", "Nathan Powers"));
                $(this).html($(this).text().replace("ScottF", "Scott Fox"));
                $(this).html($(this).text().replace("MattW", "Matt Werner"));
                
                var i, array = $(this).text().split(',');
                for (i = 0; i < array.length; i += 1) {
                    $("#techsInTbl").append("<tr class=\"techIns\"><td>" + array[i] + "</td>" + array[i] + "<td><input  class=\"techIn\" type=\"checkbox\" value=\"" + array[i] + "\" checked></td></tr>");
                }
                $(".techIn").on('change', function () {
                    techs[this.value] = this.checked;
                    console.log(this.value + " is now set to " + techs[this.value]);
                    updatecontentscriptcolor();
                    savecolors();
                    //play();
                });
            });
        });
        $.get({
            url: "https://clients.hostwinds.com/TS/funcs.php?func=techsonline",
            cache: false
        }).then(function (data) {
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
                    if ((tech.name !== "Simon Alby") || (tech.name !== "Mark Henderson") || (tech.name !== "Frank Kevin") || (tech.name !== "Matt Werner")) {
                        console.log(tech.name);
                        //$("#techsInTbl").append("<tr class=\"techIns\"><td>" + tech.name + "</td>" + tech.name + "<td><input  class=\"techIn\" type=\"checkbox\" value=\"" + tech.name + "\" checked></td></tr>");
                    }
                }
            });
            $(".techIn").on('change', function () {
                techs[this.value] = this.checked;
                console.log(this.value + " is now set to " + techs[this.value]);
                updatecontentscriptcolor();
                savecolors();
                //play();
            });
        });
    });
});