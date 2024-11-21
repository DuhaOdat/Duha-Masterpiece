(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });
    
})(jQuery);







const bloodDonationToggle = document.getElementById('bloodDonationToggle');
if (bloodDonationToggle) {
    bloodDonationToggle.addEventListener('click', function () {
        const submenu = document.getElementById('bloodDonationSubmenu');
        const arrow = document.getElementById('bloodDonationArrow');
        
        if (submenu.style.display === 'none') {
            submenu.style.display = 'block';
            arrow.classList.remove('fa-chevron-down');
            arrow.classList.add('fa-chevron-up');
        } else {
            submenu.style.display = 'none';
            arrow.classList.remove('fa-chevron-up');
            arrow.classList.add('fa-chevron-down');
        }
    });
    console.log("Blood donation toggle event added.");
} else {
    console.error("Blood donation toggle not found.");
}



       

       

         
             





function filterAppointments(status) {
    const appointments = document.querySelectorAll('#appointment-list .card');
    appointments.forEach(function (appointment) {
        if (status === 'all' || appointment.getAttribute('data-status') === status) {
            appointment.style.display = 'block';
        } else {
            appointment.style.display = 'none';
        }
    });



}


document.addEventListener("DOMContentLoaded", function () {
    // Check if the JWT token and userRole exist in localStorage
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('userRole');
    const UserId = localStorage.getItem('userId');

    // Select the Patient Portal link and Login button using querySelector
    const patientPortalLink = document.querySelector("a[href='patient-portal.html']");
    const loginButton = document.querySelector("a[href='login.html']");

    // Check if the Patient Portal link exists before manipulating it
    if (patientPortalLink) {
        patientPortalLink.style.display = 'none'; // Initially hide the Patient Portal link
    }

    // If the user is logged in (token exists) and the role is 'User'
    if (token && role === 'Patient') {
        if (patientPortalLink) {
            patientPortalLink.style.display = 'inline-block'; // Show the link
        }

        if (loginButton) {
            loginButton.textContent = 'Logout';
            loginButton.href = '#';  // Prevent navigating to login page

            // Ensure the loginButton exists before adding the event listener
            loginButton.addEventListener('click', function () {
                // Logout functionality: Remove token and role from localStorage
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userId');

                // Notify the user and reload the page
                alert('Logged out successfully');
                window.location.href = 'index.html'; // Redirect to homepage after logout
            });
        }
    }
});



function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hidden');
}


