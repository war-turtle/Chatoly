$("document").ready(function() {
  var socket = io();

  const room = $("#groupName").val();
  const sender = $("#sender").val();

  socket.on("connect", function() {
    let params = {
      sender: sender
    };

    socket.emit("joinRequest", params, function() {
      console.log("Joined");
    });
  });

  socket.on("newFriendRequest", function(friend) {
    $("#reload").load(location.href + " #reload");

    // $(document).on("click", "#accept_friend", function() {
    //   var senderId = $("#senderId").val();
    //   var senderName = $("#senderName").val();

    //   $.ajax({
    //     url: "/group/" + room,
    //     type: "POST",
    //     data: {
    //       senderId: senderId,
    //       senderName: senderName
    //     },
    //     success: function() {
    //       $(this)
    //         .parent()
    //         .eq(1)
    //         .remove();
    //     }
    //   });
    //   $("#reload").load(location.href + " #reload");
    // });

    // $(document).on("click", "#cancel_friend", function() {
    //   var user_Id = $("#user_Id").val();

    //   $.ajax({
    //     url: "/group/" + room,
    //     type: "POST",
    //     data: {
    //       user_Id: user_Id
    //     },
    //     success: function() {
    //       $(this)
    //         .parent()
    //         .eq(1)
    //         .remove();
    //     }
    //   });
    //   $("#reload").load(location.href + " #reload");
    // });
  });

  $("#add_friend").on("submit", function(e) {
    e.preventDefault();

    let receiverName = $("#receiverName").val();

    $.ajax({
      url: "/group/" + room,
      type: "POST",
      data: {
        receiver: receiverName
      },
      success: function() {
        socket.emit(
          "friendRequest",
          {
            receiver: receiverName,
            sender: sender
          },
          function() {
            console.log("friendRequest sent");
          }
        );
      }
    });
  });

  $("#accept_friend").on("click", function(e) {
    e.preventDefault();

    var senderId = $("#senderId").val();
    var senderName = $("#senderName").val();

    $.ajax({
      url: "/group/" + room,
      type: "POST",
      data: {
        senderId: senderId,
        senderName: senderName
      },
      success: function() {
        // $("#reload").load(location.href + " #reload");
        console.log($(this));
        $(this).remove();
      }
    });
  });
});
