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
    .declareAcquiredMethod("setVolume", "setVolume")
    .declareAcquiredMethod("getVolume", "getVolume");   //xxxx
  gk.ready(function (g) {
    g.bar = g.__element.getElementsByTagName('progress')[0];
    g.bar.max = 1000;
    g.bar.onclick = function (e) {
      var posX = e.clientX,
        targetLeft = $(g.bar).offset().left;
      posX = ((posX - targetLeft) / $(g.bar).width()) * g.bar.max;
      g.setValue(posX);
      g.setVolume(posX);
    };
  });
}(window, rJS, jQuery));