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

    const registerButton = document.querySelector(".register_btn");

    registerButton.addEventListener('click', function() {
        const inputUsername = document.querySelector(".register_username");
        const inputName = document.querySelector(".register_name");
        const inputLastName = document.querySelector(".register_lastname");
        const inputCountryCode = document.querySelector(".country-select");
        const inputTelephone = document.querySelector(".register_phone");
        const inputLatitude = document.querySelector(".latitude_pos");
        const inputLongitude = document.querySelector(".longitude_pos");
        const inputEmail = document.querySelector(".register_email");
        const inputPassword = document.querySelector(".register_password");
        const inputPasswordRepeat = document.querySelector(".register_password_repeat");
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,1024}$/;

        let div_below_username = document.querySelector(".alert_name");
        let div_below_user_name = document.querySelector(".alert_user_name");
        let div_below_user_last_name = document.querySelector(".alert_user_lastname");
        let div_below_telephone = document.querySelector(".alert_phone");
        let div_below_map_position = document.querySelector(".alert_map_position");
        let div_below_email = document.querySelector(".alert_email");
        let div_below_password = document.querySelector(".alert_pswd");
        let div_below_password_repeat = document.querySelector(".alert_pswd_repeat");

        // Clean after mistake 
        document.querySelectorAll('.alert_name').forEach(function(element) {
            element.innerHTML = '';
        });

        document.querySelectorAll('.alert_user_name').forEach(function(element) {
            element.innerHTML = '';
        });

        document.querySelectorAll('.alert_user_lastname').forEach(function(element) {
            element.innerHTML = '';
        });

        document.querySelectorAll('.alert_phone').forEach(function(element) {
            element.innerHTML = '';
        });

        document.querySelectorAll('.alert_map_position').forEach(function(element) {
            element.innerHTML = '';
        });
          
        document.querySelectorAll('.alert_email').forEach(function(element) {
          element.innerHTML = '';
        });
        
        document.querySelectorAll('.alert_pswd').forEach(function(element) {
          element.innerHTML = '';
        });
        
        document.querySelectorAll('.alert_pswd_repeat').forEach(function(element) {
          element.innerHTML = '';
        });

        // remove user fault 
        inputUsername.addEventListener('input', function(e) {
            if(e.target.value !=="" && div_below_username.children.length > 0) {
                document.querySelectorAll('.alert_name').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        inputEmail.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_email.children.length > 0) {
                document.querySelectorAll('.alert_email').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        inputPassword.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_password.children.length > 0) {
                document.querySelectorAll('.alert_pswd').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        inputPasswordRepeat.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_password_repeat.children.length > 0) {
                document.querySelectorAll('.alert_pswd_repeat').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        inputName.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_user_name.children.length > 0) {
                document.querySelectorAll('.alert_user_name').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        inputLastName.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_user_last_name.children.length > 0) {
                document.querySelectorAll('.alert_user_lastname').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        inputTelephone.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_telephone.children.length > 0) {
                document.querySelectorAll('.alert_phone').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        inputLatitude.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_map_position.children.length > 0) {
                document.querySelectorAll('.alert_map_position').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        inputLongitude.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_map_position.children.length > 0) {
                document.querySelectorAll('.alert_map_position').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        

        let hasError = false;

        // Validate input fields
        if(inputUsername.value === "") {
            create_error(div_below_username, "Enter your username", "error");
            hasError = true;
        }
        if(inputName.value === "") {
            create_error(div_below_user_name, "Enter your name", "error");
            hasError = true;
        }
        if(inputLastName.value === "") {
            create_error(div_below_user_last_name, "Enter your last name", "error");
            hasError = true;
        }
        if(inputCountryCode.value === "Select Country..." || inputTelephone.value === "" || !isValidPhoneNumber(inputCountryCode.options[inputCountryCode.selectedIndex].textContent + inputTelephone.value)) {
            create_error(div_below_telephone, "Enter a valid phone number", "error");
            hasError = true;
        }
        if(inputLatitude.value === "" || inputLongitude.value === "") {
            create_error(div_below_map_position, "Enter your map position", "error");
            hasError = true;
        }
        if(inputEmail.value === "") {
            create_error(div_below_email, "Enter your email", "error");
            hasError = true;
        }
        if(inputPassword.value === "" || !passwordRegex.test(inputPassword.value)) {
            create_error(div_below_password, "Password must meet the requirements", "error");
            hasError = true;
        }
        if(inputPasswordRepeat.value !== inputPassword.value) {
            create_error(div_below_password, "Passwords must match", "error");
            hasError = true;
        }

        if(hasError) return;

        // Assuming all validations are passed and variables are set
        const data = {
            username: inputUsername.value,
            name: inputName.value,
            lastname: inputLastName.value,
            phone: inputCountryCode.options[inputCountryCode.selectedIndex].textContent + inputTelephone.value,
            lat: inputLatitude.value,
            lng: inputLongitude.value,
            email: inputEmail.value,
            password: inputPassword.value,
            role: 2 // Role ID for rescuers
        };

        fetch('php/register_rescuer.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if(result.success) {
                Swal.fire({
                    title: "Rescuer Registered Successfully",
                    text: "Rescuer account has been created.",
                    icon: "success",
                    allowEscapeKey:false,
                    allowEnterKey:false
                }).then(function() {
                    location.reload();
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: result.error,
                    icon: "error"
                });
            }
        })
        .catch(error => console.error('Error:', error));
    });

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

function isValidPhoneNumber(phoneNumber) {
    var regex = /^\+\d{1,3}[\s-]?(\(\d{1,3}\)[\s-]?)?\d{1,10}$/;
    console.log("This is the phone Number: ", phoneNumber);
    return regex.test(phoneNumber);
}

function create_error(div_element, text_error, class_error, ){
    let fault = document.createElement("div");
    let node = document.createTextNode(text_error);
    fault.className = class_error;
    fault.appendChild(node);
    div_element.appendChild(fault);
}