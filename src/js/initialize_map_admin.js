document.addEventListener('DOMContentLoaded', function(){
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
        // Implement logout functionality here
        // For example: window.location.href = 'logout.php';
    });

    fetchUsername();

});

function fetchUsername() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/get_logged_in_username.php', true);
    xhr.onload = function() {
        if (this.status == 200) {
            // document.querySelector('.hello_header').innerHTML = 'Hi, ' + this.responseText;
        }
    }
    xhr.send();
}
    