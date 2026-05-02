document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('dashboardChart')?.getContext('2d');
    
    const colorSage = '#99AD7A';    
    const colorAmber = '#DCAE1D';   

    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY \u2022 18 HRS'],
                datasets: [{
                    label: 'Active Hours',
                    data: [3, 6, 12, 25, 45, 60, 80, 40, 50, 35, 22, 18],
                    backgroundColor: [
                        colorSage, colorSage, colorSage, colorSage, 
                        colorSage, colorSage, colorSage, colorSage, 
                        colorSage, colorSage, colorSage, colorAmber 
                    ],
                    barThickness: 4, 
                    borderRadius: 5,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { bottom: 10 }
                },
                plugins: {
                    legend: { display: false }, 
                    tooltip: {
                        backgroundColor: '#344B2A', 
                        titleColor: '#ffffff',
                        bodyColor: colorAmber,
                        displayColors: false,
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y + ' hrs';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false }, 
                        border: { display: false },
                        ticks: { 
                            color: function(context) {
                                return context.index === 11 ? colorAmber : '#a0a0a0';
                            },
                            font: { size: 10, weight: 'bold' },
                            maxRotation: 90, 
                            minRotation: 90,
                            autoSkip: false
                        }
                    },
                    y: {
                        display: false, 
                        min: 0
                    }
                }
            }
        });
    }
});