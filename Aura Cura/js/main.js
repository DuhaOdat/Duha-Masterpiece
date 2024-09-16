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
                          <div class="card-body hover-effect">
                              <i class="fas fa-calendar-alt fa-3x mb-3 text-primary"></i>
                              <h5 class="card-title">Appointments</h5>
                              <p class="card-text">Review your upcoming and past appointments.</p>
                              <a href="appointments.html" class="text-primary">See You Appointment</a>
                          </div>
                      </div>
                  </div>
                 
                  <div class="col-lg-4">
                      <div class="card text-center mb-4">
                          <div class="card-body hover-effect">
                              <i class="fas fa-vial fa-3x mb-3 text-primary"></i>
                              <h5 class="card-title">Lab Results</h5>
                              <p class="card-text">Access your lab test results and detailed reports.</p>
                              <a href="labResults.html" class="text-primary">See your lab results</a>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="card text-center mb-4">
                        <div class="card-body hover-effect">
                          <i class="fas fa-x-ray fa-3x mb-3 text-primary"></i>

                            <h5 class="card-title">Medical Images</h5>
                            <p class="card-text">Review your upcoming and past Medical Images.</p>
                            <a href="medical-images.html" class="text-primary">See Your Medical Image</a>
                        </div>
                    </div>
                </div>
              </div>

              <div class="row">
               
                <div class="col-lg-4">
                    <div class="card text-center mb-4">
                        <div class="card-body hover-effect">
                          <i class="fas fa-heartbeat fa-3x mb-3 text-success"></i>

                            <h5 class="card-title">Clinical  vitals</h5>
                            <p class="card-text">Review your current and past clinical vitals.</p>
                            <a href="profile.html" class="text-primary">See your clinical-vitals</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card text-center mb-4">
                        <div class="card-body hover-effect">
                          <i class="fas fa-hand-holding-heart fa-3x mb-3 text-danger"></i>

                            <h5 class="card-title">Blood Donation History</h5>
                            <p class="card-text">Access your lab test results and detailed reports.</p>
                            <a href="blood-donation.html" class="text-primary">See your Point</a>
                        </div>
                    </div>
                </div>
            </div>
          </div>

         

          </div>

                  
            `;
            break;


            case 'profile':
                htmlContent = `
             <div class="row gx-3 ">
  <h2 class="text-center">Patient General Information</h2>
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


<!-- end  Right Column: Health Tips -->

   <!-- Row starts -->
   <div class="row gx-3 mt-3">

    <h2 class="text-center">Clinical vitals</h2>
    <div class="col-xxl-3 col-sm-6 col-12">
      <div class="card mb-3">
        <div class="card-body">
          <div class="text-center">
            <div class="icon-box md bg-danger rounded-5 m-auto">
              <i class="ri-capsule-line fs-3"></i>
            </div>
            <div class="mt-3">
              <h5>BP Levels</h5>
              <p class="m-0 opacity-50">Recent five visits</p>
            </div>
          </div>
          <div id="bpLevels"></div>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>24/04/2024</div>
              <div>140</div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>16/04/2024</div>
              <div>190</div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>10/04/2024</div>
              <div>230</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-xxl-3 col-sm-6 col-12">
      <div class="card mb-3">
        <div class="card-body">
          <div class="text-center">
            <div class="icon-box md bg-info rounded-5 m-auto">
              <i class="ri-contrast-drop-2-line fs-3"></i>
            </div>
            <div class="mt-3">
              <h5>Sugar Levels</h5>
              <p class="m-0 opacity-50">Recent five visits</p>
            </div>
          </div>
          <div id="sugarLevels"></div>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>24/04/2024</div>
              <div>140</div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>16/04/2024</div>
              <div>190</div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>10/04/2024</div>
              <div>230</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-xxl-3 col-sm-6 col-12">
      <div class="card mb-3">
        <div class="card-body">
          <div class="text-center">
            <div class="icon-box md bg-success rounded-5 m-auto">
              <i class="ri-heart-pulse-line fs-3"></i>
            </div>
            <div class="mt-3">
              <h5>Heart Rate</h5>
              <p class="m-0 opacity-50">Recent five visits</p>
            </div>
          </div>
          <div id="heartRate"></div>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>24/04/2024</div>
              <div>110</div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>16/04/2024</div>
              <div>120</div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>10/04/2024</div>
              <div>100</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-xxl-3 col-sm-6 col-12">
      <div class="card mb-3">
        <div class="card-body">
          <div class="text-center">
            <div class="icon-box md bg-warning rounded-5 m-auto">
              <i class="ri-thermometer-line"></i>
            </div>
            <div class="mt-3">
              <h5>Fever</h5>
              <p class="m-0 opacity-50">Recent five visits</p>
            </div>
          </div>
          <div id="clolesterolLevels"></div>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>24/04/2024</div>
              <div>36.5</div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>16/04/2024</div>
              <div>38</div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>10/04/2024</div>
              <div>37.8</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- Row ends -->



         
        

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

        default:
            htmlContent = `<h2>Welcome, Patient Name</h2>`;
            break;
    }

    content.innerHTML = htmlContent;
    // Call the function to load pending results by default
    toggleResults('pending');
}







