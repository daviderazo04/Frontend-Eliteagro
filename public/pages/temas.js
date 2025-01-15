// PREFERENCIAS USUARIO
function savePreferences() {
    const theme = document.getElementById('theme')?.value;
    const fontSize = document.getElementById('fontSize')?.value;
    if (theme) localStorage.setItem('theme', theme);
    if (fontSize) localStorage.setItem('fontSize', fontSize);
    applyPreferences();
}

function applyPreferences() {
    const theme = localStorage.getItem('theme');
    const fontSize = localStorage.getItem('fontSize');
    document.body.className = ''; // Limpiar clases existentes
    if (theme) {
        document.body.classList.add(theme);
    }
    if (fontSize) {
        document.body.classList.add(fontSize);
    }
}

// Aplicar preferencias al cargar la página
window.onload = applyPreferences;
