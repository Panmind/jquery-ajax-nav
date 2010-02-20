// Panmind Cayugan - (C) 2009 Mind2Mind S.r.l.
//
var Poller = function (options) {
  var form = $(options.element).find ('form');
  var url  = form.attr ('action');
  var type = options.type || 'POST';
  var dataType = options.dataType || null;
  var dataFunc = options.dataFunc || function () { return form.serialize (); }
  var xhr = null;

  var poll = function () {
    var self = this;

    xhr = $.ajax ({
      url : url,
      type: type,
      data: dataFunc.apply (this, [form]),
      dataType  : dataType,
      beforeSend: options.loading,
      complete  : options.complete,
      success   : options.success,
      error     : options.error
    });
  };

  var id = undefined;

  this.start = function () {
    if (id)
      return; // Already running

    if (!options.delayed) {
      this.log ('polling');
      poll.apply (this);
    } else {
      this.log ('delaying by ' + options.timeout + 'ms');
    }

    id = window.setInterval (poll, options.timeout);
  };

  this.stop = function () {
    if (xhr)
      xhr.abort ();

    if (id) {
      this.log ('stopping');
      window.clearInterval (id);
      id = undefined;
    }
  };

  this.status = function () {
    return id ? 'running' : 'stopped';
  };

  this.log = function (message) {
    $.log ('Poller "' + url + '": ' + message);
  };

  return this;
};
