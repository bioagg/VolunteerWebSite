document.addEventListener('DOMContentLoaded', function() {
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
    fetchGeneralStatistics();
});

function fetchUsername() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/get_logged_in_username.php', true);
    xhr.onload = function() {
        if (this.status == 200) {
            document.querySelector('.hello_header').innerHTML = 'Hi, ' + this.responseText;
        }
    }
    xhr.send();
}

function fetchGeneralStatistics() {
    const url = 'php/general_statistics.php';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        // Assuming the JSON object has keys 'totalProducts', 'totalCategories', 'totalVehicles'
        insertStatisticBoxes(data.totalProducts, data.totalCategories, data.totalVehicles);
    })
    .catch(error => {
        console.error('Error fetching statistics:', error);
    });
}

function insertStatisticBoxes(totalProducts, totalCategories, totalVehicles) {
    const statsContainer = document.querySelector('.general_statistics');

    // Clear previous content
    statsContainer.innerHTML = '';

    // Create and append boxes
    statsContainer.appendChild(createStatisticBox(totalProducts, 'Total Products', '1'));
    statsContainer.appendChild(createStatisticBox(totalCategories, 'Total Categories', '2'));
    statsContainer.appendChild(createStatisticBox(totalVehicles, 'Total Vehicles', '3'));
}

function createStatisticBox(number, label, boxId) {
    const box = document.createElement('div');
    box.className = 'stat_box';

    // Three-dot menu button
    const menuButton = document.createElement('button');
    menuButton.className = "menu_button";
    menuButton.id = "menu_button_" + boxId;
    menuButton.innerHTML = '. . .'; //Three dots Maybe add image with dots
    menuButton.onclick = function() {
        // Toggle the dropdown menu for this specific box
        document.getElementById(`dropdown-${boxId}`).classList.toggle('show_menu');
        // this.nextElementSibling.classList.toggle('show_menu');
    };
    box.appendChild(menuButton);

    // Dropdown menu for this box
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    dropdownMenu.id = `dropdown-${boxId}`;
    if (boxId == '1') dropdownMenu.innerHTML = `<a class = "add_products" href="#">Add</a><a class = "edit_products" href="#">Edit</a><a class = "delete_products" href="#">Delete</a><a class = "add_json_products" href="#">Add with json</a>`;
    else if (boxId == '2') dropdownMenu.innerHTML = `<a class = "add_categories" href="#">Add</a><a class = "edit_categories" href="#">Edit</a><a class = "delete_categories" href="#">Delete</a><a class = "add_json_products" href="#">Add with json</a>`;
    else if (boxId == '3') dropdownMenu.innerHTML = `<a class = "add_vehicles" href="#">Add</a><a class = "edit_vehicles" href="#">Edit</a><a class = "delete_vehicles" href="#">Delete</a>`;

    box.appendChild(dropdownMenu);

    // Add event listeners to dropdown menu links
    const dropdownMenuLinks = dropdownMenu.querySelectorAll('a');
    dropdownMenuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            handleDropdownLinkClick(event, boxId); // Custom function to handle click
        });
    });

    // Rest of the stat_box content
    const numberElement = document.createElement('h3');
    numberElement.textContent = number;
    box.appendChild(numberElement);

    const labelElement = document.createElement('p');
    labelElement.textContent = label;
    box.appendChild(labelElement);

    return box;
}

async function handleDropdownLinkClick(event, boxId) {
    // 'event' is the click event object
    // 'boxId' is the ID of the box from which the dropdown link was clicked

    console.log('Link clicked in box:', boxId, 'Link:', event.target.textContent);
    
    if (boxId == 1) // Products section
    {
        if (event.target.textContent == "Add") { // Add products
            // Fetch catogories from the database
            const categories = await fetchCategories();

            // Generate HTML for the categories dropdown
            let categoriesOptions = categories.map(category =>
                `<option value="${category.category_id}">${category.category_name}</option>`
            ).join(''); // Join function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join#description

            Swal.fire({
                title: "Add new product",
                html:
                    '<form id="addProductForm" class="swal-form">' +
                    '<label for="product_name">Product Name:</label>' +
                    '<input type="text" id="product_name" name="product_name" required><br>' +
                    '<label for="category">Category Name:</label>' +
                    '<select id="category_id" name="category_id" required>' +
                    categoriesOptions +
                    '</select><br>' +
                    '<label for="quantity">Quantity:</label>' +
                    '<input type="number" id="quantity" name="quantity" min="0" required><br>' +
                    '<div id="detailsContainer"></div>' +
                    '<button type="button" onclick="addDetailInput()"> Add More Detail</button>' +
                    '<label for="product_description">Product Description:</label>' +
                    '<textarea id="product_description" name="product_description"></textarea><br>' +
                    '</form>',
                confirmButtonText: 'Add product',
                focusConfirm: false,
                preConfirm: () => {
                    const form = document.getElementById('addProductForm');
                    const formData = new FormData(form);
                    formData.append('product_id',generateUUID()); // APend the UUID to the formData
                    return submitProductForm(formData);
                }
            });
        } 
        else if (event.target.textContent == "Edit") { // Edit products
            Promise.all([fetchProducts(), fetchCategories()]).then(([products, categories]) => {
                let tableRows = products.map(product => {

                    let currentProductCategory = categories.filter(category => String(category.category_id) === String(product.category_id))
                        .map(category => `<option value="${category.category_id}">${category.category_name}</option>`)
                        .join();

                    // Generate options for all categories, including the current category user to ensure that it pop the product category as selected
                    let categoryOptions = categories
                        .map(category => {
                        // If the produc is the current product, we've already added it, so skip to avoid duplication
                        if(String(category.id) === product.category_id) return '';
                        return `<option value="${category.category_id}" ${category.category_id === product.category_id ? 'selected' : ''}>${category.category_name}</option>`;
                    })
                    .join('');
                    
                    // Prepare the current category option to ensure it appears first
                    categoryOptions = currentProductCategory + categoryOptions;
                    
                    // Generate inputs for editing product details
                    let detailInputs = product.details.map((detail, index) =>
                        `<div>
                            Detail Name: <input type="text" value="${detail.detail_name}" id="detail-name-${product.product_id}-${index}">
                            Detail Value: <input type="text" value="${detail.detail_value}" id="detail-value-${product.product_id}-${index}">
                        </div>`
                    ).join('');
        
                    return `<tr>
                                <td>${product.product_id}</td>
                                <td><input type="text" value="${product.product_name}" id="name-${product.product_id}"></td>
                                <td>
                                    <select id="category-${product.product_id}">
                                        ${categoryOptions}
                                    </select>
                                </td>
                                <td><input type="text" value="${product.product_description}" id="description-${product.product_id}"></td>
                                <td><input type="number" value="${product.quantity}" id="quantity-${product.product_id}"></td>
                                <td>${detailInputs}</td>
                                <td><button onclick="editProduct('${product.product_id}')">Update</button></td>
                            </tr>`;
                }).join('');
        
                Swal.fire({
                    title: "Edit Products",
                    html: 
                        `<table class="swal-table">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Category</th><th>Description</th><th>Quantity</th><th>Details</th><th>Action</th></tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>`,
                    showConfirmButton: false,
                    width: '800px'
                });
            });
        }
        else if (event.target.textContent == "Delete") { // Delete products
            fetchProducts().then(products => {
                let productRows = products.map(product =>
                    `<tr>
                        <td>${product.product_id}</td>
                        <td>${product.product_name}</td>
                        <td><button onclick="deleteProduct('${product.product_id}')">Delete</button></td>
                    </tr>`
                ).join('');
        
                Swal.fire({
                    title: "Delete Products",
                    html: 
                        `<table class="swal-table">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Action</th></tr>
                            </thead>
                            <tbody>${productRows}</tbody>
                        </table>`,
                    showConfirmButton: false,
                    width: '800px'
                });
            });
        }
        else if (event.target.textContent == "Add with json") { // Add products with json
            console.log("INNN");
            Swal.fire({
                title: 'Upload JSON File',
                input: 'file',
                inputAttributes: {
                    'accept': 'application/json',
                    'aria-label': 'Upload your JSON file'
                },
                showCancelButton: true,
                confirmButtonText: 'Upload',
                showLoaderOnConfirm: true,
                preConfirm: (file) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const json = JSON.parse(e.target.result);
                            resolve(json);
                        };
                        reader.readAsText(file);
                    });
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    processJSON_products_data(result.value);
                }
            });
        }
    }
    else if (boxId == 2) // Categories section
    {
        if (event.target.textContent == "Add") { // Add categories
            Swal.fire({
                title: "Add new category",
                html:
                '<form id="addCategoryForm" class="swal-form">' +
                '<label for="category_name">Category Name:</label>' +
                '<input type="text" id="category_name" name="category_name" required><br>' +
                '</form>',
                confirmButtonText: 'Add Category',
                focusConfirm: false,
                preConfirm: () => {
                    const form = document.getElementById('addCategoryForm');
                    const formData = new FormData(form);
                    formData.append('category_id', generateUUID()); // Append the UUID to the formData
                    return submitCategoryForm(formData);
                }
            });
        }
        else if (event.target.textContent == "Edit"){ // Edit categories
            fetchCategories().then(categories => {
                let tableRows = categories.map(category => 
                    `<tr>
                    <td>${category.category_id}</td>
                    <td><input type="text" value="${category.category_name}" id="name-${category.category_id}"></td>
                    <td><button onclick="editCategory('${category.category_id}')">Update</button></td>
                    </tr>`
                ).join('');

                Swal.fire({
                    title: "Edit Categories",
                    html:
                        `<table class="swal-table">
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>Action</th></tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                        </table>`,          
                    showConfirmButton: false,
                    width: '800px'          
                });
            });
        } 
        else if (event.target.textContent == "Delete") { // Delete categories
            fetchCategories().then(categories => {
                let categoryRows = categories.map(category =>
                    `<tr>
                        <td>${category.category_id}</td>
                        <td>${category.category_name}</td>
                        <td><button onclick="deleteCategory('${category.category_id}')">Delete</button></td>
                    </tr>`
                ).join('');
        
                Swal.fire({
                    title: "Delete Categories",
                    html: 
                        `<table class="swal-table">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Action</th></tr>
                            </thead>
                            <tbody>${categoryRows}</tbody>
                        </table>`,
                    showConfirmButton: false,
                    width: '800px'
                });
            });
        }
        else if (event.target.textContent == "Add with json") { // Add json category file
            Swal.fire({
                title: 'Upload JSON File',
                input: 'file',
                inputAttributes: {
                    'accept': 'application/json',
                    'aria-label': 'Upload your JSON file'
                },
                showCancelButton: true,
                confirmButtonText: 'Upload',
                showLoaderOnConfirm: true,
                preConfirm: (file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const json = JSON.parse(e.target.result);
                                if (json.categories && Array.isArray(json.categories)) {
                                    resolve(json);
                                } else {
                                    reject(new Error("Invalid JSON format"));
                                }
                            } catch (error) {
                                reject(new Error("Invalid file content"));
                            }
                        };
                        reader.onerror = () => reject(new Error("Failed to read file"));
                        reader.readAsText(file);
                    });
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    processJSON_category_data(result.value.categories);
                }
            }).catch(error => {
                Swal.fire('Error', error.message, 'error');
            });
        }
        
    }
    else if (boxId == 3) // Vehicles section
    {
        if (event.target.textContent == "Add") { // Add vehicles
            // Fetch user IDs from the database
            const userIds = await fetchUserIds();
            console.log(userIds);
            // Generate HTML for the user IDs dropdown
            let userIdsOptions = userIds
                .filter(user => user.id_role === 2) // Filter for id_role equal to 2
                .map(user => 
                    `<option value="${user.id}">${user.id} - ${user.username}</option>`
                ).join('');

            Swal.fire({
                title: "Add new vehicle",
                html:
                '<form id="addVehicleForm" class="swal-form">' +
                '<label for="user_id">User ID:</label>' +
                '<select id="user_id" name="user_id" required>' +
                userIdsOptions +
                '</select><br>' +
                '<label for="vehicle_type">Vehicle Type:</label>' +
                '<input type="text" id="vehicle_type" name="vehicle_type" required><br>' +
                '<label for="license_plate">License Plate:</label>' +
                '<input type="text" id="license_plate" name="license_plate" required><br>' +
                '<label for="manufactorer">Manufactorer:</label>' +
                '<input type="text" id="manufactorer" name="manufactorer"><br>' +
                '<label for="model">Model:</label>' +
                '<input type="text" id="model" name="model"><br>' +
                '<label for="year">Year:</label>' +
                '<input type="number" id="year" name="year" min="1900" max="2099"><br>' +
                '<label for="color">Color:</label>' +
                '<input type="text" id="color" name="color"><br>' +
                '</form>',
                confirmButtonText: 'Add Vehicle',
                focusConfirm: false,
                preConfirm: () => {
                    const form = document.getElementById('addVehicleForm');
                    const formData = new FormData(form);
                    return submitVehicleForm(formData);
                }
            });
        }
        else if (event.target.textContent == "Edit") { // Edit vehicles
            Promise.all([fetchVehicles(), fetchUserIds()]).then(([vehicles, userIds]) => {

                let tableRows = vehicles.map(vehicle => {
                    // Convert vehicle.user_id to String if necessary
                    // let vehicleUserIdAsString = String(vehicle.user_id);

                    // Find the current vehicle's user and mark it as the first option
                    let currentUserOption = userIds.filter(user => String(user.id) === vehicle.user_id)
                        .map(user => `<option value="${user.id}" selected>${user.id} - ${user.username}</option>`)
                        .join('');

                    // Generate options for all users, including the current user to ensure it's always an option even if not selected
                    let userIdsOptions = userIds
                        .map(user => {
                            // If the user is the current user, we've already added them, so skip to avoid duplication
                            if(String(user.id) === vehicle.user_id) return '';
                            return `<option value="${user.id}">${user.id} - ${user.username}</option>`;
                        })
                        .join('');

                    // Prepend the current user option to ensure it appears first
                    userIdsOptions = currentUserOption + userIdsOptions;
                    console.log("A: ", userIdsOptions);
                    return `<tr>
                            <td>${vehicle.vehicle_id}</td>
                            <td><select id="user-${vehicle.vehicle_id}">${userIdsOptions}</select></td>
                            <td><input type="text" value="${vehicle.vehicle_type}" id="type-${vehicle.vehicle_id}"></td>
                            <td><input type="text" value="${vehicle.license_plate}" id="plate-${vehicle.vehicle_id}"></td>
                            <td><input type="text" value="${vehicle.manufactorer}" id="manufactorer-${vehicle.vehicle_id}"></td>
                            <td><input type="text" value="${vehicle.model}" id="model-${vehicle.vehicle_id}"></td>
                            <td><input type="number" value="${vehicle.year}" id="year-${vehicle.vehicle_id}"></td>
                            <td><input type="text" value="${vehicle.color}" id="color-${vehicle.vehicle_id}"></td>
                            <td><button onclick="editVehicle('${vehicle.vehicle_id}')">Update</button></td>
                            </tr>`;
                }).join('');
                    
                Swal.fire({
                    title: "Edit Vehicles",
                    html: 
                        `<table class="swal-table">
                            <thead>
                                <tr><th>ID</th><th>User ID</th><th>Type</th><th>Plate</th><th>manufactorer</th><th>Model</th><th>Year</th><th>Color</th><th>Action</th></tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>`,
                    showConfirmButton: false,
                    width: '800px'
                });
            });
        }
        else if (event.target.textContent == "Delete") { // Delete vehicles
            fetchVehicles().then(vehicles => {
                let vehicleRows = vehicles.map(vehicle =>
                    `<tr>
                        <td>${vehicle.vehicle_id}</td>
                        <td>${vehicle.vehicle_type}</td>
                        <td>${vehicle.license_plate}</td>
                        <td><button onclick="deleteVehicle('${vehicle.vehicle_id}')">Delete</button></td>
                    </tr>`
                ).join('');
        
                Swal.fire({
                    title: "Delete Vehicles",
                    html: 
                        `<table class="swal-table">
                            <thead>
                                <tr><th>ID</th><th>Type</th><th>Plate</th><th>Action</th></tr>
                            </thead>
                            <tbody>${vehicleRows}</tbody>
                        </table>`,
                    showConfirmButton: false,
                    width: '800px'
                });
            });
        }
    }
}

// Function to generate a UUID (Placeholder, replace with actual UUID generation logic)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/*********************************************
************* FETCH FUNCTIONS ******************
**********************************************/

// Fetch categories from database
async function fetchCategories() {
    try {
        const response = await fetch('php/fetch_categories.php');
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Fetch user ids 
async function fetchUserIds() {
    try {
        const response = await fetch('php/fetch_user_ids.php');
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user IDs:', error);
    }
}

// Fetch products
async function fetchProducts() {
    try {
        const response = await fetch('php/fetch_products.php');
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fetch vehicles
async function fetchVehicles() {
    try {
        const response = await fetch('php/fetch_vehicles.php');
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching vehicles:', error);
    }
}

// Function to add detail input fields
function addDetailInput() {
    const detailsContainer = document.getElementById('detailsContainer');
    const newDetail = document.createElement('div');
    newDetail.innerHTML = `
        <input type="text" placeholder="Detail Name" name="detail_names[]">
        <input type="text" placeholder="Detail Value" name="detail_values[]">
    `;
    detailsContainer.appendChild(newDetail);
}

/*********************************************
************* ADD FUNCTIONS ******************
**********************************************/

// Asynchronously submits the category form data to the server
async function submitCategoryForm(formData) {
    // AJAX request using fetch
    try {
        // Sending a POST request to the server with the form data
        const response = await fetch('php/add_category.php', {
            method: 'POST',
            body: formData
        });

        // Check if the response status is not okay (e.g., server returned 4xx or 5xx HTTP status code)
        if (!response.ok) {
            // Throwing an error will send us to the catch block below
            throw new Error(response.statusText);
        }

        // Parse the JSON response from th server
        const data = await response.json();

        // Check i fthe operation was successful based on the 'status'
        if (data.status === 'success') {
            // Display a success message using SweetAlert
            await Swal.fire({
                title: "Success!",
                text: "Category added successfully",
                icon: "success",
                confirmButtonText: 'OK'
            });

            //Refresh the page after the user clicks 'OK'
            window.location.reload();
        } else {
            // Handle the case where the server indicates a failure
            Swal.fire({
                title: "Error!",
                text: data.error || "An error occurred",
                icon: "error",
                confirmButtonText: 'OK'
            });
        }

        // Return the data for any furtner processing (if needed)
        return data
    } catch (error) {
        // Log and display any network or unexpected errors
        console.log("This is the error: ", error);
        Swal.showValidationMessage(`Request failed: ${error}`);
    }
}

async function submitProductForm(formData) {
    try {

        // Log the contents of formData
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const response = await fetch('php/add_product.php', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();

        if (data.status === 'success') {
            await Swal.fire({
                title: "Success!",
                text: "Product added successfully",
                icon: "success",
                confirmButtonText: "OK"
            });

            //Refresh the page after the user clicks 'OK'
            window.location.reload();
        } else {
            Swal.fire({
                title: "Error!",
                text: data.error || "An error occured",
                icon: "error",
                confirmButtonText: "OK"
            });
        }

        return data;
    } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
    }
}

async function submitVehicleForm(formData) {
    try {
        const response = await fetch('php/add_vehicle.php', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();

        if (data.status === 'success') {
            await Swal.fire({
                title: 'Success!',
                text: 'Vehicle added successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            //Refresh the page after the user clicks 'OK'
            window.location.reload();
        } else {
            console.log("MEssage: ", data);
            Swal.fire({
                title: 'Error!',
                text: data.error || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        return data;
    } catch (error) {
        console.log("Error: ", error);
        Swal.showValidationMessage(`Request failed: ${error}`);
    }
}

/*********************************************
************* EDIT FUNCTIONS ******************
**********************************************/

function editCategory(categoryId) {
    // Get the new name entered by the user for the category from the input field
    const newName = document.getElementById(`name-${categoryId}`).value;

    // Create a FormData object to easily send form data in the POST request
    const formData = new FormData();
    // Append the category ID to the FormData object
    formData.append('category_id', categoryId);
    // Append the new category name to the FormData object
    formData.append('category_name', newName);

    // Send a POST request to the server to update the category
    fetch('php/edit_category.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Convert the response to JSON
    .then(async data => {
        // Check the response from the server
        if (data.status === 'success') {
            // If the update was successful, display a success message
            await Swal.fire('Success', 'Category updated successfully', 'success');

            // Refresh the page after the user clicks 'OK'
            window.location.reload();
        } else {
            // If the server responded with an error, display an error message
            Swal.fire({
                title: 'Error!',
                text: data.message || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        // Log and display any errors encountered during the fetch request
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred', 'error');
    });
}

function editProduct(productId) {
    const newName = document.getElementById(`name-${productId}`).value;
    const newCategoryId = document.getElementById(`category-${productId}`).value;
    const newDescription = document.getElementById(`description-${productId}`).value;
    const newQuantity = document.getElementById(`quantity-${productId}`).value;


    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('product_name', newName);
    formData.append('category_id', newCategoryId);
    formData.append('product_description', newDescription);
    formData.append('quantity', newQuantity);

    // Collecting detail names and values
    const detailNameInputs = document.querySelectorAll(`[id^="detail-name-${productId}-"]`);
    const detailValueInputs = document.querySelectorAll(`[id^="detail-value-${productId}-"]`);

    detailNameInputs.forEach((input, index) => {
        formData.append(`detail_names[${index}]`, input.value);
        formData.append(`detail_values[${index}]`, detailValueInputs[index].value);
    });

    fetch('php/edit_product.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(async data => {
        if (data.status === 'success') {
            await Swal.fire('Success', 'Product updated successfully', 'success');

            // Refresh the page after the user clicks 'OK'
            window.location.reload();
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.message || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred', 'error');
    });
}

function editVehicle(vehicleId) {
    const userId = document.getElementById(`user-${vehicleId}`).value;
    const vehicleType = document.getElementById(`type-${vehicleId}`).value;
    const licensePlate = document.getElementById(`plate-${vehicleId}`).value;
    const manufactorer = document.getElementById(`manufactorer-${vehicleId}`).value;
    const model = document.getElementById(`model-${vehicleId}`).value;
    const year = document.getElementById(`year-${vehicleId}`).value;
    const color = document.getElementById(`color-${vehicleId}`).value;

    const formData = new FormData();
    formData.append('vehicle_id', vehicleId);
    formData.append('user_id', userId);
    formData.append('vehicle_type', vehicleType);
    formData.append('license_plate', licensePlate);
    formData.append('manufactorer', manufactorer);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('color', color);

    fetch('php/edit_vehicle.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(async data => {
        if (data.status === 'success') {
            await Swal.fire('Success', 'Vehicle updated successfully', 'success');

            // Refresh the page after the user clicks 'OK'
            window.location.reload();
        } else {
            Swal.fire({
                title: 'Error!',
                text: data.message || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: data.message || 'An error occurred',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}


/*********************************************
************* DELETE FUNCTIONS ******************
**********************************************/

function deleteProduct(productId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('product_id', productId);

            fetch('php/delete_product.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(async data => {
                if (data.status === 'success') {
                    await Swal.fire('Deleted!', 'Your product has been deleted.', 'success');

                    // Refresh the page after the user clicks 'OK'
                    window.location.reload();
                } else {
                    Swal.fire('Error', 'Failed to delete product', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred', 'error');
            });
        }
    });
}

function deleteCategory(categoryId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('category_id', categoryId);

            fetch('php/delete_category.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(async data => {
                if (data.status === 'success') {
                    await Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
                    
                    // Regresh the page after the user click "OK"
                    window.location.reload();
                } else {
                    Swal.fire('Error', 'Failed to delete category', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred', 'error');
            });
        }
    });
}

function deleteVehicle(vehicleId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('vehicle_id', vehicleId);

            fetch('php/delete_vehicle.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(async data => {
                if (data.status === 'success') {
                    await Swal.fire('Deleted!', 'Your vehicle has been deleted.', 'success');
                    
                    // Regresh the page after the user click "OK"
                    window.location.reload();
                } else {
                    Swal.fire('Error', 'Failed to delete vehicle', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred', 'error');
            });
        }
    });
}

/*********************************************
************* PROCESS JSON FILES *************
**********************************************/

async function processJSON_products_data(jsonData) {
    console.log("These are the jsonDATA: ", jsonData);
    // Assuming jsonData.items contains the array of products
    for (const item of jsonData.items) {
        const formData = new FormData();
        formData.append('product_name', item.name);
        formData.append('category_id', item.category);
        // Generate a UUID for product_id
        formData.append('product_id', generateUUID());

        // Process details
        item.details.forEach((detail, index) => {
            formData.append(`detail_names[${index}]`, detail.detail_name);
            formData.append(`detail_values[${index}]`, detail.detail_value);
        });

        try {
            const response = await fetch('php/add_product.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                console.log('Product added successfully:', data.message);
            } else {
                console.error('Error adding product:', data.message);
                Swal.fire({
                    title: 'Error',
                    text: `Failed to add product: ${data.message}`,
                    icon: 'error'
                });
                return; // Stop processing further if an error occurs
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Show the error message using Swal.fire
            Swal.fire({
                title: 'Error',
                text: `An error occurred: ${error.message}`,
                icon: 'error'
            });
            return; // Stop processing further if an error occurs
        }
    }

    // Inform the user after processing all products
    Swal.fire({
        title: 'Completed',
        text: 'All products processed.',
        icon: 'success'
    }).then((result) => {
        if (result.value) {
            window.location.reload(); // Reload the page
        }
    });
}

async function processJSON_category_data(categories) {
    console.log("CAT", categories);
    for (const category of categories) {
        const formData = new FormData();
        formData.append('category_name', category.category_name);
        formData.append('category_id', category.id); // Assuming you have a generateUUID function

        try {
            const response = await fetch('php/add_category.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok || data.status !== 'success') {
                throw new Error(data.message || 'Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', category, error);
            // Optionally, break the loop or continue processing other categories
        }
    }

    Swal.fire('Completed', 'All categories processed.', 'success');
}
