// main.js - Global scripts for Flow State

document.addEventListener("DOMContentLoaded", function() {
    // 1. Sidebar Toggle Logic
    const toggleBtn = document.getElementById("sidebarToggle");
    const wrapper = document.querySelector(".dashboard-wrapper");

    if (toggleBtn && wrapper) {
        toggleBtn.addEventListener("click", function() {
            wrapper.classList.toggle("sidebar-hidden");
        });
    }

    // You can add other global functions here later (like setting the active nav link automatically!)
});