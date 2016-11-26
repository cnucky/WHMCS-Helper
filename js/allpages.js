/*jslint browser: true,regexp: true*/
/*global $, chrome, console, alert*/
function intellisearch() {
    "use strict";
    if ($("#intellisearchval").val() !== "") {
        $.post("search.php", $("#frmintellisearch").serialize(), function (data) {
            $("#searchresults").html(data);
            $("#btnintellisearch").hide();
            $("#btnintellisearchCancel").removeClass('hidden').show();
            $("#searchresults").hide().removeClass('hidden').slideDown();
        });
        return true;
    }
    return false;
}

function closeintellisearch() {
    "use strict";
    $("#searchresults").slideUp();
}
var keyTimer;
$("#intellisearchval").on('input', function (e) {
    "use strict";
    clearTimeout(keyTimer);
    keyTimer = setTimeout(function () {
        if (!intellisearch()) { closeintellisearch(); }
    }, 800);
}).on('keypress', function (e) {
    "use strict";
    if (e.keyCode === 13) { return false; }
});