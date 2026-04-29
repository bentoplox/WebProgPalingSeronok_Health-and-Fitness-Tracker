document.addEventListener("DOMContentLoaded", function () {
    const colorOlive = '#546B41';
    const colorSage = '#99AD7A';

    const ctx = document.getElementById('overviewBarChart').getContext('2d');

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorSage);
    gradient.addColorStop(1, 'rgba(153, 173, 122, 0.2)');

    // 1. Define our datasets for both views
    const chartData = {
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [40, 25, 60, 45, 80, 50],
            activeDays: "14 <span class='fs-6 fw-normal text-muted'>/ 30</span>",
            streak: "<i class='fa-solid fa-fire text-sage me-1' style='font-size: 1rem;'></i>5 <span class='fs-6 fw-normal text-muted'>Weeks</span>",
            hitRate: "85 <span class='fs-6 fw-normal text-muted'>%</span>"
        },
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [5, 8, 4, 7, 0, 9, 6], // Daily dummy data
            activeDays: "5 <span class='fs-6 fw-normal text-muted'>/ 7</span>",
            streak: "<i class='fa-solid fa-fire text-sage me-1' style='font-size: 1rem;'></i>4 <span class='fs-6 fw-normal text-muted'>Days</span>",
            hitRate: "71 <span class='fs-6 fw-normal text-muted'>%</span>"
        }
    };

    // 2. Initialize the chart (Defaults to Monthly)
    let overviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.monthly.labels,
            datasets: [{
                label: 'Activity Level',
                data: chartData.monthly.data,
                backgroundColor: gradient,
                borderRadius: 8,
                barPercentage: 0.6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: colorOlive,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: { beginAtZero: true, display: false },
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: '#a0a0a0', font: { weight: 'bold', size: 11 } }
                }
            }
        }
    });

    // 3. Listen for Dropdown Changes
    const selector = document.getElementById('timeframeSelector');
    if (selector) {
        selector.addEventListener('change', function (e) {
            // Get 'monthly' or 'weekly' from the dropdown value
            const selectedView = e.target.value;
            const newData = chartData[selectedView];

            // Update the Chart data and redraw it smoothly
            overviewChart.data.labels = newData.labels;
            overviewChart.data.datasets[0].data = newData.data;
            overviewChart.update();

            // Update the KPI text below the chart
            document.getElementById('kpi-active').innerHTML = newData.activeDays;
            document.getElementById('kpi-streak').innerHTML = newData.streak;
            document.getElementById('kpi-hitrate').innerHTML = newData.hitRate;
        });
    }
});