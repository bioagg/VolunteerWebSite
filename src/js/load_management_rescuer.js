document.addEventListener('DOMContentLoaded', async function() {
    try {
        fetchUsername();

        fetchAndDisplayProducts(); // Function to fetch products and display in the table

        fetchAndDisplayRescuerInventory(); // Function to fetch the current inventory of the rescuer logged in

        fetchCoordinates();

    } catch (error) {
        console.error('Error:', error);
    }
});

async function fetchUsername() {
    try {
        const response = await fetch('php/get_logged_in_username.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error; // Reject the promise with the error
    }
}

function fetchAndDisplayProducts() {
    // Fetch product data from the server
    fetch('php/fetch_products.php')
    .then(response => response.json())
    .then(data => {
        // Reference to the table body where product rows will be appended
        const productsTable = document.querySelector(".productsTable tbody");
        
        // Initialize an empty string to hold HTML for all rows
        let rows = "";

        // Iterate over each product received from the server
        data.forEach(product => {
            // Determine the stock class based on the quantity
            const stockClass = product.quantity < 6 ? 'low-stock' : 'high-stock';

            // Append a new row for each product
            rows += `
                <tr>
                    <td>${product.product_name}</td>
                    <td>${product.product_description}</td>
                    <td class="${stockClass}">${product.quantity}</td>
                </tr>
            `;
        });

        // Update the table's inner HTML with the new rows
        productsTable.innerHTML = rows;
    })
    .catch(error => {
        // Log and handle any errors encountered during the fetch
        console.error("Error: ", error);
    });
}

// Function to fetch and display the rescuer's current inventory
function fetchAndDisplayRescuerInventory() {
    fetch('php/fetch_rescuer_inventory.php')
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            console.log("THESE ARE: ", data);
            const inventoryDiv = document.querySelector('.rescuerInventory');
            let tableRows = data.inventory.map(item => 
                `<tr>
                    <td>${item.product_name}</td>
                    <td>${item.quantity}</td>
                </tr>`
            ).join('');

            let tableHTML = `
                <table class="inventoryTable">
                    <thead>
                        <tr><th>Product Name</th><th>Quantity</th></tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>`;

            inventoryDiv.innerHTML = tableHTML;
        } else {
            console.error('Error fetching inventory:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}


function fetchCoordinates() {
    fetch('php/get_user_and_admin_coordinates.php')
    .then(response => response.json())
    .then(data => {

        if(data.status === 'success') {
            console.log('User Coordinates:', data.userCoordinates);
            console.log('Admin Coordinates:', data.adminCoordinates);
            
            const userCoords = data.userCoordinates;
            const adminCoords = data.adminCoordinates;

            // Check if the user is within 100 meters of the admin
            if (isWithin100Meters(userCoords.lat_user, userCoords.lng_user, adminCoords.lat_user, adminCoords.lng_user)) {
                // User is within 100 meters, show load button
                const mainBody = document.querySelector('.main_body');
                mainBody.innerHTML += '<div class="div_buttons"><button id="loadButton" class="loadButton">Load</button> <button id="unloadButton" class="unloadButton">Unload</button></div>';

                // Add event listener to the newly created loadButton
                document.getElementById('loadButton').addEventListener('click', () => {
                    fetchProducts().then(products => showLoadProductsModal(products));
                });

                document.getElementById('unloadButton').addEventListener('click', unloadRescuerInventory);

            } else {
                // User is not within 100 meters, show message
                document.querySelector('.main_body').innerHTML += '<h1>You are not within 100 meters of the base.</h1>';
            }
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch products from the server
async function fetchProducts() {
    try {
        const response = await fetch('php/get_products.php') // Replace with your actual PHP script URL
            ;
        const data = await response.json();
        return data;
    } catch (error) {
        return console.error('Error:', error);
    }
}

// Function to calculate the distance between two geographical coordinates using the Haversine formula
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the Earth in meters
    const dLat = deg2rad(lat2 - lat1); // Difference in latitudes converted to radians
    const dLon = deg2rad(lon2 - lon1); // Difference in longitudes converted to radians

    // Haversine formula calculation
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;  // Distance in meters

    return distance;
}

// Helper function to convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Function to check if the distance between two coordinates is less than or equal to 50 meters
function isWithin100Meters(lat1, lon1, lat2, lon2) {
    // console.log("This is the distance: ", getDistanceFromLatLonInM(lat1, lon1, lat2, lon2));
    return getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) <= 100;
}

// Function to show the load products modal
function showLoadProductsModal(products) {
    let tableRows = products.map(product =>
        `<tr>
            <td id="product-name-${product.product_id}">${product.product_name}</td>
            <td id="category-name-${product.product_id}">${product.category_name}</td>
            <td id="product-description-${product.product_id}">${product.product_description}</td>
            <td id="product-quantity-${product.product_id}">${product.quantity}</td>
            <td><input type="number" min="0" id="quantity-loaded-${product.product_id}" placeholder="Enter quantity"></td>
        </tr>` // <td><button onclick="loadProduct('${product.product_id}', event)">Load</button></td>
    ).join('');

    let tableHTML = `<table class="swal-table">
                        <thead>
                            <tr><th>Name</th><th>Category</th><th>Description</th><th>Available Quantity</th><th>Load Quantity</th></tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                     </table>`;

    Swal.fire({
        title: 'Load Products',
        html: tableHTML,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'swal-wide'
        },
        preConfirm: () => {
            // Collect all loaded products
            let loadedProducts = [];
            products.forEach(product => {
                let quantity = parseInt(document.getElementById(`quantity-loaded-${product.product_id}`).value) || 0;
                if (quantity > 0) {
                    loadedProducts.push({ productId: product.product_id, quantity: quantity });
                }
            });
            return loadedProducts;
        }
    }).then((result) => {
        if (result.isConfirmed && result.value.length > 0) {
            updateRescuerInventory(result.value);
        }
    });
}


// Function to handle loading a product
function loadProduct(productId, event) {
    event.preventDefault(); // Prevent closing SweetAlert
    let quantityToLoad = parseInt(document.getElementById(`quantity-loaded-${productId}`).value);
    let availableQuantity = parseInt(document.getElementById(`product-quantity-${productId}`).textContent);

    if (quantityToLoad > availableQuantity) {
        Swal.showValidationMessage('Requested quantity exceeds available stock');
        return;
    }
    document.getElementById(`product-quantity-${productId}`).textContent = availableQuantity - quantityToLoad;

    // Store the loaded quantity in the global variable
    if (quantityToLoad > 0) {
        loadedProductQuantities[productId] = (loadedProductQuantities[productId] || 0) + quantityToLoad;
    }
}

// Function to update the rescuer's inventory with loaded products
function updateRescuerInventory(loadedProducts) {
    // We use an async function inside .then() to allow the use of 'await' for the Swal.fire modal
    // 'await' is used to wait for the Swal modal to close before proceeding with the page reload
    fetch('php/bulk_update_rescuer_inventory.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loadedProducts: loadedProducts })
    })
    .then(response => response.json())
    .then(async data => { // 'async' is used here to enable 'await' inside this function
        if (data.status === 'success') {
            // Wait for the success message to be acknowledged by the user
            await Swal.fire('Success', 'All products loaded successfully', 'success');
            // Reload the page after the user clicks 'OK' to reflect changes in inventory
            window.location.reload();
        } else {
            // Display an error message if the update is unsuccessful
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        // Handle any errors that occur during the fetch request
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred', 'error');
    });
}

// Function to handle the final confirmation of loaded products
function confirmLoadedProducts() {
    // Prepare data to be sent to the server
    const formData = new FormData();
    for (const productId in loadedProductQuantities) {
        formData.append(`products[${productId}]`, loadedProductQuantities[productId]);
    }

    // Send AJAX request to the server
    fetch('php/update_rescuer_inventory.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            Swal.fire('Success', 'Products loaded successfully', 'success');
            // Optionally, refresh the product list or update the UI accordingly
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred', 'error');
    });
}

// Function to handle the unloading process
function unloadRescuerInventory() {
    // Sending a GET request to check the rescuer's current inventory
    fetch('php/check_rescuer_inventory.php', {
        method: 'GET'
    })
    .then(response => response.json()) // Parsing the JSON response from the server
    .then(data => {
        // Checking if the server responded with a success status
        if (data.status === 'success') {
            // If the rescuer has items in their inventory
            if (data.hasItems) {
                // Call function to proceed with unloading the items
                proceedWithUnloading(data.items);
            } else {
                // Display an informational message if there are no items to unload
                Swal.fire('Info', 'You have nothing to unload.', 'info');
            }
        } else {
            // Display an error message if the server response indicates an error
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        // Handling any errors that might occur during the fetch operation
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred', 'error');
    });
}

// Function to proceed with unloading
function proceedWithUnloading(items) {
    // Display a confirmation dialog to confirm unloading of all items in the rescuer's inventory
    Swal.fire({
        title: "Are you sure?",
        text: "This action will unload all your inventory!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, unload!'
    }).then((result) => {
        // If the user confirms the unloading action
        if (result.isConfirmed) {
            // Sending a POST request to the server to unload the items
            fetch('php/unload_rescuer_inventory.php', {
                method: 'POST',
                body: JSON.stringify({ unloadedProducts: items })
            })
            .then(response => response.json())
            .then(async data => {
                // Check if the unloading was successful
                if (data.status === "success") {
                    // Display a success message
                    await Swal.fire('Success', 'All products unloaded successfully', 'success');

                    // Reload the page to reflect changes
                    window.location.reload();
                } else {
                    // Display an error message in case of failure
                    Swal.fire('Error', 'Failed to unload inventory', 'error');
                }
            })
            .catch(error => {
                // Handling any errors during the fetch operation
                Swal.fire('Error', 'An error occurred', 'error');
            });            
        }
    });
}