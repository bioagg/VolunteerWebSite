window.onload = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/check_login_status.php', true);
    xhr.onload = function() {
        // console.log("This is the answer:", this.responseText);
        if (this.responseText !== 'logged_in') {
            window.location.href = 'Login_form.html';
            // console.log("Nothing");
        }
    };
    xhr.send();
};