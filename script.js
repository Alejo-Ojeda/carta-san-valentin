document.addEventListener("DOMContentLoaded", () => {

    const envelope = document.getElementById("envelope-container");
    const letterContainer = document.getElementById("letter-container");
    const letterWindow = document.getElementById("letterWindow");

    const yesBtn = document.querySelector(".yes-btn");
    const noBtn = document.querySelector(".no-btn");

    const title = document.getElementById("letter-title");
    const catImg = document.getElementById("letter-cat");
    const bgMusic = document.getElementById("bg-music");
    const buttons = document.getElementById("letter-buttons");
    const finalText = document.getElementById("final-text");
    const restartBtn = document.getElementById("restart-btn");

    const heartContainer = document.getElementById("heart-background");

    let yaAcepto = false;
    let cartaAbierta = false;

    /* =========================
       ABRIR CARTA + MÚSICA FADE
    ========================= */

    envelope.addEventListener("click", () => {

        if (cartaAbierta) return;
        cartaAbierta = true;

        envelope.style.display = "none";
        letterContainer.style.display = "grid";

        // Fade in elegante
        bgMusic.volume = 0;
        bgMusic.play().then(() => {

            let fade = setInterval(() => {
                if (bgMusic.volume < 0.4) {
                    bgMusic.volume += 0.02;
                } else {
                    clearInterval(fade);
                }
            }, 200);

        }).catch(err => {
            console.log("Audio bloqueado por navegador:", err);
        });

        setTimeout(() => {
            letterWindow.classList.add("open");
        }, 50);
    });


    /* =========================
       BOTÓN NO
    ========================= */

    const frasesNo = [
        "Respuesta incorrecta... intenta con 'Sí' 😉",
        "Error 404: Amor no encontrado 💔",
        "Hmm... esa no era la respuesta correcta 😌",
        "El botón correcto es el otro 😏",
        "Tu corazón quiso decir 'Sí' 🥺",
        "Negativo no es opción aquí 😌"
    ];

    function mostrarMensajeNo() {

        let mensaje = document.querySelector(".mensaje-error");

        if (!mensaje) {
            mensaje = document.createElement("div");
            mensaje.classList.add("mensaje-error");
            document.body.appendChild(mensaje);
        }

        // Reinicia animación si ya estaba visible
        mensaje.classList.remove("visible");
        void mensaje.offsetWidth; // fuerza reflow para reiniciar animación

        mensaje.textContent = frasesNo[Math.floor(Math.random() * frasesNo.length)];
        mensaje.classList.add("visible");

        setTimeout(() => {
            mensaje.classList.remove("visible");
        }, 2500);
    }


    noBtn.addEventListener("click", mostrarMensajeNo);


    /* =========================
       BOTÓN SÍ
    ========================= */

    yesBtn.addEventListener("click", () => {

        if (yaAcepto) return;
        yaAcepto = true;

        title.textContent = "¡SÍÍÍÍ! 💖";
        catImg.src = "cat_dance.gif";

        letterWindow.classList.add("final");

        buttons.style.display = "none";
        finalText.style.display = "block";
        restartBtn.style.display = "inline-block";

        mostrarFrasesFondo();
    });


    function mostrarFrasesFondo() {

        const frases = [
            "Eres una persona increíble.",
            "Tu forma de ver el mundo me encanta.",
            "Tienes una luz que ilumina todo.",
            "Me inspiras más de lo que imaginas.",
            "Tu sonrisa cambia el ambiente.",
            "Eres genuina, y eso te hace única.",
            "Me siento afortunado de coincidir contigo.",
            "Contigo todo se siente más bonito."
        ];

        const leftX = 6;
        const rightX = 78;
        const topStart = 15;
        const spacing = 22;

        let leftCount = 0;
        let rightCount = 0;

        frases.forEach((texto, index) => {

            setTimeout(() => {

                const frase = document.createElement("div");
                frase.classList.add("frase-fondo");
                frase.textContent = texto;

                const isLeft = index % 2 === 0;

                if (isLeft) {
                    frase.style.left = leftX + "vw";
                    frase.style.top = (topStart + leftCount * spacing) + "vh";
                    leftCount++;
                } else {
                    frase.style.left = rightX + "vw";
                    frase.style.top = (topStart + rightCount * spacing) + "vh";
                    rightCount++;
                }

                document.body.appendChild(frase);

            }, index * 1200);
        });
    }


    /* =========================
       REINICIAR
    ========================= */

    restartBtn.addEventListener("click", () => {
        location.reload();
    });


    /* =========================
       CORAZONES
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

        setTimeout(() => heart.remove(), duration * 1000);
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

    setInterval(createHeart, 175);

});
