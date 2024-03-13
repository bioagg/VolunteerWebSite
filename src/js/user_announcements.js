let currentPage = 1;
const announcementsPerPage = 3; // Number of announcements per page

document.addEventListener('DOMContentLoaded', function() {
    // Load announcements
    loadAnnouncements();

    // Call this function to load user's offers
    loadOffers(); 
});

function loadAnnouncements() {
    fetch('php/fetch_announcements.php')
        .then(response => response.json())
        .then(data => {
            const startIndex = (currentPage - 1) * announcementsPerPage;
            const selectedAnnouncements = data.slice(startIndex, startIndex + announcementsPerPage);

            const announcementsContainer = document.getElementById('announcementsContainer');
            announcementsContainer.innerHTML = ''; // Clear existing content

            selectedAnnouncements.forEach(announcement => {
                let announcementDiv = document.createElement('div');
                announcementDiv.className = 'announcement';

                let title = document.createElement('h3');
                title.className = 'announcementTitle';
                title.textContent = announcement.title;
                title.onclick = function() {
                    window.location.href = `announcement_detail.html?id=${announcement.announcement_id}`;
                };

                let description = document.createElement('p');
                description.className = 'announcementDescription';
                description.textContent = announcement.description;

                announcementDiv.appendChild(title);
                announcementDiv.appendChild(description);
                announcementsContainer.appendChild(announcementDiv);
            });

            updatePagination(data.length);
        })
        .catch(error => console.error('Error fetching announcements:', error));
}

function updatePagination(totalAnnouncements) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination buttons

    const pageCount = Math.ceil(totalAnnouncements / announcementsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => {
            currentPage = i;
            loadAnnouncements();
        });
        pagination.appendChild(button);
    }
}

function loadOffers() {
    // Assume the user ID is stored in session and sent in a cookie or via a session variable
    fetch('php/fetch_user_offers.php')
    .then(response => response.json())
    .then(offers => {
        const offersTableBody = document.getElementById('offersTable').querySelector('tbody');
        offers.forEach(offer => {
            let row = offersTableBody.insertRow();
            row.innerHTML = `
                <td>${offer.product_name}</td>
                <td>${offer.quantity}</td>
                <td>${offer.date_added}</td>
                <td>${offer.status}</td>
                <td>${offer.date_taken || 'N/A'}</td>
                <td>${offer.taken_by_user_id || 'N/A'}</td>
                <td>${offer.date_completed || 'N/A'}</td>
                <td>${offer.status === 'pending' ? `<button class="delete-offer-btn" data-offer-id="${offer.id}">Delete</button>` : ''}</td>
            `;
        });
        attachDeleteOfferEventListeners();
    })
    .catch(error => console.error('Error loading offers:', error));
}

function attachDeleteOfferEventListeners() {
    document.querySelectorAll('.delete-offer-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            const offerId = event.target.getAttribute('data-offer-id');
            confirmDeleteOffer(offerId);
        });
    });
}

function confirmDeleteOffer(offerId) {
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
            deleteOffer(offerId);
        }
    });
}

function deleteOffer(offerId) {
    fetch('php/delete_offer.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ offer_id: offerId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Deleted!', 'Your offer has been deleted.', 'success')
            .then(() => {
                // Refresh the page after the alert is closed
                window.location.reload();
            });
        } else {
            Swal.fire('Error', 'Failed to delete offer', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'There was a problem with the request', 'error');
    });
}
