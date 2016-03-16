// YOUR CODE HERE:
var app;
$(function() {
  app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    username: 'anonymous',
    room: 'lobby',
    friends: {},
    init: function() {
      app.username = window.location.search.substr(10);
      app.$main = $("#main");
      app.$message = $("#message");
      app.$chats = $("#chats");
      app.$roomSelect = $("#roomSelect");
      app.$send = $("#send");

      app.$roomSelect.on("change", app.saveRoom);
      app.$send.on('submit', app.handleSubmit);
      app.$main.on("click", ".username", app.addFriend);
      app.stopSpinner();
      app.fetch();
      setInterval(app.fetch, 3000);
    },
    saveRoom: function(enst) {
      var sIndex = app.$roomSelect.prop('selectedIndex');

      if(sIndex === 0) {
        var roomname = prompt('Enter toom name');
        if(roomname){
          app.room = roomname;
          app.addRoom(roomname);
          app.$roomSelect.val(roomname);
          app.fetch();
        }
      }
      else {
        app.room = app.$roomSelect.val();
        app.fetch();
      }

    },
    fetch: function() {
      app.startSpinner();
      $.ajax({
        url: app.server,
        type: "GET",
        contentType: "application/json",
        data: {order: "-createdAt"},
        complete: function() {
          app.stopSpinner();
        },
        success: function(data) {
         app.populateRooms(data.results);
         app.populateMessages(data.results);
        }
      })
    },
    startSpinner: function() {
      $(".spinner img").show();
    },
    stopSpinner: function() {
      $(".spinner img").hide();
    },
    escape: function (str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    },
    send: function(message) {
     $.ajax({
      url: app.server,
      type: "POST",
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log("chatterbox: Message sent. Data: ", data);
      },
      error: function (data) {
        console.log("chatterbox: Failed to send message. Error: ", data);
      },
      compelete: function() {
        app.stopSpinner();
      }
     })
    },
    populateRooms: function(results) {
      app.$roomSelect.html('<option value="__newRoom">New Room...</option><option value = "lobby" selected>:Lobby</option>');
      if(results) {
        var processedRooms = {};

        if(app.room !== 'lobby'){
          app.addRoom(app.room);
          processedRooms[app.room] = true;
        }
        results.forEach(function(data) {
          var roomname = data.roomname;
          if (roomname && !processedRooms[roomname]) {
            app.addRoom(roomname);

            processedRooms[roomname] = true;
          }
        })
      }
      app.$roomSelect.val(app.room);
    },
    populateMessages: function(results) {
      app.clearMessages();

      if(Array.isArray(results)) {
        results.forEach(app.addMessage);
      }
     
    },
    clearMessages: function() {
       app.$chats.empty();
    },
    addMessage: function(data) {
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
            .appendTo($chat);
            var $message = $("<br /><span />");
            if(app.friends[data.username]===true) {
              $message.addClass("friend");
            }
          

          $message.text(app.escape(data.text)).appendTo($chat);
          app.$chats.append($chat);
        }
      }
    },
    addRoom: function(roomname) {
      var $option = $('<option />').val(app.escape(roomname)).text(app.escape(roomname));
      app.$roomSelect.append($option);
      
    },
    addFriend: function(evt) {
      var username = $(evt.currentTarget).attr("data-username");
      if(username !==undefined) {
        console.log("chatbox: adding as afriend", username);
        app.friends[username] = true;
        var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
        $(selector).addClass("freind");

      }

    },
    handleSubmit: function(evt) {
      evt.preventDefault();

      var message = {
        username: app.username,
        roomname: app.room || 'lobby',
        text: app.$message.val()
      };
      app.send(message);
    }

  };

});