// Global chart variable to store the current Chart.js instance
let myChart = null;

// Function that executes after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for navigation buttons
    document.getElementById('homeButton').addEventListener('click', function() {
        window.location.href = 'Welcome_page_admin.html';
    });

    document.getElementById('mapButton').addEventListener('click', function() {
        window.location.href = 'Map_admin.html';
    });

    document.getElementById('stockButton').addEventListener('click', function() {
        window.location.href = 'Stock_admin.html';
    });

    document.getElementById('statisticsButton').addEventListener('click', function() {
        window.location.href = 'Statistics_admin.html';
    });

    document.getElementById('registerRescuersButton').addEventListener('click', function() {
        window.location.href = 'Register_rescuers_admin.html';
    });

    document.getElementById('announcementsButton').addEventListener('click', function() {
        window.location.href = 'Announcements_admin.html';
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        // Placeholder for logout functionality
    });

    // Initialize date inputs with today's date
    document.getElementById('startDate').value = formatDate(new Date());
    document.getElementById('endDate').value = formatDate(new Date());
    
    // Event listener for fetching statistics based on selected dates
    document.getElementById('fetchStatsButton').addEventListener('click', function() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        fetchStatistics(new Date(startDate), new Date(endDate));
    });

    // Fetch initial data to display
    fetchUsername();
    fetchStatistics(new Date(), new Date());
});

// Fetch the username of the logged-in user
function fetchUsername() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/get_logged_in_username.php', true);
    xhr.onload = function() {
        // Placeholder for handling the response
    }
    xhr.send();
}

// Function to fetch statistics from the server for a given date range
function fetchStatistics(startDate, endDate) {
    fetch(`php/fetch_statistics.php?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`)
        .then(response => response.json())
        .then(data => {
            renderChart(data); // Render the chart with the fetched data
        })
        .catch(error => console.error('Error:', error));
}

// Function to render the chart using Chart.js
function renderChart(statistics) {
    const ctx = document.getElementById('statisticsChart').getContext('2d');
    const chartData = prepareChartData(statistics);

    // Destroy existing chart instance if present
    if (myChart) {
        myChart.destroy();
    }

    // Create a new chart instance
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['New Requests', 'Processed Requests', 'New Offers', 'Processed Offers'],
            datasets: [{
                label: 'Number of Tasks',
                data: chartData,
                backgroundColor: ['blue', 'green', 'yellow', 'red'],
                borderColor: ['black', 'black', 'black', 'black'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to prepare chart data from the statistics
function prepareChartData(statistics) {
    let newRequests = 0, processedRequests = 0, newOffers = 0, processedOffers = 0;

    statistics.forEach(stat => {
        // Increment count based on type and status
        if (stat.type === 'request' && (stat.status === 'pending' || stat.status === 'taken')) {
            newRequests += parseInt(stat.count);
        } else if (stat.type === 'request' && stat.status === 'completed') {
            processedRequests += parseInt(stat.count);
        } else if (stat.type === 'offer' && (stat.status === 'pending' || stat.status === 'taken')) {
            newOffers += parseInt(stat.count);
        } else if (stat.type === 'offer' && stat.status === 'completed') {
            processedOffers += parseInt(stat.count);
        }
    });

    return [newRequests, processedRequests, newOffers, processedOffers];
}

// Function to format a date as YYYY-MM-DD
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
