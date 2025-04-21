const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');

menuButton.onclick = function (e) {
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
};

document.onclick = function (e) {
    if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
    }
};
