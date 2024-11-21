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

    // Clear the results content before adding new results
    resultsDiv.innerHTML = '';

    // Check if the array is empty
    if (tests.length === 0) {
        const noResultsMessage = `
            <div class="no-results-message">
                <p>No ${type === 'pending' ? 'pending' : 'completed'} tests found for the selected date.</p>
            </div>
        `;
        resultsDiv.innerHTML = noResultsMessage;
        return; // Stop further processing
    }

    // Loop through tests and add cards
    tests.forEach(test => {
        const statusLabel = type === 'pending' ? `<span class="status-label pending">Pending</span>` : `<span class="status-label complete">Complete</span>`;
        const completeDateInfo = type === 'complete' ? `<p class="order-date">Completed Date: ${test.completeDate}</p>` : '';
        const viewDownloadButtons = type === 'complete'
            ? `<a class="btn btn-success" href="https://localhost:44396/api/labTest/DownloadLabResult/${test.orderId}" download>Download</a>`
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

// Search functionality to filter results by date range
function searchResults() {
    const searchDate = document.getElementById("searchDate").value;

    if (!searchDate) {
        alert("Please select a date.");
        return;
    }

 
    const selectedDate = new Date(searchDate);

   
    const currentType = document.getElementById('pendingBtn').classList.contains('active') ? 'pending' : 'complete';

    let filteredTests = [];
    if (currentType === 'pending') {        filteredTests = pendingTests.filter(test => {
            const orderDate = new Date(test.orderDate);
            return orderDate.toDateString() === selectedDate.toDateString();
        });
    } else if (currentType === 'complete') {
   
        filteredTests = completeTests.filter(test => {
            const completeDate = new Date(test.completeDate);
            return completeDate.toDateString() === selectedDate.toDateString();
        });
    }

 
    loadResults(filteredTests, currentType);
}

// Clear search filters
function clearSearch() {
    document.getElementById("searchDate").value = "";

    
    const currentType = document.getElementById('pendingBtn').classList.contains('active') ? 'pending' : 'complete';
    toggleResults(currentType);
}




