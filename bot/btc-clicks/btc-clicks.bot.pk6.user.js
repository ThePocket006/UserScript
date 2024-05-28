// ==UserScript==
// @name          BTC Clicks Bot
// @namespace     http://github.com/ThePocket006
// @version       1.0
// @description   try to take over the world!
// @author        PK6
// @match         *://btcclicks.com/*
// @match         *://faucetcrypto.com/*
// @match         *://*.faucetcrypto.com/*
// @match         *://coinpayu.com/dashboard/view_active?*
// @match         *://*.coinpayu.com/dashboard/view_active?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyirobot.com
// @updateURL    https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/btc-clicks/btc-clicks.bot.pk6.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/btc-clicks/btc-clicks.bot.pk6.user.js
// @require       http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

(function(window) {
    'use strict';

    var uri = (function (window) {
        var uri = {};
        var location = typeof window.location !== 'undefined' ? window.location : location;
        var url_pattern = /^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?$/i;

        uri.baseUrl = function (pathname) {
            var parser = uri.parseURL(uri.currentUrl());
            var baseUrl = parser.origin ? parser.origin : location.origin;
            return baseUrl + (typeof pathname === "string" ? '/' + pathname : '');
        }
        uri.currentUrl = function () {
            return location.href;
        }
        uri.validUrl = function(url) { return typeof url === "string" && url.match(url_pattern) ? true : false; }
        uri.go = function (url) {
            location.href = url ? url : uri.currentUrl();
        }
        uri.refresh = function () {
            uri.go();
        }
        uri.reload = function () {
            location.reload(true);
        }
        uri.parseURL = function (url) {
            var parser = document.createElement('a'),
                searchObject = {},
                queries, split, i;
            // Let the browser do the work
            parser.href = url?url:uri.currentUrl();
            // Convert query string to object
            if(parser.search.trim()){
                queries = parser.search.trim().replace(/^\?/, '').split('&');
                for( i = 0; i < queries.length; i++ ) {
                    split = queries[i].split('=');
                    searchObject[split[0]] = split[1];
                }
            }
            return {
                url       : parser.href,
                protocol  : parser.protocol,
                host      : parser.host,
                hostname  : parser.hostname,
                port      : parser.port,
                pathname  : parser.pathname,
                search    : parser.search,
                hash      : parser.hash,
                origin    : parser.origin,
                searchObject  : searchObject,
            };
        }
        uri.PCurrentUrl = uri.parseURL();
        return uri;
    })(window);

    var main = `
    $(window).unbind('onfocus onblur mouseleave');
    $(document).ready(function() {
        $(window).unbind('onfocus onblur mouseleave');
    });
    `;

    var script = document.createElement('script');
    script.appendChild(document.createTextNode(main));
    (document.body || document.head || document.documentElement).appendChild(script);
})(window);