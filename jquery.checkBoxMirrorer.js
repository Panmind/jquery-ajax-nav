/**
 * Implements a two-panes listing of items, where on the
 * left there are available ones and on the right selected
 * ones. When a check box is clicked on the left, the
 * corresponding item is cloned and put into the right pane.
 *
 * On a selected item, either a left or right check box
 * click removes the item from the selected list and
 * unchecks the box on the available list.
 *
 * Example markup:
 *
 *   <div id="mirrorer" rel="#selected">
 *     <ul>
 *       <li>
 *         <input type="checkbox" id="user_1" />
 *         <label for="user_1"><img ..../>User One</label>
 *       </li>
 *       <li>
 *         <input type="checkbox" id="user_2" />
 *         <label for="user_2"><img ..../>User Two</label>
 *       </li>
 *     </ul>
 *     <ul id="selected"></ul>
 *   </div>
 *
 * JS:
 *
 *   $('#mirrorer').checkBoxMirrorer ();
 *
 * Now try clicking boxes on the left and see them cloned on
 * the right. The created boxes are set no name, so they're
 * not sent to the server in a POST submit case, and they
 * inherit the clonee id, prefixed with a "c".
 *
 * Whether there are multiple source boxes e.g. in different
 * tabs, the code searches for them and checks them as well.
 *
 * For a respectable example, sign up on http://panmind.org/
 * and try publishing some content into a ReS or republishing
 * an existing content into an existing (or new) ReS: you'll
 * see two panes with available ReS and selected ones, and
 * the available ones are spread on three different tabs.
 *
 * (C) 2010 Mind2Mind s.r.l, MIT license
 * Spinned off the http://panmind.org/ website
 * Author: Marcello Barnaba <marcello.barnaba@gmail.com>
 */
$.fn.checkBoxMirrorer = function () {
  return this.each (function () {
    var source = $(this);
    var target = $(source.attr ('rel'));
    var boxes  = source.find (':checkbox');

    var sync   = function (wrapper, options) {
      var box = wrapper.find (':checkbox[value=' + options.value + ']');

      if (options.remove)
        box.parent ().remove ();
      else
        box.check (options.flag);

      return box;
    };

    var update = function () {
      var box   = $(this);
      var label = box.next (); // Sucks but the designer is warned in the HTML

      if (box.is (':checked')) {
        // Add this to the list of selected ReS
        //
        var row = $('<li/>');

        box.clone ().
          appendTo (row).
          attr ({name: '', id: 'c' + box.attr ('id')}).
          change (function () {
            sync (source, {value: $(this).val (), flag: false})
              .first ().trigger ('change'); // because we didn't click on this
            $(this).parent ().remove ();
            // optimized sync (target, {value: $(this).val (), remove: true})
            return true;
          });

        label.clone ().
          appendTo (row).
          attr ('for', 'c' + label.attr ('for'));

        row.appendTo (target);

        // Find boxes with same values and check'em
        //
        sync (source, {value: box.val (), flag: true});
      } else {
        // Remove
        //
        sync (source, {value: box.val (), flag: false});
        sync (target, {value: box.val (), remove: true});
      }
    }

    boxes.change (update);
  });
};
