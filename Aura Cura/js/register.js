// var url = "https://localhost:44396/api/Users/Register";

// async function Register() {

//     event.preventDefault(); //Prevent the form from submitting
  

//     debugger;
//     var form =document.getElementById("register-form");
//     var username=document.getElementById("FirstName");
//     var username=document.getElementById("lastName");
//     var email=document.getElementById("email");
//     var password=document.getElementById("pass");
//     var confirmPassword=document.getElementById("confirm-pass");



//     if(password.value ==confirmPassword.value) {

//    var formData= new FormData(form);

//       try{
//          let reponse= await fetch(url,{
//             method: 'POST',
//             body: formData
//          });
//          if(reponse.ok)
//             { 
//                 alert("Registration successful");
//                 form.reset();
//          }
//          else{
//              alert("Registration failed , please try again");
//          }
//       }
//       catch(error){
//          alert("an error occurred while trying to register");
//       }
//     }
//     else{
//         alert("Passwords do not match");
//     }
    
// }

// Register();



var url = "https://localhost:44396/api/Users/Register";

async function Register(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get form elements
    var form = document.getElementById("register-form");
    var firstName = document.getElementById("FirstName");
    var lastName = document.getElementById("lastName");
    var email = document.getElementById("email");
    var password = document.getElementById("pass");
    var confirmPassword = document.getElementById("confirm-pass");

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Validate Email
    if (!emailRegex.test(email.value)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate Password
    if (!passwordRegex.test(password.value)) {
        alert("Password must be at least 8 characters long and contain at least one letter and one number.");
        return;
    }

    // Check if passwords match
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    // Prepare form data
    var formData = new FormData(form);

    try {
        let response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            alert("Registration successful");
            form.reset();
        } else {
            alert("Registration failed, please try again.");
        }
    } catch (error) {
        alert("An error occurred while trying to register.");
    }
}

// Real-Time Feedback for Email and Password Fields
document.getElementById("email").addEventListener("input", function() {
    const emailFeedback = document.getElementById("emailFeedback");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
        emailFeedback.textContent = "Invalid email format.";
        emailFeedback.style.color = "red";
    } else {
        emailFeedback.textContent = "Valid email format.";
        emailFeedback.style.color = "green";
    }
});

document.getElementById("pass").addEventListener("input", function() {
    const passwordFeedback = document.getElementById("passwordFeedback");
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(this.value)) {
        passwordFeedback.textContent = "Password must be 8+ characters with one letter and one number.";
        passwordFeedback.style.color = "red";
    } else {
        passwordFeedback.textContent = "Strong password.";
        passwordFeedback.style.color = "green";
    }
});

document.getElementById("confirm-pass").addEventListener("input", function() {
    const confirmPasswordFeedback = document.getElementById("confirmPasswordFeedback");
    if (this.value !== document.getElementById("pass").value) {
        confirmPasswordFeedback.textContent = "Passwords do not match.";
        confirmPasswordFeedback.style.color = "red";
    } else {
        confirmPasswordFeedback.textContent = "Passwords match.";
        confirmPasswordFeedback.style.color = "green";
    }
});
