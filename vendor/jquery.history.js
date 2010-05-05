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

	var historyCurrentHash, historyCallback;

	var iframe;
	function iframe_init(hash) {
		iframe = $('#ie_history')[0];
	}

	function iframe_set(hash) {
		try {
			var doc = iframe.contentWindow.document;

			doc.open();
			doc.write('<html><body>' + hash + '</body></html>');
			doc.close();

			$.log("iframe set to " + hash);
			return true;
		} catch (e) {
			return false;
		}
	}

	function iframe_get() {
		try {
			return iframe.contentWindow.document.body.innerText;
		} catch (e) { return ''; }
	}

	function invokeCallback() {
		if (historyCurrentHash)
			historyCallback(historyCurrentHash.replace(/^#/, ''));
	}

	function stripQuery(s) {
		return s.replace(/\?.*$/, '');
	}

	function changed(hash) {
		return (hash && hash != 'false' && hash != historyCurrentHash);
	}


	function monitor () {
		var hash;

		if (iframe)
			hash = stripQuery(iframe_get());
		else
			hash = stripQuery(location.hash);

		if (!changed(hash))
			return;

		$.history.save(hash, true);
		invokeCallback();
	}

	$.history = {
		init: function (callback) {
			historyCallback = callback;

			var hash = stripQuery (location.hash);
			if (hash == '')
				hash = '#';

			if ($.browser.msie && ($.browser.version < 8 || document.documentMode < 8))
				iframe_init (hash);

			else if ($.browser.opera)
				history.navigationMode = 'compatible';

			setInterval (monitor, 100);
		},

		load: function (hash) {
			if (!changed (hash))
				return;

			$.history.save (hash);
			invokeCallback ();
		},

		save: function (hash, skipIframe) {
			hash = decodeURIComponent (stripQuery (hash))

			if (!hash.match (/^#/))
				hash = '#' + hash;

			if (!changed (hash)) {
				$.log ("Skipping save of " + hash);
				return;
			}

			$.log ("Saving " + hash);
			historyCurrentHash = hash;

			location.hash = hash;

			if (iframe && !skipIframe)
				iframe_set (hash);
		},

		current: function () {
			return historyCurrentHash;
		}
	};

})(jQuery);
