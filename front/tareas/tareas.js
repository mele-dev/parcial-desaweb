import { localStorageKeys, sessionStorageKeys, validarToken, logOut } from "../utils.js";

const main = async () => {
    const myId = validarToken();
    const authorization = /** @type {const} */ ({
        Authorization: `Bearer ${localStorage.getItem(localStorageKeys.jwtToken)}`,
    });

    const result = await fetch("http://localhost/back/tareas", {
        headers: {
            ...authorization,
        }
    });
    const tareas = await result.json();
    alert(`las tareas => ${JSON.stringify(tareas)}`);
    
    if (!result.ok) {
        confirm("Error inesperado. Te redirigiremos al login.");
        logOut();
    }

    const helperMessage = document.getElementById("helperMessage");
    for (const i in tareas) {
        const tarea = tareas[i];
        const newDiv = document.createElement("div");
        newDiv.className = "card";
        newDiv.innerHTML = `
            <div class="container">
                <h4><b>${tarea.nombre}</b></h4>
                <label>${tarea.duracion}</label>
                <hr>
                <p>Comentario</p>
                <p>Comentario 2</p>

                <div style="margin: 0.5rem;">
                    <button class="addComent fancy-button fancy-button-right grow">Nuevo comentario</button>
                </div>
            </div>
        `;

        helperMessage.parentNode.insertBefore(newDiv, helperMessage.nextSibling);
    }

};

main();