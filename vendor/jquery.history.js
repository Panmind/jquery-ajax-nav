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

	function stripQuery(s) {
		return s.replace(/\?.*$/, '');
	}

$.extend({

	historyInit: function(callback){
		historyCallback = callback;
		var current_hash = stripQuery(location.hash);
		
		historyCurrentHash = current_hash;
		if (historyNeedIframe) {
			// To stop the callback firing twice during initilization if no hash present
			if (historyCurrentHash == '') {
				historyCurrentHash = '#';
			}
			iframe_init();
			iframe_set(current_hash);
		}

		if(current_hash)
			historyCallback(current_hash.replace(/^#/, ''));

		setInterval($.historyCheck, 100);
	},

	historyCheck: function(){
		if (historyNeedIframe) {
			// On IE, check for location.hash of iframe
			var current_hash = iframe_get();

			if(current_hash != historyCurrentHash) {
				location.hash = current_hash;
				historyCurrentHash = current_hash;
				historyCallback(current_hash.replace(/^#/, ''));
				
			}
		} else {
			// otherwise, check for location.hash
			var current_hash = stripQuery(location.hash);

			if(current_hash != historyCurrentHash) {
				historyCurrentHash = current_hash;
				historyCallback(current_hash.replace(/^#/, ''));
			}
		}
	},

	historyLoad: function(hash){
		$.historySave(hash);
		historyCallback(hash);
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
	}
});

})(jQuery);
