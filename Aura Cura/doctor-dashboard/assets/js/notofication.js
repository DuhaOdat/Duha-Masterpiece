   // دالة لتبديل ظهور القائمة عند الضغط على الجرس
   function toggleNotificationPopup() {
    const popup = document.getElementById("notificationPopup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";

    // إذا كانت القائمة مفتوحة، قم بتحديد الإشعارات كمقروءة
    if (popup.style.display === "block") {
        markNotificationsAsRead();
    }
}

// دالة لجلب الإشعارات من API
async function fetchNotifications() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found in local storage.');
        return;
    }

    try {
        const response = await fetch(`https://localhost:44396/api/Notifications/${userId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const notifications = await response.json();
        displayNotifications(notifications);
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
    }
}

// دالة لعرض الإشعارات
function displayNotifications(notifications) {
    const notificationsContainer = document.getElementById("notifications");
    const notificationBadge = document.getElementById("notificationBadge");

    notificationsContainer.innerHTML = ""; // تنظيف الإشعارات السابقة

    // حساب عدد الإشعارات غير المقروءة
    const unreadCount = notifications.filter(notification => !notification.isRead).length;

    // تحديث الشارة بناءً على عدد الإشعارات غير المقروءة
    if (unreadCount > 0) {
        notificationBadge.classList.remove("hidden");
        notificationBadge.textContent = unreadCount; // عرض عدد الإشعارات غير المقروءة
    } else {
        notificationBadge.classList.add("hidden"); // إخفاء الشارة إذا لم يكن هناك إشعارات غير مقروءة
    }

    if (notifications.length === 0) {
        notificationsContainer.innerHTML = "<p style='padding: 10px; text-align: center;'>No notifications available.</p>";
        return;
    }

    notifications.forEach(notification => {
        const notificationDiv = document.createElement("div");
        notificationDiv.className = `notification ${notification.isRead ? "read" : ""}`;

        // نص الإشعار
        const message = document.createElement("p");
        message.textContent = notification.message;
        notificationDiv.appendChild(message);

        // تاريخ الإشعار
        const date = document.createElement("p");
        date.className = "date";
        date.textContent = new Date(notification.createdDate).toLocaleString();
        notificationDiv.appendChild(date);

        notificationsContainer.appendChild(notificationDiv);
    });
}

// دالة لتحديد الإشعارات كمقروءة
async function markNotificationsAsRead() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found in local storage.');
        return;
    }

    try {
        const response = await fetch(`https://localhost:44396/api/Notifications/markAsRead/${userId}`, {
            method: "PUT"
        });

        if (response.ok) {
            // إخفاء الشارة بعد قراءة الإشعارات
            document.getElementById("notificationBadge").classList.add("hidden");
        }
    } catch (error) {
        console.error("Error marking notifications as read:", error);
    }
}

// استدعاء fetchNotifications عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", fetchNotifications);