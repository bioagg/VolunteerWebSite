// Global variable for the Leaflet map
let map;
let redIcon, blueIcon, blackIcon, baseIcon, greenIcon, yellowIcon, purpleIcon, vehicleIcon, rescuerIcon, markers;
let showTakenRequests = true;
let showPendingRequests = true;
let showOffers = true;
let showActiveVehicles = true;
let showIdleVehicles = true;
let showPolylines = true;
let vehicleMarkers = {}; // Object to keep track of vehicle markers by their ID
let requestOfferMarkers = []; // Array to keep track of request/offer markers
let polylines = []; // Array to keep track of polylines

document.addEventListener('DOMContentLoaded', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(show_map);
    } else {
        Swal.fire({
            icon: "error",
            title: "User Error",
            text: "User didnt give permission to share his current location."
        });
    }

    initializeIcons(); // Initialize icons first

    fetchAndDisplayAdminData();

    // Set up filter event listeners
    setupFilterEventListeners();
});

function show_map(position){
    map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function fetchAndDisplayAdminData() {
    fetch('php/fetch_admin_data.php')
        .then(response => response.json())
        .then(data => {
            if (!map) {
                console.error('Map object not found in fetch and display');
                return;
            }
            console.log("This is the data: ", data);
            // Process and display the data on the map
            displayAdminDataOnMap(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayAdminDataOnMap(data) {
    // Clear existing markers and polylines before processing new data
    clearMap();

    // Create markers for base, vehicles, requests, and offers
    // Create a MarkerCluster group
    markers = L.markerClusterGroup();

    // Base location
    if (data.baseLocation) {
        let baseMarker = L.marker([data.baseLocation.lat_user, data.baseLocation.lng_user], 
            { icon: baseIcon, draggable: true })
            .bindPopup("<b>Base Location</b>")
            .addTo(map);
        
        // Update the location of the base (admin user)
        baseMarker.on('dragend', function(e) {
            let newPosition = e.target.getLatLng();
            confirmAndUpdateBasePosition(newPosition.lat, newPosition.lng)
        });
    }

    // Iterate through vehicles, requests, and offers to create markers and pop-ups
    data.vehicles.forEach(vehicle => {
        // Create vehicle marker with load calculation
        let vehicleLoadHtml = getVehicleLoad(vehicle.vehicle_id, data.requestsOffers);
        let vehicleMarker = L.marker([vehicle.latitude, vehicle.longitude], {icon: vehicleIcon})
            .bindPopup(createVehiclePopupContent(vehicle, vehicleLoadHtml));

        vehicleMarkers[vehicle.vehicle_id] = {
            marker: vehicleMarker,
            isActive: vehicleLoadHtml.includes('<li>')
        };
        console.log("VMMM: ", vehicleMarkers);
        map.addLayer(vehicleMarker);
    });

    // Similar logic for requests and offers
    data.requestsOffers.forEach(request_offer => {
        console.log(request_offer);
        let markerIcon = getMarkerIcon(request_offer);
        let popupContentFunction = request_offer.type === "request" ? createRequestPopupContent : createOfferPopupContent;

        let marker = L.marker([request_offer.lat, request_offer.lng], {icon: markerIcon})
            .bindPopup(popupContentFunction(request_offer));
        
        requestOfferMarkers.push({
            marker: marker,
            type: request_offer.type,
            status: request_offer.status,
            vehicle_id: request_offer.vehicle_id
        });
    
        markers.addLayer(marker); // Add to MarkerCluster group. Add request/offer markers to the cluster group

        // If the request/offer is taken, draw a line to the corresponding vehicle
        if (request_offer.status === "taken" && vehicleMarkers[request_offer.vehicle_id]) {
            let polyline = L.polyline([
                vehicleMarkers[request_offer.vehicle_id].marker.getLatLng(), 
                marker.getLatLng()
            ], {color: 'blue'}).addTo(map);
    
            polylines.push(polyline);
        }
    });

    // Add the MarkerCluster group to the map
    map.addLayer(markers);
}

function initializeIcons() {
    // Initialize your icons here
        // Red ICon
        redIcon = L.icon({
            iconUrl: 'Images/red_marker.png',
            iconSize: [32, 32], // size of the icon, adjust as needed
            iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });
    
        // Blue Icon
        blueIcon = L.icon({
                iconUrl: 'Images/blue_marker.png',
                iconSize: [23, 32], // size of the icon, adjust as needed
                iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });
    
        // Black Icon
        blackIcon = L.icon({
                iconUrl: 'Images/black_marker.png',
                iconSize: [32, 32], // size of the icon, adjust as needed
                iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });

        // Green ICon
        greenIcon = L.icon({
            iconUrl: 'Images/marker-icon-green.png',
            iconSize: [25, 32], // size of the icon, adjust as needed
            iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });
            
        // Yellow Icon
        yellowIcon = L.icon({
                iconUrl: 'Images/marker-icon-yellow.png',
                iconSize: [25, 32], // size of the icon, adjust as needed
                iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });
            
        // Purple Icon
        purpleIcon = L.icon({
                iconUrl: 'Images/marker-icon-violet.png',
                iconSize: [25, 32], // size of the icon, adjust as needed
                iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });
    
        // Base Icon
        baseIcon = L.icon({
        iconUrl: 'Images/Base_img-removebg-preview.png',
        iconSize: [32, 32], // size of the icon, adjust as needed
        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });
    
        // Rescuer Icon
        rescuerIcon = L.icon({
        iconUrl: "Images/rescuer_image.png",
        iconSize: [32, 32], // size of the icon, adjust as needed
        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });
    
        // Vehicle Icon
        vehicleIcon = L.icon({
        iconUrl: "Images/Car-removebg-preview.png",
        iconSize: [32, 32], // size of the icon, adjust as needed
        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
        });
}

function setupFilterEventListeners() {
    // Event listener for "Taken Requests" filter
    document.getElementById('filter-taken-requests').addEventListener('change', (e) => {
        showTakenRequests = e.target.checked;
        updateMapMarkersAndLines();
    });

    // Event listener for "Pending Requests" filter
    document.getElementById('filter-pending-requests').addEventListener('change', (e) => {
        showPendingRequests = e.target.checked;
        updateMapMarkersAndLines();
    });

    // Event listener for "Offers" filter
    document.getElementById('filter-offers').addEventListener('change', (e) => {
        showOffers = e.target.checked;
        updateMapMarkersAndLines();
    });

    // Event listener for "Vehicles with Active Tasks" filter
    document.getElementById('filter-active-vehicles').addEventListener('change', (e) => {
        showActiveVehicles = e.target.checked;
        updateMapMarkersAndLines();
    });

    // Event listener for "Vehicles without Active Tasks" filter
    document.getElementById('filter-idle-vehicles').addEventListener('change', (e) => {
        showIdleVehicles = e.target.checked;
        updateMapMarkersAndLines();
    });

    // Event listener for "Straight Lines" filter
    document.getElementById('filter-polylines').addEventListener('change', (e) => {
        showPolylines = e.target.checked;
        updateMapMarkersAndLines();
    });

}

function getMarkerIcon(request_offer) {
    if (request_offer.type === "request") {
        return request_offer.status === "pending" ? blueIcon : request_offer.status === "taken" ? redIcon : blackIcon;
    } else {
        // Logic for offer marker icon
        return request_offer.status === "pending" ? greenIcon : request_offer.status === "taken" ? yellowIcon : purpleIcon;
    }
}

function updateMapMarkersAndLines() {
    // Iterate through vehicle markers
    Object.values(vehicleMarkers).forEach(vm => {
        if ((showActiveVehicles && vm.isActive) || (showIdleVehicles && !vm.isActive)) {
            if (!map.hasLayer(vm.marker)) {
                vm.marker.addTo(map); // Add marker to map if not already present
            }
        } else {
            if (map.hasLayer(vm.marker)) {
                vm.marker.remove(); // Remove marker from map if present
            }
        }
    });

    // Iterate through request/offer markers
    requestOfferMarkers.forEach(rom => {
        if (rom.status != 'completed') { // DOnt include complete markers to the filters
            if (rom.type != 'offer'){ // Following code is for the requests
                let shouldShow = (showTakenRequests && rom.status === 'taken') ||
                (showPendingRequests && rom.status === 'pending') 
    
                if (shouldShow) {
                markers.addLayer(rom.marker); // Add marker to cluster group
                } else {
                markers.removeLayer(rom.marker); // Remove marker from cluster group
                }
            } else { // Following code is for the offers
                console.log("This is the showOffers: " + showOffers);
                let shouldShow = showOffers 
                if (shouldShow) {
                    markers.addLayer(rom.marker); // Add marker to cluster group
                } else {
                    markers.removeLayer(rom.marker); // Remove marker from cluster group
                }
            }

        }
    });

    // Handle polylines
    polylines.forEach(polyline => {
        if (showPolylines) {
            if (!map.hasLayer(polyline)) {
                polyline.addTo(map); // Add polyline to map if not already present
            }
        } else {
            if (map.hasLayer(polyline)) {
                polyline.remove(); // Remove polyline from map if present
            }
        }
    });
}

function clearMap() {
    // Clear request/offer markers
    requestOfferMarkers.forEach(markerData => markerData.marker.remove());

    // Clear vehicle markers
    Object.values(vehicleMarkers).forEach(vm => vm.marker.remove());

    // Clear polylines
    polylines.forEach(polyline => polyline.remove());
    polylines = [];
}

function getVehicleLoad(vehicleId, requestsOffers) {
    // Create an object to store the total quantity of each product
    let productLoad = {};

    // Iterate over requests/offers to calculate the load for the specified vehicle
    requestsOffers.forEach(item => {
        if (item.vehicle_id === vehicleId && item.status === 'taken') {
            let productName = item.product_name;
            if (productLoad[productName]) {
                productLoad[productName] += item.quantity;
            } else {
                productLoad[productName] = item.quantity;
            }
        }
    });

    // Convert the product load object into an HTML list
    let productListHtml = '<ul>';
    for (let [productName, quantity] of Object.entries(productLoad)) {
        productListHtml += `<li>${productName}: ${quantity}</li>`;
    }
    productListHtml += '</ul>';

    return productListHtml;
}

function createVehiclePopupContent(vehicle, loadHtml) {
    let status = loadHtml.includes('<li>') ? 'Active' : 'Idle';

    return `
        <h4>Vehicle</h4>
        <p>Username: ${vehicle.username}</p>
        <div>Load: ${loadHtml}</div>
        <p>Status: ${status}</p>
    `;
}

function createRequestPopupContent(request) {
    // Construct the content for the request popup
    let popupContent = `<h4>Request</h4>
    <p><strong>Citizen Name:</strong> ${request.user_name} ${request.user_lastname}</p>
    <p><strong>Phone:</strong> ${request.telephone_number}</p>
    <p><strong>Date of Entry:</strong> ${new Date(request.date_added).toLocaleString()}</p>
    <p><strong>Product:</strong> ${request.product_name}</p>
    <p><strong>Quantity:</strong> ${request.quantity}</p>
    <p><strong>Number of Persons:</strong> ${request.number_of_persons}</p>
    ${request.date_taken ? `<p><strong>Date Picked Up:</strong> ${new Date(request.date_taken).toLocaleString()}</p>` : ''}
    ${request.date_completed ? `<p><strong>Date Completed:</strong> ${new Date(request.date_completed).toLocaleString()}</p>` : ''}
    ${request.taker_username ? `<p><strong>Picked Up By:</strong> ${request.taker_username}</p>` : ''}`;

    return popupContent;
}

function createOfferPopupContent(offer) {
    // Construct the content for the offer popup
    let popupContent = `<h4>Offer</h4>
    <p><strong>Citizen Name:</strong> ${offer.user_name} ${offer.user_lastname}</p>
    <p><strong>Phone:</strong> ${offer.telephone_number}</p>
    <p><strong>Date of Entry:</strong> ${new Date(offer.date_added).toLocaleString()}</p>
    <p><strong>Product:</strong> ${offer.product_name}</p>
    <p><strong>Quantity:</strong> ${offer.quantity}</p>
    ${offer.date_taken ? `<p><strong>Date Picked Up:</strong> ${new Date(offer.date_taken).toLocaleString()}</p>` : ''}
    ${offer.date_completed ? `<p><strong>Date Completed:</strong> ${new Date(offer.date_completed).toLocaleString()}</p>` : ''}
    ${offer.taker_username ? `<p><strong>Picked Up By:</strong> ${offer.taker_username}</p>` : ''}`;

    return popupContent;
}

// Function to confirm the new position and call the update function
function confirmAndUpdateBasePosition(lat, lng) {
    // Displaying a confirmation dialog using SweetAlert
    Swal.fire({
        title: 'Confirm New Base Location',
        text: `Update base location to Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
    }).then((result) => {
        if (result.isConfirmed) {
            updateBasePosition(lat, lng); // If confirmed, update the base position
        }
    });
}

// Function to update the base position by sending data to the server
function updateBasePosition(lat, lng) {
    // Sending a POST request to the PHP script
    fetch('php/update_base_position.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: lat, lng: lng }) // Sending the new coordinates
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // If update is successful, show a success message
            Swal.fire('Updated!', 'The base location has been updated.', 'success');
        } else {
            // If update fails, show an error message
            Swal.fire('Error!', 'Failed to update the base location.', 'error');
        }
    })
    .catch(error => console.error('Error:', error)); // Catch and log any errors
}
