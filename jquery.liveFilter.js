/**
 * Implements an Apple-like spotlight filter onto a
 * set of matched elements. Example usage:
 *
 * Markup:
 *
 *   <input type="text" id="searchInput" />
 *   <ul id="filterMe" pm:searchField="#searchInput">
 *     <li>some text</li>
 *     <li>some other text</li>
 *   </ul>
 *
 * JS:
 *
 *   $('#filterMe').liveFilter ();
 *
 * Now try inserting some text into the #searchInput
 * and watch the child elements of the #filterMe list
 * appear and disappear :-).
 *
 * Requires the underscore.js library, you can fetch
 * it at http://github.com/documentcloud/underscore/
 * and the jQuery UI library. Sorry, but if you're
 * not using those libraries you're missing a lot of
 * lovely code into your project :-).
 *
 * (C) 2010 Mind2Mind s.r.l, MIT license.
 * Spinned off the http://panmind.org website
 * Author: Marcello Barnaba <marcello.barnaba@gmail.com>
 */
$.fn.liveFilter = function () {
  return this.each (function () {
    var source = $(this);
    var search = $(source.attr ('pm:searchField'));
    var items  = source.children ();

    if (search.length == 0)
      throw "No pm:searchField attribute defined on " + source.attr ('id');

    // Contains an hash keyed by source elements' inner text,
    // for fast searching in the filter () function below.
    //
    items.txt =  _(items).reduce ({}, function (hash, node) {
      hash[$.trim ($(node).text ())] = node;
      return hash;
    });

    var timer  = null;
    var filter = function (q) {
      q = RegExp (q, 'i');

      return function () {
        var unmatched = [];

        for (str in items.txt)
          if (!q.test (str))
            unmatched.push (items.txt[str])

        items.show ();
        $(unmatched).hide ();
      };
    };

    search.keyup (function (event) {
      if (timer) {
        clearTimeout (timer);
        timer = null;
      }

      if (event.keyCode == $.ui.keyCode.ESCAPE)
        search.val ('');

      var q = $.trim (search.val ());
      if (!q)
        items.show ();
      else
        timer = setTimeout (filter (q), 250);
    });
  });
};
