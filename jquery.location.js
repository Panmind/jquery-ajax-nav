// Panmind Wenlock - (C) 2009 Mind2Mind S.r.L.
//

/**
 * Document location handling and anchor management.
 *
 * == Rationale ==
 *
 * This plug-in defines the $.location object that provides common functions
 * to handle the document.location.href in a programmatic manner. Its scope
 * is to aid the burden of managing the anchors in an AJAX-loaded context,
 * currently implemented in the jquery.ajax-nav.js plug-in.
 *
 * History management currently relies on the jquery.history.js plug-in, whose
 * scope is to listen of anchor changes and call a callback function when this
 * happens.
 *
 * == Conventions ==
 *
 * - Query string parameters
 *
 *   Because traditional query string syntax (?foo=bar&baz=42) cannot be used in
 *   anchors, this plug-in implements a custom syntax, where the ':' character
 *   maps to '?' and the ';' character maps to '&'. Example: /path:foo=bar;baz=42
 *
 * - Anchor "sections"
 *
 *   Because in a RESTful application URIs are consistent, this plug-in assumes
 *   that the [a-zA-Z0-9] set of character at the beginning of an anchor
 *   represent a "section".
 *
 *   - vjt  Tue Nov 10 11:39:05 CET 2009
 */
$.location = new (function () { // Inline object creation and initialization
  var Host, Path, URI, Anchors;

  /**
   * Sets the current location of the document. If the history plugin is
   * loaded, no page load will happen. If it is not, a page load will be
   * triggered.
   *
   * @param String href: a full location href, possibly with anchors, in
   *   the canonic slash-and-hash separated format (e.g. /foo/3#bar).
   *
   * @return undefined
   */
  this.set = function (href) {
    document.location.href = href;
    this.__save ();
  };

  /**
   * Reloads the current page, merely calling document.location.reload ().
   *
   * @return undefined
   */
  this.reload = function () {
    document.location.reload ();
  }

  /**
   * Sets the given href as an anchor, replacing the current one if it's set.
   * If the href is empty, it is replaced with '/'.
   *
   * If the jquery.history plugin is loaded and has a callback attached that
   * listens to history changes, it'll be called.
   *
   * @param String href: the href to be set as an anchor.
   *
   * @return the anchor that was set
   */
  this.setAnchor = function (anchor) {
    this.set (URI + anchor);
  };

  /**
   * Gets the current document URI, without any anchors that may be set.
   *
   * @return String: An URI with a path
   */
  this.get = function () {
    return URI;
  };

  this.getForTracking = function () {
    var slug = this.decodeAnchor (Anchors);
    if (URI.slice (-1) != '/' && slug[0] != '/')
      slug = '/' + slug;

    return URI + slug;
  };

  /**
   * Gets the current document location, with any anchors that may be set.
   *
   * @return String: an URI with a path and anchors
   */
  this.getWithAnchors = function () {
    return URI + '#' + Anchors;
  };

  /**
   * Gets the current document protocol + host, without path or anchors.
   *
   * @return String: like https://localhost:3000/
   */
  this.getHost = function () {
    return Host;
  };

  /**
   * Gets the current document path, without URI or anchors
   *
   * @return String
   */
  this.getPath = function () {
    return Path;
  };

  /**
   * Gets the current document anchors
   *
   * @return String
   */
  this.getAnchors = function () {
    return Anchors;
  };

  // TODO: Documentation
  this.encodeAnchor = function (href) {
    // If the href is empty or doesn't start with a /,
    // add it cleverly.
    //
    if (!/^[\/#]/.test (href))
      href = '/' + (href || '');

    return decodeURIComponent (href
      .replace (/^\//, '#')
      .replace (/\?/,  ':')
      .replace (/\&/g, ';')
    );
  };

  // TODO: Documentation
  this.decodeAnchor = function (anchor) {
    return anchor
      .replace (/^#/, '/')
      .replace (/:/, '?')
      .replace (/;/g, '&');
  };

  /**
   * Private: saves the current document location
   *
   * @return undefined
   */
  this.__save = function () { // Private
    var loc = document.location;
    Host    = loc.protocol + '//' + loc.host;
    Path    = loc.pathname;
    URI     = Host + Path;
    Anchors = loc.hash.replace (/^#/, '')
  };
});

/**
 * When the ready event fires, saves the current location
 */
$(document).ready (function () {
  $.location.__save ();
});
