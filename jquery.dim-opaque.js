// Panmind Wenlock - (C) 2009 Mind2Mind S.r.L.
//

/**
 * This code implements .dim () and .opaque (), that
 * respectively disable and enable an HTML container
 * by putting on top of it an absolutely positioned
 * <div /> element created dynamically when the DOM
 * is ready. Its style could be altered via CSS, but
 * the defaults are set below. The ID of the created
 * element is "disabler".
 *
 * Also the utility method .offsetAndDimensions ()
 * is defined here, that returns the top/left offset
 * of an element from the $(document) and its width/
 * height dimensions in pixels.
 */
(function ($) {

var disabler;
var disablerID  = 'disabler';
var disablerCSS = {
  'z-index': 100,
  'opacity': 0.7,
  'background-color': '#fff'
};

/**
 * This element is a div that gets put on the element
 * interested by a .dim (), to inhibit the user to click
 * on its contents during an AJAX call.
 */
$(document).ready (function () {
  // Create the element and set required CSS properties
  //
  disabler = $('<div />')
    .attr ('id', disablerID)
    .css ({
      position: 'absolute',
      width: 0, height: 0,
      top: -9999, left: -9999
    });

  // Append it to the document, to inherit CSS from style sheets
  //
  $(document.body).append (disabler);

  // Update customizable properties
  //
  $.each (disablerCSS, function (key, value) {
    var custom = disabler.css (key);

    if (custom)
      disablerCSS[key] = custom;
  });

  disabler.css (disablerCSS);
});

/**
 * This method returns an object with the following properties
 *
 *  - width:  the element width
 *  - height: the element height
 *  - top:    the element top offset from the document
 *  - left:   the element left offset from the document
 *
 */
$.fn.offsetAndDimensions = function () {
  var element = $(this);

  return $.extend (element.offset (), {
    width : element.outerWidth (),
    height: element.outerHeight ()
  });
};

/**
 * This method puts the `disabler` div on the current
 * element and dims it to a default 70% opacity, thus
 * giving the user the impression that the underlying
 * element has a 30% opacity.
 *
 * You can dim to a different opacity by passing its
 * decimal value as the first argument.
 *
 * Returns jQuery.
 */
$.fn.dim = function () {
  var opacity    = arguments[0];
  var element    = $(this);
  var dimensions = element.offsetAndDimensions ();

  disabler.css (dimensions);

  if (opacity)
    disabler.css ({ opacity: opacity });

  disabler.show ();

  return this;
};

/** 
 * This method removes the `disabler` div, restoring
 * the UI to its full operativity.
 *
 * Returns jQuery.
 */
$.fn.opaque = function () {
  disabler.hide ();
  disabler.css (disablerCSS);

  return this;
};

})(jQuery);
