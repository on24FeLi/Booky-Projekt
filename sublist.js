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