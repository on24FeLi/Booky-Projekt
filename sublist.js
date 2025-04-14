const openBtn = document.getElementById('openFormBtn');
const formBox = document.getElementById('floatingForm');

openBtn.addEventListener('click', (e) => {
  e.preventDefault(); // Verhindert eventuelles Reload-Verhalten
  formBox.classList.toggle('hidden');
});

// Optional: schließen durch Klick außerhalb oder ESC
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") {
    formBox.classList.add('hidden');
  }
});
// --------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', () => {
  const SUB_BOOK_LIST_FORM_EL = document.querySelector('#floatingForm'); 
  const SUB_BOOK_LIST_FORM_NAME_EL = document.querySelector('#bookName');
  const SUBLIST_EL = document.querySelector('#sublist');
  let bookList = []

  SUB_BOOK_LIST_FORM_EL.addEventListener('submit', processSubBookListSubmission);


  function processSubBookListSubmission(e) {
    e.preventDefault();
    let bookName = SUB_BOOK_LIST_FORM_NAME_EL.value;
    //das noch verstehen
    const checkedGenres = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.nextElementSibling.innerText.trim());
    //--------------
    const bookItem = {bookName: bookName, genres: checkedGenres,isDone:false }
    
    bookList.push(bookItem);
    renderBookList();
  }




  function renderBookList () { 
    //Reset
    SUBLIST_EL.innerHTML ="";
    //fill
    bookList.forEach((bookListItem, index) => {
     
     
      const LI_ELEMENT = document.createElement('LI');
      LI_ELEMENT.innerHTML = `
      <div class="book-row">
        <div class="book-title">${bookListItem.bookName}</div>
        <div class="book-genre">Genre: ${bookListItem.genres.join(', ') || '—'}</div>
      </div>
    `;
      if (index % 2 === 0) {
        LI_ELEMENT.classList.add('light-bg');
      } else {
        LI_ELEMENT.classList.add('lightdark-bg');
      }
      SUBLIST_EL.appendChild(LI_ELEMENT);
    });
  }
});