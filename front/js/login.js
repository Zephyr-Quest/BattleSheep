let form = document.getElementById('signup_form');
let pseudo = document.getElementsByName('pseudo')[0];
let password = document.getElementsByName('password')[0];
let confirma = document.getElementsByName('confirm')[0];

// Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();

    logger.sendLogin(pseudo.value, password.value, confirma.value);
});
