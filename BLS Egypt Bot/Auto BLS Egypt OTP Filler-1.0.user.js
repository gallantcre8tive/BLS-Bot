// ==UserScript==
// @name         Auto BLS Egypt OTP Filler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract BLS Spain OTP from Gmail and put into OTP Field
// @author       ABD TECH
// @match        https://mail.google.com/*
// @match       https://egypt.blsspainglobal.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';


    // Use Function to clear all old OTPs


    GM.deleteValue("OTP");

    let ISOTPFieldFilled = false;

    // Function to extract OTP from Gmail content
    async function extractOTP() {
        const bodyText = document.body.textContent;

        // Regex to find OTP
        const otpRegex = /Your verification code is as mentioned below\s*(\d{6})/;
        const match = otpRegex.exec(bodyText);

        if (match && match[1]) {
            const otp = match[1];
            // console.log("Extracted OTP:", otp);

            // Save OTP in Tampermonkey storage
            await GM.setValue("OTP", otp).then(() => {
                console.log("OTP saved in Tampermonkey storage!");
            });
        } else {
           // console.log("OTP not found in Gmail.");
        }
    }

    // Function to fetch OTP from Tampermonkey storage
    async function fetchOTP() {

        if (window.location.href.startsWith("https://egypt.blsspainglobal.com/")) {

            const otp = await GM.getValue("OTP", null); // Default value is null
            if (otp) {
                // console.log("Saved OTP Found:", otp);
                if (document.querySelector("#EmailVerificationCode") && ISOTPFieldFilled == false) {
                    document.querySelector("#EmailVerificationCode").value = otp;
                    ISOTPFieldFilled = true;
                    GM.deleteValue("OTP");
                    setTimeout(() => {
                        clearInterval();
                        if (document.querySelector("#btnVerifyEmail")) {
                            document.querySelector("#btnVerifyEmail").click();
                        }
                    }, 300);
                }
            } else {
              //  console.log("No OTP found in storage.");
            }

        }
    }



    // Run extraction every 5 seconds to check for new emails
    setInterval(extractOTP, 500);

    // Check storage every second
    setInterval(fetchOTP, 500);


})();
