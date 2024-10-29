document.addEventListener("DOMContentLoaded", () => {
    loadContacts();
});

async function loadContacts() {
    try {
        const response = await fetch("https://localhost:44396/api/ContactUs/getAllContact");
        if (response.ok) {
            const contacts = await response.json();
            console.log("Fetched Contacts:", contacts); // Log fetched contacts
            displayContacts(contacts);
        } else {
            console.error("Failed to load contacts:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}


function displayContacts(contacts) {
    const tableBody = document.getElementById("contact-list");
    tableBody.innerHTML = ""; // Clear existing rows

    contacts.forEach((contact, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.subject}</td>
            <td>${contact.message}</td>
            <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
           <td>
                <button class="btn btn-primary btn-sm" onclick="openReplyModal(${contact.id})" 
                    ${contact.replyMessage ? "disabled" : ""}>Reply</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openReplyModal(contactId) {
    // Set the contact ID in the hidden input field
    document.getElementById("contactId").value = contactId;
    document.getElementById("replyMessage").value = ""; // Clear any existing message

    // Show the reply modal
    const replyModal = new bootstrap.Modal(document.getElementById("replyModal"));
    replyModal.show();
}

async function sendReply() {
    const contactId = document.getElementById("contactId").value;
    const replyMessage = document.getElementById("replyMessage").value;

    // Create FormData and append the replyMessage
    const formData = new FormData();
    formData.append("replyMessage", replyMessage);

    const response = await fetch(`https://localhost:44396/api/ContactUs/adminForm/${contactId}`, {
        method: "PUT",
        body: formData // Send as FormData
    });

    if (response.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Reply Sent',
            text: 'The reply has been sent successfully.',
            confirmButtonText: 'OK'
        });

        // Close the modal
        const replyModal = bootstrap.Modal.getInstance(document.getElementById("replyModal"));
        replyModal.hide();

        // Reload contacts to reflect reply status
        loadContacts();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to send the reply. Please try again later.',
            confirmButtonText: 'OK'
        });
    }
}

