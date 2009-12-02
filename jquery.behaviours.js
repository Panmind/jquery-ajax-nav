// Panmind Wenlock - (C) 2009 Mind2Mind S.r.L.
//
// Behaviours library, reference documentation:
//
$.behaviourDocsURL = 'http://example.org/jquery.behaviours.html'
//
//   - vjt  Tue Nov 10 11:41:08 CET 2009
//

// Utility method that logs the given element into the console and
// throws an exception with the given message.
//
$.behaviourError = function (element, message) {
  $.log ($(element)[0]);

  throw ('BUG: ' + message + ' - Please see ' + $.behaviourDocsURL);
}

// The K combinator :-)
// TODO: move this aside from here
//
if (typeof (returning) == 'undefined') {
  function returning (ret, fn) {
    fn.call (ret);
    return ret;
  }
}

// This is convoluted, but necessary.
//
// Rationale: support finding items starting from the parent, without writing
// javascript code into the "rel" attribute. How we do it? With a convention:
// a starting ">" in the "rel" means "you have to traverse the DOM till the
// parent". The parent ID or CLASS is specified by a following "#" or ".".
// The PREFIX (will be extended to support any type of match) of the attribute
// content is immediately after the "#" or ".". The rest is the selector
// searched starting from the parent.
//
// SO: >#todo .uploader means: find a parent whose ID *STARTS WITH* "todo" and
// search inside it an element whose class is "uploader".
//
// hierarchy[1] = type of match: [ '#' || '.' ]
// hierarchy[2] = root prefix: \w+
// hierarchy[3] = selector: .* (optional)
//
//   - vjt  Wed Oct  7 19:16:52 CEST 2009
//
$.fn.hierarchyFind = function (selector) {
  var hierarchy = selector.match (/^>([#\.])(\w+)(.*)?/);

  if (hierarchy) {
    var attr = hierarchy[1] == '#' ? 'id' : 'class';
    var root = $(this).parents ('['+ attr +'^='+ hierarchy[2] +']');

    return (hierarchy[3] ? root.find (hierarchy[3]) : root);
  } else {
    return $(selector);
  }
};

// The fader optional behaviour, returns true if it's applied
//
$.fn.fader = function () {
  return $(this).hasClass ('fader');
};

// The slider optional behaviour, returns true if it's applied
//
$.fn.slider = function () {
  return $(this).hasClass ('slider');
};

(function () {
  // Slide toggling
  //
  // Overwrite jQuery's one, with a simple wrapper
  // with a predefinite speed ("fast")
  //
  var slideToggle = $.fn.slideToggle;
  $.fn.slideToggle = function () {
    var element = $(this);
    var speed   = arguments[0] || 'fast';

    return slideToggle.apply (this, [speed]);
  };

  // Fade toggling
  //
  // Implemented directly, with a predefinite speed
  // ("fast").
  //
  $.fn.fadeToggle = function () {
    var speed   = arguments[0] || 'fast';

    return this.each (function () {
      var element = $(this)

      if (element.is (':hidden'))
        element.fadeIn (speed);
      else
        element.fadeOut (speed);
    });
  };
})();

// The toggler
$('.toggler').live ('click', function () {
  var toggler  = $(this);
  var selector = toggler.attr ('rel');

  if (!selector)
    $.behaviourError (this, 'no "rel" attribute defined on the toggler!');

  var togglee = toggler.hierarchyFind (selector);

  // Explanation: check only the first element of a possibly multi-element
  // jQuery array, because we need only a on/off flag. As long as jQuery
  // returns elements always in the same order, this will keep working.
  //
  var visible = $(togglee[0]).is (':visible');

  toggler.trigger ({type: 'toggled', togglee: togglee, visible: visible});

  if (visible)
    toggler.addClass ('expanded');
  else
    toggler.removeClass ('expanded');

  if (toggler.slider ())
    togglee.slideToggle ();
  else if (toggler.fader ())
    togglee.fadeToggle ();
  else
    togglee.toggle ();

  var bubble = toggler.hasClass ('swapper');
  return bubble;
});

// The asker
$('.asker').live ('click', function () {
  var asker    = $(this);
  var question = asker.attr ('title');

  if (!question)
    $.behaviourError (this, 'no "title" attribute defined on the asker!');

  if (!asker.hasClass ('deleter'))
    return confirm (question);

  var deletee = asker.hierarchyFind (asker.attr ('rel'));

  deletee.dim ();
  returning (confirm (question), function (confirmation) {
    if (!confirmation)
      deletee.opaque ();
  });
});

// The deleter
/* Example usage of the `deleted` event:
 *
 *  // Remove the tag editor in show when all tags are removed
 *  $('.tagEditor .deleter').live ('deleted', function (event) {
 *    var deletee   = event.deletee[0];
 *    var labels    = event.deletee.siblings ();
 *    var tagEditor = event.deletee.parents ('.entryContent');
 *    var remaining = labels.filter (function () { return this != deletee; });
 *
 *    if (remaining.length == 0)
 *      tagEditor.slideUp (function () { tagEditor.remove () });
 *  });
 */
$('.deleter').live ('click', function () {
  var deleter  = $(this);
  var href     = deleter.attr ('href');
  var selector = deleter.attr ('rel');

  if (!selector)
    $.behaviourError (this, 'no "rel" attribute definite on the deleter!');

  // Animation speed
  var speed   = 'fast';
  var deletee = deleter.hierarchyFind (selector);

  deletee.dim ();

  var remove  = function () {
    deleter.trigger ({type: 'deleted', deletee: deletee});
    deletee.remove ();
    deletee.opaque ();
  };

  $.post (href, {'_method': 'delete'}, function (data, textStatus) {

    if (deleter.fader ())
      deletee.fadeOut (speed, remove);
    else
      remove ();

  });

  return false;
});

// The rollover
(function () {
  // Initialize the rollover, and save the referenced element
  // into a jQuery data(), keyed to "element", and return it.
  //
  function initialize (rollover) {
    var selector = rollover.attr ('rel');

    if (!selector)
      $.behaviourError (this, 'no element defined in the "rel" attribute of the rollover!');

    // Lazy caching of relative elements, to avoid multiple searches
    // when moving the mouse over the page. XXX Consider adding the
    // hoverIntent plugin, as suggested by Ferdinando.
    //
    if (!rollover.data ('element'))
      rollover.data('element', rollover.hierarchyFind (selector));

    return $(rollover.data ('element'));
  }

  // Unluckily, mouseenter and mouseleave aren't supported by .live (),
  // a solution is here
  //   http://groups.google.com/group/jquery-en/browse_thread/thread/d58da549d8199886
  // but it must be investigated before being applied
  //
  $('.rollover').live ('mouseover', function () {
    var rollover = $(this);
    var rollovee = initialize (rollover);

    if (rollover.fader ())
      rollovee.fadeIn ();
    else
      rollovee.show ();

  }).live ('mouseout', function () {
    var rollover = $(this);
    var rollovee = initialize (rollover);

    if (rollover.fader ())
      rollovee.fadeOut ();
    else
      rollovee.hide ();

  });
})();

// The swapper: swaps the element value with the element "alt" attribute.
//
$('.swapper').live ('click', function () {
  var swapper     = $(this);
  var alternative = swapper.attr ('alt');
  var current     = swapper.val ();

  if (!alternative)
    $.behaviourError (this, 'no alternative text defined in the "alt" ' +
                            'attribute of the swapper!');

  swapper.val (alternative);
  swapper.attr ('alt', current);

  return false;
});
