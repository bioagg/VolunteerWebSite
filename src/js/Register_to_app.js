document.addEventListener('DOMContentLoaded', function() {

    function create_error(div_element, text_error, class_error, ){
        let fault = document.createElement("div");
        let node = document.createTextNode(text_error);
        fault.className = class_error;
        fault.appendChild(node);
        div_element.appendChild(fault);
    }

    function isValidPhoneNumber(phoneNumber) {
        var regex = /^\+\d{1,3}[\s-]?(\(\d{1,3}\)[\s-]?)?\d{1,10}$/;
        return regex.test(phoneNumber);
    }

    // Add function to check email and lat, lng

    let Register_button = document.querySelector(".register_btn");
    // If you want to initiate the creation of the database uncomment the next line of code
    let Initiate_button = document.querySelector(".Initiate");

    Register_button.addEventListener('click', function() {

        //RegExp
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,1024}$/;

        const input_username = document.querySelector(".register_username");
        const input_user_name = document.querySelector(".register_name");
        const input_user_last_name = document.querySelector(".register_lastname");
        const input_country_code = document.querySelector(".country-select");
        const input_telephone = document.querySelector(".register_phone");
        const input_latitude = document.querySelector(".latitude_pos");
        const input_longitude = document.querySelector(".longitude_pos");
        const input_email = document.querySelector(".register_email");
        const input_password = document.querySelector(".register_password");
        const input_password_repeat = document.querySelector(".register_password_repeat");
        

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
        
        if(input_username.value === "" && div_below_username.children.length === 0) { // Check Username
            create_error(div_below_username, "Enter your Username", "a_alert_content");
        }
        else if (input_user_name.value === "" && div_below_user_name.children.length === 0) { // Check Name
            create_error(div_below_user_name, "Enter your Name", "a_alert_content");
        }
        else if (input_user_last_name.value === "" && div_below_user_last_name.children.length === 0) { // Check LastName
            create_error(div_below_user_last_name, "Enter your Last Name", "a_alert_content");
        }
        else if ((input_country_code.options[input_country_code.selectedIndex].textContent === "Select Country..." || input_telephone.value === "") && div_below_user_last_name.children.length === 0) { // Check Name
            create_error(div_below_telephone, "Enter your Phone", "a_alert_content");
        }
        else if (isValidPhoneNumber(input_country_code.options[input_country_code.selectedIndex].textContent + input_telephone.value) == false){
            create_error(div_below_telephone, "Enter valid Phone number", "a_alert_content");
        }
        else if (input_latitude.value === "" || input_longitude === "") {
            create_error(div_below_map_position, "Enter your map position", "a_alert_content");
        }
        else if (input_email.value === "" && div_below_username.children.length === 0) { // Check Email
            create_error(div_below_email, "Enter your Email", "a_alert_content");
        }
        else if (input_password.value === "" && div_below_password.children.length === 0) {
            create_error(div_below_password, "Enter your password", "a_alert_content");
        } else if (input_password_repeat.value === "" && div_below_password_repeat.children.length === 0) {
            create_error(div_below_password_repeat, "Type your password again", "a_alert_content");
        } else if (input_password.value !== input_password_repeat.value) {
            create_error(div_below_password_repeat, "Passwords must match", "a_alert_content");
        } else if (regex.test(input_password.value) === false) {
            create_error(div_below_password, "Passwords must be at least 8 characters and contain 1 capital letter, 1 minor letter, 1 number and 1 special character", "a_alert_content");
        } else {
            let xhttp = new XMLHttpRequest();
            let url = "php/register_user.php";
            let method = "POST";
            let data = {
                username: input_username.value,
                name: input_user_name.value,
                lastname: input_user_last_name.value,
                phone: input_country_code.options[input_country_code.selectedIndex].textContent + input_telephone.value,
                lat: input_latitude.value,
                lng: input_longitude.value,
                email: input_email.value,
                password: input_password.value
            }

            let json_Data = JSON.stringify(data);

            xhttp.open(method, url, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.onload = function() {
                if (xhttp.status === 200) {
                    if(xhttp.responseText == 0) {
                        Swal.fire({
                            title:"Welcome to our app!",
                            text: "You are going to be redirected to login page.",
                            allowEscapeKey:false,
                            allowEnterKey:false,
                            confirmButtonColor:"#000000"//"#4267B2"
                        }).then(function(){
                            window.location.assign("Login_form.html");
                        });
                    } else {
                        Swal.fire({
                            title:"Error",
                            text: "Sorry, a user with the same username or email or phone already exists!",
                            icon: "error",
                            allowEscapeKey:false,
                            allowEnterKey:false,
                            confirmButtonText:"OK,got it",
                            confirmButtonColor:"#000000"//"#4267B2"
                        }).then(function(){
                            window.location.reload();
                        });
                    }
                } else {
                    console.error('Request failed. Status code: ' + xhttp.status);
                }
            }

            xhttp.send(json_Data);
        }

        //remove user fault in username
        input_username.addEventListener('input', function(e) {
            if(e.target.value !=="" && div_below_username.children.length > 0) {
                document.querySelectorAll('.alert_name').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        input_email.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_email.children.length > 0) {
                document.querySelectorAll('.alert_email').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        input_password.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_password.children.length > 0) {
                document.querySelectorAll('.alert_pswd').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        input_password_repeat.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_password_repeat.children.length > 0) {
                document.querySelectorAll('.alert_pswd_repeat').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        input_user_name.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_user_name.children.length > 0) {
                document.querySelectorAll('.alert_user_name').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        input_user_last_name.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_user_last_name.children.length > 0) {
                document.querySelectorAll('.alert_user_lastname').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        input_telephone.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_telephone.children.length > 0) {
                document.querySelectorAll('.alert_phone').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        input_latitude.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_map_position.children.length > 0) {
                document.querySelectorAll('.alert_map_position').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });

        input_longitude.addEventListener('input', function(e) {
            if(e.target.value !== "" && div_below_map_position.children.length > 0) {
                document.querySelectorAll('.alert_map_position').forEach(function(element) {
                    element.innerHTML = '';
                });
            }
        });
          
    });

    // If you want to create the database you have to uncomment the next block of code
    
    Initiate_button.addEventListener('click', function() {

        let xhttp = new XMLHttpRequest();
        let url = "php/Initiate.php";
        let method = "POST";

        xhttp.open(method, url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.onload = function() {
            if (xhttp.status === 200) {
                console.log(xhttp.responseText);
            } else {
                console.error('Request failed. Status code: ' + xhttp.status);
            }
        }

        xhttp.send();
    });


});