// ==UserScript==
// @name          Dogeclick Bot
// @namespace     http://github.com/ThePocket006
// @version       1.0
// @description   try to take over the world!
// @author        PK6
// @match         *://dogeclick.com/visit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dogeclick.com
// @updateURL    https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/dogeclick/dogeclick.bot.pk6.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/dogeclick/dogeclick.bot.pk6.user.js
// @grant         unsafeWindow
// @block         https://dogeclick.com/assets/js/visit.js
// @block         https://dogeclick.com/assets/js/visit.min.js
// ==/UserScript==

// @run-at        document-end
// @require       https://dogeclick.com/assets/js/visit.js
// @require       https://dogeclick.com/assets/js/visit.min.js
// @require       http://code.jquery.com/jquery-latest.min.js
// @require       https://cdn.jsdelivr.net/npm/sweetalert2/dist/sweetalert2.all.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/8.11.8/sweetalert2.all.min.js
// @require       https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js
// @require       https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js
(function(window) {
    'use strict';
    var main = `
        var curr = curr ? curr : $('#headbar').data('curr');
        var started = started ? started: false;
        var timeleft;

        setTimeout(function () {
            start_timer();
        }, 4000);

        $('#iframe').on('load', function () {
            start_timer();
        });

        var start_timer = function () {
            if (started) {
                return false;
            }
            console.log("Dogeclick Bot");
            started = true;
            timeleft = parseInt($('#headbar').data('timer'));

            if (timeleft > 0) {
                $('.timer').text('Please wait ' + timeleft + ' second' + (timeleft != 1 ? 's' : '') + '...');

                // start timer
                setInterval(function () {
                    if (timeleft > 0) {
                        timeleft--;
                        $('.timer').text('Please wait ' + timeleft + ' second' + (timeleft != 1 ? 's' : '') + '...');
                    }
                    if (timeleft == 0 && started) {
                        started = false;
                        $('.timer').html('Loading...');
                        $.post(window.location.origin + "/reward", { code: $('#headbar').data('code'), token: $('#headbar').data('token') }).done(function (data) {
                            if (data.reward) {
                                setTimeout(window.close, 1e3);
                                var rewardMsg = data.reward + ' ' + curr;
                                if (curr == 'BTC') {
                                    rewardMsg += data.satoshi;
                                }
                                $('.timer').html('You earned ' + rewardMsg + '!');
                            } else {
                                $('.timer').html(data.error);
                            }
                        });
                        $('#remframe').removeAttr('target');
                    }
                }, 1000);
            }
        }
        window.start_timer = start_timer;
    `;

    var script = document.createElement('script');
    script.appendChild(document.createTextNode(main));
    (document.body || document.head || document.documentElement).appendChild(script);
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);