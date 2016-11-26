/*jslint browser: true,regexp: true*/
/*global $, chrome, console, alert*/
var product = $(".fieldarea select[name='packageid'] optgroup option:selected");
var server = $(".fieldarea select[name='server'] option:selected");
var ip = $("td.fieldarea input[name='dedicatedip']");
var VSERVER = $("");
var username = $("td.fieldarea input[name='username']");
var password = $("td.fieldarea input[name='password']");
var productType = product.parent().attr("label");
var productName = product.text();
var tableData = $("#servicecontent table.form").html();
var osRegex = (/Operating System<\/td>.+?<option value="\d+?" selected="">(.+?)<\/option>.*?<\/select>/).exec(tableData);
var vserveridRegex = (/vserverid<\/td>.+?<input type="text" name=".+?" id=".+?" value="(\d+?)" size="\d+?" class="form-control"><\/td>/).exec(tableData);
var os = osRegex === null ? "" : osRegex[1];
var vserverid = vserveridRegex === null ? "" : vserveridRegex[1];
var content = $("div#servicecontent");
var contentHtml = content.html();
var str = ip.val();
var IP = str.split(":")[0];
var port = str.split(":")[1];
if (port === undefined || port === null) {
    var IPport = IP;
} else {
    var IPport = IP + ":" + port;
}


var SFTPLink = "winscp-sftp://" + encodeURIComponent(username.val()) + ":" + encodeURI(password.val()) + "@" + IPport;
var loginlink = "https://" + IP + ":2087/login/?user=" + encodeURIComponent(username.val()) + "&pass=" + encodeURI(password.val());
var SSHNodeLink = "wext: ssh root@" + server.text().substr(0, server.text().indexOf(' ')).toLowerCase() + ".hostwindsdns.com:8146/home/" + encodeURIComponent(username.val()) + "/";
var SFTPNodeLink = "wext: winscp-sftp root@" + server.text().substr(0, server.text().indexOf(' ')).toLowerCase() + ".hostwindsdns.com:8146/home/" + encodeURIComponent(username.val()) + "/";
var servertoken = $(".frm1 select[name='token'] ");
var serverid = $("select[name='server'] option:selected").val();
var token = $("input[name='token']").val();
var whmlink = "https://clients.hostwinds.com/3610hw8138/configservers.php?action=singlesignon&token=" + token + "&serverid=" + serverid;
var SSHNode = "wext: ssh root@" + IP + ".hostwindsdns.com:8146/";
var EzeeName = $('#topnav strong').html();
var FEN = EzeeName.slice(0, 1);
var LEN = EzeeName.split(" ")[1];
var EZEN = FEN + LEN;
var Ezee = "wext: ssh 108.174.193.106 8146 " + EZEN + " " + encodeURI(password.val());
var scan = "wext: plink " + encodeURIComponent(username.val()) + ":" + encodeURI(password.val()) + "@" + IPport;
//Web Hosting
if (productType === "Web Hosting" || productType === "Business Hosting" || productType === "Reseller Hosting" || productType === "White Label Hosting" || productType === "Gold Hosting" || (productType === "Client Products" && (os === null || os === undefined) || productName === "YDG")) {
    if (productType === "Client Products" || productName === "YDG") {
        var cp = server.text().substr(0, server.text().indexOf(' ')).toLowerCase();
        var cplogin = cp.split("g")[1];
        var cpLoginLink = "https://server" + cplogin + ".yourdesignguys.com:2083/login/?user=" + encodeURIComponent(username.val()) + "&pass=" + encodeURI(password.val());
        var whmLoginLink = "https://server" + cplogin + ".yourdesignguys.com:2087/login/?user=" + encodeURIComponent(username.val()) + "&pass=" + encodeURI(password.val());
        var FTPLink = "winscp-ftp://" + encodeURIComponent(username.val()) + ":" + encodeURIComponent(password.val()) + "@server" + cplogin + ".yourdesignguys.com:21/";
        var SFTPNodeLink = "winscp-sftp://root@server" + cplogin + ".yourdesignguys.com:22/home/" + encodeURIComponent(username.val()) + "/";
        var SSHNodeLink = "wext: ssh root@server" + cplogin + ".yourdesignguys.com:22/home/" + encodeURIComponent(username.val()) + "/";
    } else {
        var cpLoginLink = "https://" + server.text().substr(0, server.text().indexOf(' ')).toLowerCase() + ".hostwindsdns.com:2083/login/?user=" + encodeURIComponent(username.val()) + "&pass=" + encodeURI(password.val());
        var whmLoginLink = "https://" + IP + ":2087/login/?user=" + encodeURIComponent(username.val()) + "&pass=" + encodeURI(password.val());
        var FTPLink = "winscp-ftp://" + encodeURIComponent(username.val()) + ":" + encodeURIComponent(password.val()) + "@" + server.text().substr(0, server.text().indexOf(' ')).toLowerCase() + ".hostwindsdns.com:21/";
    }
    var link = "<a href=\"" + cpLoginLink + "\" target=\"_blank\" class=\"WEXTBTN\">cPanel Login</a>" + "<a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>" + "<a href=\"" + SSHNodeLink + "\"  class=\"WEXTBTN\">SSH into " + server.text().substr(0, server.text().indexOf(' ')).toLowerCase() + "</a>" + "<a href=\"" + SFTPNodeLink + "\"  class=\"WEXTBTN\">SFTP into " + server.text().substr(0, server.text().indexOf(' ')).toLowerCase() + "</a>" + "<a href=\"" + FTPLink + "\"  class=\"WEXTBTN\">FTP Login</a>" + "<a href=\"" + whmlink + "\"  target=\"_blank\" class=\"WEXTBTN\">WHM Login as root</a>";
    //Reseller Hosting
    if (productType === "Reseller Hosting" || (productType === "Gold Hosting" && productName.endsWith("Reseller"))) {
        link += "<a href=\"" + whmLoginLink + "\" target=\"_blank\" class=\"WEXTBTN\">WHM Login as User</a>";
    }
    content.html(contentHtml.replace('<div id="modcmdresult" style="display:none;"></div>', link).replace("<a href=\"SPAURL: " + encodeURIComponent(username.val()) + "@" + IPport + " -pw " + encodeURI(password.val()) + "\" class=\"WEXTBTN\">SSH Into Server</a> - \n\t<a href=\"wext: rdpaurl " + IPport + " Administrator " + encodeURI(password.val()) + "\" class=\"WEXTBTN\">RDP Into Server</a>", ""));
    //Windows VPSs
} else if (productType === "Windows VPS" || productType === "SSD Windows VPS" || os === "Server 2012" || (productType === "Client Products" && productName === "AmazoVPS")) {
    if (port === undefined || port === null) {
        var port = 3389;
    }
    var setpass = "<iframe height=145px class=\"WEXTBTN\" style=\"left: 50%;width: 28.95%; margin-right:75%;overflow:hidden;border:none;\" src=\"http://dska.hostwinds.com/Windows/setpass.php?ip=" + IP + "\"></iframe>";
    var link = "<a href='wext: ping " + IP + "'  class=\"WEXTBTN\">Ping Server</a>" + "\n<a href='wext:  trace -w  " + IP + "'  class=\"WEXTBTN\">Traceroute</a>" + "<a href=\"https://vmaster.hostwindsdns.com:5656/admincp/manage.php?id=" + vserverid + "\" target=\"_blank\" class=\"WEXTBTN\">Solus</a>" + " <a href='wext: rdpaurl " + IP + ":" + port + " Administrator " + encodeURI(password.val()) + "'  class=\"WEXTBTN\">RDP Into Server</a>" + setpass;
    content.html(contentHtml.replace('<div id="modcmdresult" style="display:none;"></div>', link).replace("<a href=\"SPAURL: " + encodeURIComponent(username.val()) + "@" + IPport + " -pw " + encodeURI(password.val()) + "\" class=\"WEXTBTN\">SSH Into Server</a> - \n\t<a href=\"wext: rdpaurl " + IPport + " Administrator " + encodeURI(password.val()) + "\" class=\"WEXTBTN\">RDP Into Server</a>", ""));
    //Linux VPSs
} else if (productType === "Premium VPS" || productType === "SSD Premium VPS" || productType === "VPS" || productType === "Prosper202" || productType === "Mini VPS" || productType === "CPVLab" || productType === "Minecraft VPS Hosting") {
    if (port === undefined || port === null) {
        var port = 22;
    }
    var SSHLink = "wext: ssh " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURI(password.val());
    var link = "<a href='wext: plink " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Master Script</a>" + "<a href='wext: pass " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Change Password</a>" + "<a href='wext: ncdu " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Disk Usage</a>" + "\n<a href='wext: net " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Network Stats</a>" + "\n<a href='wext: trace -w  " + IP + "'  class=\"WEXTBTN\">Traceroute</a>" + "\n<a href='wext:  ping " + IP + "'  class=\"WEXTBTN\">Ping Server</a>" + "\n<a href='wext: wplink " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Fix Wordpress</a>" + "\n<a href=\"https://vmaster.hostwindsdns.com:5656/admincp/manage.php?id=" + vserverid + "\" target=\"_blank\" class=\"WEXTBTN\">Solus</a><a href=\"" + SFTPLink + "\" class=\"WEXTBTN\"> SFTP Login</a><a href=\"" + SSHLink + "\" class=\"WEXTBTN\">SSH Login</a>" + "<a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>";
    content.html(contentHtml.replace('<div id="modcmdresult" style="display:none;"></div>', link).replace("<a href=\"SPAURL: " + encodeURIComponent(username.val()) + "@" + IPport + " -pw " + encodeURI(password.val()) + "\" style=\"color:#cc0000\">SSH Into Server</a> - \n\t<a href=\"wext: rdpaurl " + IPport + " Administrator " + encodeURI(password.val()) + "\" style=\"color:#cc0000\">RDP Into Server</a>", ""));
}
//cPanel Servers
if (os === "cPanel (Select if Buying cPanel)" || (productType === "Dedicated Server" && !os.startsWith("Windows Server")) || (productType === "Cloud Servers" && !os.startsWith("Windows Server"))) {

    if (port === undefined || port === null) {
        var port = 22;
    }
    var SSHLink = "wext: ssh " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURI(password.val());
    var link = "<a href='wext: plink " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Master Script</a>" + "<a href='wext: ncdu " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Disk Usage</a>" + "<a href='wext: pass " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Change Password</a>" + "\n<a href='wext: ping " + IP + "'  class=\"WEXTBTN\">Ping Server</a>" + "\n<a href='wext: trace -w  " + IP + "'  class=\"WEXTBTN\">Traceroute</a>" + "\n<a href='wext: wplink " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Fix Wordpress</a>" + "\n<a href=\"https://vmaster.hostwindsdns.com:5656/admincp/manage.php?id=" + vserverid + "\" target=\"_blank\" class=\"WEXTBTN\">Solus</a><a href=\"" + loginlink + "\" target=\"_blank\" class=\"WEXTBTN\">WHM Login</a><a href=\"" + SFTPLink + "\" class=\"WEXTBTN\"> SFTP Login </a><a href=\"" + SSHLink + "\" class=\"WEXTBTN\">SSH Login</a> " + "<a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>";
    content.html(contentHtml.replace('<div id="modcmdresult" style="display:none;"></div>', link).replace("<a href=\"SPAURL: " + encodeURIComponent(username.val()) + "@" + IPport + " -pw " + encodeURI(password.val()) + "\" style=\"color:#cc0000\">SSH Into Server</a> - \n\t<a href=\"rdpaurl: " + IPport + " Administrator " + encodeURI(password.val()) + "\" style=\"color:#cc0000\">RDP Into Server</a>", ""));
    //zPanel Servers
} else if ((productType === "VPS" && os === "ZPanel") || (productType === "VPS" && os === "zPanel")) {
    if (port === undefined || port === null) {
        var port = 22;
    }
    var zPanel = "http://" + IP;
    var SSHLink = "wext: ssh " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURI(password.val());
    var link = "\n<a href='wext: net " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Network Stats</a>" + "<a href='wext: ncdu " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Disk Usage</a>" + "<a href=\"" + Ezee + "\" class=\"WEXTBTN\">Ezee Login</a>" + "\n<a href='wext: plink " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Master Script</a>" + "\n<a href='wext: ping " + IP + "'  class=\"WEXTBTN\">Ping Server</a>" + "\n<a href='wext: trace -w  " + IP + "'  class=\"WEXTBTN\">Traceroute</a>" + "\n<a href='wext: wplink " + IP + " " + port + " " + encodeURIComponent(username.val()) + " " + encodeURIComponent(password.val()) + "'  class=\"WEXTBTN\">Fix Wordpress</a>" + "\n<a href=\"https://vmaster.hostwindsdns.com:5656/admincp/manage.php?id=" + vserverid + "\" target=\"_blank\" class=\"WEXTBTN\">Solus</a><a href=\"" + zPanel + "\" target=\"_blank\" class=\"WEXTBTN\">zPanel Login</a><a href=\"" + SFTPLink + "\" class=\"WEXTBTN\"> SFTP Login </a><a href=\"" + SSHLink + "\" class=\"WEXTBTN\">SSH Login</a> ";
    content.html(contentHtml.replace('<div id="modcmdresult" style="display:none;"></div>', link).replace("<a href=\"SPAURL: " + encodeURIComponent(username.val()) + "@" + IPport + " -pw " + encodeURI(password.val()) + "\" style=\"color:#cc0000\">SSH Into Server</a> - \n\t<a href=\"rdpaurl: " + IPport + " Administrator " + encodeURI(password.val()) + "\" style=\"color:#cc0000\">RDP Into Server</a>", ""));
    //Windows Dedicated Servers
} else if (productType === "Dedicated Server" && os.startsWith("Windows Server")) {
    if (port === undefined || port === null) {
        var port = 3389;
    }
    var setpass = "<iframe height=145px class=\"WEXTBTN\" style=\"left: 50%;width: 36.1%; margin-right:75%;overflow:hidden;border:none;\" src=\"http://dska.hostwinds.com/Windows/setpass.php?ip=" + IP + "\"></iframe>";
    var IP = str.split(":")[0];
    var link = "<a href='wext: ping " + IP + "'  class=\"WEXTBTN\">Ping Server</a>" + "\n<a href='wext: trace -w  " + IP + "'  class=\"WEXTBTN\">Traceroute</a>" + "<a href='wext: rdpaurl " + IP + " Administrator " + encodeURI(password.val()) + "'  class=\"WEXTBTN\">RDP Into Server</a>" + setpass;
    content.html(contentHtml.replace('<div id="modcmdresult" style="display:none;"></div>', link).replace("<a href=\"SPAURL: " + encodeURIComponent(username.val()) + "@" + IPport + " -pw " + encodeURI(password.val()) + "\" style=\"color:#cc0000\">SSH Into Server</a> - \n\t<a href=\"rdpaurl: " + IPport + " Administrator " + encodeURI(password.val()) + "\" style=\"color:#cc0000\">RDP Into Server</a>", ""));
}