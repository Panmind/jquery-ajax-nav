// Panmind Pridoli - (C) 2009-2010 Mind2Mind S.r.L.
//

/**
 * jQuery AJAX navigation framework, with history, forms and UI
 * disabling support.
 *
 * The big picture
 * ===============
 *
 * Markup
 * ------
 *
 *   <a href="/base/resource/id" class="nav">navLink</a>
 *
 *   <form id="foo" action="/base/resource/id" method="post">
 *     ...
 *   </form>
 *
 *   <div id="container"></div>
 *
 * Code
 * ----
 *
 *   $.navInit ({
 *     container: '#container',
 *     base     : '/base'
 *   });
 *
 *   $(document).ajaxInit (function () {
 *     $('a.nav').navLink ();
 *     $('#foo').navForm ();
 *   });
 *
 * Different options can be passed to navInit, navLink and navForm.
 * Options passed to navInit are defaults, that you can override on
 * a specific link/form by passing them to navLink () and navForm().
 *
 * See below for a detailed explanation of each option.
 *
 * Code flow
 * =========
 *
 * .navLink () adds a .click () behaviour to the link, that loads
 * the server response into the #container and updates the document
 * location adding an anchor containing the link href minus the /base.
 *
 * .navForm () behaves similarly, but adds a .submit () behaviour, and
 * behaves differently depending on the form method: see .navForm ()
 * documentation below.
 *
 * When the content starts loading, a custom "nav:unloading" event
 * is triggered on the document, unless this is the first page load
 * load (as determined by history).
 *
 * When the content is loaded, another custom "nav:loaded" event is
 * triggered on the whole document, again: conceptually equivalent to
 * jQuery's .ready () event.
 *
 * To listen on these events, use `ajaxReady` and `ajaxUnload`. Also,
 * the `ajaxInit` helper binds to the "nav:loaded" event using .one().
 *
 * To optimize loading, your additional listeners bound via .live ()
 * SHOULD be initialized into a
 *
 *   $(document).ajaxInit (function (event, nav) { ... });
 *
 * listeners that, instead must be bound without .live () MUST be
 * initialized into a
 *
 *   $(document).ajaxReady (function (event, nav) { ... });
 *
 * listeners that do clean-ups of the page, stop timers, etc, MUST
 * be initialized into a
 *
 *   $(document).ajaxUnload (function (event, nav) { ... });
 *
 * navLink ()/navForm () are bound using .live () by default.
 *
 * The custom event handlers receive a object with "loader" and
 * "navOptions" as their second argument. The loader is the DOM
 * element, wrapped into a jQuery, that triggered the AJAX load.
 *
 * If the load was triggered by other means (e.g. history, user
 * manually changing the fragment in the address bar, automatic
 * loading of the "root" page), the loader will be the "window"
 * object.
 *
 * Available options
 * =================
 *
 *  - container: String or jQuery (required)
 *               the target container of the AJAX load. It MUST
 *               be a single element, or an exception will be thrown
 *
 *  - base:      String or RegExp (required)
 *               the base path of the links, such as "/example/" or
 *               "/\/project\/\d\/?/"
 *
 *  - replace:   Boolean (optional, default: false)
 *               by default, the container is filled with the response
 *               returned by the server (using .html ()). If this option
 *               is true, the container is replaced with the server
 *               response (using .replaceWith ()).
 *
 *  - append:    Boolean (optional, default: false)
 *               if true, the response is appended to the container HTML
 *
 *  - prepend:   Boolean (optional, default: false)
 *               if true, the response is prepended to the container HTML
 *
 *  - root:      String (optional, default: none)
 *               the default URL path to load upon initialization,
 *               if no anchor is requested by the user.
 *               If it is undefined, no automatic loading occurs.
 *
 *  - live:      Boolean (optional, default: true)
 *               if true, the behaviour is attached using jQuery's
 *               .live (), so that new elements that appear on the
 *               page inherit the AJAX load behaviour.
 *
 *  - noEvents:  Boolean (optional, default: false)
 *               if true, no nav:loaded event is triggered upon load
 *               load completion nor a nav:unloading is fired when
 *               loading start. Useful for light actions that alter
 *               just a single, isolated element of the page.
 *
 *  - noHistory: Boolean (optional, default: false)
 *               do not alter history after a successful load.
 *
 *  - noUpdate:  Boolean (optional, default: false)
 *               do not alter `container` contents after a successful
 *               AJAX load.
 *
 *  - noDisable: Boolean (optional, default: false)
 *               do not disable the user interface by calling .dim ()
 *               on the container when the AJAX load starts.
 *
 *  - loading:   Function (optional)
 *               a callback fired when loading starts.
 *               Inside the callback, "this" is set to the HTML
 *               element that triggered the AJAX load.
 *
 *  - success:   Function (optional)
 *               a callback fired when data load is complete
 *               with a "success" status (in the 200-299 range).
 *               Inside the callback, "this" is set to the HTML
 *               element that triggered the AJAX load.
 *
 *  - error:     Function (optional)
 *               a callback fired when there is an error.
 *               Inside the callback, "this" is set to the HTML
 *               element that triggered the AJAX load.
 *
 *  - complete:  Function (optional)
 *               a callback fired when the request is complete,
 *               after the `error` and `success` callbacks have
 *               been executed.
 *
 *  - method:    String (optional)
 *               the HTTP method to use when loading. Can be
 *               'get', 'post', 'put' or 'delete'.
 *
 *  - href:      String (optional)
 *               the URL path to load into the .container. If it's not
 *               set, it'll be extracted from the link href attribute or
 *               the form action attribute.
 *
 * Hijacking
 * =========
 *
 * In order to handle redirection from deep resource URIs to
 * anchor-base ones (e.g. from
 *
 *   http://example.com/projects/1/writeboards/42
 *
 * to
 *
 *   http://example.com/projects/1#writeboards/42
 *
 * ) you should pass the links you want to be hijacked via the
 * $.navHijack () method: any link matching the base paths you
 * pass to it will be split into two parts and the slash that
 * separates 'em will be replaced by a '#'.
 *
 * E.g.:
 *
     $.navHijack ([ '/projects/\\d+', '/search' ]);
 *
 * Moreover, to optimize loading time, a cookie named "nha"
 * (that stands for NavHijAck.. but is also the nick of the
 * beloved one ;-) will be set on the hijacked path, with a
 * 1000ms expiration time.
 *
 * The backend can, thus, render only a spinner to display
 * to the user while this code loads the page contents via
 * a subsequent AJAX request.
 *
 * E.g.:
 *
    def render_spinner_if_hijacked
      render :template => '/loading' if cookies['nha'] == '1'
    end
 *
 * And in your controller:
 *
    class FooController < ApplicationController
      before_filter :render_spinner_if_hijacked

      # ... your code
    end
 *
 * Known issues
 * ============
 *
 * TODO: proper error handling, the foundation is implemented but still lacks.
 * FIXME: currently AJAX file uploads aren't supported
 * IDEA: how about making the "/base" optional?
 *
 *   - vjt  Sun May 16 18:03:05 CEST 2010
 */

(function ($) {

/**
 * Default options for every AJAX load
 */
$.navDefaultOptions = {};

/**
 * Low-level interface to AJAX loading. Does not validate the
 * options passed to it. This method implements all the heavy
 * lifting needed of the AJAX load.
 *
 * In the following description, each word enclosed by backticks
 * (`) refers to an option passed to the .navLink/.navForm.
 *
 *  - Dims the `container`
 *  - Fires the `loading` callback
 *  - Logs the details of the request to the Firebug console
 *  - Calls $.ajax with the given options
 *  - Iff the request `method` is 'get', updates the location
 *    anchor using $.location.setAnchor () and removing the
 *    `base` from the `href`
 *  - Iff the response code is *202* (accepted), this method
 *    assumes that the response is be a String that contains
 *    a path to redirect to: `params` is nullified, `method`
 *    is set to "get" and eventually the returned String is
 *    loaded, without updating the location anchor.
 *
 *    The associated Rails' helper that implements the 202
 *    code response could be named "ajax_redirect_to", a
 *    valid implementation is as follows:
 *
 *       def ajax_redirect_to(path)
 *         if request.xhr?
 *           render :text => path, :status => 202 # Accepted
 *         else
 *           redirect_to path
 *         end
 *       end
 *
 *  - If an error occurs, an alert () is shown (temporarily),
 *    and the `error` callback is fired if defined. If not,
 *    the container is updated with the bare "Error XXX" string.
 *    THIS IS TEMPORARY! :-)
 *    defined
 *  - Triggers the 'nav:loaded' event on the whole document
 *  - Opaques the `container`
 *
 * @param loader jQuery:  The trigger of this AJAX load
 *
 * @param options Object: options for this load, with the following
 *                        differences from what is documented above
 *
 *   - href:     String (required)
 *               the URL to be loaded.
 *
 *   - params:   Object (optional)
 *               additional query string / post data parameters
 */
$.navLoadContent = function (loader, options) {
  var method = (options.method || 'get').toLowerCase ();
  var response = null, error = null;

  if (typeof (options.container) == 'function')
    options.container = options.container.apply (loader);

  // Uhm. This could be heavy, and should be moved into a separate function
  // called by both navForm () and navLink ().
  //
  // This conditional checks whether the options.container exists on the page,
  // because it could not be rendered yet when the navLink/Form () is invoked,
  // as implemented in the private __validateOptions () method.
  //
  // Moreover, the container could disappear, e.g. when it is replaced by some
  // other code: that's why the `length` check is performed on the `parent ()`
  // because an element that has no parent () has been removed from the DOM.
  //
  if (options.container.parent ().length == 0) {
    // $.log ('AJAX nav: reloading container ' + options.container.selector);
    options.container = $(options.container.selector);

    // Still missing? Hey, this is a bug!
    if (options.container.length == 0) {
      $.log ('AJAX nav BUG: target DOM element ' + options.container.selector +
               ' not found, even after trying to re-select it before AJAX load');
      return false;
    }
  }

  if (!options.noHistory && $.history.current () && !options.noEvents)
    $(document).trigger ('nav:unloading', {
      navOptions: options,
      loader    : loader
    });

  // Let's begin the party...
  //
  $.ajax ({
    type   : method,
    url    : options.href,
    data   : options.params,

    // Dim the container, trigger nav:unloading on the document, call the
    // `loading` callback and log debug details to the console.
    //
    beforeSend: function (xhr) {
      if (!options.noDisable)
        options.container.dim ();

      __invoke ('loading', options, loader);

      // if (typeof (options.toSource) == 'function')
        // $.log ('loading ' + options.href + '(' + options.toSource () + ')');
    },

    // YAY! Save the response for further processing
    //
    success: function (data, textStatus) {
      response = data;
    },

    // Oh noes! Save the error for further processing
    //
    error: function (xhr, textStatus, thrownError) {
      error = textStatus;
    },

    // Let's end the party...
    //
    complete: function (xhr, textStatus) {
      if (xhr.status == 202) {
        // OK, not quite yet: this is a redirect that'll start
        // another AJAX-party...
        //
        // $.log ("202-redirecting to '" + response + "'");

        options.href   = response;
        options.method = 'get';
        options.params = null;

        $.navLoadContent (loader, options);
        return;

      } else if (response) {
        // OK, everything right. If the user doesn't want to update
        // the container, pass the response to the `success` callback.
        //
        // Else, update the location and the history (to avoid double
        // loads), and trigger the `success` and the `contentLoaded`
        // events.
        //
        // Eventually, opaque () the container back.
        //
        if (options.noUpdate) {
          options.response = response;
        } else {
          if (options.replace)
            options.container.replaceWith (response);
          else if (options.append)
            options.container.append (response);
          else if (options.prepend)
            options.container.prepend (response);
          else
            options.container.html (response);
        }

        if (method == 'get' && !options.noHistory) {
          var save = decodeURIComponent (options.href)
                      .replace ($.navDefaultOptions.urlRE, '');
          // Don't save into the history the parameter that informs the
          // backend that this request comes from history.
          //
          $.history.save (save.replace (/[\?&]_h_=/, ''));
        }

        __invoke ('success', options, loader)

        if (!options.noEvents)
          $(document).trigger ('nav:loaded', {
            navOptions: options,
            loader    : loader
          });

      } else if (error) {
        // Something went wrong, call user-defined callbacks
        // and opaque () the container back.
        //
        options.response  = xhr.responseText;
        options.lastError = { xhr: xhr, message: error }; // XXX
        __invoke ('error', options, loader);
      }

      if (!options.noDisable)
        options.container.opaque ();

      __invoke ('complete', options, loader);
      options.lastError = undefined;                      // XXX
    }

  });
};

/**
 * Public API for AJAX-loaded links, implemented as a jQuery extension
 * function.
 *
 * @param options Object: for reference, see "Available options" above
 *
 */
$.fn.navLink = function (options) {
  options = __validateOptions (options, this);

  var listener = function (event) {
    if (event.isPropagationStopped ())
      return false;

    var link = $(this);
    var args = $.clone (options);

    if (!args.href)
      args.href = link.attr ('href');

    $.navLoadContent (link, args);

    return false;
  };

  if (options.live)
    $(this).live ('click', listener);
  else
    $(this).click (listener);

  return this;
};

/**
 * Public API for AJAX-loaded forms, implemented as a jQuery extension
 * function.
 *
 * @param options Object: for reference, see "Available options" above
 *
 * A form instrumented with this method can behave in two ways:
 *
 *  - If the request method is 'get', it behaves much like a navLink,
 *    as it serializes the form values, appends them to the `href` and
 *    calls $.navLoadContent ().
 *
 *  - If the request method is 'post', 'put' or 'delete', the serialized
 *    form values are passed as `params` to $.navLoadContent () that'll
 *    POST them.
 */
$.fn.navForm = function (options) {
  options = __validateOptions (options, this);

  var listener = function (event) {
    if (event.isPropagationStopped ())
      return false;

    var form = $(this);
    var args = $.clone (options);
    var data = form.serialize ();

    if (!args.method)
      args.method = (form.attr ('method') || 'post').toLowerCase ();

    args.href = form.attr ('action');

    if (args.method == 'get') {
      // Add the data to the query string
      args.href += '?' + data;
    } else {
      // Add the data to the POST params
      args.params = data;
    }

    $.navLoadContent (form, args);

    return false;
  };

  if (options.live)
    $(this)
      .live ('submit', listener)
      .live ('ajaxSubmit', listener);
  else
    $(this)
      .bind ('submit', listener)
      .bind ('ajaxSubmit', listener);

  return this;
};

/**
 * Initialize AJAX navigation.
 *
 * TODO: Documentation
 */
$.navInit = function () {
  if (arguments[0])
    $.navDefaultOptions = arguments[0];

  // Initialize the base path
  //
  var base = decodeURIComponent ($.location.getPath ());

  if (!/\/$/.test (base))
    base = base.replace (/\/[^\/]+$/, '/');

  if (!$.navDefaultOptions.base.test (base))
    throw (
      'BUG: the current base "' + base + '"' +
      ' does not match the configured one ' +
      '"' + $.navDefaultOptions.base + '"'
    );

  $.navDefaultOptions.base  = base;
  $.navDefaultOptions.urlRE = new RegExp ( // For IE
    '(' + $.location.getHost () + ')?' + base
  );

  // $.log ('AJAX nav init: set base to "' + base + "'");

  // Initialize the default target container
  //
  var container = $.navDefaultOptions.container;
  $.navDefaultOptions.container = $(container);

  if (!$.navDefaultOptions.container)
    throw ('BUG: container "' + container + '" not found in the DOM');

  // $.log ('AJAX nav init: found the "' + container + '" container');

  if (!$.navDefaultOptions.noHistory) {
    // Initialize the jquery.history plugin
    //
    $.history.init (__onHistoryChange);

    // Load the anchor currently in the URL bar
    //
    $.history.load ($.location.getAnchors () || $.navDefaultOptions.root);
  }

  // $.log ('AJAX navigation initialized and ready to roll');
};

/**
 * Event registration syntactic sugar:
 *
 * Registers a callback to be run ONCE upon initialization
 */
$.fn.ajaxInit = function (fn) {
  return $(document).one ('nav:loaded', fn);
};

/**
 * Registers a callback to be run ALWAYS after content loads
 */
$.fn.ajaxReady = function (fn) {
  return $(document).bind ('nav:loaded', fn);
};

/**
 * Registers a callback to be run ALWAYS after content unloads
 */
$.fn.ajaxUnload = function (fn) {
  return $(document).bind ('nav:unloading', fn);
};

/**
 * Registers a callback to be run when this element receives
 * the "ajaxSubmit" event.
 */
$.fn.ajaxSubmit = function (fn) {
  return $(this).bind ('submit', fn).bind ('ajaxSubmit', fn);
};

/**
 * *Private*: this function gets called when history
 * changes, and it gets passed a path extracted from
 * the currently active anchor name.
 */
var __onHistoryChange = function (path, options) {
  if (!path)
    path = $.navDefaultOptions.root;
  else {
    // Inform the backend that this request comes from the history,
    //
    if (!/_h_/.test (path))
      path += (/\?/.test (path) ? '&' : '?') + '_h_=';
  }

  // TODO this code stinks, the .base option sucks: clean up and
  // refactor it.
  //

  //$.log ('AJAX history: loading "' + path + '"');

  $.navLoadContent (window, {
    base     : $.navDefaultOptions.base,
    container: $.navDefaultOptions.container,
    href     : ($.navDefaultOptions.base + path).replace (/\/+/g, '/')
  });
};

/**
 * *Private*: Validates the options passed to .navLink () and
 * .navForm (), extending them with the defaults.
 *
 * @param options Object: the options to be validated.
 *
 */
var __validateOptions = function (options, element) {
  var defaults = $.clone ($.navDefaultOptions);

  options = $.extend (defaults, options);

  // Sanity checks
  //
  if (typeof (options) == 'undefined')
    throw ('BUG: no option passed to a navigation link');

  if (!options.base)
    throw ('BUG: navigation links MUST have a configured base path');

  if (!options.container)
    throw ('BUG: navigation links MUST refer to a target container');

  if (typeof (options.container) == 'string')
    options.container = $(options.container);

  if (typeof (options.container) != 'function' && options.container.size () > 1)
    throw ('BUG: the container MUST be an unique element');

  // Set the "live" option to "true" if it's undefined
  //
  if (typeof (options.live) == 'undefined')
    options.live = true;

  return options;
};

/**
 * *Private*: Invokes the given specialized callback name, stored
 * into the given options object, if it is defined. If a default
 * callback is defined as well, and it's not the same function as
 * the specialized one, it gets invoked, too, UNLESS the specialized
 * one returns *false*.
 *
 * Returns undefined.
 */
var __invoke = function (name, options, loader) {
  var defaultFn     = $.navDefaultOptions[name];
  var specializedFn = options[name];
  var bubble        = true;

  if ( (typeof (specializedFn) == 'function') &&
        specializedFn != defaultFn) {
    // $.log ("invoking specialized " + name + " callback");
    bubble = specializedFn.apply (loader, [options]);
  }

  if ( (typeof (defaultFn) == 'function') && bubble !== false) {
    // $.log ("invoking default " + name + " callback");
    defaultFn.apply (loader, [options]);
  }
};


$.navHijackRedirect = function (base, anchor) {
  // Inform the backend to render only a spinner to optimize loading time,
  // via a cookie that expires 1 sec later the user clicked this link.
  //
  var expire = new Date((+new Date) + 1000).toGMTString ();
  document.cookie = 'nha=1; path="' + base + '"; expires=' + expire;
  $.location.set (base + $.location.encodeAnchor (anchor));
};

$.navHijackReset = function (href) {
  if (href.match (/^\//))
    href = href.slice (1);

  // Reset a possibly older cookie
  //
  document.cookie = 'nha=; path="' + href.split ('/')[0] + '"; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};

$.navHijack = function (paths) {
  var hijack = $.map (paths, function (path) {
    return new RegExp ('('+ path +')/+(.+)');
  });

  $('a').click (function () {
    var link = $(this);
    var href = link.attr ('href'), matched = false;

    if (href.match (/^#/) ||
        link.attr ('rel').match (/nofollow/) ||
        link.attr ('class').match (/nohijack/))
      return;

    $.each (hijack, function (i, re) {
      var m = href.match (re);
      if (m) {
        $.navHijackRedirect (m[1], m[2]);
        matched = true;
        return false;
      } else {
        $.navHijackReset (href);
      }
    });

    if (matched)
      return false;
  });

  // Poor man's singleton method! :-)
  //
  $.navHijack = function () { throw ("This function can be invoked only once.") };
};

})(jQuery);
