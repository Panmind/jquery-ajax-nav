// Panmind Cayugan - (C) 2009 Mind2Mind S.r.l.
//
var Poller = function (options) {
  var form = $(options.element).find ('form');
  var url  = form.attr ('action');

  var poll = function () {
    var self = this;
    $.ajax ({
      url : url,
      type: 'POST',
      data: form.serialize (),
      beforeSend: options.loading,
      success   : options.success,
      error     : options.error
    });
  };

  var id = undefined;

  this.start = function () {
    this.log ('polling');
    poll.apply (this);
    id = window.setInterval (poll, options.timeout);
  };

  this.stop = function () {
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
