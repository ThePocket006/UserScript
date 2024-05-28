// ==UserScript==
// @name         Shortlink
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       PK6
// @match        *://fcdot.lc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fcdot.lc
// @updateURL    https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/shortlink/shortlink.bot.pk6.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/shortlink/shortlink.bot.pk6.user.js
// @grant         unsafeWindow
// @require       http://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function(window, $) {
    'use strict';

    $(function(){
        $("#adb_detected").hide();
        $(".g-recaptcha").show();
        $(".btn-captcha").show();
        $(".captcha-check").show();
    });

    var main = `
        $(function(){
            $("#adb_detected").hide();
            $(".g-recaptcha").show();
            $(".btn-captcha").show();
            $(".captcha-check").show();
        });`;
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(main));
    (document.body || document.head || document.documentElement).appendChild(script);
})((typeof unsafeWindow != 'undefined' ? unsafeWindow : window), jQuery);