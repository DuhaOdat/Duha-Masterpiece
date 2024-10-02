const pendingTests = [
    {
        testName: "Kidney Function Test Yellow Top Serum SP LB",
        provider: "RAGHAD, RAED ABD AL RAZZAQ",
        orderDate: "2024-07-28 04:31 PM"
    },
    {
        testName: "Troponin I Yellow-Top Serum SP LB",
        provider: "RAGHAD, RAED ABD AL RAZZAQ",
        orderDate: "2024-07-28 04:31 PM"
    }
];

const completeTests = [
    {
        testName: "Blood Glucose Test",
        provider: "DR. SMITH, JOHN",
        orderDate: "2024-05-22 10:00 AM",
        completeDate: "2024-05-23 02:45 PM",
        resultLink: "https://example.com/view/blood-glucose-test",
        downloadLink: "https://example.com/download/blood-glucose-test.pdf"
    },
    {
        testName: "Lipid Profile Test",
        provider: "DR. JANE DOE",
        orderDate: "2024-04-10 08:00 AM",
        completeDate: "2024-04-11 11:00 AM",
        resultLink: "https://example.com/view/lipid-profile-test",
        downloadLink: "https://example.com/download/lipid-profile-test.pdf"
    }
];

// On page load, show pending results
document.addEventListener("DOMContentLoaded", function () {
    toggleResults('pending');
});

function toggleResults(type) {
    const resultsDiv = document.getElementById('resultsContent');
    const pendingBtn = document.getElementById('pendingBtn');
    const completeBtn = document.getElementById('completeBtn');

    // Reset results content
    resultsDiv.innerHTML = '';

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

function loadResults(tests, type) {
    const resultsDiv = document.getElementById('resultsContent');
    tests.forEach(test => {
        const statusLabel = type === 'pending' ? `<span class="status-label pending">Pending</span>` : `<span class="status-label complete">Complete</span>`;
        const completeDateInfo = type === 'complete' ? `<p class="order-date">Completed Date: ${test.completeDate}</p>` : '';
        const viewDownloadButtons = type === 'complete' 
            ? `<button class="btn btn-info me-2" onclick="viewResult('${test.resultLink}')">View</button>
               <a class="btn btn-success" href="${test.downloadLink}" download>Download</a>` 
            : '';

        const card = `
            <div class="col-md-6">
                <div class="card ${type}">
                    <div class="card-header">
                        <strong>${test.testName}</strong>
                        ${statusLabel}
                    </div>
                    <div class="card-body">
                        <p class="provider-name">Provider: ${test.provider}</p>
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

// View result function (opens a new window)
function viewResult(link) {
    if (link) {
        window.open(link, '_blank');
    } else {
        alert("Result is not available yet.");
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