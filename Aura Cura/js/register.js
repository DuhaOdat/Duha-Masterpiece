var url = "https://localhost:44396/api/Users/Register";

async function Register() {

    event.preventDefault(); //Prevent the form from submitting
  

    debugger;
    var form =document.getElementById("register-form");
    var username=document.getElementById("FirstName");
    var username=document.getElementById("lastName");
    var email=document.getElementById("email");
    var password=document.getElementById("pass");
    var confirmPassword=document.getElementById("confirm-pass");



    if(password.value ==confirmPassword.value) {

   var formData= new FormData(form);

      try{
         let reponse= await fetch(url,{
            method: 'POST',
            body: formData
         });
         if(reponse.ok)
            { 
                alert("Registration successful");
                form.reset();
         }
         else{
             alert("Registration failed , please try again");
         }
      }
      catch(error){
         alert("an error occurred while trying to register");
      }
    }
    else{
        alert("Passwords do not match");
    }
    
}

Register();