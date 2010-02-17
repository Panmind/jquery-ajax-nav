/*
 * jQuery history plugin
 * 
 * sample page: http://www.mikage.to/jquery/jquery_history.html
 *
 * Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified by Lincoln Cooper to add Safari support and only call the callback once during initialization
 * for msie when no initial hash supplied.
 */

(function ($) {
  var _current, _callback;

  $.history = {
    init: function (callback) {
      _callback = callback;

      var hash = stripQuery (location.hash);
      if (hash == '')
        hash = '#';

      if ($.browser.msie && ($.browser.version < 8 || document.documentMode < 8))
        _iframe.init (_current);

      else if ($.browser.opera)
        history.navigationMode = 'compatible';

      setInterval (function () {
        var hash;

        if (_iframe.inited)
          hash = stripQuery (_iframe.get ());
        else
          hash = stripQuery (location.hash);

        if (!changed (hash))
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

    save: function (hash, skipIframe) {
      hash = decodeURIComponent (stripQuery (hash))

      if (!hash.match (/^#/))
        hash = '#' + hash;

      if (!changed (hash)) {
        return;
      }

      _current = hash;

      location.hash = hash;

      if (_iframe.inited && !skipIframe)
        _iframe.set (hash);
    },

    current: function () {
      return _current;
    }
  };

  //////////// Private ///////////////

  var _iframe = {
    init: function (hash) {
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
      _callback (_current.replace(/^#/, ''));
  };

  var stripQuery = function (s) {
    return s.replace(/\?.*$/, '');
  }

  var changed = function (hash) {
    if (hash && hash != 'false' && hash != _current)
      return true;
  }

})(jQuery);
