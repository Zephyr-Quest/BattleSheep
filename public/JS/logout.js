const logOutBtn = document.getElementById("log_out");

logOutBtn.addEventListener("click", e => {
    e.preventDefault();

    http.post(
        "/logout",
        {},
        () => window.location.href = "/",
        err => console.error(err)
    );
})