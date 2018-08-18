$(document).ready(function() {
  $("#favorite").on("submit", function() {
    let id = $("#id").val();
    let clubName = $("#club_name").val();

    $.ajax({
      url: "/home",
      type: "POST",
      data: {
        id: id,
        clubName: clubName
      },
      success: function() {}
    });
  });
});
