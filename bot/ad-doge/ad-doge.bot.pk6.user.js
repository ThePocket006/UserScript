// ==UserScript==
// @name          AD-Doge Bot
// @namespace     http://github.com/ThePocket006
// @version       1.0
// @description   try to take over the world!
// @author        PK6
// @match         *://ad-doge.com/*
// @match         *://litecoinads.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ad-doge.com
// @updateURL    https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/ad-doge/ad-doge.bot.pk6.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/ad-doge/ad-doge.bot.pk6.user.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @grant         unsafeWindow
// @require       https://cdn.jsdelivr.net/npm/moment/moment.min.js
// @require       http://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

// @require       https://raw.githubusercontent.com/ThePocket006/jquery-observe/master/jquery-observe.js
// @require       https://raw.githubusercontent.com/ThePocket006/jquery-mutationobserver/master/jquery.mutationobserver.min.js

(function(window, $) {
    'use strict';
    console.log("Bot JQuery version: " + $.fn.jquery, this);
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

    var $event = $({}),
        EVENT_PK_FRAME_READY = 'PK_FRAME_READY',
        data = (function(){
            var dname = ('data_' + uri.parseURL().stl).toLowerCase();

            console.log("dname: ", dname);

            // console.log("GM_deleteValue:", GM_deleteValue('data'));
            console.log("GM_listValues:", GM_listValues());
            console.log(`GM_getValue ${dname}:`, GM_getValue(dname));
            //console.log("Delete GM_deleteValue data:", GM_deleteValue('data'));
            var vl = function (playBtn){
                var vl = {};

                vl.baseuri = '';
                vl.visited = {};
                vl.videolnk = [];
                vl.videolnk.at = null;
                vl.selector = {playBtn : playBtn};
                vl.getLnk = function(index) {return $(vl.videolnk).get(index)}
                vl.getRandLnk = function() {return vl.getLnk(Math.floor(Math.random() * vl.videolnk.length))}
                vl.extend = function(obj){
                    return $.extend(vl, obj);
                }

                return vl.extend({
                    is: {alreadyearn: false, refreshable: true},
                    visited: {nextAt: moment().add(1, 'day').unix(), at: moment().unix()},
                    at: moment().unix(),
                    save: function(){
                        var that = this;
                        $.when($(arguments).each(function(k, v){
                            if(is.object(v)){
                                for (const key in v) {
                                    if (that.hasOwnProperty(key)) {
                                        that[key] = v[key];
                                    }else if (that.is.hasOwnProperty(key)) {
                                        that.is[key] = v[key];
                                    }
                                }
                            }
                        })).then(function(){
                            (this.visited.nextAt = moment().add(1, 'day').unix()) && (this.visited.at = moment().unix()) && data.save();
                        });
                    }
                });
            }

            var _data = function(){
                return {
                    autorun : null,
                    link : {
                        account : 'user/default.aspx',
                        earn : {video:'user/earn/video.aspx', youtube:'user/earn/youtube.aspx'},
                    },
                    selector : {
                        player : "iframe#player"
                    },
                    dm : vl('iframe#player button.np_button.np_ButtonPlayback'),
                    yt : vl('iframe#player'),
                    at : moment().unix(),
                    is : {
                        Yt : (/youtube/i).test(uri.parseURL().pathname),
                        earnVidPage : (/(video|youtube)\.aspx/i).test(uri.parseURL().href),
                        listpage : (/(video|youtube)\.aspx$/i).test(uri.parseURL().href),
                        loginpage : (/(login\.aspx)/i).test(uri.parseURL().href),
                        vidpage : is.object(uri.parseURL().searchObject) &&  uri.parseURL().searchObject.hasOwnProperty('v'),
                        earnable : function(){ return is.false(data.dm.is.alreadyearn) && is.false(data.yt.is.alreadyearn) },
                        extend : function(obj){
                            _data.is = $.extend({}, obj, this);
                            return this;
                        }
                    },
                    save : function(){
                        console.log(`Bot save data "${dname}" >>`, this);
                        return GM_setValue(dname, this.extend({at: moment().unix()}));
                    },
                    nextLnk: function(){
                        return is.false(this.dm.is.alreadyearn) ? this.dm.baseuri : (is.false(this.yt.is.alreadyearn) ? this.yt.baseuri : this.link.account);
                    },
                    goNextLnk: function(){
                        var test = !is.loginpage || !is.earnVidPage;
                        return test && uri.go(this.nextLnk());
                    },
                    extend: function(obj){
                        for (const i in obj) {
                            if (obj.hasOwnProperty(i)) {
                                console.log("extend", i, this[i]);
                                if(is.object(this[i]) && this[i].hasOwnProperty("extend")) this[i].extend(obj[i]);
                                else this[i] = obj[i];
                            }
                        }
                        return this;
                    }
                }
            }();

            _data.extend(GM_getValue(dname, {}));
            _data.dm.baseuri = _data.link.earn.video;
            _data.yt.baseuri = _data.link.earn.youtube;
            _data.dm.is.refreshable = (_data.dm.videolnk.length === 0 || moment(_data.dm.videolnk.at).isBefore(moment(), 'day'));
            _data.yt.is.refreshable = (_data.yt.videolnk.length === 0 || moment(_data.yt.videolnk.at).isBefore(moment(), 'day'));
            _data.dm.is.alreadyearn = (moment(_data.dm.visited.at).isBefore(moment(), 'day')?false:data.dm.is.alreadyearn);
            _data.yt.is.alreadyearn = (moment(_data.yt.visited.at).isBefore(moment(), 'day')?false:data.yt.is.alreadyearn);

            $.extend(is, _data.is, {dm : _data.dm.is, yt : _data.yt.is});

            return _data;
        })();

    moment(data.at).add(2, 'day').isBefore(moment(), 'day') && data.save();
    is.null(data.autorun) && (data.autorun = confirm("Voulez-vouz démarer le bot automatiquement au chargement de la page?")) && data.save();

    console.log("test", data.autorun, data.nextLnk() !== data.link.account, data.nextLnk());
    //data.autorun && is.earnable() && !is.earnVidPage && data.goNextLnk();

    if(is.earnVidPage){
        $(function(){
            var video = data[is.Yt ? 'yt' : 'dm'];
            var uvideo = data[is.Yt ? 'dm' : 'yt'];

            if(is.listpage){
                if(video.is.refreshable){
                    var $earn = $('#content .tab-content a[href*="user/earn"]');
                    video.videolnk = [];
                    $earn.length && $.when($earn.each(function(){
                        var href = $(this).prop('href');
                        (video.videolnk.indexOf(href) === -1) && video.videolnk.push(href);
                    })).then(function(){
                        video.videolnk.at = moment().unix();
                        data.save();
                        uri.go(video.getRandLnk());
                    });
                }else{
                    uri.go(video.getRandLnk());
                }
            }else if(is.vidpage && !video.is.alreadyearn){
                video.is.refreshable && uri.go(video.baseuri);
                var $panelS = $("#ctl00_PageMainContent_SuccessMessagePanel");
                var $panelE = $("#ctl00_PageMainContent_ErrorMessagePanel");
                var $player = $(data.selector.player);
                var $playBtn = $(video.selector.playBtn);

                var interval = setInterval(function(){
                    $player = $(data.selector.player);
                    if($player.length){
                        console.log("iframe detected");
                        clearInterval(interval);
                        $playBtn = $(video.selector.playBtn);
                        $event.trigger(EVENT_PK_FRAME_READY);
                    }else{
                        console.log("iframe not detected")
                    }
                }, 1e3*3);
                $event.on(EVENT_PK_FRAME_READY, function(e){
                    $player.prop('src', uri.parseURL($player.prop('src')).setQuery("autoplay", 1).href);

                    //if(is.Yt) setTimeout(function(){$playBtn.trigger('click')}, 1e3*2);
                    console.log("video:", video);
                    $(window).trigger('focus');
                    $(window).on('blur', function(){$(window).trigger('focus');});

                    setTimeout(function(){
                        uri.go(video.getRandLnk());
                    }, 1e3*(Math.floor(Math.random()*61) + 62));

                    var i = setInterval(function(){
                        $panelS = $panelS.length?$panelS:$("#ctl00_PageMainContent_SuccessMessagePanel");
                        $panelE = $panelE.length?$panelE:$("#ctl00_PageMainContent_ErrorMessagePanel");

                        if($panelS.text().trim()){
                            clearInterval(i);
                            uri.go(video.getRandLnk());
                        }else if($panelE.text().trim()){
                            clearInterval(i);
                            video.save({alreadyearn: true});
                            uri.go(uvideo.is.alreadyearn?data.link.account:uvideo.baseuri);
                        }
                    }, 250);

                    /*$panelS.parent().bind('DOMSubtreeModified', function(e){
                        uri.go(video.getRandLnk());
                    });*/
                });
            }else{
                data.goNextLnk();
            }
        });
    }
})((typeof unsafeWindow != 'undefined' ? unsafeWindow : window), jQuery);