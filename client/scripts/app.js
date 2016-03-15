// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'
};

  app.escape = function (str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };


  app.init = function() {
   $("#main").on("click", ".username", app.addFriend);
   $("#send").on("submit", ".submit", app.handleSubmit);
   app.fetch();
   $(".refresh").on("click", app.refreshMessages);
  };

  app.send = function(message) {
   $.ajax({
    url: this.server,
    type: "POST",
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log("chatterbox: Message sent. Data: ", data);
    },
    error: function (data) {
      console.log("chatterbox: Failed to send message. Error: ", data);
    }
   })
  };

  app.fetch = function() {
    $.ajax({
      url: this.server,
      type: "GET",
      success: function(data) {
        _.each(data.results, function(message) {
          app.escape(message.text);
          app.escape(message.username);
          app.escape(message.roomname);
          app.addMessage(message);
        })
      }
    })
  };
  app.refreshMessages = function () {
    app.clearMessages();
    app.fetch();
  };
  app.clearMessages = function() {
    $("#chats").empty();
  };

  app.addMessage = function(message) {
    $("#chats").append("<p><button class='username'>" + message.username + "</button><span>" + message.text + "</span></p>");

  };

  app.addRoom = function(str) {
    $("#roomSelect").append("<p>" + str + "</p>");
  }

  app.addFriend = function() {
    
  }

  app.handleSubmit = function() {

  }
$(document).ready(function() {
  app.init();
});