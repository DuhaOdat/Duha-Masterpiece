document.addEventListener("DOMContentLoaded", () => {
    fetchAllFeedback();
});

async function fetchAllFeedback() {
    try {
        const response = await fetch("https://localhost:44396/api/Feedback/GetAllFeedBack");
        if (response.ok) {
            const feedbackData = await response.json();
            populateFeedbackTable(feedbackData);
        } else {
            console.error("Failed to fetch feedback data:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function populateFeedbackTable(feedbackData) {
    const feedbackList = document.getElementById("feedback-list");
    feedbackList.innerHTML = ""; // Clear existing content

    feedbackData.forEach((feedback, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${feedback.username}</td>
            <td>${feedback.testimonialMessege}</td>
            <td>${feedback.isAccept ? "Accepted" : "Pending"}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="acceptFeedback(${feedback.testimonialId})">Accept</button>
                <button class="btn btn-danger btn-sm" onclick="deleteFeedback(${feedback.testimonialId})">Delete</button>
            </td>
        `;

        feedbackList.appendChild(row);
    });
}

// Function to accept feedback (mark as accepted)
async function acceptFeedback(feedbackId) {
    try {
        const response = await fetch(`https://localhost:44396/api/Feedback/UpdateFeedBackIsActive/${feedbackId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(true) // Set isActive to true
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Feedback Accepted',
                text: 'The feedback has been marked as accepted.',
                confirmButtonText: 'OK'
            });
            fetchAllFeedback(); // Refresh the feedback list
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to accept feedback. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to delete feedback
async function deleteFeedback(feedbackId) {
    try {
        const response = await fetch(`https://localhost:44396/api/Feedback/DeleteFeedBack/${feedbackId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Feedback Deleted',
                text: 'The feedback has been deleted successfully.',
                confirmButtonText: 'OK'
            });
            fetchAllFeedback(); // Refresh the feedback list
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete feedback. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
