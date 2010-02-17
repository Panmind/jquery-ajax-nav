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

$.extend({

	historyInit: function(callback){
		historyCallback = callback;

		var hash = stripQuery(location.hash);
		if (hash == '')
			hash = '#';
		
		if ($.browser.msie && ($.browser.version < 8 || document.documentMode < 8))
			iframe_init(hash);
		else if ($.browser.opera)
			history.navigationMode = 'compatible';

		setInterval($.historyCheck, 100);
	},

	historyCheck: function(){
		var hash;

		if (iframe)
			hash = stripQuery(iframe_get());
		else
			hash = stripQuery(location.hash);

		if (!changed(hash))
			return;

		$.historySave(hash, true);
		invokeCallback();
	},

	historyLoad: function(hash){
		if (!changed(hash))
			return;

		$.historySave(hash);
		invokeCallback();
	},

	historySave: function(hash, skipIframe) {
		hash = decodeURIComponent(stripQuery(hash))

		if (hash[0] != '#')
			hash = '#' + hash;

		if (!changed(hash)) {
			return;
		}

		historyCurrentHash = hash;
		
		location.hash = hash;

		if (iframe && !skipIframe)
			iframe_set(hash);
	},

	historyCurrent: function(){
		return historyCurrentHash;
	}

});

})(jQuery);
