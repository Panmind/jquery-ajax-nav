/**
 * AJAX Validation helper for jQuery
 * =================================
 *
 * Leverages the jquery.validate plugin to implement AJAX checks on the server
 * that determine whether a form is valid or not.
 *
 * Markup
 * ------
 *
 * You need a form with the pm:check attribute and a spinner:
 *
 *   <form action="/login" method="post" id="login" pm:check="/serverside/checker">
 *     <!-- plain old form -->
 *     <input type="text" name="email" />
 *     <input type="text" name="passwd" />
 *     <input type="submit" />
 *     <img src="/images/spinner.gif" id="spinner" style="display:none" />
 *   </form>
 *
 *
 * Backend
 * -------
 *
 * The /serverside/checker should be a method that returns a different
 * HTTP status code when validation passes or fails. E.g., a login checker
 * could be written with Rails as:
 *
 *   def login_checker
 *     if params[:email].blank? || params[:passwd].blank? # Sanity check
 *       render :nothing => true, :status => :bad_request and return
 *     end
 *
 *     email  = CGI.unescape(params[:email])
 *     passwd = CGI.unescape(params[:passwd])
 *     status = User.authenticate(email, passwd) ? :ok : :invalid_request
 *
 *     render :nothing => true, :status => status
 *   end
 *
 * This method returns a 400 code if either the email or the password aren't
 * passed, 406 if the combination is wrong or 200 if it matches.
 *
 *
 * Frontend
 * --------
 *
 * You can validate logins via AJAX with the following code, much self
 * explanatory:
 *
 *    $(document).ready (function () {
 *      $('#login').ajaxValidate ({
 *        validate: {
 *          rules: {
 *            'email':    { required: true },
 *            'password': { required: true, minlength: 6 }
 *          }
 *        },
 *
 *        params: function () {
 *          var email  = $('#email');
 *          var passwd = $('#password');
 *
 *          return {email: email.val (), passwd: passwd.val ()}
 *        },
 *
 *        error: function (validator) {
 *          if (this.status == '400')
 *            validator.showErrors ({'password': 'The password you entered is not valid'});
 *          else if (this.status == '406')
 *            validator.showErrors ({
 *              email:    null,
 *              password: 'Login failed: please try again'
 *            });
 *        }
 *     });
 *   });
 *
 *
 * Options reference
 * =================
 *
 *  - validate:    Options passed to the jQuery.validate plugin itself - See
 *                 its documentation for more information:
 *                 http://docs.jquery.com/Plugins/Validation
 *
 *  - type:        Request method, passed to jQuery.ajax if present, defaults
 *                 to "get".
 *
 *  - params:      Query parameters sent to the server-side checker - It must
 *                 be a callback and it is invoked with "this" set to the jQuery
 *                 object that contains the form DOM object and should return a
 *                 value suitable for the "data" option of the jQuery.ajax method.
 *
 *  - error:       An optional callback invoked when the backend returns an HTTP
 *                 status different than 200 (OK). "this" is set to the XHR object,
 *                 while the first parameter is set to the Validator object.
 *
 *  - field:       An optional form field to bind the error messages to. The field
 *                 can be either a field *name* (not id) or a callback. The message
 *                 is chosen by inspecting the value of the "response" option.
 *                 If the field is a callback, it is called with "this" set to the
 *                 XHR object and should return a string containing the field name.
 *
 *  - response:    An optional map of HTTP status - error messages. It could be a
 *                 plain Javascript object or a callback. If it's a callback, it is
 *                 called with "this" set to the XHR object and should return a string
 *                 containing the error message to show.
 *                 WARNING: If no "field" option is set, this option is ignored.
 *
 *  - unless:      An optional callback invoked when the form is submitted, with
 *                 "this" set to the jQuery object containing the form DOM object.
 *                 If the callback returns true, AJAX validation is skipped.
 *
 * Code Flow
 * =========
 *
 *  - Form is submitted
 *  - If offline validations fail, the submit is halted
 *  - If the "unless" callback is present and returns true, the submit is halted
 *  - AJAX validation request is started with params computed by the "params" callback
 *  - If the request status is 200, the form is submitted to the server
 *  - If any other status is returned, the submit is halted
 *    - If the "field" option is set, a message is chosen from the "response" option and
 *      it is shown via the "showErrors" method of the Validate plugin
 *    - If the "error" callback is set, it is called
 *
 */
(function ($) {

  $.fn.ajaxValidate = function (options) {
    var form = $(this);

    var spinner   = $(options.spinner || '#spinner');
    var validator = form.validate ($.extend ({},
      $.validateOptions || {}, options.validate || {})
    );

    var show_error = function (xhr) {

      var field = options.field;
      if (field) {
        var errors  = {};
        var message = options.response[xhr.status];

        if ($.isFunction (message))
          message = message.apply (xhr);

        if ($.isFunction (field))
          field = field.apply (xhr);

        errors[field] = message;
        validator.showErrors (errors);
      }

      if ($.isFunction (options.error))
        options.error.apply (xhr, [validator]);
    };

    form.submit (function () {
      if (!validator.form ()) return false;

      if ($.isFunction (options.unless) && options.unless.apply (this))
        return true;

      if (form.data ('valid')) return true;

      var params = options.params.apply (this);
      $.ajax ({
        type: options.type || 'get',
        url : form.attr ('pm:check'),
        data: params,

        beforeSend: function () {
          spinner.show ();
        },

        complete: function (xhr) {
          spinner.hide ();

          if (xhr.status != 200)
            show_error (xhr);
          else {
            form.data ('valid', true);
            form.submit ();
          }
        }
      });

      return false;
    });
  };

}) (jQuery);
