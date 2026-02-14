document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTOS
    ========================= */

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

    const gameContainer = document.getElementById("game-container");
    const gameArea = document.getElementById("game-area");
    const scoreText = document.getElementById("score");
    const livesText = document.getElementById("lives");
    const levelText = document.getElementById("level-text");
    const missionText = document.getElementById("mission-text");
    const claimBtn = document.getElementById("claim-btn");

    const startScreen = document.getElementById("start-screen");
    const startBtn = document.getElementById("start-btn");

    /* =========================
       VARIABLES JUEGO
    ========================= */

    let level = 1;
    let score = 0;
    let lives = 3;
    let speed = 4;

    let gameInterval = null;
    let survivalTimer = null;

    let survivalTime = 12;
    let gameRunning = false;
    let yaAcepto = false;

    /* =========================
       UI
    ========================= */

    function updateUI(){
        scoreText.textContent = "Corazones: " + score;
        livesText.textContent = "Vidas: " + "❤️".repeat(lives);
    }

    /* =========================
       START SCREEN
    ========================= */

    startBtn.addEventListener("click", () => {

        if(gameRunning) return;

        startScreen.style.opacity = "0";
        startScreen.style.pointerEvents = "none";

        setTimeout(() => {
            startScreen.style.display = "none";
        }, 300);

        // 🔥 MÚSICA EMPIEZA AQUÍ
        bgMusic.volume = 0.4;
        bgMusic.play().catch(()=>{});

        gameRunning = true;
        resumeGame();
    });


    function startGame(){

        gameRunning = true;

        level = 1;
        score = 0;
        lives = 3;

        levelText.textContent = "Nivel 1 💖";
        missionText.textContent = "Explota 7 corazones rosas";

        updateUI();
        resumeGame();
    }

    /* =========================
       CREAR OBJETOS
    ========================= */

    function createObject(){

        if(!gameRunning) return;

        const obj = document.createElement("div");
        obj.classList.add("game-heart");

        let type = "pink";
        const random = Math.random();

        /* =========================
           PROBABILIDADES AJUSTADAS
        ========================= */

        if(level === 1){
            if(random < 0.05) type = "gold";
            else if(random < 0.20) type = "bomb";
            else if(random < 0.35) type = "gray";
        }

        if(level === 2){
            if(random < 0.08) type = "gold";
            else if(random < 0.45) type = "bomb";   // más bombas
            else if(random < 0.45) type = "gray";   // más oscuros
        }

        if(level === 3){
            if(random < 0.10) type = "gold";
            else if(random < 0.45) type = "bomb";
            else if(random < 0.55) type = "gray";
        }

        if(type === "pink") obj.classList.add("pink");
        if(type === "gray") obj.classList.add("gray");
        if(type === "gold") obj.classList.add("gold");

        if(type === "bomb"){
            obj.classList.add("bomb");
            obj.textContent = "💣";
        }

        obj.style.position = "absolute";
        obj.style.left = Math.random() * 85 + "%";
        obj.style.bottom = "0px";

        gameArea.appendChild(obj);

        let position = 0;
        let speed;

        if(level === 1) speed = 1.8;
        if(level === 2) speed = 2.0;
        if(level === 3) speed = 2.4;

        let alive = true;

        function animate(){

            if(!gameRunning || !alive || !document.body.contains(obj)){
                return;
            }

            position += speed;
            obj.style.bottom = position + "px";

            if(position > gameArea.offsetHeight){

                if(type === "pink"){
                    lives--;
                    updateUI();
                    if(lives <= 0){
                        resetGame();
                    }
                }

                obj.remove();
                return;
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        obj.addEventListener("pointerdown", () => {

            if(!alive) return;
            alive = false;

            obj.style.transform = "rotate(45deg) scale(1.3)";
            obj.style.transition = "0.1s ease";

            setTimeout(() => obj.remove(), 90);

            if(type === "pink"){
                score++;
            }

            if(type === "gold" && lives < 10){
                lives++;
            }

            if(type === "gray"){
                lives--;
            }

            if(type === "bomb"){
                lives--;

                const rect = obj.getBoundingClientRect();

                explodeBombEffect(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2
                );
            }

            updateUI();

            if(lives <= 0){
                resetGame();
            }

            if(score >= 7 && level < 3){
                levelComplete();
            }

            if(score >= 7 && level === 3){
                winGame();
            }
        });
    }



    /* =========================
       NIVEL COMPLETADO
    ========================= */

    function levelComplete(){

        pauseGame();
        clearInterval(survivalTimer);

        document.querySelectorAll(".game-heart").forEach(h => h.remove());

        showBanner("Nivel " + level + " completado 💖");

        setTimeout(() => {

            level++;
            score = 0;

            // 🔥 Mantener vidas extra al pasar nivel
            if(lives < 3) lives = 3;
            // si tiene más de 3, se mantienen
            updateUI();


            if(level === 2){
                levelText.textContent = "Nivel 2 🔥";
                missionText.textContent = "Más cuidado... aparecen bombas 💣";
                resumeGame();
            }

            else if(level === 3){
                startSurvival();
            }

        }, 2600);
    }



    /* =========================
       NIVEL 3 SUPERVIVENCIA
    ========================= */

    function startSurvival(){

        pauseGame();
        document.querySelectorAll(".game-heart").forEach(h => h.remove());

        // 🔥 NO tocar vidas extra
        if(lives < 3) lives = 3; // solo garantiza mínimo
        score = 0;

        survivalTime = 7;
        updateUI();

        levelText.textContent = "Nivel 3 💀";
        missionText.textContent = "Sobrevive 7 segundos";

        resumeGame();

        survivalTimer = setInterval(() => {

            survivalTime--;
            levelText.textContent = "Nivel 3 💀 - " + survivalTime + "s";

            if(survivalTime <= 0){
                clearInterval(survivalTimer);
                winGame();
            }

        }, 1000);
    }



    /* =========================
       GANAR
    ========================= */

    function winGame(){

        pauseGame();
        clearInterval(survivalTimer);

        // ocultar UI normal
        document.querySelector(".game-ui").style.display = "none";
        document.querySelectorAll(".game-heart").forEach(h => h.remove());

        // crear pantalla final fuera del game-area
        const victoryScreen = document.createElement("div");
        victoryScreen.className = "victory-screen-full";

        victoryScreen.innerHTML = `
        <div class="victory-card">
            <h1>💖 VICTORIA TOTAL 💖</h1>
            <p>Has desbloqueado el nivel más importante ✨</p>
            <div class="victory-hearts">❤️ ❤️ ❤️</div>
            <button id="final-claim-btn">RECLAMAR MI PREMIO ✨</button>
        </div>
    `;

        gameContainer.appendChild(victoryScreen);

        document.getElementById("final-claim-btn").addEventListener("click", () => {
            gameContainer.style.display = "none";
            envelope.style.display = "block";
            bgMusic.volume = 0.4;
            bgMusic.play().catch(()=>{});
        });
    }



    /* =========================
       PAUSA / REANUDAR
    ========================= */

    function pauseGame(){
        gameRunning = false;
        clearInterval(gameInterval);
    }

    function resumeGame(){

        gameRunning = true;

        let spawnRate;

        if(level === 1) spawnRate = 1100;  // más espacio entre corazones
        if(level === 2) spawnRate = 900;
        if(level === 3) spawnRate = 600;

        gameInterval = setInterval(createObject, spawnRate);
    }




/* =========================
   RESET
========================= */

    function resetGame(){

        pauseGame();
        clearInterval(survivalTimer);

        lives = 3;
        score = 0;

        claimBtn.style.display = "none";

        showBanner("Respawn 😏");

        // Ajustar velocidad y misión según nivel actual
        if(level === 1){
            speed = 4;
            missionText.textContent = "Explota 7 corazones rosas";
            setTimeout(() => resumeGame(800), 2000);
        }

        else if(level === 2){
            speed = 3;
            missionText.textContent = "Modo difícil - 7 corazones";
            setTimeout(() => resumeGame(600), 2000);
        }

        else if(level === 3){
            survivalTime = 12;
            missionText.textContent = "Sobrevive 12 segundos";
            setTimeout(() => startSurvival(), 2000);
        }

        updateUI();
    }


    /* =========================
       BANNER
    ========================= */

    function showBanner(text){

        let banner = document.getElementById("level-banner");

        if(!banner){
            banner = document.createElement("div");
            banner.id = "level-banner";
            document.body.appendChild(banner);
        }

        banner.textContent = text;
        banner.style.display = "flex";

        setTimeout(() => {
            banner.style.display = "none";
        }, 2000);
    }

    /* =========================
       RECLAMAR PREMIO
    ========================= */

    claimBtn.addEventListener("click", () => {

        gameContainer.style.display = "none";
        envelope.style.display = "block";

        bgMusic.volume = 0.4;
        bgMusic.play().catch(()=>{});
    });



    /* =========================
       CARTA
    ========================= */

    envelope.addEventListener("click", () => {

        envelope.style.display = "none";
        letterContainer.style.display = "grid";

        bgMusic.volume = 0.4;
        bgMusic.play().catch(()=>{});

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

function explodeBombEffect(x, y){

    const explosion = document.createElement("div");
    explosion.classList.add("bomb-explosion");

    explosion.style.left = x + "px";
    explosion.style.top = y + "px";

    document.body.appendChild(explosion);

    setTimeout(() => explosion.remove(), 500);
}
