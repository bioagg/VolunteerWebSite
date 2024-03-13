window.addEventListener('DOMContentLoaded', function(){
    let send_info_btn = document.querySelector(".send_email_button");

    send_info_btn.addEventListener("click", function(){
        Swal.fire({
           icon: "question", 
           title: "Interested in receiving updates and exclusive offers from CollectiSearch?",
           text: "By providing your email and clicking 'Accept', you agree to receive updates and exclusive offers from CollectiSearch.",
           showCancelButton: true,
           confirmButtonColor: '#3085d6',
           cancelButtonColor: '#d33', 
           confirmButtonText: "Yes, I want it"
        }).then(function(res) {
            if (res.isConfirmed) {
                Swal.fire({
                    title: "Thank you!",
                    text: "You have subscribed to CollectiSearch newsletter",
                    icon: "success"
                });
            }
        })
    });
});