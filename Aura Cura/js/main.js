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






//             case 'add-appointment':
//             htmlContent = `
//                 <!-- Appointment Booking Form Start -->
//                 <div class="container-fluid py-5 bg-light">
//                     <div class="container">
//                         <div class="row justify-content-center">
//                             <div class="col-lg-8">
//                                 <div class="card border-0 shadow p-4">
//                                     <h2 class="text-center mb-4">Book an Appointment</h2>
//                                     <form id="appointmentForm">
//                                         <div class="row g-3">
//                                             <!-- Full Name -->
//                                             <div class="col-md-6">
//                                                 <div class="form-group position-relative">
//                                                     <label for="name" class="form-label">Full Name</label>
//                                                     <div class="input-group">
//                                                         <span class="input-group-text bg-white border-end-0">
//                                                             <i class="bi bi-person text-primary"></i>
//                                                         </span>
//                                                         <input type="text" class="form-control border-start-0" id="name" placeholder="Enter your name">
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <!-- Email -->
//                                             <div class="col-md-6">
//                                                 <div class="form-group position-relative">
//                                                     <label for="email" class="form-label">Email Address</label>
//                                                     <div class="input-group">
//                                                         <span class="input-group-text bg-white border-end-0">
//                                                             <i class="bi bi-envelope text-primary"></i>
//                                                         </span>
//                                                         <input type="email" class="form-control border-start-0" id="email" placeholder="Enter your email">
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <!-- Phone -->
//                                             <div class="col-md-6">
//                                                 <div class="form-group position-relative">
//                                                     <label for="phone" class="form-label">Phone Number</label>
//                                                     <div class="input-group">
//                                                         <span class="input-group-text bg-white border-end-0">
//                                                             <i class="bi bi-telephone text-primary"></i>
//                                                         </span>
//                                                         <input type="text" class="form-control border-start-0" id="phone" placeholder="Enter your phone number">
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <!-- Date -->
//                                             <div class="col-md-6">
//                                                 <div class="form-group position-relative">
//                                                     <label for="date" class="form-label">Appointment Date</label>
//                                                     <div class="input-group">
//                                                         <span class="input-group-text bg-white border-end-0">
//                                                             <i class="bi bi-calendar text-primary"></i>
//                                                         </span>
//                                                         <input type="date" class="form-control border-start-0" id="date">
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <!-- Department -->
//                                             <div class="col-md-6">
//                                                 <div class="form-group position-relative">
//                                                     <label for="department" class="form-label">Select Department</label>
//                                                     <div class="input-group">
//                                                         <span class="input-group-text bg-white border-end-0">
//                                                             <i class="bi bi-building text-primary"></i>
//                                                         </span>
//                                                         <select class="form-select border-start-0" id="department">
//                                                             <option selected>Choose...</option>
//                                                             <option value="1">Cardiology</option>
//                                                             <option value="2">Dentistry</option>
//                                                             <option value="3">Ophthalmology</option>
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <!-- Doctor -->
//                                             <div class="col-md-6">
//                                                 <div class="form-group position-relative">
//                                                     <label for="doctor" class="form-label">Select Doctor</label>
//                                                     <div class="input-group">
//                                                         <span class="input-group-text bg-white border-end-0">
//                                                             <i class="bi bi-person-badge text-primary"></i>
//                                                         </span>
//                                                         <select class="form-select border-start-0" id="doctor">
//                                                             <option selected>Choose...</option>
//                                                             <option value="1">Dr. Luna Falah</option>
//                                                             <option value="2">Dr. Adam Crew</option>
//                                                             <option value="3">Dr. Kate Winslet</option>
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <!-- Message -->
//                                             <div class="col-12">
//                                                 <div class="form-group position-relative">
//                                                     <label for="message" class="form-label">Message</label>
//                                                     <div class="input-group">
//                                                         <span class="input-group-text bg-white border-end-0">
//                                                             <i class="bi bi-chat-left-text text-primary"></i>
//                                                         </span>
//                                                         <textarea class="form-control border-start-0" id="message" rows="3" placeholder="Enter your message"></textarea>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <!-- Submit Button -->
//                                             <div class="col-12 text-center">
//                                                 <button type="submit" class="btn btn-primary rounded-pill px-5 py-2 mt-3">Book Appointment</button>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <!-- Appointment Booking Form End -->
//             `;
//             break;
            
//             case 'show-appointments':
//                 htmlContent = `
//                     <div class="container py-5">
//                         <h2 class="mb-4">All Appointments</h2>
    
//                         <!-- Filter Buttons -->
//                         <div class="d-flex justify-content-center mb-4">
//                             <button class="btn btn-outline-primary me-2" onclick="filterAppointments('all')">All</button>
//                             <button class="btn btn-outline-success me-2" onclick="filterAppointments('accepted')">Accepted</button>
//                             <button class="btn btn-outline-warning me-2" onclick="filterAppointments('pending')">Pending</button>
//                             <button class="btn btn-outline-danger me-2" onclick="filterAppointments('rejected')">Rejected</button>
//                         </div>
    
//                         <!-- Appointment Cards using Flexbox -->
//                         <div id="appointment-list" class="d-flex flex-wrap gap-3">
//                             <!-- Appointment Card #1 -->
//                             <div class="card border-0 shadow p-4 mb-3" data-status="accepted" style="flex: 1 1 calc(33.333% - 1rem);">
//                                 <div class="badge bg-success text-white mb-2">Accepted</div>
//                                 <h5>Appointment #1</h5>
//                                 <p><strong>Full Name:</strong> John Doe</p>
//                                 <p><strong>Email:</strong> johndoe@example.com</p>
//                                 <p><strong>Phone:</strong> (123) 456-7890</p>
//                                 <p><strong>Date:</strong> 2024-09-20</p>
//                                 <p><strong>Department:</strong> Cardiology</p>
//                                 <p><strong>Doctor:</strong> Dr. Adam Crew</p>
//                                 <p><strong>Message:</strong> Need to discuss test results.</p>
    
//                                 <!-- Edit and Delete Buttons in one row -->
//                                 <div class="d-flex gap-2">
//                                     <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
//                                     <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
//                                 </div>
//                             </div>
    
//                             <!-- Appointment Card #2 -->
//                             <div class="card border-0 shadow p-4 mb-3" data-status="pending" style="flex: 1 1 calc(33.333% - 1rem);">
//                                 <div class="badge bg-warning text-white mb-2">Pending</div>
//                                 <h5>Appointment #2</h5>
//                                 <p><strong>Full Name:</strong> Jane Smith</p>
//                                 <p><strong>Email:</strong> janesmith@example.com</p>
//                                 <p><strong>Phone:</strong> (987) 654-3210</p>
//                                 <p><strong>Date:</strong> 2024-10-15</p>
//                                 <p><strong>Department:</strong> Dentistry</p>
//                                 <p><strong>Doctor:</strong> Dr. Kate Winslet</p>
//                                 <p><strong>Message:</strong> Follow-up on dental procedure.</p>
    
//                                 <!-- Edit and Delete Buttons in one row -->
//                                 <div class="d-flex gap-2">
//                                     <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
//                                     <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
//                                 </div>
//                             </div>
    
//                             <!-- Appointment Card #3 -->
//                             <div class="card border-0 shadow p-4 mb-3" data-status="rejected" style="flex: 1 1 calc(33.333% - 1rem);">
//                                 <div class="badge bg-danger text-white mb-2">Rejected</div>
//                                 <h5>Appointment #3</h5>
//                                 <p><strong>Full Name:</strong> Alex Brown</p>
//                                 <p><strong>Email:</strong> alexbrown@example.com</p>
//                                 <p><strong>Phone:</strong> (555) 123-4567</p>
//                                 <p><strong>Date:</strong> 2024-08-10</p>
//                                 <p><strong>Department:</strong> Ophthalmology</p>
//                                 <p><strong>Doctor:</strong> Dr. Luna Falah</p>
//                                 <p><strong>Message:</strong> Discuss eye surgery options.</p>
    
//                                 <!-- Edit and Delete Buttons in one row -->
//                                 <div class="d-flex gap-2">
                                    
//                                     <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
    
//                     <!-- Edit Appointment Modal -->
//                     <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
//                         <div class="modal-dialog">
//                             <div class="modal-content">
//                                 <div class="modal-header">
//                                     <h5 class="modal-title" id="editModalLabel">Edit Appointment</h5>
//                                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                                 </div>
//                                 <div class="modal-body">
//                                     <form>
//                                         <!-- Full Name -->
//                                         <div class="mb-3">
//                                             <label for="editName" class="form-label">Full Name</label>
//                                             <input type="text" class="form-control" id="editName" value="John Doe">
//                                         </div>
    
//                                         <!-- Email -->
//                                         <div class="mb-3">
//                                             <label for="editEmail" class="form-label">Email Address</label>
//                                             <input type="email" class="form-control" id="editEmail" value="johndoe@example.com">
//                                         </div>
    
//                                         <!-- Phone -->
//                                         <div class="mb-3">
//                                             <label for="editPhone" class="form-label">Phone Number</label>
//                                             <input type="text" class="form-control" id="editPhone" value="(123) 456-7890">
//                                         </div>
    
//                                         <!-- Date -->
//                                         <div class="mb-3">
//                                             <label for="editDate" class="form-label">Appointment Date</label>
//                                             <input type="date" class="form-control" id="editDate" value="2024-09-20">
//                                         </div>
    
//                                         <!-- Department -->
//                                         <div class="mb-3">
//                                             <label for="editDepartment" class="form-label">Select Department</label>
//                                             <select class="form-select" id="editDepartment">
//                                                 <option value="1" selected>Cardiology</option>
//                                                 <option value="2">Dentistry</option>
//                                                 <option value="3">Ophthalmology</option>
//                                             </select>
//                                         </div>
    
//                                         <!-- Doctor -->
//                                         <div class="mb-3">
//                                             <label for="editDoctor" class="form-label">Select Doctor</label>
//                                             <select class="form-select" id="editDoctor">
//                                                 <option value="1">Dr. Luna Falah</option>
//                                                 <option value="2" selected>Dr. Adam Crew</option>
//                                                 <option value="3">Dr. Kate Winslet</option>
//                                             </select>
//                                         </div>
    
//                                         <!-- Message -->
//                                         <div class="mb-3">
//                                             <label for="editMessage" class="form-label">Message</label>
//                                             <textarea class="form-control" id="editMessage" rows="3">Need to discuss test results.</textarea>
//                                         </div>
    
//                                         <!-- Submit Button -->
//                                         <button type="submit" class="btn btn-primary">Save Changes</button>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
    
//                     <!-- Delete Appointment Modal -->
//                     <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
//                         <div class="modal-dialog">
//                             <div class="modal-content">
//                                 <div class="modal-header">
//                                     <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
//                                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                                 </div>
//                                 <div class="modal-body">
//                                     <p>Are you sure you want to delete this appointment?</p>
//                                 </div>
//                                 <div class="modal-footer">
//                                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//                                     <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//                 break;
           


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




