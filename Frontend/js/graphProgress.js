document.addEventListener("DOMContentLoaded", function () {
    const colorOlive = '#546B41';
    const colorSage = '#99AD7A';
    const colorSand = '#DCCCAC';

    const ctx = document.getElementById('overviewBarChart').getContext('2d');

    // Adding a subtle gradient to the bars for that premium look
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorSage);
    gradient.addColorStop(1, 'rgba(153, 173, 122, 0.2)');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Activity Level',
                // Dummy data matching a fitness curve
                data: [40, 25, 60, 55, 80, 50, 95, 65, 40, 70, 85, 60],
                backgroundColor: gradient,
                borderRadius: 8, // Rounded bar tops!
                barPercentage: 0.6, // Makes bars thinner
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
                y: {
                    beginAtZero: true,
                    display: false // Hides Y axis completely like the inspo
                },
                x: {
                    grid: { display: false }, // No vertical lines
                    border: { display: false }, // Removes the bottom line
                    ticks: {
                        color: '#a0a0a0',
                        font: { weight: 'bold', size: 11 }
                    }
                }
            }
        }
    });
});