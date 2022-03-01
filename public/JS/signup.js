const colors = {
    green: '#3ca50c',
    red: '#FF3333'
};

/* -------------------------------------------------------------------------- */
/*                             Get all HTML nodes                             */
/* -------------------------------------------------------------------------- */

// Toggle form
const toggleBtn = document.getElementById('switch_form');
const signupSpan = document.getElementById('signup_link');
const loginSpan = document.getElementById('login_link');

// Signup form
const signupForm = document.getElementById('signup_form');
const signupFormNodes = {
    pseudo: signupForm.querySelector('input[name="pseudo"]'),
    password: signupForm.querySelector('input[name="password"]'),
    confirm: signupForm.querySelector('input[name="confirm"]')
};

// Login form
const loginForm = document.getElementById('login_form');
const loginFormNodes = {
    pseudo: loginForm.querySelector('input[name="pseudo"]'),
    password: loginForm.querySelector('input[name="password"]')
};

/* -------------------------------------------------------------------------- */
/*                                   Events                                   */
/* -------------------------------------------------------------------------- */

toggleBtn.addEventListener('click', () => {
    signupSpan.classList.toggle('selected');
    loginSpan.classList.toggle('selected');
    signupForm.style.display
        = signupForm.style.display === 'none' ? 'block' : 'none';
    loginForm.style.display
        = loginForm.style.display === 'none' ? 'block' : 'none';
});

/* ------------------------------- signup Form ------------------------------ */

signupForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get form data
    const data = {
        pseudo: signupFormNodes.pseudo.value,
        password: signupFormNodes.password.value
    };

    // Reset input styles
    for (const inputName in signupFormNodes) {
        if (signupFormNodes.hasOwnProperty(inputName)) {
            const input = signupFormNodes[inputName];
            input.style.borderColor = colors.green;
        }
    }

    // Check data
    if (data.pseudo.length > 20 || data.pseudo.length < 3) {
        signupFormNodes.pseudo.style.borderColor = colors.red;
        return;
    }
    if (data.password !== signupFormNodes.confirm.value
        || data.password.length < 3) {
        signupFormNodes.password.style.borderColor = colors.red;
        signupFormNodes.confirm.style.borderColor = colors.red;
        return;
    }

    console.log(data);

    // Send HTTP POST request
    http.post(
        '/signup', data,
        () => window.location.href = 'lobby',
        err => console.error(err)
    );
});

/* ------------------------------- login Form ------------------------------- */

loginForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get form data
    const data = {
        pseudo: loginFormNodes.pseudo.value,
        password: loginFormNodes.password.value
    };

    // Reset input styles
    for (const inputName in loginFormNodes) {
        if (loginFormNodes.hasOwnProperty(inputName)) {
            const input = loginFormNodes[inputName];
            input.style.borderColor = colors.green;
        }
    }

    // Check data
    if (data.pseudo.length > 20 || data.pseudo.length < 3) {
        loginFormNodes.pseudo.style.borderColor = colors.red;
        return;
    }
    if (data.password.length < 3) {
        loginFormNodes.password.style.borderColor = colors.red;
        return;
    }

    console.log(data)
    http.post('/login',
              data,
              () => window.location.href = 'lobby',
              err => console.error(err));
});