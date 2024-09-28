


export const validarToken = async () => {
    const token = localStorage.getItem(localStorageKeys.jwtToken);

    if (!token) {
        logOut();
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const result = await fetch("https://localhost/backend/personas/verify", {
            headers,
        });

        if (result.status === 401) {
            logOut(window.location.href);
        }

        const parsed = await result.json();
        return parsed.id;
    } catch (e) {
        console.error(e);
        if (confirm("Error inesperado al autenticar. ¿Reintentar?")) {
            return await jwtGuard();
        }
        logOut(window.location.href);
    }
};

export const logOut = (aimPage) => {
    localStorage.clear();
    sessionStorage.clear();
    if (aimPage !== undefined) {
        sessionStorage.setItem(sessionStorageKeys.aimPage, aimPage);
    }
    window.location.href = "/";
}



export const localStorageKeys = /** @type {const} */ ({
    jwtToken: "jwtToken",
});

export const sessionStorageKeys = /** @type {const} */ ({
    aimPage: "aimPage",
});