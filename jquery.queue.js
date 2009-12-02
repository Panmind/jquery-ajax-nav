// Panmind Wenlock - (C) 2009 Mind2Mind S.r.L.
//

/**
 * A simple fixed-size Queue.
 *
 * Instantiation: var q = new Queue (options).
 *
 * @param options Object
 *   - elements: Array
 *               initialize the queue with the given elements.
 *
 *   - maxSize:  Integer
 *               maximum size of the queue
 *
 *   - mode:     String
 *               FIFO or LIFO
 *
 * == API ==
 *
 *   - q.push (element)  : adds an element and returns the element count;
 *   - q.pop  ()         : removes the last element, taking into account the
 *                         queue mode (FIFO or LIFO) and returns it;
 *   - q.remove (element): finds the given element in the queue and, if found,
 *                         removes it. Returns true if success or false if not.
 *   - q.elements ()     : returns the queue elements as an Array
 *   - q.length ()       : returns the queue elements count
 *   - q.size ()         : alias of q.length ()
 *   - q.first ()        : returns the first element of the queue
 *   - q.each (fn)       : invokes 'fn' on every queue element
 *   - q.map (fn)        : maps the elements array with 'fn' and returns it
 *
 *
 *   -vjt  Fri Oct 16 09:57:16 CEST 2009
 */
var Queue = function () {
  var options  = arguments[0] || {};
  var maxSize  = options.maxSize || 5;
  var elements = options.elements || [];
  var mode     = options.mode || 'FIFO';

  if (elements.length > maxSize)
    throw "This queue can contain at most " + maxSize + " elements";

  this.push = function (element) {
    if (elements.length + 1 > maxSize)
      this.pop ();

    return elements.unshift (element);
  };

  this.pop = function () {
    if (mode == 'FIFO')
      return elements.pop ();
    else
      return elements.shift ();
  };

  this.remove = function (item) {
    var removed = elements.indexOf (item);

    if (removed >= 0) {
      elements = $.grep (elements, function (_, idx) { return idx != removed });
      return true;
    }

    return false;
  }

  this.elements = function () {
    return elements;
  };

  var length = function () {
    return elements.length;
  };

  // Poor man's method aliasing ;-)
  //
  this.length = this.size = length;

  this.first = function () {
    return elements[0];
  };

  this.each = function (callback) {
    $.each (elements, callback);
  };

  this.map = function (callback) {
    return $.map (elements, callback);
  };

};
