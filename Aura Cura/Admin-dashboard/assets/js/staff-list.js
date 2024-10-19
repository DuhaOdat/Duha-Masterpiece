// let selectedUserId = null; // Declare a variable to store the selected user's ID

// // Fetch users except patients and display them in the table
// async function fetchUsersExceptPatients() {
//     try {
//         const response = await fetch('https://localhost:44396/api/Users/GetUsersExceptPatients');
//         if (!response.ok) {
//             throw new Error('Failed to fetch data');
//         }

//         const users = await response.json();
//         displayUsers(users); // Function to display the users in the table
//     } catch (error) {
//         console.error('Error fetching users:', error);
//     }
// }

// // Function to display users in the table
// function displayUsers(users) {
//     const staffList = document.getElementById('staff-list');
//     staffList.innerHTML = ''; // Clear the existing table rows

//     users.forEach((user, index) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${index + 1}</td>
//             <td>${user.firstName}</td>
//             <td>${user.lastName}</td>
//             <td>${user.email}</td>
//             <td>${user.role}</td>
//             <td>
//                 <button class="btn btn-primary">Update</button>
//                 <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteStaffModal" data-user-id="${user.id}">Delete</button>
//             </td>
//         `;
//         staffList.appendChild(row);
//     });

//     // Add event listeners for all delete buttons
//     const deleteButtons = document.querySelectorAll('.btn-danger');
//     deleteButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             selectedUserId = this.getAttribute('data-user-id'); // Store the user ID in the variable
//         });
//     });
// }

// document.getElementById("confirmDeleteButton").addEventListener("click", async function() {
//     if (!selectedUserId) {
//         alert('No user selected for deletion.');
//         return;
//     }

//     try {
//         const response = await fetch(`https://localhost:44396/api/Users/DeleteUser/${selectedUserId}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(error.message);
//         }

//         const data = await response.json();
//         alert(data.message); // Show success message
//         $('#deleteStaffModal').modal('hide'); // Hide the modal

//         // If you want to refresh the whole page, uncomment the next line:
//         location.reload();

//         // If you want to just refresh the user list without reloading the page:
//         // await fetchUsersExceptPatients(); // Refresh the table
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     }
// });


// // Call the function to fetch and display the data when the page loads
// window.onload = fetchUsersExceptPatients;




// Fetch users except patients and display them in the table
async function fetchUsersExceptPatients() {
    try {
        const response = await fetch('https://localhost:44396/api/Users/GetUsersExceptPatients');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const users = await response.json();
        displayUsers(users); // Function to display the users in the table
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function to display users in the table
function displayUsers(users) {
    const staffList = document.getElementById('staff-list');
    staffList.innerHTML = ''; // Clear the existing table rows

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-primary" data-user-id="${user.id}">Update</button>
                <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteStaffModal" data-user-id="${user.id}">Delete</button>
            </td>
        `;
        staffList.appendChild(row);

        // Add event listener for the Delete button
        row.querySelector('.btn-danger').addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            confirmDeleteUser(userId); // Pass the userId directly to the delete function
        });

        // Add event listener for the Update button
        row.querySelector('.btn-primary').addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            openUpdateModal(user); // Populate the modal with the user details
        });
    });
}

// Function to confirm and delete a user
async function confirmDeleteUser(userId) {
    document.getElementById("confirmDeleteButton").addEventListener("click", async function() {
        try {
            const response = await fetch(`https://localhost:44396/api/Users/DeleteUser/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const data = await response.json();
            alert(data.message); // Show success message
            $('#deleteStaffModal').modal('hide'); // Hide the modal

            // Refresh the whole page to reflect the deleted user
            location.reload();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
}

// Function to open the update modal and populate it with user data
function openUpdateModal(user) {
    document.getElementById('userId').value = user.id;
    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('email').value = user.email;
    document.getElementById('role').value = user.role;

    // Show the modal
    $('#updateUserModal').modal('show');
}

// Function to handle the form submission for updating a user
document.getElementById('updateUserForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent form from submitting the traditional way

    const userId = document.getElementById('userId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    // Prepare form data
    const formData = new FormData();
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Email', email);
    formData.append('Role', role);

    try {
        const response = await fetch(`https://localhost:44396/api/Users/UpdateUser/${userId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        alert(data.message); // Show success message
        $('#updateUserModal').modal('hide'); // Hide the modal

        // Refresh the whole page to reflect the updated user
        location.reload(); 
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Call the function to fetch and display the data when the page loads
window.onload = fetchUsersExceptPatients;
