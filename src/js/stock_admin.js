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

    fetchCategories();

    // initially fetch all inventory
    fetchInventory();
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

function fetchCategories() {
    fetch('php/fetch_categories.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(categories => {
            var categoryFilters = document.getElementById('categoryFilters');
            categoryFilters.innerHTML = '';

            categories.forEach(function(category) {
                var label = document.createElement('label');
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'filter-category-' + category.category_id;
                checkbox.checked = true;
                checkbox.setAttribute('data-category-id', category.category_id);

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(' ' + category.category_name));
                categoryFilters.appendChild(label);

                // Add event listener to each checkbox
                checkbox.addEventListener('change', function() {
                    applyCategoryFilters();
                });
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function applyCategoryFilters() {
    const selectedCategories = [];
    const checkboxes = document.querySelectorAll('#categoryFilters input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        selectedCategories.push(checkbox.getAttribute('data-category-id'));
    });

    // Call function to fetch and display inventory based on selected categories
    fetchInventory(selectedCategories);
}

function fetchInventory(selectedCategories = []) {
    // Prepare data to be sent to the PHP script
    const formData = new FormData();
    selectedCategories.forEach(catId => formData.append('categories[]', catId));

    fetch('php/fetch_inventory.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach(item => {
            const row = tableBody.insertRow();
            const nameCell = row.insertCell(0);
            const quantityCell = row.insertCell(1);
            const rescuerQuantityCell = row.insertCell(2);
            const statusCell = row.insertCell(3);

            nameCell.textContent = item.product_name;
            quantityCell.textContent = item.total_quantity;
            rescuerQuantityCell.textContent = item.rescuer_quantity !== null ? item.rescuer_quantity : 'N/A';
            statusCell.textContent = item.rescuer_name ? `Taken by ${item.rescuer_name}` : 'Available';
        });
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}


    