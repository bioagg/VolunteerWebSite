document.addEventListener('DOMContentLoaded', function() {

    loadUserRequests();
    
    // Load products for autocomplete
    loadProductsForAutocomplete();

    // Set up the form submission handler
    document.getElementById('requestForm').addEventListener('submit', submitRequestForm);
});

function loadUserRequests() {
    fetch('php/fetch_user_requests.php')
        .then(response => response.json())
        .then(data => {
            console.log("These are the user request: ", data);
            const tableBody = document.getElementById('requestsTable').getElementsByTagName('tbody')[0];
            data.forEach(request => {
                let row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${request.id}</td>
                    <td>${request.product_name}</td>
                    <td>${request.status}</td>
                    <td>${request.date_added}</td>
                    <td>${request.date_taken}</td>
                    <td>${request.date_completed ? request.date_completed : 'N/A'}</td>
                `;
            });
        })
        .catch(error => console.error('Error fetching requests:', error));
}

// Function to load products for autocomplete
function loadProductsForAutocomplete() {
    fetch('php/fetch_products.php')
        .then(response => response.json())
        .then(data => {
            const productNames = data.map(product => product.product_name);
            initializeAutocomplete(document.querySelector('.productInput'), productNames);
        })
        .catch(error => console.error('Error fetching products:', error));
}

function initializeAutocomplete(inputElem, suggestions) {
    let currentFocus;

    inputElem.addEventListener('input', function() {
        let a, b, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;

        a = document.createElement("div");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        suggestions.forEach((suggestion, index) => {
            if (suggestion.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("div");
                b.innerHTML = "<strong>" + suggestion.substr(0, val.length) + "</strong>";
                b.innerHTML += suggestion.substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + suggestion + "'>";
                b.addEventListener("click", function(e) {
                    inputElem.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        });
    });

    inputElem.addEventListener("keydown", function(e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inputElem) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function submitRequestForm(event) {
    event.preventDefault();

    const numberOfPersons = document.querySelector('.numberOfPersons').value;
    const productName = document.querySelector('.productInput').value;
    const quantity = document.querySelector('.quantity').value;

    if (!numberOfPersons || !quantity) {
        Swal.fire({
            title: 'Error!',
            text: 'Please enter the number of persons.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('numberOfPersons', numberOfPersons);
    formData.append('type', 'request');
    formData.append('quantity', quantity); // As specified
    formData.append('status', 'pending');

    fetch('php/insert_request.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Request submitted:', data);
        // Check for a successful submission
        if (data.success) {
            Swal.fire({
                title: 'Success',
                text: 'Request submitted successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload(); // Reload the page
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'There was an issue submitting your request.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => console.error('Error submitting request:', error));
}