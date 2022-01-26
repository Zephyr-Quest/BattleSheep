const toggleBtn = document.getElementById("switch_form");
const signupSpan = document.getElementById("signup_link");
const loginSpan = document.getElementById("login_link");
const signupForm = document.getElementById("signup_form");
const loginForm = document.getElementById("login_form");

toggleBtn.addEventListener('click', e => {
    signupSpan.classList.toggle("selected");
    loginSpan.classList.toggle("selected");
    signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
});