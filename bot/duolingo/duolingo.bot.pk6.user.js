// ==UserScript==
// @name          Duolingo Bot
// @namespace     http://github.com/ThePocket006
// @version       0.0.1
// @description   try to take over the world!
// @author        PK6
// @match         https://*.duolingo.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @updateURL     https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/duolingo/duolingo.bot.pk6.user.meta.js
// @downloadURL   https://raw.githubusercontent.com/thepocket006/UserScript/main/bot/duolingo/duolingo.bot.pk6.user.js
// @grant         unsafeWindow
// ==/UserScript==

(function(window) {
    'use strict';

    const document = window.document;

    const selectors = {
        levelBtns: 'button[data-test*="skill-path-level"]',
        trainingBtn: 'a[data-test*="skill-path-state-passed"]',
        solverBtn: 'button.auto-solver-btn.pause-btn',
        solveAllBtn: 'button#solveAllButton.auto-solver-btn.solve-btn',
        continuBtn: 'button._1rcV8._1VYyp._1ursp._7jW2t._2CP5-.MYehf._19taU._1E9sc',
    };

    // const levelBtns = document.querySelectorAll('button[data-test*="skill-path-level"]');
    // const trainingBtn = document.querySelectorAll('a[data-test*="skill-path-state-passed"]');
    // const solverBtn = document.querySelectorAll('button.auto-solver-btn.pause-btn');
    // const solveAllBtn = document.querySelectorAll('button#solveAllButton.auto-solver-btn.solve-btn');

    function dlp_exist() {
        return !!JSON.parse(localStorage.getItem("DLP_Local_Storage"));
    }

    console.log("Duolingo Bot");
    if(!dlp_exist()){
        console.log("DLP not found, bot will not run.");
        return;
    }else{
        console.log("DLP found, bot will run.");
        let i = setInterval(function(){
            const levelBtns = document.querySelectorAll(selectors.levelBtns);
            const continuBtn = document.querySelectorAll(selectors.continuBtn);

            if(levelBtns.length > 0){
                const trainingBtn = document.querySelector(selectors.trainingBtn);
                // const solverBtn = document.querySelector(selectors.solverBtn);
                // const solveAllBtn = document.querySelector(selectors.solveAllBtn);

                levelBtns[0].click();
                setTimeout(function(){ trainingBtn.click(); }, 200);
                setTimeout(function(){
                    const solveAllBtn = document.querySelector(selectors.solveAllBtn);

                    if(solveAllBtn && solveAllBtn.length > 0 && solveAllBtn[0].textContent.toLowerCase().trim() === 'solve all'){
                        solveAllBtn[0].click();
                    }
                }, 1000*1.5);
                // solverBtn.click();
                // solveAllBtn.click();
                // clearInterval(i);
            }

            if(continuBtn.length > 0){
                continuBtn[0].click();
            }

        }, 1000*5);
    }

  })(window);
