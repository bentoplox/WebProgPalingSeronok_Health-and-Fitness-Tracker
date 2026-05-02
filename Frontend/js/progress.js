document.addEventListener("DOMContentLoaded", function () {
    const monthData = [
        { id: 'grid-mar', title: 'March 2026', active: 10, total: 31, streak: 5, hit: 68 },
        { id: 'grid-apr', title: 'April 2026', active: 11, total: 30, streak: 5, hit: 72 },
        { id: 'grid-may', title: 'May 2026', active: 4, total: 31, streak: 2, hit: 55 }
    ];

    let currentIndex = 2;

    const titleEl = document.getElementById('calendar-title');
    const btnPrev = document.getElementById('prevMonthBtn');
    const btnNext = document.getElementById('nextMonthBtn');

    const kpiActive = document.getElementById('kpi-active');
    const kpiStreak = document.getElementById('kpi-streak');
    const kpiHitRate = document.getElementById('kpi-hitrate');

    function updateCalendar() {
        const currentMonth = monthData[currentIndex];

        titleEl.innerText = currentMonth.title;

        document.querySelectorAll('.calendar-month-grid').forEach(grid => grid.classList.add('d-none'));
        document.getElementById(currentMonth.id).classList.remove('d-none');

        kpiActive.innerHTML = `${currentMonth.active} <span class="fs-6 fw-normal text-muted">/ ${currentMonth.total}</span>`;
        kpiStreak.innerHTML = `${currentMonth.streak} <span class="fs-6 fw-normal text-muted">Weeks</span>`;
        kpiHitRate.innerHTML = `${currentMonth.hit} <span class="fs-6 fw-normal text-muted">%</span>`;

        btnPrev.disabled = currentIndex === 0;
        btnNext.disabled = currentIndex === monthData.length - 1;

        btnPrev.style.opacity = currentIndex === 0 ? "0.3" : "1";
        btnNext.style.opacity = currentIndex === monthData.length - 1 ? "0.3" : "1";
    }

    btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCalendar();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentIndex < monthData.length - 1) {
            currentIndex++;
            updateCalendar();
        }
    });

    updateCalendar();

    const activityModalElement = document.getElementById('activityModal');
    
    if (activityModalElement) {
        const activityModal = new bootstrap.Modal(activityModalElement);

        const modalDate = document.getElementById('modalDate');
        const modalName = document.getElementById('modalName');
        const modalSport = document.getElementById('modalSport');
        const modalDuration = document.getElementById('modalDuration');
        const modalCalories = document.getElementById('modalCalories');
        const modalIntensity = document.getElementById('modalIntensity');
        const modalIcon = document.getElementById('modalIcon');

        document.querySelectorAll('.activity-node').forEach(node => {
            node.addEventListener('click', function () {
                const dateStr = this.getAttribute('data-date');
                const actName = this.getAttribute('data-name');
                const actSport = this.getAttribute('data-sport');
                const actDuration = this.getAttribute('data-duration');
                const actCalories = this.getAttribute('data-calories');
                const actIntensity = this.getAttribute('data-intensity');
                const actIcon = this.getAttribute('data-icon');

                modalDate.innerText = dateStr;
                modalName.innerText = actName;
                modalSport.innerText = actSport;
                modalDuration.innerHTML = `${actDuration}<small class="fs-6 text-muted fw-normal ms-1">m</small>`;
                modalCalories.innerHTML = `${actCalories}<small class="fs-6 text-muted fw-normal ms-1">kcal</small>`;
                modalIntensity.innerText = actIntensity;
                modalIcon.className = `fa-solid ${actIcon} text-olive`;

                activityModal.show();
            });
        });
    }
});