console.log("connected");
$("#jokebtn").on("click", function(){
    $.ajax({
      method: "POST",
      url: "/jokes",
      success: function(result,status)
      {
          $("#setup").html(result.setup);
          $("#punchline").html(result.punchline);
          console.log(result);
      },
      error(err)
      {
          console.log(err);
      }
    });
});
