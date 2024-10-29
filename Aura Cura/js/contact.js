async function submitContactForm(event) {
    event.preventDefault(); // منع التحديث التلقائي للصفحة

    // جمع البيانات باستخدام FormData
    const formData = new FormData();
    formData.append("Name", document.getElementById("name").value);
    formData.append("Email", document.getElementById("email").value);
    formData.append("Sub", document.getElementById("subject").value);
    formData.append("Message", document.getElementById("message").value);

    try {
        // إرسال الطلب باستخدام FormData
        const response = await fetch("https://localhost:44396/api/ContactUs/userForm", {
            method: "POST",
            body: formData // استخدم FormData هنا بدون تعيين `Content-Type`
        });

        // التعامل مع الاستجابة
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Message Sent',
                text: 'Thank you for reaching out to us. We will get back to you shortly.',
                confirmButtonText: 'OK'
            });
            document.getElementById("contactForm").reset(); // إعادة تعيين النموذج
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send your message. Please try again later.',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'An error occurred while sending your message. Please try again later.',
            confirmButtonText: 'OK'
        });
    }
}
