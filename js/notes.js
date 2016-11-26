/* WHMCS Notes */
/*jslint browser: true*/
/*global $, jQuery, alert*/
/*jslint regexp: true*/
var HWHelper = {};
HWHelper.Notes = {};
HWHelper.Notes.Stored = {};
$(document).ready(function () {
    "use strict";
    if (document.location.href.indexOf("supporttickets.php") > -1) {
        HWHelper.Notes.CreateContainer();
        HWHelper.Notes.PopulateContainer();
    }
});
HWHelper.Notes.CreateContainer = function () {
    "use strict";
    $("body").append("<div id='resizable' class='child hwhelper-note-container'><div id='adminnotes'>Admin Notes</div></div>");
    HWHelper.Notes.Container = $(".hwhelper-note-container");
    $('#resizable').resizable({
        handles: 'n'
    }).bind('resize', function () {
        $(this).css("top", "auto");
    });
};
HWHelper.Notes.PopulateContainer = function () {
    "use strict";
    var notes = HWHelper.Notes.GetNotes();
    $.each(notes, function (key, note) {
        HWHelper.Notes.Container.append(note);
    });
};
HWHelper.Notes.GetNotes = function () {
    "use strict";
    return $(".reply.note");
};

$("#resizable").resizable({
    handles: {
        'n': '#handle'
    }
});
$(document).ready(function () {
    "use strict";
    $('.ui-resizable-n').dblclick(function () {
        $(".hwhelper-note-container").css("height", "350px");
    });
    return false;
});