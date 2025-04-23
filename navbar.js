export function renderNavbar() {
    const href = window.location.href;
    const currentSite = href.split('/').pop();
  
    const navItems = [
      { href: "#", img: "./images/bookjournal.png", alt: "Journal", page: "" },
      { href: "sublist.html", img: "./images/checkliste.png", alt: "Checkliste", page: "sublist.html" },
      { href: "wishlist.html", img: "./images/wish.png", alt: "Wunschliste", page: "wishlist.html" },
      { href: "statistik.html", img: "./images/statistik.png", alt: "Statistik", page: "statistik.html" },
    ];
  
    const navbarHtml = navItems.map(item => {
      const isActive = currentSite === item.page ? 'id="isactiv"' : '';
      return `
        <li ${isActive}>
          <div class="nav-item">
            <a href="${item.href}"><img src="${item.img}" alt="${item.alt}" /></a>
          </div>
        </li>
      `;
    }).join('');
  
    const navbar = document.querySelector('#navbar');
if (navbar) {
    navbar.innerHTML = `
    ${navbarHtml}
    <div class="farbverlaufnav">
      <img src="./images/book.png" alt="book" id="bookimage" />
    </div>
  `;
}
  }