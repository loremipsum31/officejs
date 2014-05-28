/*global window, rJS, RSVP, jIO, JSON */

(function (window, jIO, rJS) {
  "use strict";

  var gk = rJS(window);

  gk.declareMethod('createIO', function (description, key) {
    this.jio = jIO.createJIO(description);
    this.key = key;
    this.jio.put({
      "_id" : key
    }).then(function () {
      description = JSON.stringify(description, null, "  ");
      return ("JIO created: " + description + "\nwith key: " + key);
    }).catch(function (e) {
      return "jio created error: " + e.target.result;
    });
  })
    .declareMethod('getIO', function (attachment) {
      var gadget = this;
      return gadget.jio.getAttachment({
        "_id": gadget.key,
        "_attachment": attachment
      }).then(function (response) {
        return response.data;
      }).fail(function (response) {
        return "jio getIO error : " + response.target.result;
      });
    })
    .declareMethod('setIO', function (attachment, file) {
      var gadget = this;
      return gadget.jio.putAttachment({
        "_id": gadget.key,
        "_attachment": attachment,
        "_blob": file
      });
    })
    .declareMethod('showAllIO', function () {
      var gadget = this;
      return gadget.jio.allDoc({
        "include_docs": "m"
      });
    });
}(window, jIO, rJS));