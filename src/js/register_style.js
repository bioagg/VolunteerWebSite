function adjustContainerHeight() {
    var container = document.querySelector('.container');
    if (window.innerHeight > 1100) {
        container.style.height = '70vh';
    } else {
        container.style.height = '90vh'; // Reset to default if viewport height changes
    }
}

// Run the function on load and on window resize
window.addEventListener('DOMContentLoaded', adjustContainerHeight);
window.addEventListener('resize', adjustContainerHeight);