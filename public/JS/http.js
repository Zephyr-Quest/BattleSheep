const http = (function () {
    const HOST = 'http://localhost:8080';

    function customFecth(url, config, resolve, reject) {
        fetch(url, config)
            .then(resolve)
            .catch(reject);
    }

    return {
        post(path, data, resolve, reject) {
            const url = HOST + path;

            const options = {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            customFecth(url, options, resolve, reject);
        }
    }
})();