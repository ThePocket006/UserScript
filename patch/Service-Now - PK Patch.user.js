// ==UserScript==
// @name         Service-Now - PK Patch
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  try to take over the world!
// @author       ThePocket006
// @match        *://cupiaprod.service-now.com/*
// @match        *://*.service-now.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js
// ==/UserScript==

(function(window, $, Swal) {
    'use strict';

    function findRoots(ele) {
        return [
            ele,
            ...ele.querySelectorAll('*')
        ].filter(e => !!e.shadowRoot)
            .flatMap(e => [e.shadowRoot, ...findRoots(e.shadowRoot)])
    }

    function autoRefresh(s){
        $.each([document, ...findRoots(window.document)], function(i, v){
            const $e = $(v).find(s.join(', '));
            $e.length && $e.trigger('click') && console.log('findRoots', $e)
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

    function config(){
        Swal.fire({
            title: "Reset time in second",
            input: "text",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Save"
        }).then((result) => {
            if (result.isConfirmed) {
                // Update
            }
        });
    }

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

    jQuery.fn.extend({
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

    $(document).ready(function(){
        var s = ['a[role=menuitem][ng-click^=refreshAllPane]', 'button.now-button[data-tooltip^=Actualiser]', 'button[id=REFRESH_COMPONENT][title^=Actualiser]'];

        add_css();
        $('body').append("<div id='pk-settings' class='pk'><button class='pk-float'></button></div>");

        //var maxZindex = $('.now-modal-overlay, .layout-main, .header-bar, sn-polaris-header, .content-area, .core-main-content').getMaxZ();

        $('#pk-settings > button.pk-float').on('click', function(){
            config();
        });

        console.log('');
        var time = setInterval(function(){
            console.log('Refresh App');
            autoRefresh(s);
        }, 1000*60*2);
    });
})(unsafeWindow||window, jQuery||$, Swal);