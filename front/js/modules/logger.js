let logger = (function(){

    function postLog(username, password, confirm) {
        console.log(username, password, confirm);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username
            },
            success: () => {
                window.location.href = "/";
            },
        });
    }

    return {
        sendLogin(username, password, confirm) {
            postLog(username, password, confirm);
        }
    }
})();