async function createServiceHandler() {
    event.preventDefault(); // Prevents the form from submitting traditionally

    // Get the form element
    const form = document.getElementById("serviceForm");

    // Create a FormData object from the form
    const formData = new FormData(form);

    // Send the POST request with FormData
    const response = await fetch("https://localhost:44396/api/Services/AddService", {
        method: "POST",
        body: formData // No need to set headers, FormData handles it automatically
    });

    // if (response.ok) {
    //     console.log("Service created successfully");
    //     // Optionally, reset the form or update the DOM to reflect the new service
    //     form.reset();
    // } else {
    //     console.error("Failed to create service:", response.statusText);
    // }
    if (response.ok) {
        // Show SweetAlert success alert
        Swal.fire({
            icon: 'success',
            title: 'Service Created',
            text: 'The new service has been created successfully!',
            confirmButtonText: 'OK'
        }).then(() => {
            // Optionally, reset the form or perform other actions
            form.reset();
            // Redirect to the services page
            window.location.href = "/Aura%20Cura/Admin-dashboard/services.html";
        });
    } else {
        // Show SweetAlert error alert
        Swal.fire({
            icon: 'error',
            title: 'Failed to Create Service',
            text: 'An error occurred while creating the service. Please try again later.',
            confirmButtonText: 'OK'
        });
    }
    
}
