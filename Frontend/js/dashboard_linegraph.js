document.addEventListener("DOMContentLoaded", function () {
    // Check if the canvas exists on this page
    const ctx = document.getElementById('dashboardChart');

    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Minutes',
                    data: [45, 60, 30, 90, 45, 120, 60], // Your dummy data
                    borderColor: '#546B41', // Your Olive color
                    backgroundColor: 'rgba(153, 173, 122, 0.2)', // Your Sage color with 20% opacity for the fill
                    borderWidth: 2,
                    pointBackgroundColor: '#546B41',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4 // Makes the line wavy and smooth
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }, // Hides the top legend for a cleaner look
                    tooltip: {
                        backgroundColor: '#1A1A1A',
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y + ' mins';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false }, // Hides vertical grid lines
                        ticks: { color: '#a0a0a0', font: { size: 11 } }
                    },
                    y: {
                        display: false, // Completely hides the Y-axis numbers for a minimalist "widget" look
                        min: 0
                    }
                }
            }
        });
    }
});