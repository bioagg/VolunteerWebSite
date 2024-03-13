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

    const form = document.getElementById('announcementForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('announcementTitle').value;
        const description = document.getElementById('announcementDescription').value;
        const productId = document.getElementById('productSelect').value;
        const requiredQuantity = document.getElementById('requiredQuantity').value;

        createAnnouncement(title, description, productId, requiredQuantity);
    });

    // Populate products in the dropdown
    fetchProducts();
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

function createAnnouncement(title, description, productId, requiredQuantity) {
    fetch('php/create_announcement.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title, description, productId, requiredQuantity })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            Swal.fire('Success', 'Announcement created successfully', 'success')
            .then(() => window.location.reload());
        } else {
            Swal.fire('Error', 'Failed to create announcement', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'There was a problem with the request', 'error');
    });
}

// Fetch products
async function fetchProducts() {
    try {
        const response = await fetch('php/fetch_products.php');
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const products = await response.json();
        const productSelect = document.getElementById('productSelect');
        productSelect.innerHTML = ''; // Clear existing options

        // Create a default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a product';
        productSelect.appendChild(defaultOption);

        // Append each product as an option
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.product_id;
            option.textContent = product.product_name;
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
