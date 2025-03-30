document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const userId = "<%= user.id %>"; // Ensure user ID is set correctly

    let currentPage = 1;
    const pageSize = 5; // Show 5 notifications per page
    let notifications = [];

    const notificationIcon = document.getElementById("notification-icon");
    const notificationDropdown = document.getElementById("notification-dropdown");
    const notificationList = document.getElementById("notifications");
    const unreadCountSpan = document.getElementById("unread-count");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    // Toggle dropdown visibility
    notificationIcon.addEventListener("click", () => {
        notificationDropdown.style.display = notificationDropdown.style.display === "none" ? "block" : "none";
    });

    // Fetch notifications from the backend
    async function fetchNotifications() {
        try {
            const response = await fetch(`/notifications?userId=${userId}`);
            notifications = await response.json();
            updateUnreadCount();
            renderNotifications();
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }

    // Render notifications with pagination
    function renderNotifications() {
        notificationList.innerHTML = "";
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedNotifications = notifications.slice(start, end);

        paginatedNotifications.forEach(notification => {
            const li = document.createElement("li");
            li.textContent = notification.message;
            li.className = `list-group-item ${notification.isread ? "read" : "unread"}`;
            li.dataset.id = notification.id;

            li.addEventListener("click", async () => {
                if (!notification.isread) {
                    const markRead = await fetch(`/notifications/${notification.id}/read`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" }
                    });

                    if (markRead.ok) {
                        notification.isread = true;
                        li.classList.remove("unread");
                        li.classList.add("read");
                        updateUnreadCount();
                    }
                }
            });

            notificationList.appendChild(li);
        });

        // Update pagination info
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(notifications.length / pageSize)}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= notifications.length;
    }

    // Update unread count
    function updateUnreadCount() {
        const unreadCount = notifications.filter(n => !n.isread).length;
        unreadCountSpan.textContent = unreadCount > 0 ? unreadCount : "";
    }

    // Handle pagination
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderNotifications();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * pageSize < notifications.length) {
            currentPage++;
            renderNotifications();
        }
    });

    // Listen for real-time notifications
    socket.on("new_notification", (notification) => {
        notifications.unshift(notification); // Add new notification at the beginning
        updateUnreadCount();
        renderNotifications();
    });

    fetchNotifications();
});
