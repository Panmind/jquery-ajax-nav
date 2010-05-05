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

$.extend({
	historyCurrentHash: undefined,
	historyCallback: undefined,
	historyIframeSrc: undefined,
	historyNeedIframe: $.browser.msie && ($.browser.version < 8 || document.documentMode < 8),
	
	historyInit: function(callback, src){
		$.historyCallback = callback;
		if (src) $.historyIframeSrc = src;
		var current_hash = location.hash.replace(/\?.*$/, '');
		
		$.historyCurrentHash = current_hash;
		if ($.historyNeedIframe) {
			// To stop the callback firing twice during initilization if no hash present
			if ($.historyCurrentHash == '') {
				$.historyCurrentHash = '#';
			}
		
			// add hidden iframe for IE
			$("body").prepend('<iframe id="$_history" style="display: none;"'+
				' src="javascript:false;"></iframe>'
			);
			var ihistory = $("#$_history")[0];
			var iframe = ihistory.contentWindow.document;
			iframe.open();
			iframe.close();
			iframe.location.hash = current_hash;
		}
		else if ($.browser.safari) {
			// etablish back/forward stacks
			$.historyBackStack = [];
			$.historyBackStack.length = history.length;
			$.historyForwardStack = [];
			$.lastHistoryLength = history.length;
			
			$.isFirst = true;
		}
		if(current_hash)
			$.historyCallback(current_hash.replace(/^#/, ''));
		setInterval($.historyCheck, 100);
	},
	
	historyAddHistory: function(hash) {
		// This makes the looping function do something
		$.historyBackStack.push(hash);
		
		$.historyForwardStack.length = 0; // clear forwardStack (true click occured)
		this.isFirst = true;
	},
	
	historyCheck: function(){
		if ($.historyNeedIframe) {
			// On IE, check for location.hash of iframe
			var ihistory = $("#$_history")[0];
			var iframe = ihistory.contentDocument || ihistory.contentWindow.document;
			var current_hash = iframe.location.hash.replace(/\?.*$/, '');

			if(current_hash != $.historyCurrentHash) {
			
				location.hash = current_hash;
				$.historyCurrentHash = current_hash;
				$.historyCallback(current_hash.replace(/^#/, ''));
				
			}
		} else if ($.browser.safari) {
			if($.lastHistoryLength == history.length && $.historyBackStack.length > $.lastHistoryLength) {
				$.historyBackStack.shift();
			}
			if (!$.dontCheck) {
				var historyDelta = history.length - $.historyBackStack.length;
				$.lastHistoryLength = history.length;
				
				if (historyDelta) { // back or forward button has been pushed
					$.isFirst = false;
					if (historyDelta < 0) { // back button has been pushed
						// move items to forward stack
						for (var i = 0; i < Math.abs(historyDelta); i++) $.historyForwardStack.unshift($.historyBackStack.pop());
					} else { // forward button has been pushed
						// move items to back stack
						for (var i = 0; i < historyDelta; i++) $.historyBackStack.push($.historyForwardStack.shift());
					}
					var cachedHash = $.historyBackStack[$.historyBackStack.length - 1];
					if (cachedHash != undefined) {
						$.historyCurrentHash = location.hash.replace(/\?.*$/, '');
						$.historyCallback(cachedHash);
					}
				} else if ($.historyBackStack[$.historyBackStack.length - 1] == undefined && !$.isFirst) {
					// back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
					// document.URL doesn't change in Safari
					if (location.hash) {
						var current_hash = location.hash;
						$.historyCallback(location.hash.replace(/^#/, ''));
					} else {
						var current_hash = '';
						$.historyCallback('');
					}
					$.isFirst = true;
				}
			}
		} else {
			// otherwise, check for location.hash
			var current_hash = location.hash.replace(/\?.*$/, '');
			if(current_hash != $.historyCurrentHash) {
				$.historyCurrentHash = current_hash;
				$.historyCallback(current_hash.replace(/^#/, ''));
			}
		}
	},
	historyLoad: function(hash){
		var newhash;
		var call_back = typeof(arguments[1]) == 'undefined' ? true : !!arguments[1];
		hash = decodeURIComponent(hash.replace(/\?.*$/, ''));
		
		if ($.browser.safari) {
			newhash = hash;
		}
		else {
			newhash = '#' + hash;
			location.hash = newhash;
		}
		$.historyCurrentHash = newhash;
		
		if ($.historyNeedIframe) {
			var ihistory = $("#$_history")[0];
			var iframe = ihistory.contentWindow.document;
			iframe.open();
			iframe.close();
			iframe.location.hash = newhash;
			$.lastHistoryLength = history.length;
			if (call_back)
				$.historyCallback(hash);
		}
		else if ($.browser.safari) {
			$.dontCheck = true;
			// Manually keep track of the history values for Safari
			this.historyAddHistory(hash);
			
			// Wait a while before allowing checking so that Safari has time to update the "history" object
			// correctly (otherwise the check loop would detect a false change in hash).
			var fn = function() {$.dontCheck = false;};
			window.setTimeout(fn, 200);
			if (call_back)
				$.historyCallback(hash);
			// N.B. "location.hash=" must be the last line of code for Safari as execution stops afterwards.
			//      By explicitly using the "location.hash" command (instead of using a variable set to "location.hash") the
			//      URL in the browser and the "history" object are both updated correctly.
			location.hash = newhash;
		}
		else if (call_back) {
		  $.historyCallback(hash);
		}
	},
	historySave: function(hash) {
		$.historyLoad(hash, false);
	}
});

})(jQuery);
