/*global window, rJS, RSVP, console, $, jQuery */
/*jslint  nomen: true */


(function (window, rJS, $) {
  "use strict";
  var gk = rJS(window);

  gk.declareMethod('setValue', function (value) {
    this.bar.value = value;
  })
    .declareMethod('setMax', function (max) {
      this.bar.max = max;
    })
    .declareMethod('getValue', function () {
      return this.bar.value;
    })
    .declareMethod('getMax', function () {
      return this.bar.max;
    })
    .declareMethod('getPositionValue', function (e) {
      var posX = e.clientX,
        targetLeft = $(this.bar).offset().left;
      posX = ((posX - targetLeft) / $(this.bar).width());
      return posX * this.bar.max;
    })
    .declareMethod('setAction', function (type, action) {
      this.bar[type] = function (e) {
        action.call(this, e);
      };
    });
  gk.ready(function (g) {
    g.bar = g.__element.getElementsByTagName('progress')[0];
    g.bar.value = 0;
    g.bar.max = 1000;
  });
}(window, rJS, jQuery));
