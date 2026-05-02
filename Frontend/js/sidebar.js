// js/sidebar.js

const sidebarContent = `
    <aside class="sidebar d-flex flex-column p-4">
        <a href="dashboard.html" class="d-flex align-items-center mb-4 text-decoration-none">
            <img src="../images/favicon.ico" alt="Logo" width="30" class="me-2">
            <span class="fs-4 fw-bold text-olive">Flow State</span>
        </a>

        <div class="d-flex align-items-center mb-4 p-3 bg-light rounded-4 border border-sand">
            <img src="../images/running.jpg" alt="XR" width="40" height="40" class="rounded-circle me-3 object-fit-cover" onerror="this.src='https://via.placeholder.com/40'">
            <div>
                <h6 class="mb-0 text-olive fw-bold">XR</h6>
                <small class="text-muted">Pro Member</small>
            </div>
        </div>

        <ul class="nav nav-pills flex-column mb-auto gap-2" id="sidebar-nav">
            <li><a href="dashboard.html" id="dashboardNav" class="nav-link sidebar-link"><i class="fa-solid fa-house me-2"></i> Overview</a></li>
            <li><a href="tracker.html" id="trackerNav" class="nav-link sidebar-link"><i class="fa-solid fa-person-running me-2"></i> Fitness Tracker</a></li>
            <li><a href="progress.html" id = "progressNav" class="nav-link sidebar-link"><i class="fa-solid fa-chart-line me-2"></i> Progress Chart</a></li>
            <li><a href="nutrition.html" id="nutritionNav" class="nav-link sidebar-link"><i class="fa-solid fa-apple-whole me-2"></i> Nutrition Planner</a></li>
            <li><a href="notification.html" id="notificationNav" class="nav-link sidebar-link"><i class="fa-solid fa-bell me-2"></i> Noti & Reminders</a></li>
            
            <hr class="border-secondary opacity-25 my-2">
            
            <li><a href="#" class="nav-link sidebar-link"><i class="fa-solid fa-gear me-2"></i> Settings</a></li>
            <li><a href="aboutus.html" class="nav-link sidebar-link"><i class="fa-solid fa-circle-info me-2"></i> About Us</a></li>
        </ul>
    </aside>
`;

// Insert the sidebar into the page
document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("sidebar-container");
    if (container) {
        container.innerHTML = sidebarContent;

        // Auto-Active Link Logic: This automatically highlights the correct button!
        const currentPath = window.location.pathname.split("/").pop(); // Gets 'dashboard.html' or 'progress.html'
        const navLinks = document.querySelectorAll(".sidebar-link");
        
        navLinks.forEach(link => {
            if (link.getAttribute("href") === currentPath) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
});

// ==========================================
// SIDEBAR ACTIVE STATE ROUTING
// ==========================================
setTimeout(() => {
    // 1. Get the current page URL
    let currentPath = window.location.pathname;

    // 2. Define the "Nutrition Module" family
    const nutritionPages = [
        "nutrition.html", 
        "saved-recipes.html", 
        "custom-recipes.html", 
        "recipe-details.html", 
        "edit-recipe.html"
    ];

    // 3. Check if the current page is part of the Nutrition family
    let isNutritionPage = nutritionPages.some(page => currentPath.includes(page));

    if (isNutritionPage) {
        // Find the specific Nutrition Planner link in your sidebar
        // Note: Adjust the href selector if your link points somewhere slightly different!
        let nutritionLink = document.querySelector('.sidebar a[href*="nutrition.html"]');
        
        if (nutritionLink) {
            // Apply the blue highlight (Assuming Bootstrap's standard active classes)
            // If you use custom CSS classes for the blue highlight, swap them here!
            nutritionLink.classList.add('active', 'bg-primary', 'text-white');
        }
    }
}, 100); // 100ms delay ensures the sidebar has finished loading into the DOM