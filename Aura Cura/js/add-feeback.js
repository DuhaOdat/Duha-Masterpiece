document.addEventListener("DOMContentLoaded", () => {
    // Fetch the userId from localStorage and set it in the hidden input field if it exists
    const userId = localStorage.getItem("userId");
    if (userId) {
        document.getElementById("userId").value = userId; // Populate the hidden userId field
    }
   
});


async function submitFeedback() {
    // Get form values
    const userId = document.getElementById("userId").value;
    const testimonialMessage = document.getElementById("testimonialMessage").value;

    // Prepare the feedback data object
    const feedbackData = {
        UserId: parseInt(userId), // Parse to integer
        TestimonialMessege: testimonialMessage
    };

    try {
        // Send POST request to create feedback
        const response = await fetch("https://localhost:44396/api/Feedback/CreateFeedBack", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedbackData)
        });
    
        if (response.ok) {
            // Success alert using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Feedback Submitted',
                text: 'Thank you for your feedback! We appreciate it.',
                confirmButtonText: 'OK'
            }).then(() => {
                document.getElementById("feedbackForm").reset(); // Reset form after confirmation
            });
        } else {
            // Error alert using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to submit feedback. Please try again.',
                confirmButtonText: 'OK'
            });
            console.error("Error submitting feedback:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
        // Network or other error alert using SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'An Error Occurred',
            text: 'An error occurred while submitting feedback. Please try again.',
            confirmButtonText: 'OK'
        });
    }
    
}
