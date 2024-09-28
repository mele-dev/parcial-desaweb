import { localStorageKeys, sessionStorageKeys } from "./utils.js";

/** @type {HTMLParagraphElement} **/
const helperMessage = document.getElementById("helperMessage");

/** @type {HTMLParagraphElement} **/
const username = document.getElementById("username");

/** @type {HTMLParagraphElement} **/
const contraseña = document.getElementById("psw1");

/** @type {HTMLParagraphElement} **/
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
    const allInputs = [ username, contraseña, loginButton];

    try {
        for (const input of allInputs) {
            input.disabled = true;
        }

        const result = await fetch("http://localhost/back/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.value,
                contraseña: contraseña.value,   
            }),
        });

        const token = await result.json();

        if (result.ok) {
            localStorage.setItem(localStorageKeys.jwtToken, token.token);
            const aimPage = sessionStorage.getItem(sessionStorageKeys.aimPage);
            sessionStorage.removeItem(sessionStorageKeys.aimPage, "aimPage");
            window.location.href = aimPage ?? "./tareas";
        } else if (result.status === 404) {
            helperMessage.innerText = "No pudimos encontrarte";
            helperMessage.style.color = "red";
        } else {
            console.error(result);
        }
    } catch (e) {
        helperMessage.innerText = "Error de red";
        helperMessage.style.color = "red";
        console.error(e);
    } finally {
        for (const input of allInputs) {
            input.disabled = false;
        }
    }
});