async function loadRewardClaims() {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token for authorization
    try {
        const response = await fetch('https://localhost:44396/api/bloodDonation/getAllRewardClaims', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch reward claims.');

        const rewardClaims = await response.json();
        const tbody = document.querySelector('#rewardClaimTable tbody');
        tbody.innerHTML = ''; // Clear existing rows

        rewardClaims.forEach((claim, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${claim.userFullName}</td>
                <td>${claim.rewardName}</td>
                <td>${claim.claimedDate ? new Date(claim.claimedDate).toLocaleDateString() : 'N/A'}</td>
                <td>${claim.emailSentDate ? new Date(claim.emailSentDate).toLocaleDateString() : 'Not Sent'}</td>
                <td>${claim.isCollected ? 'Collected' : 'Pending'}</td>
                <td>${claim.collectedDate ? new Date(claim.collectedDate).toLocaleDateString() : 'Not Collected'}</td>
                <td>
                    <!-- Date input for processing date and Send Email button -->
                    <label for="processingDate${index}">Select Processing Date:</label>
                    <input type="date" id="processingDate${index}" required ${claim.isCollected ? 'disabled' : ''}>
                    <button class="btn btn-primary btn-sm" onclick="sendEmail(${claim.id}, document.getElementById('processingDate${index}').value)" ${claim.isCollected ? 'disabled' : ''}>Send Email</button>
                    
                    <!-- Mark as Collected button -->
                    <button class="btn btn-success btn-sm" onclick="markAsCollected(${claim.id})" ${claim.isCollected ? 'disabled' : ''}>Mark as Collected</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load reward claims.');
    }
}


async function sendEmail(rewardClaimId, processingDate) {
    const token = localStorage.getItem('jwtToken');

    // Ensure the date is in ISO format (YYYY-MM-DD)
    if (!processingDate) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select a processing date.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }
    const formattedProcessingDate = new Date(processingDate).toISOString();

    console.log("Sending email with payload:", { rewardClaimId, processingDate: formattedProcessingDate });

    try {
        const response = await fetch('https://localhost:44396/api/bloodDonation/sendCongratulatoryEmail', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rewardClaimId: rewardClaimId,
                processingDate: formattedProcessingDate
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error('Failed to send email.');
        }

        Swal.fire({
            title: 'Success!',
            text: 'Email sent successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        loadRewardClaims();
    } catch (error) {
        console.error('Error in sendEmail:', error);
        
        Swal.fire({
            title: 'Error!',
            text: 'Failed to send email. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}




async function markAsCollected(rewardClaimId) {
    const token = localStorage.getItem('jwtToken');
    console.log("Marking as collected for Reward Claim ID:", rewardClaimId); // Debugging log

    try {
        const response = await fetch(`https://localhost:44396/api/bloodDonation/markAsCollected/${rewardClaimId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to mark as collected.');
        }

        console.log("Marked as collected successfully!");
        
        // Use SweetAlert2 to display success message
        Swal.fire({
            icon: 'success',
            title: 'Marked as Collected',
            text: 'The reward has been marked as collected successfully!',
            confirmButtonText: 'OK'
        }).then(() => {
            loadRewardClaims(); // Reload to update the collected status after confirmation
        });

    } catch (error) {
        console.error("Error in markAsCollected:", error);
        
        // Use SweetAlert2 to display error message
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to mark as collected.',
            confirmButtonText: 'OK'
        });
    }
}


// Load reward claims on page load
document.addEventListener('DOMContentLoaded', loadRewardClaims);
