// Panmind Cayugan - (C) 2009 Mind2Mind S.r.L.
//

/**
 * Our diffHTML () implementation, based on jsdifflib,
 * which is inspired by Python's difflib
 *
 * Source: http://snowtide.com/jsdifflib
 *
 * Takes two strings as arguments and returns a single
 * string with <ins> and <del> tags inserted when appropriate.
 *
 *   - vjt  Mon Nov  2 21:50:20 CET 2009
 */
(function () {
  // This private function adds <ins> and <del> elements
  // taking care of wrapping them into the outermost HTML
  // tags, for proper formatting.
  //
  var addDelimiter = function (pieces, delimiter) {
    var open  = ' <'+delimiter+'>';
    var close = '</'+delimiter+'> ';

    return (
      open +
      $.map (pieces, function (piece) {
        var match = piece.match (/<(\/?)(\w+)>/); // The closing slash is match[1]

        if (!match)
          return piece;

        return (match[1] ? (close + piece) : (piece + open));

      }).join (' ') +
      close
    );
  };

  // Recursive reducer -- see below for an explanation
  //
  var toTokens = function (result, node) {
    if (node.tagName  // Standalone tag, like <br/>
        && node.textContent.length == 0
        && node.childNodes.length == 0) {
      result.push ('<' + node.tagName + '/>');
      return result;
    }

    if (node.tagName)
      result.push ('<' + node.tagName + '>');

    var text;
    if (node.childNodes && node.childNodes.length > 0)
      result = result.concat (_(node.childNodes).reduce ([], toTokens)); // Recursion
    else if (text = $.trim (node.textContent))
      result = result.concat (text.split (/\s+/));

    if (node.tagName)
      result.push ('</' + node.tagName + '>');

    return result;
  };

  $.diffHTML = function (a, b) {
    // Parsing HTML with Regexes is bad. Aren't you convinced? Read this:
    //
    // http://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454
    //
    //   - vjt  Thu Dec 10 22:08:23 CET 2009
    //
    var parser = new DOMParser (); // IE uses the brige defined below.

    var docA = parser.parseFromString('<w>' + a + '</w>', 'text/xml');
    var docB = parser.parseFromString('<w>' + b + '</w>', 'text/xml');

    // Reduce the parsed documents to an array of single-word tokens
    // using the toTokens reducer method
    //
    a = _(docA.firstChild.childNodes).reduce ([], toTokens);
    b = _(docB.firstChild.childNodes).reduce ([], toTokens);

    // Do the diff
    //
    var matcher = new difflib.SequenceMatcher (a, b)

    // And reduce the opcodes to an HTML representation of the differences.
    //
    return _(matcher.get_opcodes ()).reduce ('', function (result, opcode) {
      var change = opcode[0];

      var aStart = opcode[1];
      var aEnd   = opcode[2];
      var bStart = opcode[3];
      var bEnd   = opcode[4];

      switch (change) {
      case 'equal':
        // .. if the text is equal, simply concatenate it into
        // the return value
        result += a.slice (aStart, aEnd).join (' ');
        break;

      case 'replace':
        // .. if the text has been replaced, remove the old
        // one and add the new one
        result += addDelimiter (a.slice (aStart, aEnd), 'del');
        result += addDelimiter (b.slice (bStart, bEnd), 'ins');
        break;

      case 'insert':
        // .. if some text has been inserted, add it into an
        // <ins>
        result += addDelimiter (b.slice (bStart, bEnd), 'ins');
        break;

      case 'delete':
        // .. and eventually if some text has been deleted,
        // remove it with a <del>
        result += addDelimiter (a.slice (aStart, aEnd), 'del');
        break;

      default:
        // uh-oh, should not happen!
        //
        throw ('BUG: unknown diff change "' + change + '"');
      }

      return result;
    });
  };

  /**
   * Quick&dirty DOMParser bridge vs Microsoft.XMLDOM
   */
  if (!window.DOMParser) {
    window.DOMParser = function () {
      this.init = function () { return false; }

      this.parseFromString = function (text) {
        try {
          var doc = new ActiveXObject ('Microsoft.XMLDOM');
          doc.async = false;
          doc.loadXML (text);

          return doc;
        } catch (e) {
          throw ('DOMParser initialization error: ' + e.message);
        }
      };

      this.parseFromBuffer = function (buffer) {
        return this.parseFromString (buffer);
      };

      this.parseFromStream = function (stream) {
        throw ('Not implemented');
      }
    };
  };
})();
