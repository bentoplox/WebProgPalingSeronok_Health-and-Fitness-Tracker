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
window.onload = function() {
    const insightDisplay = document.getElementById('health-insight-text');
    if (!insightDisplay) return;

    // We use a CORS proxy to bypass the browser's security block on local files
    const proxy = "https://corsproxy.io/?";
    const apiUrl = "https://odphp.health.gov/myhealthfinder/api/v4/itemlist.json?Type=topic";

    fetch(proxy + encodeURIComponent(apiUrl))
        .then(res => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            // Correct path for the MyHealthFinder API v4
            const items = data.Result.Items.Item;
            
            if (items && items.length > 0) {
                // Pick a random health topic
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


