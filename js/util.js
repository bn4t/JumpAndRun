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
