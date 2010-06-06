/*
 * jQuery AJAX history plugin
 *
 * Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
 * Copyright (c) 2009-2010 Mind2Mind s.r.l.
 *
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified by Lincoln Cooper to add Safari support and only call
 * the callback once during initialization for msie when no initial
 * hash supplied.
 *
 * Rewrote by Marcello Barnaba (Mind2Mind) to DRY it up,
 * reduce the global JS namespace pollution and make the
 * code more readable.
 *
 * Part of Panmind.org AJAX Navigation Framework,
 * http://github.com/Panmind/jquery-ajax-nav.
 */

(function ($) {
  var _current, _callback;

  $.history = {
    init: function (callback) {
      _callback = callback;
      _current  = location.hash || '#';

      if ($.browser.msie && ($.browser.version < 8 || document.documentMode < 8))
        _iframe.init ();

      else if ($.browser.opera)
        history.navigationMode = 'compatible';

      setInterval (function () {
        var hash;

        if (_iframe.inited)
          hash = _iframe.get ();
        else
          hash = location.hash;

        if (!changed (hash || '#'))
          return;

        $.history.save (hash, true);
        invoke ();

      }, 100);
    },

    load: function (hash) {
      if (!changed (hash))
        return;

      $.history.save (hash);
      invoke ();
    },

    save: function (hash) {
      hash = $.location.encodeAnchor (hash)

      if (!changed (hash)) {
        $.location.__save (); // Better safe than sorry
        return;
      }

      var update = !arguments[1];
      if (update || _iframe.inited)  // On IE the hash must be always
        $.location.setAnchor (hash); // updated, as it doesn't create
                                     // new history entries

      if (update && _iframe.inited) // But the iFrame must be updated
        _iframe.set (hash);         // only when it is needed because
                                    // it creates new history entries
      _current = hash;
    },

    current: function () {
      return _current;
    }
  };

  //////////// Private ///////////////

  var _iframe = {
    init: function () {
      this.element = $('#ie_history')[0];

      if (this.element.length == 0)
        throw ('BUG: no "ie_history" element ID found in DOM!');

      if (this.element.src != 'javascript:false')
        throw ('BUG: the "ie_history" iFrame MUST have a src="javascript:false"');

      this.inited = true;
    },

    set: function (hash) {
      try {
        /* After initialization, IE doesn't save the current page,
         * but if it is saved DURING initialization, previous history
         * is lost. So we update the iFrame twice here, to preserve
         * the page visualized during initialization.
         */
        if (this.get () == 'false')
          this.write (_current);

        this.write (hash);
        return true;

      } catch (e) {
        return false;
      }
    },

    get: function () {
      try {
        return this.element.contentWindow.document.body.innerText;
      } catch (e) {
        return '';
      }
    },

    write: function (hash) {
      var doc = this.element.contentWindow.document;

      doc.open();
      doc.write('<html><body>' + hash + '</body></html>');
      doc.close();
    }
  };

  var invoke = function () {
    if (_current)
      _callback ($.location.decodeAnchor (_current));
  };

  var changed = function (hash) {
    if (hash && hash != 'false' && hash != _current)
      return true;
  }

})(jQuery);
