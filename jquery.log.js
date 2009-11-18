/**
 * Utility helper that logs to the Firebug/WebKit console, but
 * only if it is available in the current browser.
 */
$.log = function (message) {
  if (typeof (console) != 'undefined' && typeof (console.log) == 'function')
    console.log (message);
};
