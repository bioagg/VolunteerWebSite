let currentProductId; // Variable to store the current product ID

document.addEventListener('DOMContentLoaded', function() {
    const announcementId = new URLSearchParams(window.location.search).get('id');
    if (announcementId) {
        fetchAnnouncementDetails(announcementId);
    } else {
        console.error('Announcement ID not found.');
    }

    const offerForm = document.getElementById('offerForm');
    offerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitOffer(announcementId, document.getElementById('offerQuantity').value);
    });
});

function fetchAnnouncementDetails(announcementId) {
    // Fetch announcement details and populate the page
    fetch('php/fetch_announcement_detail.php?id=' + announcementId)
    .then(response => response.json())
    .then(data => {
        if (data) {
            // Store to global variable the product id
            currentProductId = data.product_id;

            // Assuming 'data' is an object containing the announcement details including product name
            document.getElementById('announcementTitle').textContent = data.title;
            document.getElementById('announcementDescription').textContent = data.description;

            // Update the label with product name
            document.querySelector('label[for="offerQuantity"]').textContent = `Your Offer Quantity for ${data.product_name}:`;
        } else {
            console.error('No data returned for announcement.');
        }
    })
    .catch(error => console.error('Error fetching announcement details:', error));
}

function submitOffer(announcementId, quantity) {
    // Ensure we have the currentProductId before submitting the offer
    if (!currentProductId) {
        console.error('Product ID not found.');
        return;
    }

    const data = {
        announcement_id: announcementId,
        quantity: quantity,
        product_id: currentProductId
    };

    fetch('php/insert_offer.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Success', 'Your offer has been submitted.', 'success')
            .then(() => window.location.reload()); // Reload the page after the alert is closed
        } else {
            Swal.fire('Error', 'Failed to submit offer', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'There was a problem with the request', 'error');
    });
}
