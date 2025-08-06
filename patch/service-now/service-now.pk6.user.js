// ==UserScript==
// @name         Service-Now - PK Patch
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Auto refresh data on Service-Now
// @author       ThePocket006
// @createdAt    2024-04-26
// @updatedAt    2024-05-28
// @match        *://cupiaprod.service-now.com/*
// @match        *://*.service-now.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @updateURL    https://raw.githubusercontent.com/thepocket006/UserScript/main/patch/service-now/service-now.pk6.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/thepocket006/UserScript/main/patch/service-now/service-now.pk6.user.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js
// @require      https://cdn.jsdelivr.net/npm/underscore@1/underscore-min.js
// @require      https://unpkg.com/gm-storage@2.0.3
// @noframes
// ==/UserScript==

(function(window, $, Swal, _) {
    'use strict';

    function findRoots(ele) {
        return [
            ele,
            ...ele.querySelectorAll('*')
        ].filter(e => !!e.shadowRoot)
            .flatMap(e => [e.shadowRoot, ...findRoots(e.shadowRoot)])
    }

    function autoRefresh(s, a = '') {
        if($.isArray(a)) {
            a = a.join(', ');
        }

        if($.isArray(s)) {
            s = s.join(', ');
        }

        /*$.each([document, ...findRoots(window.document)], function(i, v){
            const $e = $(v).find(s);
            $e.length
             && ! $e.has(a)
             && $e.trigger('click')
             && console.log('findRoots', $e)
        });*/

        const doc = (function(){
            var d = [document, ...findRoots(window.document)];

            const r = {
                documents: d,
                find: function(selector, notSelect = '') {
                    /*const r =*/ return _.filter(_.flatten([_.map(r.documents, function(v){
                        const tmp = $(v).find(selector).not(notSelect);
                        return tmp.length ? tmp : undefined;
                    })]), function(v){
                        console.log(v)
                        return v !== undefined;
                    });
/**
                    console.log('doc::find', r);
                    return r;*/
                }
            };

            return r;
        })();

        _.each(doc.find(s, a), function($e, i){
            $e = $.prototype.isPrototypeOf($e) ? $e : $($e);

            $e.trigger('click');
            console.log('findRoots::click', $e);
        });

        autoActionRefresh(doc, a);
    }

    function autoActionRefresh(doc, a = ''){
        const actions = [
            ['div.navbar-header > button.icon-menu.navbar-btn', '.context_item[role="menuitem"][item_id="216ac28a0a0a0bb200af43eb879c30ae"]'],
            ['div.navbar-header > button.icon-menu.navbar-btn.additional-actions-context-menu-button', '.context_item[role="menuitem"][item_id][href^="reloadWindow"]']
        ];

        if($.isArray(a)) {
            a = a.join(', ');
        }

        console.log('autoActionRefresh')
        _.each(actions, function(v, i) {
            var selectors = [];
            _.each(v, function(value, index) {
                console.log('actions[' + i + '][' + index + ']: ', value);
                selectors.push(value);
                value = selectors.join(' ');
                const e = doc.find(value, a);

                console.log('autoActionRefresh:e:', e);
                e.length && setTimeout(function() {
                    _.each(e, function($e){
                        $e = $.prototype.isPrototypeOf($e) ? $e : $($e);
                        console.log('autoActionRefresh:run:', $e);

                        $e.trigger('click');
                        console.log('findRoots::click', $e);
                    })
                }, index * 150);
            });
        });
    }

    function add_css(){
        var css = `
        .pk-float{
	position:fixed;
	/*width:60px;
	height:60px;*/
	bottom:40px;
	right:40px;
	background-color:#0C9;
	color:#FFF;
	border-radius:50px;
	text-align:center;
	box-shadow: 2px 2px 3px #999;
}
        `;
        GM_addStyle(css);
    }

    function convertTime(seconds) {
        seconds = parseInt(seconds, 10);

        var hours   = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);

        seconds = seconds - (hours * 3600) - (minutes * 60);

        if ( !!hours ) {
            if ( !!minutes ) {
                return `${hours}h ${minutes}m ${seconds}s`
            } else {
                return `${hours}h ${seconds}s`
            }
        }
        if ( !!minutes ) {
            return `${minutes}m ${seconds}s`
        }
        return `${seconds}s`
    }

    function config(){
        const s = Swal.fire({
            title: "Reset time in second",
            input: "text",
            inputValue: refreshTime,
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Save",
            didOpen: function() {
                console.log('config:s', this, Swal.getInput());
                const $a = $(Swal.getInput());
                $a.after(`<div id='info' class='swal2-html-container text-muted'>${convertTime($a.val())}</div>`);

                const $b = $a.parent().find('#info');

                console.log('config:didOpen', {$a, $b}, convertTime($a.val()));

                $a.on('keyup', function(){
                    $b.text(convertTime($a.val()));
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Update
                const v = Math.abs(result.value);

                if(v !== NaN && v >= defaultRefreshTime) {
                    refreshTime = v;
                    storage.set(name.STORE_REFRESH_TIME, refreshTime);

                    time && clearInterval(time) && (time = undefined);
                    time = setInterval(refreshApp, 1000*refreshTime);
                }

                console.log('config:result:', result, refreshTime);
            }
        });
    }

    var time;
    const name = {
        STORE_INIT: 'STORE_INIT',
        STORE_REFRESH_TIME: 'STORE_REFRESH_TIME',
        STORE_HAS_SHADOWROOT: 'STORE_HAS_SHADOWROOT',
    };
    const storage = new GMStorage();
    const Toast = (function(){
        var toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        var r = {};

        $(['success', 'error', 'warning', 'info', 'question']).each(function(idx, val){
            r[val] = function(msg){
                toast.fire({
                    icon: val,
                    title: msg
                });
            }
        });

        return r;
    })();
    const start = function(){
        add_css();
        var $body = $($(document).find('body').get(0))

        if($body.find('#pk-settings > button.pk-float').length === 0) {
            $body.append("<div id='pk-settings' class='pk'><button class='pk-float'></button></div>");

            //var maxZindex = $('.now-modal-overlay, .layout-main, .header-bar, sn-polaris-header, .content-area, .core-main-content').getMaxZ();

            $body.find('#pk-settings > button.pk-float').on('click', function(){
                config();
            });
        }

        time = setInterval(refreshApp, 1000*refreshTime);
    }

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

    var validCheckUrl = function(){
        const path = uri.currentUrl().replace(uri.baseUrl, '');

        return [
            /\/now\/cwf\/agent\//i
        ].filter(function(v){ return v.test(path) }).length > 0;
    }

    const refreshApp = (function(){
        console.log({validCheckUrl: validCheckUrl()})
        if(validCheckUrl()) {
            // Exclude selector
            const a = ['[aria-label="Transmettre un commentaire"]', '[aria-label="Submit Feedback"]'];

            // Include selector
            const s = ['a[role=menuitem][ng-click^=refreshAllPane]', 'button.now-button[data-tooltip]', 'button[id=REFRESH_COMPONENT][title]', '.context_item[role="menuitem"][item_id="216ac28a0a0a0bb200af43eb879c30ae"]'];

            return function(){
                console.log('Refresh App', {validCheckUrl: validCheckUrl()});
                autoRefresh(s, a);
            }
        }else{
            console.log('Not refresh (not valid url)');
        }
    })()

    var defaultRefreshTime = 60*2,
        refreshTime = storage.get(name.STORE_REFRESH_TIME, defaultRefreshTime);

    $.fn.extend({
        getMaxZ : function(){
            return Math.max.apply(null, jQuery(this).map(function(){
                var z;
                return isNaN(z = parseInt(jQuery(this).css("z-index"), 10)) ? 0 : z;
            }));
        }
    });

    GM_registerMenuCommand('Settings', function() {
        config();
    });

    $(document).ready(function() {
        console.log('start service-now patch', {validCheckUrl: validCheckUrl()});
        setTimeout(start, 1000);
    });
})(unsafeWindow||window, jQuery||$, Swal, _);