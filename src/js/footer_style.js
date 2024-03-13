function setEqualWidth() {
    let input_el = document.querySelector(".input_email_footer");
    let button_el = document.querySelector(".send_email_button");

    let input_Rect = input_el.getBoundingClientRect();
    let button_Rect = button_el.getBoundingClientRect();
    let distance = 15;

    let button_left = input_Rect.right + distance;

    button_el.style.left = button_left + 'px';
}

function adjustImageSize() {
    var image = document.querySelector('.search_image img');
    var windowWidth = window.innerWidth;
  
    // Adjust the image size based on the window width
    if (windowWidth >= 2560) {
      image.style.width = '50%';
      image.style.height = '80%';
    } else if (windowWidth >= 1920) {
      image.style.width = '40%';
      image.style.height = '70%';
    } else if (windowWidth >= 1440) {
      image.style.width = '40%';
      image.style.height = '60%';
    } else {
      image.style.width = '40%';
      image.style.height = '50%';
    }
  }

window.addEventListener('DOMContentLoaded', function(){
    setEqualWidth();
    adjustImageSize();
    this.window.addEventListener('resize', setEqualWidth);
    this.window.addEventListener('resize', adjustImageSize)
});