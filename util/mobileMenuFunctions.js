
exports.openMenu = () => {
    const MobileMenu = document.getElementById('MobileMenu')
    MobileMenu.classList.remove('closed-menu');
    MobileMenu.classList.add('opened-menu');
    alert("open menu")
}