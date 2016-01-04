var tabId = null;
if (sessionStorage.getItem("sessionId") == null) {
    sessionStorage.setItem('sessionId', new Date().getTime());
}
tabId = sessionStorage.getItem("sessionId");

var queryParam = "";
var anURI = "http://localhost:8080/DynamicCookies/img.gif";
var refrenceURI = "http://localhost:8080/DynamicCookies";
var originURI = "http://localhost:8080";

var frameDiv = document.createElement("div");
frameDiv.id = "frameContainer";

ANuser = false;

var language = window.navigator.userLanguage || window.navigator.language;
var browserCodeName = navigator.appCodeName;
var browserAppName = navigator.appName;
var browserEngine = navigator.product;
var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth
    || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;

var windowSize = w.innerWidth + "x" + w.innerHeight;

var browserCharset = d.characterSet;

var screenResolution = screen.height + "x" + screen.width;
var browserUserAgent = navigator.userAgent;


function xhrRegister(uid, ip, page) {
    var xmlhttp;

    var domainName = extractDomain(page);

    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    if (typeof uid !== "undefined")
        queryParam += "guid=" + uid + "&";
    if (typeof ip !== "undefined")
        queryParam += "ip=" + ip + "&";
    if (typeof page !== "undefined")
        queryParam += "page_url=" + encodeURIComponent(page) + "&";
    if (typeof browserAppName !== "undefined")
        queryParam += "browser_name=" + browserAppName + "&";
    if (typeof language !== "undefined")
        queryParam += "browser_language=" + language + "&";
    if (typeof browserUserAgent !== "undefined")
        queryParam += "browser_user_agent=" + browserUserAgent + "&";
    if (typeof screenResolution !== "undefined")
        queryParam += "screen_resolution=" + screenResolution + "&";
    if (typeof browserCharset !== "undefined")
        queryParam += "browser_charset=" + browserCharset + "&";
    if (typeof windowSize !== "undefined")
        queryParam += "browser_window_size=" + windowSize + "&";
    if (typeof domainName !== "undefined")
        queryParam += "domain_name=" + domainName + "&";
    if (typeof tabId !== "undefined")
        queryParam += "browser_tab_id=" + tabId;

    (new Image()).src = anURI + "?" + queryParam;""

    // xmlhttp.open("GET",anURI+queryParam,true);
    // xmlhttp.send();

}

document.body.appendChild(frameDiv);

var oCrumbles = document.cookie.split(';');
for (var i = 0; i < oCrumbles.length; i++) {
    var oPair = oCrumbles[i].split('=');
    var sKey = decodeURIComponent(oPair[0].trim());
    var sValue = oPair.length > 1 ? oPair[1] : '';
    if (sKey == "ANuser")

        ANuser = decodeURIComponent(sValue);
}

console.log("doman ANuser", ANuser)

if (ANuser == false) {

    console.log("no an user on domain, setting up a new user");

    function createIframe() {
        i = document.createElement("iframe");
        i.src = refrenceURI + "/frame/content-frame.html";
        i.scrolling = "auto";
        i.frameborder = "0";
        i.width = "0px";
        i.height = "0px";
        document.getElementById("frameContainer").appendChild(i);
    }
    ;

    // Check for browser support of event handling capability
    if (window.addEventListener)
        window.addEventListener("load", createIframe, false);
    else if (window.attachEvent)
        window.attachEvent("onload", createIframe);
    else
        window.onload = createIframe;

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, function (e) {

        var key = e.message ? "message" : "data";
        var data = e[key];

        if (e.origin == originURI) {
            console.log("an user setup on domain");
            console.log(e, key, data);

            if (typeof data !== "undefined" && data != "") {
                document.cookie = "ANuser=" + data;
                ANuser = data;
                xhrRegister(ANuser, "localhost", document.location.href)
            }
        }

    }, false);
} else {
    console.log("existing an user on domain", ANuser);

    xhrRegister(ANuser, "localhost", document.location.href)
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}
