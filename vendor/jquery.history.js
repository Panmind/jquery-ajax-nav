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

	var historyCurrentHash, historyCallback, historyNeedIframe;

	historyNeedIframe = $.browser.msie && ($.browser.version < 8 || document.documentMode < 8);

	var iframe;

	function iframe_init() {
		// add hidden iframe for IE
		iframe = $('<iframe src="javascript:false" style="display:none"/>');
		$('body').prepend(iframe);
		iframe = iframe[0];
	}

	function iframe_set(hash) {
		var doc = iframe.contentWindow.document;
		doc.open();
		doc.close();
		doc.location.hash = hash;
	}

	function iframe_get() {
		return stripQuery(iframe.contentWindow.document.location.hash);
	}

	function invokeCallback() {
		if (historyCurrentHash)
			historyCallback(historyCurrentHash.replace(/^#/, ''));
	}

	function stripQuery(s) {
		return s.replace(/\?.*$/, '');
	}

$.extend({

	historyInit: function(callback){
		historyCallback = callback;

		var hash = stripQuery(location.hash);
		
		if (historyNeedIframe) {
			// To stop the callback firing twice during initilization if no hash present
			if (hash == '')
				hash = '#';

			iframe_init();
			$.historySave(hash);
		}

		invokeCallback();

		setInterval($.historyCheck, 100);
	},

	historyCheck: function(){
		if (historyNeedIframe) {
			// On IE, check for location.hash of iframe
			var hash = iframe_get();

			if (hash != $.historyCurrent()) {
				$.historySave(hash);
				invokeCallback();
			}
		} else {
			// otherwise, check for location.hash
			var hash = stripQuery(location.hash);

			if (hash != $.historyCurrent()) {
				$.historySave(hash);
				invokeCallback();
			}
		}
	},

	historyLoad: function(hash){
		$.historySave(hash);
		invokeCallback();
	},

	historySave: function(hash) {
		hash = decodeURIComponent(stripQuery(hash))

		if (hash[0] != '#')
			hash = '#' + hash;

		historyCurrentHash = hash;
		
		if (historyNeedIframe) {
			iframe_set(hash);
		} else {
			location.hash = hash;
		}

		return historyCurrentHash;
	},

	historyCurrent: function(){
		return historyCurrentHash;
	}

});

})(jQuery);
