// YOUR CODE HERE:
var app;
$(function() {
  app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    username: 'anonymous',
    room: 'lobby'
  };

    app.username = window.location.search.slice(10);
    app.escape = function (str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };


    app.init = function() {
      app.username = window.location.search.substr(10);
      app.$main = $("#main");
      app.$message = $("#message");
      app.$chats = $("#chats");
      app.$roomSelect = $("#roomSelect");
      app.$send = $("#send");
      app.fetch();
      setInterval(app.fetch, 3000);
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
        contentType: "application/json",
        data: {order: "-createdAt"},
        
        success: function(data) {
          console.log(data);
         app.populateRooms(data.results);
         app.populateMessages(data.results);
        }
      })
    };

    app.populateRooms = function(results) {
      app.$roomSelect.html('<option value="__newRoom">New Room...</option><option value = "lobby" selected>:Lobby</option>');
      if(results) {
        var processedRooms = {};
        results.forEach(function(data) {
          var roomname = data.roomname;
          if (roomname && !processedRooms[roomname]) {
            app.addRoom(roomname);

            processedRooms[roomname] = true;
          }
        })
      }
      app.$roomSelect.val(app.room);
    };

    app.populateMessages = function(results) {
      app.clearMessages();

      if(Array.isArray(results)) {
        results.forEach(app.addMessage);
      }
     
    };

    app.refreshMessages = function () {
      app.clearMessages();
      app.fetch();
    };
    app.clearMessages = function() {
       app.$chats.empty();
    };

    app.addMessage = function(data) {
      if(!data.roomname) {
        data.roomname = "lobby";
      }
      if(data.roomname ===app.room) {
        if(data.text.length > 0) {
          var $chat = $("<div class='chat' />");
          var $username = $("<sp class='username' >");
          $username.text(app.escape(data.username) + ": ")
            .attr('data-username', app.escape(data.username))
            .attr("data-roomname", app.escape(data.roomname))
            .appendTo($chat)
          var $message = $("<br /><span />");

          $message.text(app.escape(data.text)).appendTo($chat);
          app.$chats.append($chat);
        }
      }
    };

    app.addRoom = function(roomname) {
      var $option = $('<option />').val(app.escape(roomname)).text(app.escape(roomname));
      app.$roomSelect.append($option);
      
    };

    app.addFriend = function() {
      
    }

    app.handleSubmit = function() {
      var userObj = {};
      userObj.username = this.username;
      userObj.text = $('textarea').value();
      app.send(userObj);
      
    }

});