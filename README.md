jQuery AJAX Navigation framework
================================

(C) 2009-2010 [Mind2Mind s.r.l.](http://mind2mind.is) - Ruby License.

Spinned off from the [panmind.org][panmind] web app.

Tutorial documentation is a work in progress. In the
meantime, have a look at the reference documentation
in the source files.

Small demo
----------

To launch the demo app, from your favorite terminal application,
enter the "demo" directory and issue:

    rackup -p 8080

Then point your browser to http://localhost:8080/ and click around.
Source files are in the `demo/` directory. Please note that the Rack
backend is necessary to navigate the demo without errors: the forms
work only when there's a backend answering to POST requests and the
demo home page must be handled differently whether the client request
comes from XHR or not.

Full-fledged demo
-----------------

Visit [http://panmind.org][panmind] and navigate through the [ReS][],
try [searching the site][search] or [sign up][] and try out the
[collaboration tools][] to see what you can gain from using this framework.

Have a look as well to our [application.js][], [network/globals.js][],
[network/res-nav.js][] and [projects/globals.js] to see how we implemented
this stuff in a quite large Rails application.

Ruby support modules will follow soon.

Core sources
------------

  * [jquery.ajax-nav.js][]      - AJAX navigation framework
  * [jquery.history.js][]       - AJAX history management
  * [jquery.location.js][]      - Document location/anchors management

Extras
------

  * [jquery.ajax-validate.js][] - AJAX validation plugin
  * [jquery.behaviours.js][]    - Generic behaviours library
  * [jquery.dim-opaque.js][]    - Helpers to disable parts of the UI
  * [jquery.poller.js][]        - A poller that uses `{set,clear}Interval`
  * [jquery.queue.js][]         - A queue, `FIFO` or `LIFO`
  * [jquery.diffhtml.js][]      - An HTML diff routine based on `DOMParser`
  * [jquery.utilities.js][]     - Small `$.log` and `$.clone` helpers

Support libraries
-----------------

  * [vendor/jsdifflib.js][]     - Javascript Diff Library
  * [jQuery 1.4.2][jquery]      - Please see [vendor/jquery-IE-xhr-abort.patch][jquery-patch]

Authors
-------

  * Marcello Barnaba  ([@vjt](http://twitter.com/vjt))       <marcello.barnaba@exelab.eu>
  * Ferdinando de Meo ([@burzuk](http://twitter.com/burzuk)) <ferdinando.demeo@exelab.eu>
  * Paolo Zaccagnini  ([@paozac](http://twitter.com/paozac)) <paolo.zaccagnini@exelab.eu>
  * Exelab Karma      ([@exelab](http://twitter.com/exelab)) <exelab@exelab.eu>


  `- vjt  Sun Jul 25 17:45:51 CEST 2010`


[panmind]:                 http://panmind.org
[sign up]:                 http://panmind.org/signup
[search]:                  http://panmind.org/search
[ReS]:                     http://panmind.org/search/res
[collaboration tools]:     http://panmind.org/tour/collaborate

[jquery.ajax-nav.js]:      http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.ajax-nav.js
[jquery.history.js]:       http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.history.js
[jquery.location.js]:      http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.location.js
[jquery.ajax-validate.js]: http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.ajax-validate.js
[jquery.behaviours.js]:    http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.behaviours.js
[jquery.dim-opaque.js]:    http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.dim-opaque.js
[jquery.poller.js]:        http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.poller.js
[jquery.queue.js]:         http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.queue.js
[jquery.diffhtml.js]:      http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.diffhtml.js
[jquery.utilities.js]:     http://github.com/Panmind/jquery-ajax-nav/blob/master/jquery.utilities.js

[vendor/jsdifflib.js]:     http://github.com/Panmind/jquery-ajax-nav/blob/master/vendor/jsdifflib.js
[jquery-patch]:            http://github.com/Panmind/jquery-ajax-nav/blob/master/vendor/jquery-IE-xhr-abort.patch
[jquery]:                  http://jquery.com

[application.js]:          http://panmind.org/javascripts/application.js
[network/globals.js]:      http://panmind.org/javascripts/network/globals.js
[network/res-nav.js]:      http://panmind.org/javascripts/network/res-nav.js
[projects/globals.js]:     http://panmind.org/javascripts/projects/globals.js
