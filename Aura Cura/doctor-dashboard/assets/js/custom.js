$.sidebarMenu = function (menu) {
  var animationSpeed = 300;

  $(menu).on("click", "li a", function (e) {
    var $this = $(this);
    var checkElement = $this.next();

    if (checkElement.is(".treeview-menu") && checkElement.is(":visible")) {
      checkElement.slideUp(animationSpeed, function () {
        checkElement.removeClass("menu-open");
      });
      checkElement.parent("li").removeClass("active");
    }

    //If the menu is not visible
    else if (
      checkElement.is(".treeview-menu") &&
      !checkElement.is(":visible")
    ) {
      //Get the parent menu
      var parent = $this.parents("ul").first();
      //Close all open menus within the parent
      var ul = parent.find("ul:visible").slideUp(animationSpeed);
      //Remove the menu-open class from the parent
      ul.removeClass("menu-open");
      //Get the parent li
      var parent_li = $this.parent("li");

      //Open the target menu and add the menu-open class
      checkElement.slideDown(animationSpeed, function () {
        //Add the class active to the parent li
        checkElement.addClass("menu-open");
        parent.find("li.active").removeClass("active");
        parent_li.addClass("active");
      });
    }
    //if this isn't a link, prevent the page from being redirected
    if (checkElement.is(".treeview-menu")) {
      e.preventDefault();
    }
  });
};
$.sidebarMenu($(".sidebar-menu"));

// Custom Sidebar JS
jQuery(function ($) {
  //toggle sidebar
  $(".toggle-sidebar").on("click", function () {
    $(".page-wrapper").toggleClass("toggled");
  });

  // Pin sidebar on click
  $(".pin-sidebar").on("click", function () {
    if ($(".page-wrapper").hasClass("pinned")) {
      // unpin sidebar when hovered
      $(".page-wrapper").removeClass("pinned");
      $("#sidebar").unbind("hover");
    } else {
      $(".page-wrapper").addClass("pinned");
      $("#sidebar").hover(
        function () {
          console.log("mouseenter");
          $(".page-wrapper").addClass("sidebar-hovered");
        },
        function () {
          console.log("mouseout");
          $(".page-wrapper").removeClass("sidebar-hovered");
        }
      );
    }
  });

  // Pinned sidebar
  $(function () {
    $(".page-wrapper").hasClass("pinned");
    $("#sidebar").hover(
      function () {
        console.log("mouseenter");
        $(".page-wrapper").addClass("sidebar-hovered");
      },
      function () {
        console.log("mouseout");
        $(".page-wrapper").removeClass("sidebar-hovered");
      }
    );
  });

  // Toggle sidebar overlay
  $("#overlay").on("click", function () {
    $(".page-wrapper").toggleClass("toggled");
  });

  // Added by Srinu
  $(function () {
    // When the window is resized,
    $(window).resize(function () {
      // When the width and height meet your specific requirements or lower
      if ($(window).width() <= 768) {
        $(".page-wrapper").removeClass("pinned");
      }
    });
    // When the window is resized,
    $(window).resize(function () {
      // When the width and height meet your specific requirements or lower
      if ($(window).width() >= 768) {
        $(".page-wrapper").removeClass("toggled");
      }
    });
  });
});

// Loading
$(function () {
  $("#loading-wrapper").fadeOut(2000);
});

$(function () {
  $(".day-sorting .btn").on("click", function () {
    $(".day-sorting .btn").removeClass("btn-primary");
    $(this).addClass("btn-primary");
  });
});


/***********
***********
***********
  Bootstrap JS 
***********
***********
***********/

// Tooltip
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Popover
var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
);
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});


/*************************************** */
async function loadImageProfile() {
  let userId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage
  let token = localStorage.getItem('jwtToken'); // Retrieve the token

  // Ensure the UserId and token exist before fetching data
  if (!userId || !token) {
      console.error("User ID or token missing");
      return;
  }

  let url = `https://localhost:44396/api/Doctors/GetDoctorByUserId/${userId}`; // Correct API URL

  try {
      let response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,  // Include the JWT token in the request
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`Error fetching Doctor profile: ${response.statusText}`);
      }

      let data = await response.json();
      console.log(data);

      // عرض صورة الطبيب
      if (data.image) {
          document.getElementById('doctor-profile-image2').src = `../../../../backend/Auera-Cura/Auera-Cura/Uploads/${data.image}`;
      } else {
          document.getElementById('doctor-profile-image2').src = 'default-image-path.jpg'; // صورة افتراضية إذا لم تكن هناك صورة للطبيب
      }

  } catch (error) {
      console.error("Error loading doctor profile image:", error);
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", loadImageProfile);


// document.getElementById("admin-name-header")=logcal