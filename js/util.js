var BASE_URL = "https://apply55gx.github.io/Runner/";

function redirectToGame() {
    createCookie("jnr-name", name, 1);
    window.location = BASE_URL + "play/";
}

function redirectToHome() {
    window.location = BASE_URL;
}

function redirectToAbout() {
    window.location = BASE_URL + "about.html";
}

function redirectToHighscores() {

    window.location = BASE_URL + "highscores.html";
}

function createCookie(name, value, days) {

    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toUTCString();

    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function sortNumber(a, b) {
    return b - a;
}