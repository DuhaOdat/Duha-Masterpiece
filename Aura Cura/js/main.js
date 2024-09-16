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



/*****dynamic sidebar */

function loadContent(section) {
    const content = document.getElementById('dynamic-content');
    let htmlContent = '';

    switch (section) {
        case 'dashboard':
            htmlContent = `
               <div class="app-body">

            <div id="dashboard" class="tab-content active">
              <div class="mb-4">
                  <h3>Welcome, patient Name</h3>
                  <p>Here you can manage your medical information, view upcoming appointments, and access lab results, etc.</p>
              </div>
              <div class="row">
                  <div class="col-lg-4">
                      <div class="card text-center mb-4">
                          <div class="card-body hover-effect"onclick="loadContent('show-appointments')">
                              <i class="fas fa-calendar-alt fa-3x mb-3 text-primary"></i>
                              <h5 class="card-title">Appointments</h5>
                              <p class="card-text">Review your upcoming and past appointments.</p>
                              <a href="#" class="text-primary">See You Appointment</a>
                          </div>
                      </div>
                  </div>
                 
                  <div class="col-lg-4">
                      <div class="card text-center mb-4">
                          <div class="card-body hover-effect"onclick="loadContent('lab-results')">
                              <i class="fas fa-vial fa-3x mb-3 text-primary"></i>
                              <h5 class="card-title">Lab Results</h5>
                              <p class="card-text">Access your lab test results and detailed reports.</p>
                              <a href="#" class="text-primary">See your lab results</a>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="card text-center mb-4">
                        <div class="card-body hover-effect"onclick="loadContent('medical-images')">
                          <i class="fas fa-x-ray fa-3x mb-3 text-primary"></i>

                            <h5 class="card-title">Medical Images</h5>
                            <p class="card-text">Review your upcoming and past Medical Images.</p>
                            <a href="#" class="text-primary">See Your Medical Image</a>
                        </div>
                    </div>
                </div>
              </div>

              <div class="row">
               
                <div class="col-lg-4">
                    <div class="card text-center mb-4">
                        <div class="card-body hover-effect" onclick="loadContent('profile')">
                          <i class="fas fa-user fa-3x mb-3 text-success"></i>

                            <h5 class="card-title">Profile</h5>
                            <p class="card-text">Review your Profile Where you can Show or edit it.</p>
                            <a href="#" class="text-primary">See your profile</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card text-center mb-4">
                        <div class="card-body hover-effect"  onclick="loadContent('blood-history')">
                          <i class="fas fa-hand-holding-heart fa-3x mb-3 text-danger"></i>

                            <h5 class="card-title">Blood Donation History</h5>
                            <p class="card-text">check Your earn Point and your donation history.</p>
                            <a href="#" class="text-primary">See your Point</a>
                        </div>
                    </div>
                </div>
                 <div class="col-lg-4">
                    <div class="card text-center mb-4">
                        <div class="card-body hover-effect"  onclick="loadContent('donation-rewards')">
                          <i class="fas fa-trophy fa-3x mb-3 text-warning"></i>

                            <h5 class="card-title">Blood Donation Rewards</h5>
                            <p class="card-text">check your recent reward and available reward.</p>
                            <a href="#" class="text-primary">See your reward</a>
                        </div>
                    </div>
                </div>
            </div>
          </div>

         

          </div>

                  
            `;
            break;

            case 'add-appointment':
            htmlContent = `
                <!-- Appointment Booking Form Start -->
                <div class="container-fluid py-5 bg-light">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <div class="card border-0 shadow p-4">
                                    <h2 class="text-center mb-4">Book an Appointment</h2>
                                    <form id="appointmentForm">
                                        <div class="row g-3">
                                            <!-- Full Name -->
                                            <div class="col-md-6">
                                                <div class="form-group position-relative">
                                                    <label for="name" class="form-label">Full Name</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-white border-end-0">
                                                            <i class="bi bi-person text-primary"></i>
                                                        </span>
                                                        <input type="text" class="form-control border-start-0" id="name" placeholder="Enter your name">
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Email -->
                                            <div class="col-md-6">
                                                <div class="form-group position-relative">
                                                    <label for="email" class="form-label">Email Address</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-white border-end-0">
                                                            <i class="bi bi-envelope text-primary"></i>
                                                        </span>
                                                        <input type="email" class="form-control border-start-0" id="email" placeholder="Enter your email">
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Phone -->
                                            <div class="col-md-6">
                                                <div class="form-group position-relative">
                                                    <label for="phone" class="form-label">Phone Number</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-white border-end-0">
                                                            <i class="bi bi-telephone text-primary"></i>
                                                        </span>
                                                        <input type="text" class="form-control border-start-0" id="phone" placeholder="Enter your phone number">
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Date -->
                                            <div class="col-md-6">
                                                <div class="form-group position-relative">
                                                    <label for="date" class="form-label">Appointment Date</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-white border-end-0">
                                                            <i class="bi bi-calendar text-primary"></i>
                                                        </span>
                                                        <input type="date" class="form-control border-start-0" id="date">
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Department -->
                                            <div class="col-md-6">
                                                <div class="form-group position-relative">
                                                    <label for="department" class="form-label">Select Department</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-white border-end-0">
                                                            <i class="bi bi-building text-primary"></i>
                                                        </span>
                                                        <select class="form-select border-start-0" id="department">
                                                            <option selected>Choose...</option>
                                                            <option value="1">Cardiology</option>
                                                            <option value="2">Dentistry</option>
                                                            <option value="3">Ophthalmology</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Doctor -->
                                            <div class="col-md-6">
                                                <div class="form-group position-relative">
                                                    <label for="doctor" class="form-label">Select Doctor</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-white border-end-0">
                                                            <i class="bi bi-person-badge text-primary"></i>
                                                        </span>
                                                        <select class="form-select border-start-0" id="doctor">
                                                            <option selected>Choose...</option>
                                                            <option value="1">Dr. Luna Falah</option>
                                                            <option value="2">Dr. Adam Crew</option>
                                                            <option value="3">Dr. Kate Winslet</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Message -->
                                            <div class="col-12">
                                                <div class="form-group position-relative">
                                                    <label for="message" class="form-label">Message</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-white border-end-0">
                                                            <i class="bi bi-chat-left-text text-primary"></i>
                                                        </span>
                                                        <textarea class="form-control border-start-0" id="message" rows="3" placeholder="Enter your message"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Submit Button -->
                                            <div class="col-12 text-center">
                                                <button type="submit" class="btn btn-primary rounded-pill px-5 py-2 mt-3">Book Appointment</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Appointment Booking Form End -->
            `;
            break;
            
            case 'show-appointments':
                htmlContent = `
                    <div class="container py-5">
                        <h2 class="mb-4">All Appointments</h2>
    
                        <!-- Filter Buttons -->
                        <div class="d-flex justify-content-center mb-4">
                            <button class="btn btn-outline-primary me-2" onclick="filterAppointments('all')">All</button>
                            <button class="btn btn-outline-success me-2" onclick="filterAppointments('accepted')">Accepted</button>
                            <button class="btn btn-outline-warning me-2" onclick="filterAppointments('pending')">Pending</button>
                            <button class="btn btn-outline-danger me-2" onclick="filterAppointments('rejected')">Rejected</button>
                        </div>
    
                        <!-- Appointment Cards using Flexbox -->
                        <div id="appointment-list" class="d-flex flex-wrap gap-3">
                            <!-- Appointment Card #1 -->
                            <div class="card border-0 shadow p-4 mb-3" data-status="accepted" style="flex: 1 1 calc(33.333% - 1rem);">
                                <div class="badge bg-success text-white mb-2">Accepted</div>
                                <h5>Appointment #1</h5>
                                <p><strong>Full Name:</strong> John Doe</p>
                                <p><strong>Email:</strong> johndoe@example.com</p>
                                <p><strong>Phone:</strong> (123) 456-7890</p>
                                <p><strong>Date:</strong> 2024-09-20</p>
                                <p><strong>Department:</strong> Cardiology</p>
                                <p><strong>Doctor:</strong> Dr. Adam Crew</p>
                                <p><strong>Message:</strong> Need to discuss test results.</p>
    
                                <!-- Edit and Delete Buttons in one row -->
                                <div class="d-flex gap-2">
                                    <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                                </div>
                            </div>
    
                            <!-- Appointment Card #2 -->
                            <div class="card border-0 shadow p-4 mb-3" data-status="pending" style="flex: 1 1 calc(33.333% - 1rem);">
                                <div class="badge bg-warning text-white mb-2">Pending</div>
                                <h5>Appointment #2</h5>
                                <p><strong>Full Name:</strong> Jane Smith</p>
                                <p><strong>Email:</strong> janesmith@example.com</p>
                                <p><strong>Phone:</strong> (987) 654-3210</p>
                                <p><strong>Date:</strong> 2024-10-15</p>
                                <p><strong>Department:</strong> Dentistry</p>
                                <p><strong>Doctor:</strong> Dr. Kate Winslet</p>
                                <p><strong>Message:</strong> Follow-up on dental procedure.</p>
    
                                <!-- Edit and Delete Buttons in one row -->
                                <div class="d-flex gap-2">
                                    <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                                </div>
                            </div>
    
                            <!-- Appointment Card #3 -->
                            <div class="card border-0 shadow p-4 mb-3" data-status="rejected" style="flex: 1 1 calc(33.333% - 1rem);">
                                <div class="badge bg-danger text-white mb-2">Rejected</div>
                                <h5>Appointment #3</h5>
                                <p><strong>Full Name:</strong> Alex Brown</p>
                                <p><strong>Email:</strong> alexbrown@example.com</p>
                                <p><strong>Phone:</strong> (555) 123-4567</p>
                                <p><strong>Date:</strong> 2024-08-10</p>
                                <p><strong>Department:</strong> Ophthalmology</p>
                                <p><strong>Doctor:</strong> Dr. Luna Falah</p>
                                <p><strong>Message:</strong> Discuss eye surgery options.</p>
    
                                <!-- Edit and Delete Buttons in one row -->
                                <div class="d-flex gap-2">
                                    
                                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <!-- Edit Appointment Modal -->
                    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="editModalLabel">Edit Appointment</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <!-- Full Name -->
                                        <div class="mb-3">
                                            <label for="editName" class="form-label">Full Name</label>
                                            <input type="text" class="form-control" id="editName" value="John Doe">
                                        </div>
    
                                        <!-- Email -->
                                        <div class="mb-3">
                                            <label for="editEmail" class="form-label">Email Address</label>
                                            <input type="email" class="form-control" id="editEmail" value="johndoe@example.com">
                                        </div>
    
                                        <!-- Phone -->
                                        <div class="mb-3">
                                            <label for="editPhone" class="form-label">Phone Number</label>
                                            <input type="text" class="form-control" id="editPhone" value="(123) 456-7890">
                                        </div>
    
                                        <!-- Date -->
                                        <div class="mb-3">
                                            <label for="editDate" class="form-label">Appointment Date</label>
                                            <input type="date" class="form-control" id="editDate" value="2024-09-20">
                                        </div>
    
                                        <!-- Department -->
                                        <div class="mb-3">
                                            <label for="editDepartment" class="form-label">Select Department</label>
                                            <select class="form-select" id="editDepartment">
                                                <option value="1" selected>Cardiology</option>
                                                <option value="2">Dentistry</option>
                                                <option value="3">Ophthalmology</option>
                                            </select>
                                        </div>
    
                                        <!-- Doctor -->
                                        <div class="mb-3">
                                            <label for="editDoctor" class="form-label">Select Doctor</label>
                                            <select class="form-select" id="editDoctor">
                                                <option value="1">Dr. Luna Falah</option>
                                                <option value="2" selected>Dr. Adam Crew</option>
                                                <option value="3">Dr. Kate Winslet</option>
                                            </select>
                                        </div>
    
                                        <!-- Message -->
                                        <div class="mb-3">
                                            <label for="editMessage" class="form-label">Message</label>
                                            <textarea class="form-control" id="editMessage" rows="3">Need to discuss test results.</textarea>
                                        </div>
    
                                        <!-- Submit Button -->
                                        <button type="submit" class="btn btn-primary">Save Changes</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <!-- Delete Appointment Modal -->
                    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <p>Are you sure you want to delete this appointment?</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'profile':
                htmlContent = `
             <div class="row gx-3 ">
  <h2 >Patient General Information</h2>
  <div class="col-12 col-sm-12 col-md-8 col-lg-10">
    <div class="card mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-3">
            <img src="img/person-icon.png" class="img-fluid rounded-2" style="max-width: 200px;" alt="Bootstrap Gallery">
          </div>
          <div class="col-sm-9">
            <div class="align-items-center">
              <div class="profile-content">
                <div class="row">
                  <div class="col-6">
                    <p class="profile-row"><span class="profile-label">Patient ID:</span> 9962009649</p>
                    <p class="profile-row"><span class="profile-label">Name:</span> Joud Doe</p>
                    <p class="profile-row"><span class="profile-label">Blood Type:</span> O+</p>
                    <p class="profile-row"><span class="profile-label">Gender:</span> Female</p>
                    <p class="profile-row"><span class="profile-label">Weight:</span> 72</p>
                  </div>
                  <div class="col-6">
                    <p class="profile-row"><span class="profile-label">Status:</span> UnMarried</p>
                    <p class="profile-row"><span class="profile-label">Date of Birth:</span> January 1, 1980</p>
                    <p class="profile-row"><span class="profile-label">Email:</span> johndoe@example.com</p>
                    <p class="profile-row"><span class="profile-label">Phone:</span> (123) 456-7890</p>
                    <p class="profile-row"><span class="profile-label">Address:</span> 123 Main St, Springfield, IL</p>
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-3">
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editPatientModal">
                    Edit Patient Details
                  </button>
                </div>

                <!-- Modal -->
                <div class="modal fade" id="editPatientModal" tabindex="-1" aria-labelledby="editPatientModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="editPatientModalLabel">Edit Patient Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="row gx-3">
                          <div class="col-xxl-6 col-lg-4 col-sm-6">
                            <div class="mb-3">
                              <label class="form-label" for="a1">First Name</label>
                              <input type="text" class="form-control" id="a1" value="Carole" disabled>
                            </div>
                            <div class="mb-3">
                              <label class="form-label" for="a2">Last Name</label>
                              <input type="text" class="form-control" id="a2" value="Dodson" disabled>
                            </div>
                            <div class="mb-3">
                              <label class="form-label" for="a3">Age</label>
                              <input type="number" class="form-control" id="age" value="30" disabled>
                            </div>
                            <div class="mb-3">
                              <label class="form-label" for="a3">Patient Id</label>
                              <input type="text" class="form-control" id="patients-id" value=" 9962009649" disabled>
                            </div>
                            <div class="mb-3">
                              <label class="form-label" for="a6">Address</label>
                              <input type="text" class="form-control" id="address" value="irbid">
                            </div>
                          </div>
                          <div class="col-xxl-6 col-lg-4 col-sm-6">
                            <div class="mb-3">
                              <label class="form-label" for="a3">Blood Type</label>
                              <input type="text" class="form-control" id="blood-type" value=" O+" disabled>
                            </div>
                            <div class="mb-3">
                              <label class="form-label" for="a5">Email</label>
                              <input type="email" class="form-control" id="a5" value="test@testing.com" disabled>
                            </div>
                            <div class="mb-3">
                              <label class="form-label" for="a6">Mobile Number</label>
                              <input type="text" class="form-control" id="a6" value="0987654321">
                            </div>
                            <div class="mb-3">
                              <label class="form-label" for="a6">Weight</label>
                              <input type="number" class="form-control" id="a6" value="72">
                            </div>
                            <div class="mb-3">
                              <label class="form-label" for="a7">Marital Status</label>
                              <select class="form-select" id="a7">
                                <option value="0">Married</option>
                                <option value="1">Un Married</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- end model -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<!-- end  -->

  
        </div>
                `;
                break;






        case 'lab-results':
            htmlContent = `
             <div class="app-container">

          <div class="container">
            <h2>Your Laboratory Orders / Results</h2>
        
            <!-- Search Functionality -->
            <div class="search-section">
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label for="fromDate" class="form-label">From Date</label>
                        <input type="date" class="form-control" id="fromDate">
                    </div>
                    <div class="col-md-3">
                        <label for="toDate" class="form-label">To Date</label>
                        <input type="date" class="form-control" id="toDate">
                    </div>
                    <div class="col-md-3 d-flex align-items-end">
                        <button class="btn btn-primary me-2" onclick="searchResults()">Search</button>
                        <button class="btn btn-secondary" onclick="clearSearch()">Clear Search</button>
                    </div>
                </div>
            </div>
        
            <!-- Toggle Switch for Pending/Complete -->
            <div class="toggle-switch d-flex justify-content-center mb-4">
                <button id="pendingBtn" class="switch-button active" onclick="toggleResults('pending')">Pending</button>
                <button id="completeBtn" class="switch-button" onclick="toggleResults('complete')">Complete</button>
            </div>

          
        
            <!-- Results Content -->
            <div id="resultsContent" class="row">
                <!-- Pending and Complete results will be dynamically inserted here -->
            </div>
        </div>
           
       

 <!-- Row starts -->


        </div>
            `;
            break;

        case 'medical-images':
            htmlContent = `
              <div class="container-fluid">
    <div class="container main-content">
        <h3>Your Medical Images / Reports</h3>
        <div class="content-box">
            <!-- Tabs for different types of medical images -->
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" id="xray-tab" data-bs-toggle="tab" href="#xray">X-ray</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="ct-tab" data-bs-toggle="tab" href="#ct">CT Scan</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="mri-tab" data-bs-toggle="tab" href="#mri">MRI</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="ultrasound-tab" data-bs-toggle="tab" href="#ultrasound">Ultrasound</a>
                </li>
            </ul>

            <div class="tab-content mt-4">
                <!-- X-ray Section -->
                <div class="tab-pane fade show active" id="xray">
                    <h5>X-ray Reports</h5>
                    <ul class="nav nav-pills mb-3">
                        <li class="nav-item">
                            <a class="nav-link active" id="xray-pending-tab" data-bs-toggle="tab" href="#xray-pending">Pending</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="xray-complete-tab" data-bs-toggle="tab" href="#xray-complete">Complete</a>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- Pending X-ray Reports -->
                        <div class="tab-pane fade show active" id="xray-pending">
                            <div class="report-item">
                                <h5 class="report-title">X-ray - Chest</h5>
                                <p class="order-date">Order Date: 2024-02-28</p>
                                <span class="badge bg-warning">Pending</span>
                            </div>
                            <div class="report-item">
                                <h5 class="report-title">X-ray - Spine</h5>
                                <p class="order-date">Order Date: 2024-03-15</p>
                                <span class="badge bg-warning">Pending</span>
                            </div>
                        </div>
                        <!-- Completed X-ray Reports -->
                        <div class="tab-pane fade" id="xray-complete">
                            <div class="report-item">
                                <h5 class="report-title">X-ray - Chest</h5>
                                <p class="order-date">Order Date: 2024-02-28</p>
                                <p class="complete-date">Complete Date: 2024-03-01</p>
                                <span class="badge bg-success">Complete</span>
                                <button class="btn btn-primary">View</button>
                                <button class="btn btn-success">Download</button>
                            </div>
                            <div class="report-item">
                                <h5 class="report-title">X-ray - Knee</h5>
                                <p class="order-date">Order Date: 2024-01-20</p>
                                <p class="complete-date">Complete Date: 2024-01-21</p>
                                <span class="badge bg-success">Complete</span>
                                <button class="btn btn-primary">View</button>
                                <button class="btn btn-success">Download</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CT Scan Section -->
                <div class="tab-pane fade" id="ct">
                    <h5>CT Scan Reports</h5>
                    <ul class="nav nav-pills mb-3">
                        <li class="nav-item">
                            <a class="nav-link active" id="ct-pending-tab" data-bs-toggle="tab" href="#ct-pending">Pending</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="ct-complete-tab" data-bs-toggle="tab" href="#ct-complete">Complete</a>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- Pending CT Scan Reports -->
                        <div class="tab-pane fade show active" id="ct-pending">
                            <div class="report-item">
                                <h5 class="report-title">CT Scan - Abdomen</h5>
                                <p class="order-date">Order Date: 2024-02-27</p>
                                <span class="badge bg-warning">Pending</span>
                            </div>
                            <div class="report-item">
                                <h5 class="report-title">CT Scan - Head</h5>
                                <p class="order-date">Order Date: 2024-03-10</p>
                                <span class="badge bg-warning">Pending</span>
                            </div>
                        </div>
                        <!-- Completed CT Scan Reports -->
                        <div class="tab-pane fade" id="ct-complete">
                            <div class="report-item">
                                <h5 class="report-title">CT Scan - Abdomen</h5>
                                <p class="order-date">Order Date: 2024-02-27</p>
                                <p class="complete-date">Complete Date: 2024-02-28</p>
                                <span class="badge bg-success">Complete</span>
                                <button class="btn btn-primary">View</button>
                                <button class="btn btn-success">Download</button>
                            </div>
                            <div class="report-item">
                                <h5 class="report-title">CT Scan - Lungs</h5>
                                <p class="order-date">Order Date: 2024-01-05</p>
                                <p class="complete-date">Complete Date: 2024-01-06</p>
                                <span class="badge bg-success">Complete</span>
                                <button class="btn btn-primary">View</button>
                                <button class="btn btn-success">Download</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MRI Section -->
                <div class="tab-pane fade" id="mri">
                    <h5>MRI Reports</h5>
                    <ul class="nav nav-pills mb-3">
                        <li class="nav-item">
                            <a class="nav-link active" id="mri-pending-tab" data-bs-toggle="tab" href="#mri-pending">Pending</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="mri-complete-tab" data-bs-toggle="tab" href="#mri-complete">Complete</a>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- Pending MRI Reports -->
                        <div class="tab-pane fade show active" id="mri-pending">
                            <div class="report-item">
                                <h5 class="report-title">MRI - Brain</h5>
                                <p class="order-date">Order Date: 2024-02-25</p>
                                <span class="badge bg-warning">Pending</span>
                            </div>
                            <div class="report-item">
                                <h5 class="report-title">MRI - Spine</h5>
                                <p class="order-date">Order Date: 2024-03-05</p>
                                <span class="badge bg-warning">Pending</span>
                            </div>
                        </div>
                        <!-- Completed MRI Reports -->
                        <div class="tab-pane fade" id="mri-complete">
                            <div class="report-item">
                                <h5 class="report-title">MRI - Brain</h5>
                                <p class="order-date">Order Date: 2024-02-25</p>
                                <p class="complete-date">Complete Date: 2024-02-26</p>
                                <span class="badge bg-success">Complete</span>
                                <button class="btn btn-primary">View</button>
                                <button class="btn btn-success">Download</button>
                            </div>
                            <div class="report-item">
                                <h5 class="report-title">MRI - Shoulder</h5>
                                <p class="order-date">Order Date: 2024-01-18</p>
                                <p class="complete-date">Complete Date: 2024-01-19</p>
                                <span class="badge bg-success">Complete</span>
                                <button class="btn btn-primary">View</button>
                                <button class="btn btn-success">Download</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ultrasound Section -->
                <div class="tab-pane fade" id="ultrasound">
                    <h5>Ultrasound Reports</h5>
                    <ul class="nav nav-pills mb-3">
                        <li class="nav-item">
                            <a class="nav-link active" id="ultrasound-pending-tab" data-bs-toggle="tab" href="#ultrasound-pending">Pending</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="ultrasound-complete-tab" data-bs-toggle="tab" href="#ultrasound-complete">Complete</a>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- Pending Ultrasound Reports -->
                        <div class="tab-pane fade show active" id="ultrasound-pending">
                            <div class="report-item">
                                <h5 class="report-title">Ultrasound - Abdomen</h5>
                                <p class="order-date">Order Date: 2024-02-26</p>
                                <span class="badge bg-warning">Pending</span>
                            </div>
                            <div class="report-item">
                                <h5 class="report-title">Ultrasound - Pelvis</h5>
                                <p class="order-date">Order Date: 2024-03-05</p>
                                <span class="badge bg-warning">Pending</span>
                            </div>
                        </div>
                        <!-- Completed Ultrasound Reports -->
                        <div class="tab-pane fade" id="ultrasound-complete">
                            <div class="report-item">
                                <h5 class="report-title">Ultrasound - Abdomen</h5>
                                <p class="order-date">Order Date: 2024-02-26</p>
                                <p class="complete-date">Complete Date: 2024-02-27</p>
                                <span class="badge bg-success">Complete</span>
                                <button class="btn btn-primary">View</button>
                                <button class="btn btn-success">Download</button>
                            </div>
                            <div class="report-item">
                                <h5 class="report-title">Ultrasound - Thyroid</h5>
                                <p class="order-date">Order Date: 2024-01-22</p>
                                <p class="complete-date">Complete Date: 2024-01-23</p>
                                <span class="badge bg-success">Complete</span>
                                <button class="btn btn-primary">View</button>
                                <button class="btn btn-success">Download</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
            `;
            break;

            case 'add-blood-donation':
            htmlContent = `
    <!-- Blood Donation Form Start -->
<div class="container-fluid py-5 bg-light">
    <div class="row justify-content-center">
      
        <div class="col-lg-12 col-md-10">
            <div class="card border-0 shadow p-4">
                <h2 class="text-center mb-4">Blood Donation Form</h2>
                <form action="submit-request.html" method="POST">
                    <div class="row">
                        <!-- Full Name -->
                        <div class="col-md-6 mb-3">
                            <label for="fullName" class="form-label">Full Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="fullName" name="fullName" placeholder="Enter your full name" required>
                        </div>

                        <!-- Phone Number -->
                        <div class="col-md-6 mb-3">
                            <label for="phoneNumber" class="form-label">Phone Number <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="phoneNumber" name="phoneNumber" placeholder="Enter your phone number" required>
                        </div>
                    </div>

                    <div class="row">
                        <!-- Email Address -->
                        <div class="col-md-6 mb-3">
                            <label for="emailAddress" class="form-label">Email Address <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="emailAddress" name="emailAddress" placeholder="Enter your email address" required>
                        </div>

                        <!-- Blood Type -->
                        <div class="col-md-6 mb-3">
                            <label for="bloodType" class="form-label">Blood Type <span class="text-danger">*</span></label>
                            <select class="form-select" id="bloodType" name="bloodType" required>
                                <option value="" selected>Select your blood type</option>
                                <option value="A+">A+</option>
                                <option value="B+">B+</option>
                                <option value="O+">O+</option>
                                <option value="AB+">AB+</option>
                                <option value="A-">A-</option>
                                <option value="B-">B-</option>
                                <option value="O-">O-</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <!-- Donation Date -->
                        <div class="col-md-6 mb-3">
                            <label for="donationDate" class="form-label">Preferred Donation Date</label>
                            <input type="date" class="form-control" id="donationDate" name="donationDate" required>
                        </div>

                        <!-- Comments -->
                        <div class="col-md-6 mb-3">
                            <label for="comments" class="form-label">Additional Information</label>
                            <textarea class="form-control" id="comments" name="comments" rows="3" placeholder="Any additional information"></textarea>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary rounded-pill px-4 py-2">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- Blood Donation Form End -->


                          
            `;
            break;
            case 'show-blood-donations':
                // افتراض أن فصيلة الدم ثابتة للمستخدم
                let bloodType = 'O+'; // يمكنك تغيير هذا وفقًا لفصيلة دم المستخدم
            
                            // بيانات المريض
                let patientInfo = {
                    fullName: 'John Doe',
                    phoneNumber: '(123) 456-7890',
                    emailAddress: 'john.doe@example.com',
                };
                                // حساب النقاط بناءً على كل طلب
                let requests = [
                    { date: 'August 5, 2024', donationDate: 'August 10, 2024', status: 'Accepted', comments: 'Successful donation' },
                    { date: 'July 1, 2024', donationDate: 'July 3, 2024', status: 'Accepted', comments: 'Successful donation' },
                    { date: 'June 15, 2024', donationDate: 'June 18, 2024', status: 'Accepted', comments: 'Successful donation' }
                ];
            
                // تحديد عدد النقاط لكل تبرع ناجح
                let pointsPerDonation = 10; // مثلاً 100 نقطة لكل تبرع ناجح
            
                // حساب إجمالي النقاط بناءً على الطلبات السابقة
                let totalPoints = requests.reduce((sum, request) => {
                    if (request.status === 'Accepted') {
                        return sum + pointsPerDonation;
                    }
                    return sum;
                }, 0);
            
                htmlContent = `
                <!-- Request Status Page Start -->
            <div class="container-fluid py-5">
                <div class="container">
                    <h2 class="mb-4 text-center">Your Blood Donation Requests</h2>
            
                    <!-- Points Tracker Start -->
                    <div class="mb-4">
                        <h4 class="text-center">Your Current Points: <span id="currentPoints">${totalPoints}</span> / 600</h4>
                        <div class="progress mb-4">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${totalPoints / 6}%" aria-valuenow="${totalPoints}" aria-valuemin="0" aria-valuemax="600"></div>
                        </div>
                    </div>
                    <!-- Points Tracker End -->
            
                    <!-- Current Request -->
                    <div class="card mb-4">
                        <div class="card-header bg-primary text-white">
                            <h5>Current Request</h5>
                        </div>
                        <div class="card-body">
                            <h6>Request Date: September 10, 2024</h6>
                             <p><strong>Patient Name:</strong> ${patientInfo.fullName}</p>
                             <p><strong>Phone Number:</strong> ${patientInfo.phoneNumber}</p>
                             <p><strong>Email Address:</strong> ${patientInfo.emailAddress}</p>
                            <p>Blood Type: ${bloodType}</p>
                            <p>Donation Date: September 15, 2024</p>
                            <p>Status: <strong class="text-warning">Pending</strong></p>
                        </div>
                    </div>
            
                    <!-- Previous Requests -->
                    <h3 class="mb-4">Previous Requests</h3>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Request Date</th>
                                    <th>Donation Date</th>
                                    <th>Status</th>
                                    <th>Comments</th>
                                    <th>Points Earned</th> <!-- عمود النقاط المكتسبة -->
                                </tr>
                            </thead>
                            <tbody>
                                ${requests.map(request => `
                                <tr>
                                    <td>${request.date}</td>
                                    <td>${request.donationDate}</td>
                                    <td class="${request.status === 'Accepted' ? 'text-success' : 'text-danger'}">${request.status}</td>
                                    <td>${request.comments}</td>
                                    <td>${request.status === 'Accepted' ? pointsPerDonation : 0}</td> <!-- النقاط المكتسبة -->
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
            
                    <!-- Point -->
                    <div class="mt-5">
                        <h4 class="mb-4 text-center">Point:</h4>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">10 points - O+</li>
                            <li class="list-group-item">15 points - O-</li>
                            <li class="list-group-item">8 points - A+</li>
                            <li class="list-group-item">12 points - A-</li>
                            <li class="list-group-item">8 points - B+</li>
                            <li class="list-group-item">12 points - B-</li>
                            <li class="list-group-item">6 points - AB+</li>
                            <li class="list-group-item">10 points - AB-</li>
                        </ul>
                    </div>
                    <!-- Rewards Section End -->
                </div>
            </div>
            <!-- Request Status Page End -->
                `;
                break;
                case 'donation-rewards':
                    htmlContent = `
                    <!-- Donation Rewards Start -->
                <div class="container ">
                         <div class="mb-4">
                        <h2 class="mb-4">Donation Rewards</h2>
                        
                    </div>
                   
                     <div class="row g-4">
        <!-- Package 1 -->
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card border-0 shadow-sm h-100 card-custom-bg ">
                <img class="card-img-top fixed-image-size" src="img/reward1.png" alt="Package 1">
                <div class="card-body text-center">
                    <h5 class="card-title">Basic Health Checkup</h5>
                    <p class="card-text">Earn 100 points to redeem a free basic health checkup at our hospital.</p>
                    <p class="text-primary">Points Required: 100</p>
                </div>
            </div>
        </div>
       
         <!-- Package 2 -->
         <div class="col-lg-4 col-md-6 mb-4">
            <div class="card border-0 shadow-sm h-100 card-custom-bg">
                <img class="card-img-top fixed-image-size" src="img/reward2.png" alt="Package 4">
                <div class="card-body text-center">
                    <h5 class="card-title">Health Package</h5>
                    <p class="card-text">Earn 150 points to redeem a health package at our hospital.</p>
                    <p class="text-primary">Points Required: 150</p>
                </div>
            </div>
        </div>
         <!-- Package 3 -->
         <div class="col-lg-4 col-md-6 mb-4">
            <div class="card border-0 shadow-sm h-100 card-custom-bg">
                <img class="card-img-top fixed-image-size" src="img/reward3.png" alt="Package 2">
                <div class="card-body text-center">
                    <h5 class="card-title">Comprehensive Blood Test</h5>
                    <p class="card-text">Earn 200 points to redeem a comprehensive blood test package.</p>
                    <p class="text-primary">Points Required: 200</p>
                </div>
            </div>
        </div>
      
    </div>
     
    <div class="row g-4">
    <div class="col-lg-4 col-md-6 mb-4">
    <div class="card border-0 shadow-sm h-100 card-custom-bg">
       <img class="card-img-top fixed-image-size" src="img/reward4.png" alt="Package 4" > 
        <div class="card-body text-center">
            <h5 class="card-title">Special Blood Test</h5>
            <p class="card-text">Earn 250 points to redeem a special blood test package.</p>
            <p class="text-primary">Points Required: 250</p>
        </div>
    </div>
</div>

         <!-- Package 5 -->
         <div class="col-lg-4 col-md-6 mb-4">
            <div class="card border-0 shadow-sm h-100 card-custom-bg">
                <img class="card-img-top fixed-image-size" src="img/reward5.png" alt="Package 3">
                <div class="card-body text-center">
                    <h5 class="card-title">Full Body Checkup</h5>
                    <p class="card-text">Earn 500 points to redeem a full body checkup package.</p>
                    <p class="text-primary">Points Required: 500</p>
                </div>
            </div>
        </div>
        <!-- Package 6 -->
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card border-0 shadow-sm h-100 card-custom-bg">
                <img class="card-img-top fixed-image-size" src="img/reward6.png" alt="Package 6">
                <div class="card-body text-center">
                    <h5 class="card-title">VIP Health Checkup</h5>
                    <p class="card-text">Earn 600 points to redeem a VIP health checkup package.</p>
                    <p class="text-primary">Points Required: 600</p>
                </div>
            </div>
        </div>
    </div>
                </div>
                <!-- Donation Rewards End -->
                    `;
                    break;
                
            
        default:
            htmlContent = `<h2>Welcome, Patient Name</h2>`;
            break;
    }

    content.innerHTML = htmlContent;

        // حفظ القسم الحالي في LocalStorage
    localStorage.setItem('currentSection', section);

    // تحديث حالة التنقل لتظهر أي عنصر نشط
    updateActiveNav(section);



    // Call the function to load pending results by default
    toggleResults('pending');


        // Add event listener for delete confirmation
        if (section === 'show-appointments') {
            document.getElementById('confirmDelete').addEventListener('click', function () {
                alert('Appointment deleted successfully!');
                var deleteModal = bootstrap.Modal.getInstance(document.querySelector('#deleteModal'));
                deleteModal.hide();
            });
        }
}

function updateActiveNav(section) {
    // إزالة الـ class "active" من جميع روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // إضافة الـ class "active" للرابط المناسب بناءً على القسم المفتوح
    const activeLink = document.querySelector(`a[onclick="loadContent('${section}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
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
