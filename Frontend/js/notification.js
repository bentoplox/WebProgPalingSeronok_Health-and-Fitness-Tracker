// 1. Toggle Mobile View
function toggleView(view) {
    const notiSection = document.getElementById('noti-section');
    const remindSection = document.getElementById('remind-section');
    const buttons = document.querySelectorAll('#mobileTabs .nav-link');

    if (view === 'remind-view') {
        notiSection.classList.add('d-none');
        remindSection.classList.remove('d-none');
        buttons[1].classList.add('active');
        buttons[0].classList.remove('active');
    } else {
        notiSection.classList.remove('d-none');
        remindSection.classList.add('d-none');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    }
}

// 2. Category Selector Logic
function setCategory(color) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.border-${color}`);
    if (activeBtn) activeBtn.classList.add('active');
}

// 3. Combined Health Insight API Call
window.onload = function () {
    const insightDisplay = document.getElementById('health-insight-text');
    if (!insightDisplay) return;

    
    const proxy = "https://corsproxy.io/?";
    const apiUrl = "https://odphp.health.gov/myhealthfinder/api/v4/itemlist.json?Type=topic";

    fetch(proxy + encodeURIComponent(apiUrl))
        .then(res => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            
            const items = data.Result.Items.Item;

            if (items && items.length > 0) {
                
                const randomIndex = Math.floor(Math.random() * items.length);
                const randomTopic = items[randomIndex].Title;

                insightDisplay.innerText = `Recommended: ${randomTopic}`;
            } else {
                insightDisplay.innerText = "Stay active and hydrated today!";
            }
        })
        .catch((error) => {
            console.error("API Error:", error);
            // Fallback text so the user doesn't see "Fetching..." forever
            insightDisplay.innerText = "Check your nutrition planner for daily tips!";
        });
};


function showAllNotifications() {
    const todayPane = document.getElementById('today');
    const weekPane = document.getElementById('week');
    const tabNav = document.getElementById('pills-tab');
    const seeAllBtn = document.querySelector('.btn-see-all');
    const allContainer = document.getElementById('all-notifications-container');
    const title = document.getElementById('notification-title');

    // Combine content
    if (allContainer) {
        allContainer.innerHTML = todayPane.innerHTML + weekPane.innerHTML;
    }

    // Switch tab
    document.getElementById('all').classList.add('show', 'active');
    todayPane.classList.remove('show', 'active');
    weekPane.classList.remove('show', 'active');

    // Hide nav + button
    tabNav.style.setProperty('display', 'none', 'important');
    seeAllBtn.style.display = 'none';

    // CHANGE title (instead of hiding)
    if (title) {
        title.innerText = "All Notifications";
    }

    // Create / show back button
    let backBtn = document.getElementById('btn-back-nav');

    if (!backBtn) {
        const header = document.querySelector('.notification-center-card h5');

        header.insertAdjacentHTML('beforebegin', `
        <button id="btn-back-nav"
            class="d-none btn btn-outline-secondary rounded-pill px-3 py-1 me-2 d-flex align-items-center gap-2 shadow-sm"
            onclick="goBackToTabs()">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back</span>
        </button>
    `);

        backBtn = document.getElementById('btn-back-nav');
    }

    // SHOW it
    backBtn.classList.remove('d-none');
    initAllTabClicks();
}

function goBackToTabs() {
    const tabNav = document.getElementById('pills-tab');
    const seeAllBtn = document.querySelector('.btn-see-all');
    const todayPane = document.getElementById('today');
    const weekPane = document.getElementById('week');
    const allPane = document.getElementById('all');
    const title = document.getElementById('notification-title');

    // Restore nav + button
    tabNav.style.setProperty('display', 'inline-flex', 'important');
    seeAllBtn.style.display = 'block';

    // Restore title
    if (title) {
        title.innerText = "Notification Center";
    }

    // Hide back button
    const backBtn = document.getElementById('btn-back-nav');
    if (backBtn) {
        backBtn.classList.add('d-none');
    }

    // Reset tabs
    allPane.classList.remove('show', 'active');
    weekPane.classList.remove('show', 'active');
    todayPane.classList.add('show', 'active');
}

function attachClick(selector, url) {
    document.querySelectorAll(selector).forEach(el => {
        if (!el) return;

        el.addEventListener('click', (e) => {
            e.stopPropagation(); 
            window.location.href = url;
        });
    });
}

/* 
   (TODAY + WEEK)
 */
function initStaticClicks() {

    // TODAY
    attachClick('#today .glass-blue', 'progress.html');
    attachClick('#today .glass-yellow', 'nutrition.html');
    attachClick('#today .glass-red', 'tracker.html');

    // WEEK
    attachClick('#week .glass-green', 'progress.html');
    attachClick('#week .glass-orange', 'dashboard.html');
    attachClick('#week .glass-purple', 'progress.html');
}

/* 
   SEE ALL TAB 
 */
function initAllTabClicks() {

    attachClick('#all .glass-blue', 'progress.html');
    attachClick('#all .glass-yellow', 'nutrition.html');
    attachClick('#all .glass-red', 'tracker.html');
    attachClick('#all .glass-green', 'progress.html');
    attachClick('#all .glass-orange', 'dashboard.html');
    attachClick('#all .glass-purple', 'progress.html');
}

/* 
   RUN  PAGE LOAD
 */
document.addEventListener('DOMContentLoaded', () => {
    initStaticClicks();
});


/* 
   PREVENT BUTTON CLICK FROM REDIRECTING
 */
document.querySelectorAll('.btn-action-small').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});


/* 
   OPTIONAL: HOVER EFFECT (feel clickable)
 */
document.querySelectorAll('.noti-item-minimal').forEach(item => {
    item.style.cursor = 'pointer';

    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-2px)';
        item.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
        item.style.boxShadow = '';
    });
});