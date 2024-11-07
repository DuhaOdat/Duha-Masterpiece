

document.addEventListener('DOMContentLoaded', function() {
    fetchBloodDonationRequests();
});

async function fetchBloodDonationRequests() {
    try {
        const response = await fetch('https://localhost:44396/api/bloodDonation/GetAllBloodDonationRequests');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const requests = await response.json();
        const tableBody = document.querySelector('#bloodDonationRequestTable tbody');

        // Clear any existing rows
        tableBody.innerHTML = '';

        requests.forEach((request, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${request.patientName}</td>
                <td>${request.bloodType}</td>
                <td>${new Date(request.requestDate).toLocaleString()}</td>
                <td>${request.preferredDonationDate ? new Date(request.preferredDonationDate).toLocaleString() : 'N/A'}</td>
                <td>${request.labTechnician}</td>
                <td>${request.status}</td>
                <td>${request.notes}</td>
                <td>${request.donationConfirmed ? 'Yes' : 'No'}</td>
                <td>
                    ${request.status === 'Pending' ? `<button class="btn btn-primary btn-sm" onclick="openProcessRequestModal(${request.requestId})">Process</button>` : ''}
                    ${request.status === 'Approved' && !request.donationConfirmed ? `<button class="btn btn-success btn-sm" onclick="confirmDonation(${request.requestId})">Confirm</button>` : ''}
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        
    } catch (error) {
        console.error('Error fetching blood donation requests:', error);
    }
}

// Function to open the modal and set the request ID
function openProcessRequestModal(requestId) {
    console.log("Request ID: ", requestId); // للتأكد من أن المعرف يظهر بشكل صحيح
    if (!requestId) {
        console.error("Request ID is undefined or null");
        return;
    }
    document.getElementById('requestId').value = requestId; // Set the request ID in the form
    const modal = new bootstrap.Modal(document.getElementById('processRequestModal'));
    modal.show();
}

document.getElementById('processRequestForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const requestId = document.getElementById('requestId').value;
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value;
    const userId = localStorage.getItem('userId'); // Get the userId of the logged-in lab technician from local storage

    // Create FormData object to send form data
    const formData = new FormData();
    formData.append('status', status);
    formData.append('notes', notes);
    formData.append('labTechnicianId', userId); // Send the userId of the lab technician

    try {
        const response = await fetch(`https://localhost:44396/api/bloodDonation/ProcessBloodDonationRequest/${requestId}`, {
            method: 'PUT',
            body: formData // Use FormData instead of JSON
        });

        const responseData = await response.json(); // Parse the response

        if (!response.ok) {
            console.error('Error details:', responseData); // Print error details
            throw new Error(`Error: ${response.statusText}`);
        }

        console.log('Request processed:', responseData);

        // Close the modal after success
        const modal = bootstrap.Modal.getInstance(document.getElementById('processRequestModal'));
        modal.hide();

        alert('Request processed successfully!');
        location.reload(); // Refresh the page or reload the data
    } catch (error) {
        console.error('Error processing request:', error);
        alert('Failed to process request');
    }
});
async function confirmDonation(requestId) {
    if (!requestId) {
        console.error("Request ID is undefined or null");
        return;
    }

    const confirm = window.confirm("Are you sure you want to confirm this donation?");
    if (!confirm) {
        return; // إذا قام المستخدم بإلغاء التأكيد، نخرج من الدالة
    }

    try {
        // لاحظ أنه تم إدراج requestId مباشرة في الرابط
        const response = await fetch(`https://localhost:44396/api/bloodDonation/ConfirmBloodDonation?requestId=${requestId}`, {
            method: 'POST', // استخدام POST لأنه تأكيد
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseData = await response.json(); // قراءة الرد من الخادم

        if (!response.ok) {
            console.error('Error details:', responseData); // طباعة تفاصيل الخطأ
            throw new Error(`Error: ${response.statusText}`);
        }

        alert('Donation confirmed successfully!');
        location.reload(); // إعادة تحميل الصفحة لتحديث البيانات
    } catch (error) {
        console.error('Error confirming donation:', error);
        alert('Failed to confirm the donation');
    }
}
