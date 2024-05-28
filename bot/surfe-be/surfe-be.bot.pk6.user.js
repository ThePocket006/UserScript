// ==UserScript==
// @name         Surfe Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       PK6
// @match        *://surfe.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=surfe.be
// @updateURL    https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/surfe-be/surfe-be.bot.pk6.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/surfe-be/surfe-be.bot.pk6.user.js
// @grant         unsafeWindow
// ==/UserScript==

(function(window, $) {
    'use strict';
    console.log("Bot JQuery version: " + $.fn.jquery);
    var is = {
        null : function(el){ return el === null },
        NaN : function(el){ return Number.isNaN(el) },
        bool : function(el){ return typeof el === "boolean" },
        string : function(el){ return typeof el === "string" },
        function : function(el){ return typeof el === "function" },
        number : function(el){ return typeof el === "number" },
        object : function(el){ return typeof el === "object" && !this.null(el) },
        array : function(el){ return this.object(el) && el instanceof Array },
        undef : function(el){ return typeof el === "undefined" },
        false : function(el){ return el === false },
        true : function(el){ return el === true },
        or : function(){
            var test = true, is = this;

            $(arguments).each(function(el){
                if(is.false(el)){
                    test = false;
                    return test;
                }
            });

            return test;
        },
        and : function(){
        },
    };

    var uri = (function (window) {
            var uri = {};
            var location = !is.undef(window.location) ? window.location : location;
            var url_pattern = /^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?$/i;

            var geturl = function(url){
                console.log("geturl", uri);
                return ((is.string(url) && (url = url.trim())) || (is.object(url) && url.hasOwnProperty("href") && (url = url.href))) ? (uri.validUrl(url)?url:uri.baseUrl(url)):uri.currentUrl()
            }

            uri.baseUrl = function (pathname) {
                var parser = uri.parseURL(uri.currentUrl());
                var baseUrl = parser.origin ? parser.origin : location.origin;
                return baseUrl + (is.string(pathname) && (pathname = pathname.trim()) ? '/' + pathname : '');
            }
            uri.currentUrl = function () {
                return location.href;
            }
            uri.validUrl = function(url) { return is.string(url) && url.match(url_pattern) ? true : false; }
            uri.go = function (url) {
                location.href = geturl(url);
            }
            uri.refresh = function () {
                uri.go(uri.currentUrl());
            }
            uri.reload = function () {
                location.reload(true);
            }
            uri.parseURL = function (url) {
                // Let the browser do the work
                var _parser = document.createElement('a'), parser = {};

                _parser.href = geturl(url);

                $.extend(parser, _parser);
                return $.extend(parser, {
                    stl : parser.hostname.split('.').slice(-2)[0],
                    subdomain : (function(){
                        var tmp = parser.hostname.replace(parser.hostname.split('.').slice(-2), '');
                        return tmp;
                    })(),
                    searchObject  : (function(){
                        var searchObject = {}, queries, split, i;
                        // Convert query string to object
                        if(parser.search.trim()){
                            queries = parser.search.trim().replace(/^\?/, '').split('&');
                            for( i = 0; i < queries.length; i++ ) {
                                split = queries[i].split('=');
                                searchObject[split[0]] = split[1];
                            }
                        }
                        return searchObject;
                    })(),
                    setQuery : function(key, val){
                        if(parser.search.trim() && is.string(key) && key){
                            key = encodeURIComponent(key);
                            val = encodeURIComponent(val);

                            var search = this.search;
                            var kvp = key+"="+val;

                            var r = new RegExp("(&|\\?)"+key+"=[^\&]*");

                            search = search.replace(r,"$1"+kvp);

                            if(!RegExp.$1) {search += (search.trim().length>0 ? '&' : '?') + kvp;};

                            _parser.search = search;
                            parser = uri.parseURL(_parser.href);
                        }
                        return parser;
                    },
                    /*removeQuery : function(key){
                        var obj = this.searchObject;
                        if(this.hasQuery(key) && delete obj[key]){

                        }else return true;
                    },
                    hasQuery : function(key){
                    },*/
                });
            }
            return uri;
        })(window);

    $(document).ready(function(){
        console.log("/view-video/i", (/view-video/i).test(uri.parseURL().href));
        if((/view-video/i).test(uri.parseURL().href)){
            var $player = $("iframe#player");

            var interval = setInterval(function(){
                $player = $("iframe#player");
                if($player.length){
                    console.log("iframe detected");
                    clearInterval(interval);
                    $player.prop('src', uri.parseURL($player.prop('src')).setQuery("autoplay", 1).href);
                }else{
                    console.log("iframe not detected")
                }
            }, 1e3*3);
        }
    });
    // Your code here...
})((typeof unsafeWindow != 'undefined' ? unsafeWindow : window), jQuery);