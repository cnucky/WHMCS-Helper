/*jslint browser: true,regexp: true*/
/*global $, chrome, console, alert*/
var style = $('<style>.WEXTBTN {     padding: 2px 6px; font-size: 12px; line-height: 14px; -webkit-appearance: none; font-weight: 400 !important; display: inline-block;  margin-bottom: 0;  color: #fff !important; text-align: center; vertical-align: middle; background-color: #0074cc; cursor: pointer; border: 0; border-radius: 2px; }</style>');
$('html > head').append(style);
var node = $('#info li:nth-child(6) a').html();
var KVM = $('#info li:nth-child(7) a').html();
var content = $("div#info");
var contentHtml = content.html();
var EzeeName = $('#tmenutabs li:nth-child(1) span').html();
var FEN = EzeeName.slice(9, 10);
var LEN = EzeeName.slice(9);
var LEN = LEN.split(" ")[1];
var EZEN = FEN + LEN;
var Ezee = "ssh://" + EZEN + "@108.174.193.106:8146/";
if (node === null || typeof node === "undefined") {
    node = "VPS";
} else if (KVM === null || typeof KVM === "undefined") {
    KVM = "KVM";
} else {
    if (node.match(/VPS\d*/)) {
        var nodemod = node.split("VPS");
        var nodefinal = "VPSN" + nodemod[1];
        var SSHNode = "ssh://root@" + nodefinal + ".hostwindsdns.com:8146/";
        var link = "<a href=\"" + SSHNode + "\" class=\"WEXTBTN\">SSH into " + nodefinal + "</a>" + "  <a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>";
        content.html(contentHtml.replace(node, link));
    }
    if (node.match(/SEAVPS\d*/)) {
        var nodemod = node.split("SEAVPS");
        var nodefinal = "SEAVPS-" + nodemod[1];
        var SSHNode = "ssh://root@" + nodefinal + ".hostwindsdns.com:8146/";
        var link = "<a href=\"" + SSHNode + "\" class=\"WEXTBTN\">SSH into " + nodefinal + "</a>" + "  <a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>";
        content.html(contentHtml.replace(node, link));
    }
}
if (KVM.match(/KVM\d*/)) {
    var KVMmod = KVM.split("KVM");
    var KVMfinal = "KVM-" + KVMmod[1];
    var SSHNode = "ssh://root@" + KVMfinal + ".hostwindsdns.com:8146/";
    var link = "<a href=\"" + SSHNode + "\" class=\"WEXTBTN\">SSH into " + KVMfinal + "</a>" + "  <a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>";
    content.html(contentHtml.replace(KVM, link));
}
if (KVM.match(/SSD\d*/)) {
    var KVMmod = KVM.split("SSD");
    var KVMfinal = "SSD-" + KVMmod[1];
    var SSHNode = "ssh://root@" + KVMfinal + ".hostwindsdns.com:8146/";
    var link = "<a href=\"" + SSHNode + "\" class=\"WEXTBTN\">SH into " + KVMfinal + "</a>" + "  <a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>";
    content.html(contentHtml.replace(KVM, link));
}
if (KVM.match(/SEAKVM\d*/)) {
    var KVMmod = KVM.split("SEAKVM");
    var KVMfinal = "SEAKVM-" + KVMmod[1];
    var SSHNode = "ssh://root@" + nodefinal + ".hostwindsdns.com:8146/";
    var link = "<a href=\"" + SSHNode + "\" class=\"WEXTBTN\">SSH into " + KVMfinal + "</a>" + "  <a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>";
    content.html(contentHtml.replace(KVM, link));
}
if (KVM.match(/SEASSD\d*/)) {
    var KVMmod = KVM.split("SEASSD");
    var KVMfinal = "SEASSD-" + KVMmod[1];
    var SSHNode = "ssh://root@" + KVMfinal + ".hostwindsdns.com:8146/";
    var link = "<a href=\"" + SSHNode + "\" class=\"WEXTBTN\">SSH into " + KVMfinal + "</a>" + "  <a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>";
    content.html(contentHtml.replace(KVM, link));
}