document.addEventListener("DOMContentLoaded", function() {
  const socket = io();

  const room = $("#groupName").val();
  const sender = $("#sender").val();

  socket.on("connect", function() {
    console.log("connected to server");

    const params = { room: room, name: sender };

    socket.emit("join", params, function() {
      console.log("user joined the group");
    });
  });

  socket.on("userList", list => {
    let ol = $("<ol></ol>");

    for (let i = 0; i < list.length; i++) {
      ol.append(
        '<p><a id="val" data-toggle="modal" data-target="#myModal">' +
          list[i] +
          "</a></p>"
      );
    }

    $(document).on("click", "#val", function() {
      $("#name").text("@" + $(this).text());
      $("#receiverName").val($(this).text());
      $("#nameLink").attr("href", "/profile/" + $(this).text());
    });

    $("#numValue").text("(" + list.length + ")");
    $("#users").html(ol);
  });

  document
    .querySelector("#message-form")
    .addEventListener("submit", function(e) {
      e.preventDefault();

      const msg = document.querySelector("#msg");

      socket.emit(
        "createMessage",
        {
          text: msg.value,
          room: room,
          sender: sender
        },
        function() {
          msg.value = "";
        }
      );
    });

  socket.on("newMessage", function(data) {
    let template = document.querySelector("#message-template").innerHTML;
    let message = Mustache.render(template, {
      text: data.text,
      sender: data.sender,
      room: data.room
    });

    document.querySelector("#messages").innerHTML += message;
  });
});
