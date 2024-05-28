// ==UserScript==
// @name          Coinpros Bot
// @namespace     http://github.com/ThePocket006
// @version       1.0
// @description   try to take over the world!
// @author        PK6
// @match         *://coinpros.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinpros.co.uk
// @updateURL    https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/coinpros/coinpros.bot.pk6.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/coinpros/coinpros.bot.pk6.user.js
// @grant         unsafeWindow
// @require       http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

(function(window) {
    'use strict';
    /*
    * Some Options
    * This option can be update by you
    */
  
    /**
     * @baseUrl is a url of site
     * @videoEarUrl is a url where you execute your stask
     * @username
     * @password
     * @autoRefresh is true if you dont w
     */
    var baseUrl = "https://coinpros.co.uk",
        videoEarUrl = "auto",//"https://coinpros.co.uk/user/earn/video.aspx",
        numberOfvideo = "auto",//auto: autodetect the number of video
        username = null,
        password = null,
        autoRefresh = true,
        refreshEvery = 1000*60*30, //Time in milliseconds
        debug = {
          log   : true,
          info  : true,
          error : true,
          warn  : true,
        };
  
    /*
    * Do not change this part of code
    * Thank for your comprehention
    */
  
    /**
     * Helpers Code
     */
    // if (typeof Promise.prototype.done !== 'function') {
    //   Promise.prototype.done = function (onFulfilled, onRejected) {
    //     var self = arguments.length ? this.then.apply(this, arguments) : this
    //     self.then(null, function (err) {
    //       setTimeout(function () {
    //         throw err
    //       }, 0)
    //     })
    //   }
    // }
  
    /**
     * Code of Cbot
     */
    var Cbot = (function (window) {
      var EVENT_START_INIT_CBOT = 'EPK_START_INIT_CBOT',
          EVENT_END_INIT_CBOT = 'EPK_END_INIT_CBOT',
          EVENT_START_WATCHED = 'EPK_START_WATCHED',
          EVENT_STOP_WATCHED = 'EPK_STOP_WATCHED',
          SELECTOR_SIDEBAR_MENU_EARN = "#ctl00_SidebarMenu1_Earn6";
  
  
      var self = {},
          $self = $(self),
          $ssme = $(SELECTOR_SIDEBAR_MENU_EARN),
          botStarted = false,
          user = {name : username, pwd : password},
          params = {
            videoEarUrl   : videoEarUrl.toLocaleLowerCase().indexOf("auto") !== -1 && $ssme.find("a").prop('href').trim()? $ssme.find("a").prop('href').trim() : (self.uri.validUrl(videoEarUrl) ? videoEarUrl : null),
            numberOfvideo : typeof numberOfvideo === "string" && numberOfvideo.toLocaleLowerCase().indexOf("auto") !== -1 && $ssme.find(".badge").text().trim().match(/^\d+$/) ? parseInt($ssme.find(".badge").text().trim()) : parseInt(numberOfvideo) ,
            numOfVidToWash: function(){
              var t = parseInt($ssme.find(".badge").text().trim());
              return t >= 0 ? t : 0;
            },
            timeToPlay    : 1000*60,
            videoPlaying  : false,
            autoRefresh   : typeof autoRefresh === "boolean" ? autoRefresh : true,
            autoRefreshIn : typeof refreshEvery === "number" ? refreshEvery : 1000*60*30,
          },
          initialize = function (){
            console.log(self);
            if(self.uri.currentUrl().indexOf(self.uri.parseURL(baseUrl).hostname) === -1) {
              console.warn(self.name, 'impossible to init the bot.');
              return;
            }else{
              $self.trigger(EVENT_START_INIT_CBOT);
  
              self.ready(function () {
                $.ajax({
                  type: 'GET',
                  cache: false,
                  url: self.uri.currentUrl(),
                  complete: function (req, textStatus) {
                    var dateString = req.getResponseHeader('Date');
                    if (dateString.indexOf('GMT') === -1) {
                      dateString += ' GMT';
                    }
                    self.serverTime = (new Date(dateString)).getTime();
                    self.info("Server Time: ", (new Date(self.serverTime)));
                    setTimeout(function () { $self.trigger(EVENT_END_INIT_CBOT) }, 0);
                  }
                });
              });
            }
          };
  
      self.author = 'The Pocket 006';
      self.name = 'Coinpros Bot';
      self.version = '1.0';
      self.debug = {
        log   : typeof debug.log    != 'undefined' ? debug.log    : false,
        info  : typeof debug.info   != 'undefined' ? debug.info   : false,
        error : typeof debug.error  != 'undefined' ? debug.error  : false,
        warn  : typeof debug.warn   != 'undefined' ? debug.warn   : false,
      };
      self.serverTime = null;
      self.localTime = (new Date()).getTime();
      self.isReady = false;
      self.params = params;
  
      self.log    = self.debug.log    ? console.log.bind(console)   : function () {};
      self.info   = self.debug.info   ? console.info.bind(console)  : function () {};
      self.error  = self.debug.error  ? console.error.bind(console) : function () {};
      self.warn   = self.debug.warn   ? console.warn.bind(console)  : function () {};
  
      self.uri = (function (window) {
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
          parser.href = url;
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
        return uri;
      })(window);
  
      self.ready = function (callback) {
        $(document).ready(function () {
          var interval = setInterval(function () {
            if(self.isReady !== false) {
              clearInterval(interval);
              callback;
            }
          }, 100);
          setTimeout(clearInterval(interval), Math.floor(Math.random() * 90 + 110));
        });
      }
      self.start = function (params) {
        if(botStarted !== false) {
          self.info(self.name, " already started");
          return;
        } else {
          botStarted = true;
          start(params);
        }
      }
  
    var start = function (params) {
      params = self.params;
      var uri = self.uri;
      var listOfLink = [];
      //auto refresh
      var autoRefreshInterval = setInterval(function () { uri.refresh(); }, params.autoRefreshIn);
      var $buttomPlay = $("#player div.np_Controls-row.np_Controls-row--center > button");
      var $playTimer = $("#player div.np_Controls-row.np_Controls-row--bottom.np_Controls-row--info > div > span.np_TimerContent-current");
      var playTimer = 0;
  
      initialize();
      if(params.numOfVidToWash > 0){
        if(uri.currentUrl().indexOf(uri.parseURL(params.videoEarUrl).pathname) === -1){
          uri.go(params.videoEarUrl);
        }else if(! $.isEmptyObject(uri.parseURL(uri.currentUrl()).searchObject)){
          self.ready(function () {
  
          });
        }else{
          var $gallery = $('div.video-container.gallery'),
              $galleryLinks = $('div.video-container.gallery > div.row .image-inner a');
  
          $galleryLinks.each(function(k, v) {
            $(listOfLink).push($(v).prop('href').trim());
            if($galleryLinks.length == (k+1)){
              uri.go(listOfLink[Math.floor(Math.random()*listOfLink.length)]);
            }
          })
        }
      }
  
      //Event listnner
      $self.one(EVENT_START_INIT_CBOT, function () {
        self.log(self.name, " start initialization");
      }).one(EVENT_END_INIT_CBOT, function () {
        self.isReady = true;
        self.log(self.name, " is ready");
      }).one(EVENT_START_WATCHED, function () {
        $buttomPlay.trigger('click');
        params.videoPlaying = true;
      }).one(EVENT_STOP_WATCHED, function () {
        $buttomPlay.trigger('click');
        params.videoPlaying = false;
        uri.go(params.videoEarUrl);
      });
  
      $playTimer.bind("DOMSubtreeModified", function (e) {
        var $this = $(e.target);
        var tmp = $this.text().trim().split(':');
  
        playTimer = (parseInt(tmp[0])*60 + parseInt(tmp[1])) * 1000;
        if(playTimer >= params.timeToPlay){
          $self.trigger(EVENT_STOP_WATCHED);
        }
      });
    }
    return self;
  })(window);
  
  Cbot.start();
  })(typeof unsafeWindow != 'undefined' ? unsafeWindow : window);