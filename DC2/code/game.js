const gameData = [
    { images: ['real1.jpg', 'ai1.jpg'], realIndex: 0 },
    { images: ['ai2.jpg', 'real2.jpg'], realIndex: 1 },
    { images: ['real1.jpg', 'ai1.jpg'], realIndex: 0 },
    { images: ['ai2.jpg', 'real2.jpg'], realIndex: 1 },
    { images: ['real1.jpg', 'ai1.jpg'], realIndex: 0 },
];
let currentRound = 0;
let score = 0;
let isProcessing = false; // The restraint "lock"

function loadRound() {
    if (currentRound < gameData.length) {
        const leftImg = document.getElementById('img-left');
        const rightImg = document.getElementById('img-right');
        
        leftImg.src = gameData[currentRound].images[0];
        rightImg.src = gameData[currentRound].images[1];
        
        // Reset effects
        leftImg.classList.remove('glitch');
        rightImg.classList.remove('glitch');
        
        document.getElementById('round-num').innerText = currentRound + 1;
        document.getElementById('feedback-text').innerText = "Analyze carefully...";
        document.getElementById('feedback-text').style.color = "white";
        
        isProcessing = false;
    } else {
        showFinalScore();
    }
}

function checkAnswer(userClickedIndex) {
    if (isProcessing) return; 
    isProcessing = true; 
    
    const correctIndex = gameData[currentRound].realIndex;
    const feedback = document.getElementById('feedback-text');
    const leftImg = document.getElementById('img-left');
    const rightImg = document.getElementById('img-right');

    if (userClickedIndex === correctIndex) {
        score++;
        feedback.innerText = "CORRECT. ACCESS GRANTED.";
        feedback.style.color = "#4ece75";
        document.getElementById('score').innerText = score;
    } else {
        feedback.innerText = "ERROR. DECEPTION DETECTED.";
        feedback.style.color = "#ff4e4e";
        // Apply glitch to the wrong image clicked
        const wrongImg = userClickedIndex === 0 ? leftImg : rightImg;
        wrongImg.classList.add('glitch');
    }

    currentRound++;
    setTimeout(loadRound, 1500); 
}

function showFinalScore() {
    const gameUI = document.getElementById('game-ui');
    const accuracy = Math.round((score / gameData.length) * 100);
    
    gameUI.innerHTML = `
        <h1 style="color: #4ece75;">SYSTEM EVALUATION</h1>
        
        <p style="font-size: 2.5rem; color: white; margin-bottom: 10px;">ACCURACY: ${accuracy}%</p>
        
        <div style="margin: 30px auto; width: 80%;">
            <meter id="score-meter" min="0" max="100" low="40" high="70" optimum="90" value="${accuracy}"></meter>
        </div>

        <p style="margin-bottom: 25px;">${accuracy >= 70 ? 'Welcome, Human.' : 'Identity Unverified.'}</p>
        
        <nav id="next-btn" style="display: inline-block;" onclick="window.location.href='firstpage.html'">
            <p>REBOOT SYSTEM</p>
        </nav>
    `;
}

window.onload = loadRound;