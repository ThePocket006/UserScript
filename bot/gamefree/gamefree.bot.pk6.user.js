// ==UserScript==
// @name          Gamefree Bot
// @namespace     http://github.com/ThePocket006
// @version       1.0
// @description   try to take over the world!
// @author        PK6
// @match         *://gramfree.today/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gramfree.today
// @updateURL    https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/gamefree/gamefree.bot.pk6.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/gamefree/gamefree.bot.pk6.user.js
// @grant         unsafeWindow
// @require       http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

// @require       https://cdn.jsdelivr.net/npm/sweetalert2/dist/sweetalert2.all.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/8.11.8/sweetalert2.all.min.js
// @require       https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js
// @require       https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js

(function(window) {
  'use strict';

  $(document).ready(function () {
      var EVENT_ROLL = 'PKE_ROLL';
      var rolling = false;

      var $event = $({});
      var timer = (function () {
          var timer = {};
          timer.toS = function (str) {
              if(typeof str === 'number') return str;
              else {
                  var p = str.split(':'),
                      s = 0, m = 1;

                  while (p.length > 0) {
                      s += m * parseInt(p.pop(), 10);
                      m *= 60;
                  }

                  return s;
              }
          }
          timer.toMS = function (str) {
              return timer.toS(str) * 1000;
          }

          return timer;
      })();
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

      var nextRollTime = null;
      var $nextRollTime = $('#next-roll-time');

      if(uri.currentUrl().indexOf("/videos") !== -1){
          $(window).unbind('mouseleave');
          var $watchFrame = $('#watch-frame');
          var $watchFrameTimer = $('#watch-frame .timer');
          var $watchBtn = $('.watch-btn');

          if($watchBtn.length > 0){
              var $watch = $($watchBtn.get(0));

              $watch.trigger('click');
          }else{
              //uri.go(uri.baseUrl('free'));
          }
          $watchFrameTimer.bind("DOMSubtreeModified", function (e) {
              $(window).unbind('mouseleave');
              var $this = $(e.target);
              var tmpstr = $this.text().trim();

              if(tmpstr && timer.toMS(tmpstr) <= 0){
                  setTimeout(uri.refresh(), 750);
              }
          });
      }else if(uri.currentUrl().indexOf("/free") !== -1){
      }

      $.ajax({
          type: 'GET',
          cache: false,
          url: uri.baseUrl('dashboard'),
          complete: function (req, textStatus) {
              var dateString = req.getResponseHeader('Date');
              if (dateString.indexOf('GMT') === -1) {
                  dateString += ' GMT';
              }
              var serverTime = (new Date(dateString)).getTime();
              console.info("Server Time: ", (new Date(serverTime)));
              console.log(req, textStatus);
          },
          success: function(rep){
              nextRollTime = timer.toS($(rep).find('div.card-body.time-roll > p.card-text.time-next-roll').text().trim()) * 1000;
              console.log("nextRollTime", nextRollTime);

              if(nextRollTime >= 0) {
                  console.log("TRIGGER ", EVENT_ROLL, " in", timer.toMS(nextRollTime));
                  //$event.trigger(EVENT_ROLL, timer.toMS(nextRollTime));
              }
          }
      });
  });

  var main = `
  $(window).unbind('mouseleave');
  $(document).ready(function() {
      $(window).unbind('mouseleave');
  });
  `;

  var script = document.createElement('script');
  script.appendChild(document.createTextNode(main));
  (document.body || document.head || document.documentElement).appendChild(script);
})(window);