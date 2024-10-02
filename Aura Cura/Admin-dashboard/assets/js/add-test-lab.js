async function addLabTest() {
    // Get the form input values
    const testName = document.getElementById('testName').value;
    const description = document.getElementById('description').value;
    const isAvailable = document.getElementById('isAvailable').checked;
    
    // Log the input values to ensure they are correct
    console.log("TestName:", testName);
    console.log("Description:", description);
    console.log("IsAvailable:", isAvailable);
    
    // Get the UserID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId || isNaN(parseInt(userId))) {
        alert("User ID is invalid or missing. Please log in.");
        window.location.href = 'login.html';
        return;
    }

    // Log the UserID
    console.log("UserID:", userId);

    // Construct the lab test object
    const labTestData = {
        TestName: testName,
        Description: description,
        IsAvailable: isAvailable,
        CreatedBy: parseInt(userId),  // Convert UserID to integer
        CreatedDate: new Date().toISOString()  // ISO date format
    };

    // Log the data that will be sent
    console.log("Data to send:", labTestData);

    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert("No token found. Please log in again.");
        window.location.href = 'login.html';  // Redirect to login if token is missing
        return;
    }

    // Log the JWT token
    console.log("Token:", token);

    // Set the API URL
    const url = 'https://localhost:44396/api/Admin/add-lab-test';

    try {
        // Make the fetch request using async/await
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Ensure JSON content-type
                'Authorization': `Bearer ${token}`  // Include the JWT token
            },
            body: JSON.stringify(labTestData)  // Send the data as JSON
        });

        // Check if the response is successful
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                let result = await response.json();  // Parse as JSON if content-type is JSON
                alert(result);  // Show success message
            } else {
                let result = await response.text();  // Parse as plain text
                alert(result);  // Show success message
            }
        } else {
            const errorText = await response.text();  // Handle non-JSON error responses
            console.error("Error response:", errorText);
            alert(`Failed to add lab test: ${errorText}`);
        }
    } catch (error) {
        console.error("Error occurred:", error);  // Log any errors
        alert("An error occurred while adding the lab test.");
    }
}
