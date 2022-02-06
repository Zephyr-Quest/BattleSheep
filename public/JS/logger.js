let logger = (function(){

    function postLog(username, password, confirm) {
        console.log(username, password, confirm);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username,
                password: password,
                confirmation: confirm
            },
            success: () => {
                window.location.href = "/lobby";
            },
        });
    }

    return {
        sendLogin(username, password, confirm) {
            postLog(username, password, confirm);
        }
    }
})();

module.exports = logger