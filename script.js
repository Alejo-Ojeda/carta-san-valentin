const envelope = document.getElementById("envelope-container");
const letterContainer = document.getElementById("letter-container");
const letterWindow = document.getElementById("letterWindow");

const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const restartBtn = document.getElementById("restart-btn");

const heartContainer = document.getElementById("heart-background");

/* =========================
   ABRIR CARTA
========================= */

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letterContainer.style.display = "grid";

    setTimeout(() => {
        letterWindow.classList.add("open");
    }, 50);
});

/* =========================
   BOTÓN NO (MENSAJES CURSIS RANDOM)
========================= */

const frasesNo = [
    "Respuesta incorrecta... intenta con 'Sí' 😉",
    "Error 404: Amor no encontrado 💔",
    "Hmm... esa no era la respuesta correcta 😌",
    "El botón correcto es el otro 😏",
    "¿Seguro? Piénsalo otra vez 💕",
    "Ese botón está defectuoso 😌",
    "Intento fallido... prueba con 'Sí' 😳",
    "Sistema bloqueado hasta que digas que sí 💘",
    "No aceptamos negativas aquí 😌",
    "Tu corazón quiso decir 'Sí' 🥺"
];

function mostrarMensajeNo() {
    let mensaje = document.querySelector(".mensaje-error");

    // Si no existe lo creamos
    if (!mensaje) {
        mensaje = document.createElement("div");
        mensaje.classList.add("mensaje-error");
        document.body.appendChild(mensaje);
    }

    // Frase random
    const randomIndex = Math.floor(Math.random() * frasesNo.length);
    mensaje.textContent = frasesNo[randomIndex];

    mensaje.classList.add("visible");

    // ⏱ MÁS RÁPIDO
    setTimeout(() => {
        mensaje.classList.remove("visible");
    }, 2000); // antes era más largo
}

noBtn.addEventListener("click", mostrarMensajeNo);


/* =========================
   BOTÓN SÍ
========================= */

yesBtn.addEventListener("click", () => {
    title.textContent = "¡SÍÍÍÍ! 💖";
    catImg.src = "cat_dance.gif";

    letterWindow.classList.add("final");

    buttons.style.display = "none";
    finalText.style.display = "block";
    restartBtn.style.display = "inline-block";
});

/* =========================
   REINICIAR
========================= */

restartBtn.addEventListener("click", () => {
    location.reload();
});

/* =========================
   CORAZONES INTERACTIVOS (EXPLOSIÓN BONITA)
========================= */

function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");

    const size = Math.random() * 20 + 15;
    heart.style.width = size + "px";
    heart.style.height = size + "px";
    heart.style.left = Math.random() * 100 + "vw";

    const duration = Math.random() * 4 + 6;
    heart.style.animationDuration = duration + "s";

    heartContainer.appendChild(heart);

    heart.addEventListener("click", (e) => {
        e.stopPropagation();
        explodeHeart(heart);
    });

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

function explodeHeart(heart) {
    const rect = heart.getBoundingClientRect();

    for (let i = 0; i < 6; i++) {
        const mini = document.createElement("div");
        mini.classList.add("mini-heart");

        mini.style.left = rect.left + rect.width / 2 + "px";
        mini.style.top = rect.top + rect.height / 2 + "px";

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 40;

        mini.style.setProperty("--x", Math.cos(angle) * distance + "px");
        mini.style.setProperty("--y", Math.sin(angle) * distance + "px");

        document.body.appendChild(mini);

        setTimeout(() => mini.remove(), 800);
    }

    heart.remove();
}

setInterval(createHeart, 350);
