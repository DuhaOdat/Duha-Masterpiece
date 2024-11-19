
// async function Login() {
//     event.preventDefault();  // Prevent form from submitting in the default way

//     var form = document.getElementById("login-form");
//     var url = "https://localhost:44396/api/Users/Login";  // Ensure this is correct

//     // Create a FormData object from the form
//     var formData = new FormData(form);

//     try {
//         // Send the POST request with form data
//         let response = await fetch(url, {
//             method: "POST",
//             body: formData
//         });

//         if (response.ok) {
//             var result = await response.json();  // Parse JSON response
            
//             // Save the data in localStorage
//             localStorage.setItem('jwtToken', result.token);  // Save JWT token
//             localStorage.setItem('userRole', result.role);  // Store the role

//             // Check if userId exists before saving
//             if (result.userId) {
//                 localStorage.setItem('userId', result.userId);  // Store the userId
//             } else {
//                 console.error("userId is not present in the response.");
//             }
          
//             // Force redirect to OTP or password change page if goTo is "OTP"
//             if (result.goTo === "OTP") {
//                 window.location.href = "otp.html";  // Redirect to OTP or password change page
//                 return;  // Stop further execution to ensure the user is redirected
//             }
            
//             // Redirect based on the user's role if password change is not required
//             if (result.role === 'Admin') {
//                 window.location.href = "Admin-dashboard/Admin-profile.html";  // Redirect to admin page
//             } else if (result.role === 'Doctor') {
//                 window.location.href = "doctor-dashboard/Doctor-profile.html";  // Redirect to doctor page
//             } else if (result.role === 'Lab Technician') {
//                 window.location.href = "lab-technician-dashboard/technician-profile.html";  // Redirect to lab technician page
//             } else {
//                 window.location.href = "patient-portal.html";  // Default redirect if role doesn't match
//             }

//             alert("Logged in successfully");
//         } else {
//             alert("Login failed. Please try again.");
//         }
//     } catch (error) {
//         console.error("Error during login:", error);  // Log the error for debugging
//         alert("An error occurred during login.");
//     }
// }


async function Login() {
    event.preventDefault();  // Prevent form from submitting in the default way

    var form = document.getElementById("login-form");
    var url = "https://localhost:44396/api/Users/Login";  // Ensure this is correct

    // Create a FormData object from the form
    var formData = new FormData(form);

    try {
        // Send the POST request with form data
        let response = await fetch(url, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            var result = await response.json();  // Parse JSON response
            
            // Save the data in localStorage
            localStorage.setItem('jwtToken', result.token);  // Save JWT token
            localStorage.setItem('userRole', result.role);  // Store the role

            // Check if userId exists before saving
            if (result.userId) {
                localStorage.setItem('userId', result.userId);  // Store the userId
            } else {
                console.error("userId is not present in the response.");
            }
          
            // Force redirect to OTP or password change page if goTo is "OTP"
            if (result.goTo === "OTP") {
                window.location.href = "otp.html";  // Redirect to OTP or password change page
                return;  // Stop further execution to ensure the user is redirected
            }
            
            // Redirect based on the user's role if password change is not required
            if (result.role === 'Admin') {
                window.location.href = "Admin-dashboard/Admin-profile.html";  // Redirect to admin page
            } else if (result.role === 'Doctor') {
                window.location.href = "doctor-dashboard/Doctor-profile.html";  // Redirect to doctor page
            } else if (result.role === 'Lab Technician') {
                window.location.href = "lab-technician-dashboard/technician-profile.html";  // Redirect to lab technician page
            } else {
                window.location.href = "patient-portal.html";  // Default redirect if role doesn't match
            }

            alert("Logged in successfully");
        } else if (response.status === 401) {
            // Unauthorized - Incorrect email or password
            alert("Email or password is incorrect. Please try again.");
        } else {
            // Handle other response errors
            alert("Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);  // Log the error for debugging
        alert("An error occurred during login.");
    }
}

