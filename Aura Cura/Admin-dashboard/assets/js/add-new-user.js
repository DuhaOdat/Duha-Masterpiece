var url="https://localhost:44396/api/Users/RoleRegister";



async function RoleRegister() {

    event.preventDefault(); //Prevent the form from submitting
   
        var form =document.getElementById("registerForm");
        var username=document.getElementById("firstName");
        var username=document.getElementById("lastName");
        var email=document.getElementById("email");
        var password=document.getElementById("password");
        var role=document.getElementById("role");
    

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
    
RoleRegister() ;
      

