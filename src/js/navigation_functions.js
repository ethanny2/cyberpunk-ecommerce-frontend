/* Rewrite in vanilla JS*/

function openNav() {
  document.getElementById("myNav").style.width = "100%";
  $("#logo").hide();
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  $("#logo").show();
}

/* Hide the height content of all the subsections */
$(document).ready(function () {
  /* Default hidden content*/
  $("#about_content").hide();
  $("#shop_content").hide();
  $("#contact_content").hide();

  $(".about_sub").click(function () {
    console.log("Calling click function on about");
    if ($("#about_content").is(":hidden")) {
      /*Slide up */
      /* Slide down*/
      $("#about_content").slideDown("slow");
      console.log("Sliding down");
    } else {
      console.log("Sliding up");
      $("#about_content").slideUp("slow");
    }
  });
  $(".shop_sub").click(function () {
    console.log("Calling click function on about");
    if ($("#shop_content").is(":hidden")) {
      /*Slide up */
      /* Slide down*/
      $("#shop_content").slideDown("slow");
      console.log("Sliding down");
    } else {
      console.log("Sliding up");
      $("#shop_content").slideUp("slow");
    }
  });
  $(".contact_sub").click(function () {
    console.log("Calling click function on about");
    if ($("#contact_content").is(":hidden")) {
      /*Slide up */
      /* Slide down*/
      $("#contact_content").slideDown("slow");
      console.log("Sliding down");
    } else {
      console.log("Sliding up");
      $("#contact_content").slideUp("slow");
    }
  });
});
