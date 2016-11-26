/*jslint browser: true,regexp: true*/
/*global $, chrome, console, alert*/
function setCookie(cname, cvalue, exdays) {
    "use strict";
    var d = new Date(),
        expires = "";
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    "use strict";
    var name = cname + "=",
        ca = document.cookie.split(';'),
        i = 0,
        c = 0;
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
var apikey = getCookie("apikey");
var SeaIPMIUser = getCookie("SeaIPMIUser");
var SeaIPMIPass = getCookie("SeaIPMIPass");
var DalIPMIUser = getCookie("DalIPMIUser");
var DalIPMIPass = getCookie("DalIPMIPass");

function checkCookie() {
    "use strict";
    var apikey = getCookie("apikey"),
        DalIPMIPass = getCookie("DalIPMIPass");
    if (SeaIPMIUser !== "" && SeaIPMIPass !== "" && DalIPMIUser !== "" && DalIPMIPass !== "" && apikey !== "") {
        console.log(SeaIPMIUser + " " + SeaIPMIPass + " " + DalIPMIUser + " " + DalIPMIPass + " " + apikey);
    }
}

$(document).on("submit", "form", function (e) {
    "use strict";
    var oForm = $(this),
        formId = oForm.attr("id"),
        firstValue = oForm.find("input").first().val();
    setCookie(formId, firstValue, 365);
    
    return false;
});

