
async function SendOTP() {
    const url = "https://localhost:44396/api/OTP/reset/request";
  
    if (document.getElementById("resetPasswordEmail").value === "") {
        alert("Please enter your email address.");
        return;
    }
    const response = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: document.getElementById("resetPasswordEmail").value
            }),
        }
    );

    if (response.status === 200) {
        otpSentDone();
        document.getElementById("resetPasswordOTP").removeAttribute('disabled');
        document.getElementById("form2-1").style.display = "block";
        document.getElementById("form2-2").removeAttribute('disabled');
        document.getElementById("form2-3").removeAttribute('disabled');

        document.getElementById("resetPasswordEmail").setAttribute("disabled", true);
        document.getElementById("form1btn").setAttribute("disabled", true);

        function countdown(elementName, minutes, seconds) {
            var element, endTime, hours, mins, msLeft, time;

            function twoDigits(n) {
                return (n <= 9 ? "0" + n : n);
            }

            function updateTimer() {
                msLeft = endTime - (+new Date);
                if (msLeft < 1000) {
                    element.innerHTML = "Time is up!";
                } else {
                    time = new Date(msLeft);
                    hours = time.getUTCHours();
                    mins = time.getUTCMinutes();
                    element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
                    setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
                }
            }

            element = document.getElementById(elementName);
            endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
            updateTimer();
        }

        countdown("ten-countdown", 5, 0);

    }
    else {
        otpSentWrong();
    }
};



async function checkOTP() {
    const url = "https://localhost:44396/api/OTP/reset/validate-otp";
    const response = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otp: document.getElementById("resetPasswordOTP").value
            }),
        }
    );

    if (response.status === 200) {
        localStorage.setItem("OTP", document.getElementById("resetPasswordOTP").value);
        OTPCorrect();

        document.getElementById("resetPasswordNewPWD").removeAttribute('disabled');
        document.getElementById("form3-1").removeAttribute('disabled');
        document.getElementById("form3-2").removeAttribute('disabled');

        document.getElementById("resetPasswordOTP").setAttribute("disabled", true);
        document.getElementById("form2-2").setAttribute("disabled", true);
        document.getElementById("form2-1").style.display = "none";
        document.getElementById("form2-3").setAttribute("disabled", true);
    }
    else {
        OTPWrong()
    }

}


async function NewPWD(event) {
    // Optional: Prevent default form submission if used in a form
    if (event) event.preventDefault();

    console.log("Attempting to reset password...");
    console.log(document.getElementById("resetPasswordNewPWD").value);

    const otp = localStorage.getItem("OTP");
    const url = `https://localhost:44396/api/OTP/reset/password/${otp}`;

    
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newPassword: document.getElementById("resetPasswordNewPWD").value,
            }),
        });

        console.log(`Response Status: ${response.status}`); // Debugging line

    if (response.status === 200) {
        resetDone();
        // Swal.fire({
        //     title: "Success",
        //     text: "The password has been reset successfully.",
        //     html: "I will close in <b></b> milliseconds.",
        //     timer: 3000,
        //     timerProgressBar: true,
        //     didOpen: () => {
        //         Swal.showLoading();
        //         const timer = Swal.getPopup().querySelector("b");
        //         timerInterval = setInterval(() => {
        //             timer.textContent = `${Swal.getTimerLeft()}`;
        //         }, 100);
        //     },
        //     willClose: () => {
        //         clearInterval(timerInterval);
        //     }
        // }).then((result) => {
        //     /* Read more about handling dismissals below */
        //     if (result.dismiss === Swal.DismissReason.timer) {
        //         console.log("I was closed by the timer");
        //     }
        // });
        localStorage.removeItem("OTP");
        window.location.href = "login.html";
        
    } else {
        resetWrong();
    }
}






// async function goBack1() {
//     document.getElementById("resetPasswordOTP").setAttribute("disabled", true);
//     document.getElementById("form2-2").setAttribute("disabled", true);
//     document.getElementById("form2-1").style.display = "none";
//     document.getElementById("form2-3").setAttribute("disabled", true);

//     document.getElementById("resetPasswordEmail").removeAttribute('disabled');
//     document.getElementById("form1btn").removeAttribute('disabled');
// }

// async function goBack2() {
//     document.getElementById("resetPasswordOTP").removeAttribute('disabled');
//     document.getElementById("form2-1").style.display = "block";
//     document.getElementById("form2-2").removeAttribute('disabled');
//     document.getElementById("form2-3").removeAttribute('disabled');

//     document.getElementById("resetPasswordNewPWD").setAttribute("disabled", true);
//     document.getElementById("form3-1").setAttribute("disabled", true);
//     document.getElementById("form3-2").setAttribute("disabled", true);
// }



// toast
iziToast.settings({
    timeout: 3000, // default timeout
    resetOnHover: true,
    // icon: '', // icon class
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
    onOpen: function () {
        console.log('callback abriu!');
    },
    onClose: function () {
        console.log("callback fechou!");
    }
});
async function otpSentDone() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-check',
        title: 'Done',
        message: 'OTP has been to your email!',
        position: 'bottomCenter',
        progressBarColor: '#eaa451',

    });
};

async function otpSentWrong() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-x',
        title: 'Invalid',
        message: 'Please enter a valid email',
        position: 'bottomCenter',
        progressBarColor: 'red',

    });
}


async function OTPCorrect() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-check',
        title: 'Checked',
        message: 'You can now reset your password!',
        position: 'bottomCenter',
        progressBarColor: '#eaa451',

    });
}

async function OTPWrong() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-x',
        title: 'Error',
        message: 'the OTP entered doesn\'t match !',
        position: 'bottomCenter',
        progressBarColor: 'red',

    });
}

async function resetDone() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-check',
        title: 'Done',
        message: 'Password has been changed successfully!',
        position: 'bottomCenter',
        progressBarColor: '#eaa451',

    });
}

async function resetWrong() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-check',
        title: 'Strange',
        message: 'somthing went wrong!',
        position: 'bottomCenter',
        progressBarColor: 'red',

    });
}