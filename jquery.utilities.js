// This file is part of the jQuery AJAX nav framework
//
// (C) 2009-2010 Mind2Mind s.r.l

/**
 * Utility helper that logs to the Firebug/WebKit console, but
 * only if it is available in the current browser.
 */
$.log = function (message) {
  if (typeof (console) != 'undefined' && typeof (console.log) == 'function')
    console.log (message);
};

/**
 * Utility helper that clones the given object and returns a
 * newly created one. WARNING: does not recursively copies
 * nested objects!
 */
$.clone = function (obj) {
  return combine ({}, function (copy) {
    for (key in obj) copy[key] = obj[key];
  });
};

/**
 * The K combinator :-)
 */
function combine (ret, fn) {
  fn (ret);
  return ret;
}
