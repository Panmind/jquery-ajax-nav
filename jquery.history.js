/**
 * jQuery Awesome History Plugin
 * -----------------------------
 *
 * Copyright (C) 2006-2009 Taku Sano (Mikage Sawatari)
 * Copyright (C) 2009      Lincoln Cooper
 * Copyright (C) 2010      Marcello Barnaba
 *
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 *
 * Based on Taku Sano's jQuery History plugin, web page:
 *   http://www.mikage.to/jquery/jquery_history.html
 *
 * Modified by Lincoln Cooper to add Safari support and
 * only call the callback once during initialization for
 * MSIE when no initial hash supplied.
 *
 * Rewritten by Marcello Barnaba to make it more compatible
 * with IE quirks, more performant and more easy on the eyes.
 *
 */

(function ($) {
  var _current, _callback;

  $.history = {
    /**
     * Initializes AJAX history, the given callback will be called
     * when history changes.
     *
     * The core of the implementation is the setInterval argument,
     * that checks whether the current document hash has changed.
     * It gets called every 100ms.
     *
     * If we're running on MSIE, we need an iFrame to manipulate
     * history entries, more on this topic below.
     */
    init: function (callback) {
      _callback = callback;
      _current  = '#';

      if ($.browser.msie && ($.browser.version < 8 || document.documentMode < 8))
        _iframe.init ();

      else if ($.browser.opera)
        history.navigationMode = 'compatible';

      setInterval (function () {
        var hash;

        if (_iframe.inited)
          hash = _iframe.get ();
        else
          hash = location.hash || '#';

        hash = normalize (hash);

        if (!changed (hash))
          return;

        $.history.save (hash, false);
        invoke ();

      }, 100);
    },

    /**
     * Saves the given hash into history if it is different than
     * the one currently loaded and invokes the user provided
     * callback.
     */
    load: function (hash) {
      if (!hash)
        return;

      hash = normalize (hash)

      if (!changed (hash))
        return;

      $.history.save (hash);
      invoke ();
    },

    /**
     * Saves the given hash into history. Iff the second optional
     * argument is true, the current location hash (either in the
     * MSIE iFrame or in the addressbar) is not updated: it's set
     * true by the monitor function (called every 100ms) in order
     * to not alter the browser history stack when an user clicks
     * on the back or forward button.
     */
    save: function (hash, update) {
      hash = normalize (hash);

      if (!hash)
        return;

      if (update === undefined)
        update = true;

      if (update || _iframe.inited)  // On IE the hash must be always
        $.location.setAnchor (hash); // updated, as it doesn't create
                                     // new history entries

      if (update && _iframe.inited)  // But the iFrame must be updated
        _iframe.set (hash);          // only when it is needed because
                                     // it creates new history entries
      // $.log ("saving " + hash);
      _current = hash;
    },

    /**
     * Returns the currently loaded hash.
     */
    current: function () {
      return _current;
    }
  };

  //////////// Private ///////////////

  /**
   * Handle an iFrame object for IE. The theory behind using iFrames
   * is that, unlike other engines (Webkit, Gecko and Opera), IE doesn't
   * add new history entries when the location.hash is changed via JS:
   *
   * the only way to add history entries is to rewrite the contents of
   * an hidden iFrame, and that's what the following code does.
   *
   * You MUST have the following markup in your DOM:
   *   <iframe src="javascript:false" style="display:none" id="ie_history"></iframe>
   *
   * or an exception will be thrown.
   */
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

  var normalize = function (hash) {
    try {
      hash = decodeURIComponent (hash).replace (/[?&\/]+$/, '');
      return $.location.encodeAnchor (hash)
    } catch (e) {
      return undefined;
    }
  };

  var changed = function (hash) {
    if (hash && hash != 'false' && hash != _current) {
      return true;
    }
  };

})(jQuery);
