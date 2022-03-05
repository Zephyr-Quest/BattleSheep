import WebGL from './ThreeJS/WebGL.js';

if (!WebGL.isWebGLAvailable() || navigator.userAgent.includes("Firefox")) {
    const warning = WebGL.getWebGLErrorMessage();
    console.log(warning.innerText);
    
    const path = window.location.pathname;
    if (path === '/' || path === '/rules')
        document.getElementById('home_main').style.display = "flex";
    else {
        window.location.href = "/not_available";
    }
}