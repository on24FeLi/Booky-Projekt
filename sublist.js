//Formular
const openBtn = document.getElementById("openFormBtn");
const formBox = document.getElementById("floatingForm");
openBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Verhindert eventuelles Reload-Verhalten
  formBox.classList.toggle("hidden");
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    formBox.classList.add("hidden");
  }
});
// --------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const SUB_BOOK_LIST_FORM_EL = document.querySelector("#floatingForm");
  const SUB_BOOK_LIST_FORM_NAME_EL = document.querySelector("#bookName");
  const SUBLIST_EL = document.querySelector("#sublist");
  let bookList = [];
  const randomButton = document.getElementById("randomButton");
  // Random Button-----------
  randomButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * bookList.length);
    const selectedBook = bookList[randomIndex].bookName;
    alert(`Als nächstes könntest du "${selectedBook}" lesen!`);
  });
  //Sachen aus dem Local Storage holen
  const storedList = localStorage.getItem("bookList");
  if (storedList) {
    bookList = JSON.parse(storedList);
    renderBookList();
  }


  SUB_BOOK_LIST_FORM_EL.addEventListener(
    "submit",
    processSubBookListSubmission
  );

  function processSubBookListSubmission(e) {
    e.preventDefault();
    let bookName = SUB_BOOK_LIST_FORM_NAME_EL.value;
    //das noch verstehen
    const checkedGenres = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.nextElementSibling.innerText.trim());
    //--------------
    const bookItem = {
      bookName: bookName,
      genres: checkedGenres,
      isDone: false,
    };

    bookList.push(bookItem);
    saveToLocalStorage();
    renderBookList();
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
        <div class="book-genre">Genre: ${bookListItem.genres.join(", ") || "—"}</div>
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
        const indexToDelete = e.currentTarget.getAttribute("data-index");
        bookList.splice(indexToDelete, 1); // Löschen aus dem Array
        saveToLocalStorage(); // Speichern
        renderBookList(); // Neu rendern
      });
    });
  }
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  console.log(searchTerm)
  const filteredBooks = bookList.filter((bookList) =>
    bookList.bookName.toLowerCase().includes(searchTerm)
  );
  console.log(filteredBooks)
  renderBookList(filteredBooks);
});
});
