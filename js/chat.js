/* 
	HostWinds Helper
	  Chat Module
*/
/*jslint browser: true*/
/*global $, jQuery, alert*/
/*jslint regexp: true*/
var HWHelper = {};
//Chat module
HWHelper.Chat = {};
//Current chat ID
HWHelper.Chat.ActiveChat = "";
//Data for the chat module
HWHelper.Chat.Data = {};
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function (mutations, observer) {
    mutations.forEach(function(mutation) {
        var target = mutation.target;
        if ($(target).is(".chat ul")) {
            HWHelper.Chat.Update(target);
        } else {
            if ($(target).is("#chat-circles")) {
                var children = $(target).children();
                if (children != null) {
                    $(children).each(function(key, child) {
                        if (!$(child).is(".circle.empty")) {
                            console.log(child);
                            console.log("We got one, Captain!");
                            var circleID = $(child).attr("id");
                            console.log("circleID: " + circleID);
                            var chatID = circleID.replace("circle-", "");
                            HWHelper.Chat.OnOpen(chatID);
                        }
                    });
                }
            }
        }
    });
});
observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false
});
$(document).ready(function() {
    $(document).click(function(event) {
        if ($(event.target).is(".map")) {
            var map = event.target;
            var parent = $(map).parent()[0];
            if (parent != null) {
                var chatURL = $(parent).attr("href");
                var chatID = chatURL.replace("/chats/", "");
                HWHelper.Chat.OnFocus(chatID);
            }
        }
    });
});
HWHelper.Chat.OnOpen = function(chatID) {
    HWHelper.Chat.Data[chatID] = {};
    if (Object.keys(HWHelper.Chat.Data).length == 1) {
        HWHelper.Chat.OnFocus(chatID);
        console.log("Setting active chat.");
    }
}
HWHelper.Chat.OnFocus = function(chatID) {
        var data = HWHelper.Chat.Data[chatID];
        HWHelper.Chat.CurrentChat = chatID;
        HWHelper.Chat.UpdateClientID(chatID);
        HWHelper.Chat.UpdateTicket(chatID);
        HWHelper.Chat.UpdateInvoice(chatID);
        HWHelper.Chat.UpdateNewTicket(chatID);
        HWHelper.Chat.UpdateClient(chatID);
    }
    //HWHelper.Chat.OnClose( String/chatID ):
    //	Run on chat close
HWHelper.Chat.OnClose = function(chatID) {
        delete HWHelper.Chat.Data[chatID];
    }
    //HWHelper.Chat.UpdateClientID( String/chatID ):
    //	Updates the client ID in the HW.Chat.Data[chatID] table using the client's email.
HWHelper.Chat.UpdateClientID = function(chatID) {
        var data = HWHelper.Chat.Data[chatID];
        var email = data.clientEmail;
        if (email != null) {
            var link = "https://clients.hostwinds.com/3610hw8138/search.php?type=clients&field=Email+Address&q=" + email;
            $.get(link, function(result) {
                var resultParse = $.parseHTML(result);
                var summaryBoxes = $(resultParse).find(".clientssummarybox > ul > li > a");
                $(summaryBoxes).each(function(key, element) {
                    var href = $(element).attr("href");
                    if (href.indexOf("open") > -1 && href.indexOf("supporttickets") > -1) {
                        var clientID = href.replace("supporttickets.php?action=open&userid=", "");
                        data.clientID = clientID;
                        if (chatID == HWHelper.Chat.CurrentChat) {
                            HWHelper.Chat.UpdateNewTicket(chatID);
                        }
                    }
                });
            });
        }
    }
    //HWHelper.Chat.UpdateInvoice( String/chatID ):
    //	Updates the link for the View as Invoice button.
HWHelper.Chat.UpdateInvoice = function(chatID) {
        var data = HWHelper.Chat.Data[chatID];
        var invoiceID = data.refID;
        var ticketDOM = $(".Invoice");
        if (invoiceID != null) {
            if (ticketDOM.length == 0) {
                $(".about").append('<p class="Invoice">' + '<span class="app-icon app-icon-billing"></span>' + '<a href="https://clients.hostwinds.com/3610hw8138/search.php?type=invoices&field=Invoice+%23&q=' + invoiceID + '"> View as Invoice</a>' + '</p>');
            } else {
                $(".Invoice a").attr("href", "https://clients.hostwinds.com/3610hw8138/search.php?type=invoices&field=Invoice+%23&q=" + invoiceID);
            }
        } else {
            $(ticketDOM).remove();
        }
    }
    //HWHelper.Chat.UpdateTicket( String/chatID ):
    //	Updates the link for the View as Ticket button.
HWHelper.Chat.UpdateTicket = function(chatID) {
        var data = HWHelper.Chat.Data[chatID];
        var ticketID = data.refID;
        var ticketDOM = $(".Ticket");
        if (ticketID != null) {
            if (ticketDOM.length == 0) {
                $(".about").append('<p class="Ticket">' + '<span class="app-icon app-icon-ticket"></span>' + '<a href="https://clients.hostwinds.com/3610hw8138/search.php?type=tickets&field=Ticket+%23&q=' + ticketID + '"> View as Ticket</a>' + '</p>');
            } else {
                $(".Ticket a").attr("href", "https://clients.hostwinds.com/3610hw8138/search.php?type=tickets&field=Ticket+%23&q=" + ticketID);
            }
        } else {
            $(ticketDOM).remove();
        }
    }
    //HWHelper.Chat.UpdateNewTicket( String/chatID ):
    //	Updates the link for the Open New Ticket button.
HWHelper.Chat.UpdateNewTicket = function(chatID) {
        var data = HWHelper.Chat.Data[chatID];
        var clientID = data.clientID;
        var ticketDOM = $(".OpenTicket");
        if (clientID != null) {
            var link = "https://clients.hostwinds.com/3610hw8138/supporttickets.php?action=open&userid=" + clientID;
            if (ticketDOM.length == 0) {
                $(".about").append('<p class="OpenTicket">' + '<span class="app-icon app-icon-ticket"></span>' + '<a href="' + link + '"> Open New Ticket</a>' + '</p>');
            } else {
                $(".OpenTicket a").attr("href", link);
            }
        } else {
            $(ticketDOM).remove();
        }
    }
    //HWHelper.Chat.UpdateClient( String/chatID ):
HWHelper.Chat.UpdateClient = function(chatID) {
        var data = HWHelper.Chat.Data[chatID];
        var clientID = data.clientID;
        var ticketDOM = $(".Area");
        if (clientID != null) {
            var link = "https://clients.hostwinds.com/3610hw8138/clientssummary.php?userid=" + clientID;
            if (ticketDOM.length == 0) {
                $(".about").append('<p class="Area">' + '<span class="app-icon app-icon-ticket"></span>' + '<a href="' + link + '">Open Client Area</a>' + '</p>');
            } else {
                $(".Area a").attr("href", link);
            }
        } else {
            $(ticketDOM).remove();
        }
    }
    /*

    	Hooks

    */
    /* Update - Called when the chat updates */
HWHelper.Chat.Update = function(target) {
        var messages = $(target).find(".text");
        var parent = $(target).parent();
        var chatID = parent.attr("data-conference-id");
        var length = messages.length;
        var lastMessage = messages[length - 1];
        if (lastMessage != null) {
            lastMessage = $(lastMessage).html();
            HWHelper.Chat.MatchText(lastMessage, chatID);
        }
    }
    /* Match Text */
HWHelper.Chat.MatchText = function(text, chatID) {
    var ticketreferenceFound = text.search(/#([0-9]{10}$)/);
    var invoicereferenceFound = text.search(/#([0-9]{6}$)/);
    var data = HWHelper.Chat.Data[chatID];
    if (ticketreferenceFound > -1) {
        var refID = text.replace(text.replace(/([0-9]{10}$)/, ""), "");
        data.refID = refID;
        if (chatID == HWHelper.Chat.CurrentChat) {
            HWHelper.Chat.UpdateTicket(chatID);
        }
    } else if (invoicereferenceFound > -1) {
        var refID = text.replace(text.replace(/([0-9]{6}$)/, ""), "");
        data.refID = refID;
        if (chatID == HWHelper.Chat.CurrentChat) {
            HWHelper.Chat.UpdateInvoice(chatID);
        }
    } else {
        mailreferenceFound = text.search(/([a-zA-Z0-9.]{1,})@[a-zA-Z]{1,}\.([a-zA-Z]{1,5})/);
        if (mailreferenceFound > -1) {
            var removeText = text.replace(/([a-zA-Z0-9.]{1,})@[a-zA-Z]{1,}\.([a-zA-Z]{1,5})/, "");
            var email = text.replace(removeText, "");
            data.clientEmail = email;
            HWHelper.Chat.UpdateClientID(chatID);
        }
    }
}