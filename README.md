jQuery AJAX Navigation framework
================================

(C) 2009-2010 Mind2Mind s.r.l.
Spinned off from the [panmind.org](http://panmind.org) web app.
Released under the terms of the MIT License.

Tutorial documentation is a work in progress. In the
meantime, have a look at the reference documentation
in the source files.

Demo
----

To launch the demo app, from your favorite terminal application,
enter the "demo" directory and issue:

    rackup -p 8080

Point your browser to localhost:8080 and click around. Source files
are in the demo/ directory.


You can also visit [http://panmind.org](http://panmind.org) and navigate
the [ReS](http://panmind.org/search/res), try out a [search](http://panmind.org/search)
or [sign up](http://panmind.org/signup) and use the *collaboration tools* to see what
you can obtain from using these frameworks; have a look as well to
[http://panmind.org/javascripts/application.js](application.js),
[http://panmind.org/javascripts/network/globals.js](network/globals.js),
[http://panmind.org/javascripts/network/res-nav.js](network/res-nav.js) and
[http://panmind.org/javascripts/project/globals.js](project/globals.js) to
see how we implemented them in a quite large Rails application.

Core
----

  * jquery.location.js      - Document location handling
  * jquery.ajax-nav.js      - AJAX navigation framework
  * jquery.history.js       - AJAX history management

Extras
------

  * jquery.behaviours.js    - Generic behaviours library
  * jquery.dim-opaque.js    - Helpers to disable parts of the UI
  * jquery.poller.js        - A poller that uses {set,clear}Interval
  * jquery.queue.js         - A queue, FIFO or LIFO
  * jquery.diffhtml.js      - An HTML diff routine based on DOMParser
  * jquery.utilities.js     - Small $.log and $.clone helpers
  * jquery.ajax-validate.js - An AJAX validation helper

Support libraries
-----------------

  * vendor/jsdifflib.js  - Javascript Diff Library
  * jQuery 1.4.2         - Please see vendor/jquery-IE-xhr-abort.patch

Authors
-------

  * Marcello Barnaba  <marcello.barnaba@exelab.eu>
  * Ferdinando de Meo <ferdinando.demeo@exelab.eu>
  * Paolo Zaccagnini  <paolo.zaccagnini@exelab.eu>
  * Exelab Karma      <exelab@exelab.eu>

    vjt  Sun Jul 25 16:09:25 CEST 2010

