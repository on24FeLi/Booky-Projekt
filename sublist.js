import { renderNavbar } from './navbar.js';
//Formular

const OPEN_BTN = document.getElementById("openFormBtn");
const FORM_BOX = document.getElementById("floatingForm");
const OPEN_FILTER_BTN = document.getElementById("openFilterBtn");
const FORM_FILTER_BOX = document.getElementById("filterPopup");
OPEN_BTN.addEventListener("click", (e) => {
  e.preventDefault();
  FORM_BOX.classList.toggle("hidden");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    FORM_BOX.classList.add("hidden");
  }
});
OPEN_FILTER_BTN.addEventListener("click", (e) => {
  e.preventDefault();
  FORM_FILTER_BOX.classList.toggle("hidden");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    FORM_FILTER_BOX.classList.add("hidden");
  }
});
// --------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const SUB_BOOK_LIST_FORM_EL = document.querySelector("#floatingForm");
  const SUB_BOOK_LIST_FORM_NAME_EL = document.querySelector("#bookName");
  const SUBLIST_EL = document.querySelector("#sublist");
  const SUB_FORM = document.querySelector("#subForm");
  const STORED_LIST = localStorage.getItem("bookList");
  const RANDOM_BUTTON = document.getElementById("randomButton");
  const SEARCH_INPUT = document.getElementById("searchInput");
  const GENRE_SELECT = document.getElementById("genreSelect");
  const SORT_SELECT = document.getElementById("sortSelect");
  const APPLY_FILTER_BTN = document.getElementById("applyFilterBtn");
  let bookList = [];
  // Random Button-----------
  RANDOM_BUTTON.addEventListener("click", () => {
    const RANDOM_INDEX = Math.floor(Math.random() * bookList.length);
    const SELECTED_BOOK = bookList[RANDOM_INDEX].bookName;
    alert(`Als nächstes könntest du "${SELECTED_BOOK}" lesen!`);
  });
  //Sachen aus dem Local Storage holen
  if (STORED_LIST) {
    bookList = JSON.parse(STORED_LIST);
    renderBookList();
  }
  SUB_BOOK_LIST_FORM_EL.addEventListener(
    "submit",
    processSubBookListSubmission
  );

  function processSubBookListSubmission(e) {
    e.preventDefault();
    let bookName = SUB_BOOK_LIST_FORM_NAME_EL.value;
    const CHECKED_GENRES = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.nextElementSibling.innerText.trim());
    const BOOK_ITEM = {
      bookName: bookName,
      genres: CHECKED_GENRES,
      isDone: false,
    };
    bookList.push(BOOK_ITEM);
    saveToLocalStorage();
    renderBookList();
    SUB_FORM.reset();
    FORM_BOX.classList.add("hidden");
  }
  function saveToLocalStorage() {
    localStorage.setItem("bookList", JSON.stringify(bookList));
  }

  function renderBookList(filteredList = bookList) {
    //Reset
    SUBLIST_EL.innerHTML = "";
    //fill
    filteredList.forEach((bookListItem, index) => {
      document.getElementById(
        "totalCount"
      ).innerText = `Total: ${bookList.length}`;

      const LI_ELEMENT = document.createElement("LI");
      LI_ELEMENT.innerHTML = `
      <div class="book-row">
        <div class="book-title">${bookListItem.bookName}</div>
        <div class="book-genre">Genre: ${
          bookListItem.genres.join(", ") || "—"
        }</div>
        <button class="delete-btn" data-index="${index}">
          <img src="./images/delete.png" alt="">
        </button>
      </div>
    `;
      if (index % 2 === 0) {
        LI_ELEMENT.classList.add("light-bg");
      } else {
        LI_ELEMENT.classList.add("lightdark-bg");
      }
      SUBLIST_EL.appendChild(LI_ELEMENT);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const INDEX_TO_DELETE = e.currentTarget.getAttribute("data-index");
        bookList.splice(INDEX_TO_DELETE, 1); // Löschen aus dem Array
        saveToLocalStorage(); // Speichern
        renderBookList(); // Neu rendern
      });
    });
  }

  SEARCH_INPUT.addEventListener("input", () => {
    const SEARCH_TERM = SEARCH_INPUT.value.toLowerCase();
    const FILTERED_BOOKS = bookList.filter((bookList) =>
      bookList.bookName.toLowerCase().includes(SEARCH_TERM)
    );
    renderBookList(FILTERED_BOOKS);
    SUB_FORM.reset();
    FORM_BOX.classList.add("hidden");
  });
  //Filter
  APPLY_FILTER_BTN.addEventListener("click", () => {
    const SELECTED_GENRE = GENRE_SELECT.value;
    const SELECTED_SORT = SORT_SELECT.value;

    let FILTERED_BOOKS = [...bookList];

    if (SELECTED_GENRE !== "") {
      FILTERED_BOOKS = FILTERED_BOOKS.filter((book) =>
        book.genres.includes(SELECTED_GENRE)
      );
    }
    if (SELECTED_SORT === "az") {
      FILTERED_BOOKS.sort((a, b) =>
        a.bookName.localeCompare(b.bookName, "de", { sensitivity: "base" })
      );
    } else if (SELECTED_SORT === "za") {
      FILTERED_BOOKS.sort((a, b) =>
        b.bookName.localeCompare(a.bookName, "de", { sensitivity: "base" })
      );
    }
    renderBookList(FILTERED_BOOKS);
  });
  renderNavbar();
});
