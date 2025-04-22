const openBtn = document.getElementById("openFormBtn");
const formBox = document.getElementById("floatingForm");
const openFilterBtn = document.getElementById("openFilterBtn");
const formFilterBox = document.getElementById("filterPopup");
openBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formBox.classList.toggle("hidden");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    formBox.classList.add("hidden");
  }
});
// Öffnen & Schließen des Filtermenüs
openFilterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formFilterBox.classList.toggle("hidden");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    formFilterBox.classList.add("hidden");
  }
});
//---
document.addEventListener("DOMContentLoaded", () => {
  const WISH_LIST_FORM_EL = document.querySelector("#floatingForm");
  const WISH_LIST_FORM_NAME_EL = document.querySelector("#book_Name");
  const WISH_LIST_FORM_PREIS_EL = document.querySelector("#bookPreis");
  const WISH_LIST_FORM_ERSCHEINUNGSDATUM_EL = document.querySelector("#bookPublish");
  const WISHLIST_EL = document.querySelector("#wishlist");
  const WISH_FORM = document.querySelector("#wishForm"); 
  const storedList = localStorage.getItem("wishList");
  let wishList = [];

  WISH_LIST_FORM_EL.addEventListener("submit", processWishListSubmission);
  //Sachen aus dem Local Storage holen
 
  if (storedList) {
    wishList = JSON.parse(storedList);
    renderWishList();
    showUpcomingBooksPopup();
  }
  function processWishListSubmission(e) {
    e.preventDefault();
    let bookName = WISH_LIST_FORM_NAME_EL.value;
    let bookPrice = parseFloat(WISH_LIST_FORM_PREIS_EL.value) || 0;
    let bookPublishDate = WISH_LIST_FORM_ERSCHEINUNGSDATUM_EL.value;

    const checkedGenres = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.nextElementSibling.innerText.trim());

    const WISH_LIST_ITEM = {
      bookName: bookName,
      bookPrice: bookPrice,
      bookPublishDate: bookPublishDate,
      genres: checkedGenres,
      isDone: false,
    };
    wishList.push(WISH_LIST_ITEM);
    saveToLocalStorage();
    renderWishList();
    WISH_FORM.reset();
    formBox.classList.add("hidden");
  }
  function saveToLocalStorage() {
    localStorage.setItem("wishList", JSON.stringify(wishList));
  }

  function renderWishList(filteredList = wishList) {
    //Reset
    WISHLIST_EL.innerHTML = "";
    //fill
    filteredList.forEach((WISH_LIST_ITEM, index) => {
      document.getElementById(
        "totalCount"
      ).innerText = `Total: ${wishList.length}`;
      let totalPrice = filteredList.reduce((sum, book) => sum + book.bookPrice, 0);
document.getElementById("totalPrice").innerText = `Preis: ${totalPrice.toFixed(2)}€`;
      const LI_WISH_ELEMENT = document.createElement("LI");
      LI_WISH_ELEMENT.innerHTML = `
        <div class="book-row">
        <div class="book-title">${WISH_LIST_ITEM.bookName}</div>
        <div class="book-price">${WISH_LIST_ITEM.bookPrice + "€"}</div>
      <div class="book-publish">
      ${new Date(WISH_LIST_ITEM.bookPublishDate) < new Date() 
        ? '<img src="./images/DatumInVergangenheit.png" alt="vergangen" title="Bereits erschienen" style="height: 16px; margin-left: 5px;" />' 
        : new Date(WISH_LIST_ITEM.bookPublishDate).toLocaleDateString("de-DE")}
</div>
        <button class="delete-btn" data-index="${index}">
        <img src="./images/delete.png" alt="">
        </button>
        </div>
    `;
      if (index % 2 === 0) {
        LI_WISH_ELEMENT.classList.add("light-bg");
      } else {
        LI_WISH_ELEMENT.classList.add("lightdark-bg");
      }
      WISHLIST_EL.appendChild(LI_WISH_ELEMENT);
    });
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const indexToDelete = e.currentTarget.getAttribute("data-index");
        wishList.splice(indexToDelete, 1); // Löschen aus dem Array
        saveToLocalStorage(); // Speichern
        renderWishList(); // Neu rendern
      });
    });
  }
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    console.log(searchTerm);
    const filteredBooks = wishList.filter((wishList) =>
      wishList.bookName.toLowerCase().includes(searchTerm)
    );
    console.log(filteredBooks);
    renderWishList(filteredBooks);
  });
  const genreSelect = document.getElementById("genreSelect");
  const sortSelect = document.getElementById("sortSelect");
  const applyFilterBtn = document.getElementById("applyFilterBtn");

  applyFilterBtn.addEventListener("click", () => {
    const selectedGenre = genreSelect.value;
    const selectedSort = sortSelect.value;

    let filteredBooks = [...wishList];
    if (selectedGenre !== "") {
      filteredBooks = filteredBooks.filter((book) =>
        book.genres.includes(selectedGenre)
      );
    }
    if (selectedSort === "az") {
      filteredBooks.sort((a, b) =>
        a.bookName.localeCompare(b.bookName, "de", { sensitivity: "base" })
      );
    } else if (selectedSort === "za") {
      filteredBooks.sort((a, b) =>
        b.bookName.localeCompare(a.bookName, "de", { sensitivity: "base" })
      );
    } else if (selectedSort === "price-asc") {
      filteredBooks.sort((a, b) => a.bookPrice - b.bookPrice);
    } else if (selectedSort === "price-desc") {
      filteredBooks.sort((a, b) => b.bookPrice - a.bookPrice);
    }
    else if (selectedSort === "date-asc") {
      filteredBooks.sort((a, b) => new Date(a.bookPublishDate) - new Date(b.bookPublishDate));
    } else if (selectedSort === "date-desc") {
      filteredBooks.sort((a, b) => new Date(b.bookPublishDate) - new Date(a.bookPublishDate));
    }
    renderWishList(filteredBooks);
  });
  function showUpcomingBooksPopup() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
  
    const upcomingBooks = wishList.filter(book => {
      const pubDate = new Date(book.bookPublishDate);
      return pubDate >= today && pubDate <= nextWeek;
    });
  
    if (upcomingBooks.length > 0) {
      const popupList = document.getElementById("popupBookList");
      popupList.innerHTML = "";
  
      upcomingBooks.forEach(book => {
        const pubDate = new Date(book.bookPublishDate);
        const diffTime = pubDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
        const li = document.createElement("li");
        li.textContent = `${book.bookName} – erscheint in ${diffDays} Tag${diffDays === 1 ? '' : 'en'}`;
        popupList.appendChild(li);
      });
  
      document.getElementById("weekPopup").classList.remove("hidden");
    }
  }
});
