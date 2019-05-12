/*jshint esversion: 6 */

// All input shunted to this function.
// Choose states and actions based on that input. 
// 
// 1) Link Quick-Selection w Timer
// 2) Omnibox wo Timer

var keyTimer = null;
var keyTimerCount = 0;
var keyTimerLength = 125;
var keyTimerOn = false;
var keyCombo = "";

function popUnpopTimer() {
    // If the state of the timer 
}

function prettyNumbers(num_) {
    strNum = String(num_);
    len = strNum.length;
    diff = 4 - len;
    for (var x = 0; x < diff; x++) {
        strNum = "0" + strNum;
    }
    return strNum;
}

function keyHandler(keyEvent) {

    var key = keyEvent.code.toLowerCase();

    // Pop / Unpop Omnibox
    if (key == "space") {
        if (keyEvent.ctrlKey == true) {
            ob.openCloseOmnibox(hardclose = true);
        } else {
            if (ob.boxState == ob.BOX_CLOSED) {
                keyEvent.preventDefault();
                ob.openCloseOmnibox();
                return;
            }
        }
    }


    // capture key combos
    if (ob.boxState == ob.BOX_CLOSED) {
        // Omnibox closed, use input to set cursor
        // and start / reset timer

        keyCombo += keyEvent.key.toLowerCase();
        lh.renderCursor(lh.getCursor(keyCombo));

        if (keyTimerOn) {
            // multiple keypresses, reset timer to full
            keyTimerCount = keyTimerLength;
            if (keyEvent.key == ";") {
                // cancel current operation
                clearInterval(keyTimer);
                keyTimerOn = false;
                keyTimerCount = 0;
                keyCombo = "";
            }
        }
        else {
            keyTimerOn = true;
            keyTimerCount = keyTimerLength;

            keyTimer = setInterval(function () {
                keyTimerCount -= 1;

                var kci = document.getElementById("keyComboInfo");
                kci.innerHTML = keyCombo;
                kci.innerHTML += "\t\t";
                kci.innerHTML += prettyNumbers(keyTimerCount);


                if (keyTimerCount <= 0) {
                    clearInterval(keyTimer);
                    keyTimerOn = false;
                    keyTimerCount = 0;

                    // if cursor set, go to website
                    if (lh.getCursor(keyCombo) !== undefined) {
                        link = "" + lh.getCursor(keyCombo)[0].href;
                        window.location = link;
                    }
                    // clear keycombo for next query
                    keyCombo = "";
                }
            }, 1);
        }
    } else {
        // Omnibox is open. Pass input to omnibox and step.
        ob.step(keyEvent);
        keyEvent.preventDefault();
    }
}
