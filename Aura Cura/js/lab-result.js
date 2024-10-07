let pendingTests = [];
let completeTests = [];

document.addEventListener("DOMContentLoaded", function () {
    toggleResults('pending'); // عرض النتائج المعلقة عند تحميل الصفحة
    fetchLabResults(); // جلب النتائج من API
});

// Function to toggle between pending and completed tests
function toggleResults(type) {
    const resultsDiv = document.getElementById('resultsContent');
    const pendingBtn = document.getElementById('pendingBtn');
    const completeBtn = document.getElementById('completeBtn');

    // Reset results content
    resultsDiv.innerHTML = '';

    // Load the pending or completed tests based on the button clicked
    if (type === 'pending') {
        pendingBtn.classList.add('active');
        completeBtn.classList.remove('active');
        loadResults(pendingTests, 'pending');
    } else if (type === 'complete') {
        completeBtn.classList.add('active');
        pendingBtn.classList.remove('active');
        loadResults(completeTests, 'complete');
    }
}

// Function to dynamically load results into the page
function loadResults(tests, type) {
    const resultsDiv = document.getElementById('resultsContent');
    tests.forEach(test => {
        console.log(tests);

        const statusLabel = type === 'pending' ? `<span class="status-label pending">Pending</span>` : `<span class="status-label complete">Complete</span>`;
      
        const completeDateInfo = type === 'complete' ? `<p class="order-date">Completed Date: ${test.completeDate}</p>` : '';

        // Removed the View button and kept only the Download button
        const viewDownloadButtons = type === 'complete'
        ? `<a class="btn btn-success" href="https://localhost:44396/api/labTest/DownloadLabResult/${test.orderId}" download>Download</a>`  // استخدام API لتحميل PDF
        : '';
    

        const card = `
            <div class="col-md-6">
                <div class="card ${type}">
                    <div class="card-header">
                        <strong>${test.testName}</strong>
                        ${statusLabel}
                    </div>
                    <div class="card-body lab">
                        <p class="provider-name">Provider: ${test.doctorName}</p>
                        <p class="order-date">Order Date: ${test.orderDate}</p>
                        ${completeDateInfo}
                        ${viewDownloadButtons}
                    </div>
                </div>
            </div>
        `;
        resultsDiv.innerHTML += card;
    });
}

// Fetch lab results from the API
async function fetchLabResults() {
    const patientId = localStorage.getItem('userId'); // احصل على الـ ID من localStorage
    const token = localStorage.getItem('jwtToken');

    try {
        // Fetch pending lab tests
        let pendingResponse = await fetch(`https://localhost:44396/api/labTest/GetPendingLabTestsForPatient/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (pendingResponse.ok) {
            pendingTests = await pendingResponse.json();
        } else {
            console.error("Failed to fetch pending lab results");
        }

        // Fetch completed lab tests
        let completeResponse = await fetch(`https://localhost:44396/api/labTest/GetCompletedLabTestsForPatient/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (completeResponse.ok) {
            completeTests = await completeResponse.json();
            console.log("Completed Tests:", completeTests); // للتحقق من البيانات
        } else {
            console.error("Failed to fetch completed lab results");
        }

        // Reload the current view (pending by default)
        toggleResults('pending');
    } catch (error) {
        console.error("Error fetching lab results:", error);
    }
}

// Search functionality (simple demo, can be expanded)
function searchResults() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    // In a real scenario, you'd filter the test data based on the date range and refresh the results.
    alert(`Searching tests from ${fromDate} to ${toDate}`);
}

// Clear search filters
function clearSearch() {
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    toggleResults('pending'); // Reload original results
}
