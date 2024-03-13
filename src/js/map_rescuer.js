// Global variable for the Leaflet map
let map;
let redIcon, blueIcon, blackIcon, baseIcon, greenIcon, yellowIcon, purpleIcon, vehicleIcon, rescuerIcon, markers;
let showTakenRequests = true;
let showPendingRequests = true;
let showOffers = true;
let showPendingOffers = true;
let showTakenOffers = true;
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
    fetchAndDisplayRescuerData();

    // Set up filter event listeners
    setupFilterEventListeners();

    // Create the task panel
    fetchTasks();
});

function show_map(position){
    map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function setupFilterEventListeners() {
    // Clear existing markers and polylines before processing new data
    clearMap();

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

    // Event listener for "Taken Offers" filter
    document.getElementById('filter-taken-offers').addEventListener('change', (e) => {
        showTakenOffers = e.target.checked;
        updateMapMarkersAndLines();
    });

    // Event listener for "Pending Offers" filter
    document.getElementById('filter-pending-offers').addEventListener('change', (e) => {
        showPendingOffers = e.target.checked;
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

function updateMapMarkersAndLines() {
    // Iterate through vehicle markers
    Object.values(vehicleMarkers).forEach(vm => {
        console.log("THis is the vm: ", vm);
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

                    let shouldShow = (showTakenOffers && rom.status === 'taken') ||
                    (showPendingOffers && rom.status === 'pending')

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

function fetchAndDisplayRescuerData() {
    fetch('php/fetch_rescuer_data.php')
        .then(response => response.json())
        .then(data => {
            console.log("DATA: ", data);
            if (!map) {
                console.error('Map object not found');
                return;
            }
            displayRescuerDataOnMap(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayRescuerDataOnMap(data) {
    // Function variable for the initial position of the vehicle marker
    let initial_pos_vehicle_marker;

    // Clear existing markers before processing new data
    clearMap();

    // Create a MarkerCluster group
    markers = L.markerClusterGroup();

    // Base location
    if (data.baseLocation) {
        L.marker([data.baseLocation.lat_user, data.baseLocation.lng_user], { icon: baseIcon })
            .bindPopup("<b>Base Location</b>")
            .addTo(map);
    }

    // Rescuer location
    if (data.rescuerLocation) {
        L.marker([data.rescuerLocation.lat_user, data.rescuerLocation.lng_user], { icon: rescuerIcon, draggable: true })
            .bindPopup("<b>Your Location</b>")
            .addTo(map);
    }

    // Vehicle Marker
    if (data.vehicleData) {
        var vehicleMarker = L.marker(
            [data.vehicleData.latitude, data.vehicleData.longitude],
            {icon: vehicleIcon, draggable: true, vehicle_id: data.vehicleData.vehicle_id}
        ).addTo(map);
        
        vehicleMarkers[data.vehicleData.vehicle_id] = {
            marker: vehicleMarker,
        };

        // Dragstart event fired when the user starts dragging the marker.
        vehicleMarker.on('dragstart', function(e) {
            initial_pos_vehicle_marker = e.target.getLatLng();
        });

        // Dragend event fired when the user stops dragging the marker.
        vehicleMarker.on('dragend', function(e) {
            let newPosition = e.target.getLatLng();

            Swal.fire({
                title: 'Confirm Position Update',
                text: "Do you want to update the vehicle's position?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // If confirmed, update the marker to the updated position
                    updateVehiclePosition(newPosition.lat, newPosition.lng, vehicleMarker.options.vehicle_id);
                } else {
                    // If not confirmed, revert the marker to its original position
                    e.target.setLatLng(initial_pos_vehicle_marker);
                }
            });
        });
    }

    // Requests
    data.requestsOffers.requests.forEach(request => {
        var icon = request.status === 'pending' ? blueIcon : 
                   request.status === 'taken' ? redIcon : blackIcon;

        let requestMarker = L.marker([request.lat, request.lng], { icon: icon })
            .bindPopup(createRequestPopupContent(request));

        requestOfferMarkers.push({
            marker: requestMarker,
            type: request.type,
            status: request.status,
            vehicle_id: request.vehicle_id
        });

        markers.addLayer(requestMarker); // Add to MarkerCluster group

        if (request.status === "taken" && vehicleMarkers[request.vehicle_id]) {
            console.log("EEEE");
            let polyline = L.polyline([
                vehicleMarkers[request.vehicle_id].marker.getLatLng(), 
                requestMarker.getLatLng()
            ], {color: 'blue'}).addTo(map);

            polylines.push(polyline);
        }
    });

    // Offers
    data.requestsOffers.offers.forEach(offer => {
        var icon = offer.status === 'pending' ? greenIcon : 
                   offer.status === 'taken' ? yellowIcon : purpleIcon;
        
        let offerMarker = L.marker([offer.lat, offer.lng], {icon: icon})
            .bindPopup(createOfferPopupContent(offer));
        
        requestOfferMarkers.push({
            marker: offerMarker,
            type: offer.type,
            status: offer.status,
            vehicle_id: offer.vehicle_id
        });
        markers.addLayer(offerMarker); // Add to MarkerCluster group
        // L.marker([offer.lat, offer.lng], { icon: new L.Icon.Default({ markerColor: 'green' }) })
        //     .bindPopup(createOfferPopupContent(offer))
        //     .addTo(map);
        // If the request/offer is taken, draw a line to the corresponding vehicle
    });

    // Add the MarkerCluster group to the map
    map.addLayer(markers);


}

function createRequestPopupContent(request) {
    // Construct the content for the request popup
    let popupContent = `<h4>Request</h4>
                        <p>Citizen Name: ${request.user_name} ${request.user_lastname}</p>
                        <p>Phone: ${request.telephone_number}</p>
                        <p>Date of Entry: ${new Date(request.date_added).toLocaleString()}</p>
                        <p>Product: ${request.product_name}</p>
                        <p>Quantity: ${request.quantity}</p>
                        ${request.date_taken ? `<p>Date Picked Up: ${new Date(request.date_taken).toLocaleString()}</p>` : ''}
                        ${request.date_completed ? `<p>Date Completed: ${new Date(request.date_completed).toLocaleString()}</p>` : ''}
                        ${request.taker_username ? `<p>Picked Up By: ${request.taker_username}</p>` : ''}`;

    // Add "Take Over Request" button only if the status is 'pending'
    if (request.status === 'pending') {
        popupContent += `<button onclick="handleRequest('${request.id}')">Take Over Request</button>`;
    }

    return popupContent;
}

function createOfferPopupContent(offer) {
    // Construct the content for the offer popup
    return `<h4>Offer</h4>
            <p>Citizen Name: ${offer.user_name} ${offer.user_lastname}</p>
            <p>Phone: ${offer.telephone_number}</p>
            <p>Date of Entry: ${new Date(offer.date_added).toLocaleString()}</p>
            <p>Product: ${offer.product_name}</p>
            <p>Quantity: ${offer.quantity}</p>
            ${offer.date_taken ? `<p>Date Picked Up: ${new Date(offer.date_taken).toLocaleString()}</p>` : ''}
            ${offer.date_completed ? `<p>Date Completed: ${new Date(offer.date_completed).toLocaleString()}</p>` : ''}
            ${offer.taken_by_user ? `<p>Picked Up By: ${offer.taken_by_user}</p>` : ''}
            <button onclick="handleOffer('${offer.id}')">Take Over Offer</button>`;
}

// Functions to handle the take over of requests and offers
function handleRequest(requestId) {
    console.log("Handling request:", requestId);
    // Add implementation for handling the request
    var data = { id: requestId, action: 'take', type: 'request' };
    updateRequestOfferStatus(data);
}

function handleOffer(offerId) {
    console.log("Handling offer:", offerId);
    // Add implementation for handling the offer
    var data = { id: offerId, action: 'take', type: 'offer' };
    updateRequestOfferStatus(data);
}


function updateRequestOfferStatus(data) {
    fetch('php/update_request_offer_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then( async result => {
        if (result.success) {
            console.log("Status updated successfully");
            // Reload data or update the map accordingly
            // Wait for the success message to be acknowledged by the user
            if (result.type == "request") {
                await Swal.fire('Success', 'You have taken request with id: ' + result.id, 'success');
            }
            else {
                await Swal.fire('Success', 'Change this to adjust to offer', 'success');
            }
            // Reload the page after the user clicks 'OK' to reflect changes in inventory
            window.location.reload();
        } else {
            console.error("Error updating status");
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to update the vehicle's position
function updateVehiclePosition(lat, lng, id) {
    console.log("New vehicle position:", lat, lng, id);
    // Send the new position to your backend for updating in the database
    // Define the data to be sent
    var data = {
        vehicle_id: id,
        latitude: lat,
        longitude: lng
    };

    // Send the new position to the backend
    fetch('php/update_vehicle_position.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            Swal.fire('Success', 'Vehicle position updated', 'success')
            .then(() => {
                window.location.reload(); // Reload the page after successful update
            });
        } else {
            throw new Error(data.message || 'An error occurred');
        }
    })
    .catch(error => {
        console.error('Error updating vehicle position:', error);
            Swal.fire({
                title: 'Error!',
                text: data.message || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
            });
    });
}

function fetchTasks() {
    fetch('php/fetch_tasks.php') // Endpoint to fetch tasks
        .then(response => response.json())
        .then(tasks => {
            console.log("TASKS PANEL: ", tasks);
            const tasksTableBody = document.getElementById('tasksTable').querySelector('tbody');
            tasks.forEach(task => {
                let distance = getDistanceFromLatLonInM(task.vehicle_lat, task.vehicle_lng, task.request_lat, task.request_lng);
                let showCompleteButton = distance <= 50; // Show button if within 50 meters

                let row = tasksTableBody.insertRow();
                row.innerHTML = `
                    <td>${task.type}</td>
                    <td>${task.user_name + ' ' + task.user_lastname}</td>
                    <td>${task.telephone_number}</td>
                    <td>${new Date(task.date_added).toLocaleString()}</td>
                    <td>${task.product_name}</td>
                    <td>${task.quantity}</td>
                    <td>${task.status}</td>
                    <td>
                        ${showCompleteButton ? `<button onclick="completeTask(${task.request_id})">Complete</button>` : ''}
                        <button onclick="cancelTask(${task.request_id})">Cancel</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in kilometers
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; // Distance in kilometers
    return d * 1000; // Distance in meters
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function completeTask(taskId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to mark this task as completed?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, complete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // If the user confirms, proceed to complete the task
            fetch('php/complete_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId }) // Send the task ID
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Completed!', 'The task has been marked as completed.', 'success')
                    .then(() => {
                        window.location.reload(); // Reload the page after successful completion.
                    });
                } else {
                    Swal.fire('Error', 'There was an issue completing the task.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'A network error occurred.', 'error');
            });
        }
    });
}


// Function to cancel a task
function cancelTask(taskId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to cancel this task?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // If the user confirms, proceed to cancel the task
            fetch('php/cancel_task.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId }) // Send the task ID
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Cancelled!', 'The task has been cancelled.', 'success')
                    .then(() => {
                        window.location.reload(); // Reload the page after successful cancel. Not the best option, the best option is to have 
                                                  // unique function refresh the tasks list or update the UI
                    });
                } else {
                    Swal.fire('Error', 'There was an issue cancelling the task.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'A network error occurred.', 'error');
            });
        }
    });
}

// function togglePanel(panelId) {
//     var panel = document.querySelector('.' + panelId);

//     if (panel.style.display === "none") {
//         panel.style.display = "block";
//     } else {
//         panel.style.display = "none";
//     }
// }
