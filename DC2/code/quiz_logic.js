/* * SOLOMON GOH | LEVEL 3
 * Assessment Logic Controller
 */

const questions = [
    {
        question: "In the context of AI Deepfakes, which facial feature often fails to reflect light physics correctly?",
        options: [
            "The Hairline",
            "The Pupils (Eyes)",
            "The Chin",
            "The Nose Shape"
        ],
        correct: 1 // Index of correct answer
    },
    {
        question: "Phishing emails often use 'Isolation Tactics'. What is the primary goal of this technique?",
        options: [
            "To make you feel special",
            "To prevent you from verifying the request with others",
            "To encrypt the email connection",
            "To speed up the internet transfer"
        ],
        correct: 1
    },
    {
        question: "When analyzing a suspected Deepfake image, you notice the background near the head is 'warped'. This is an artifact of:",
        options: [
            "Low internet connection",
            "The camera lens being dirty",
            "The AI struggling to separate foreground from background",
            "The subject moving too fast"
        ],
        correct: 2
    },
    {
        question: "You receive an email demanding 'Immediate Payment' or your account will be locked. This is an example of:",
        options: [
            "Standard business protocol",
            "A helpful reminder",
            "Psychological Urgency Trigger",
            "Automated billing system"
        ],
        correct: 2
    },
    {
        question: "Which of the following visual inconsistencies is a common sign of a Generated Adversarial Network (GAN) image?",
        options: [
            "Asymmetrical accessories (e.g., mismatched earrings)",
            "Perfectly symmetrical face",
            "High resolution textures",
            "Correct skin pores"
        ],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;
let isLocked = false; // Prevent double clicking during animation

function initQuiz() {
    document.getElementById('total-q').innerText = questions.length;
    loadQuestion(0);
}

function loadQuestion(index) {
    if (index >= questions.length) {
        finishQuiz();
        return;
    }

    const qData = questions[index];
    document.getElementById('current-q').innerText = index + 1;
    document.getElementById('question-text').innerText = qData.question;
    
    // Clear old buttons
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    // Create new buttons
    qData.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = `> ${opt}`; // Terminal style prefix
        btn.onclick = () => checkAnswer(i, btn);
        container.appendChild(btn);
    });

    document.getElementById('feedback-area').innerText = "";
    document.getElementById('feedback-area').style.color = "#4ece75";
    isLocked = false;
}

function checkAnswer(selectedIndex, btnElement) {
    if (isLocked) return;
    isLocked = true;

    const correctIndex = questions[currentQuestionIndex].correct;

    if (selectedIndex === correctIndex) {
        // Correct Case
        score++;
        btnElement.classList.add('correct-anim');
        document.getElementById('feedback-area').innerText = ">> ANSWER VERIFIED: CORRECT";
        document.getElementById('feedback-area').style.color = "#4ece75";
    } else {
        // Incorrect Case
        btnElement.classList.add('wrong-anim');
        document.getElementById('feedback-area').innerText = ">> ERROR: INVALID RESPONSE";
        document.getElementById('feedback-area').style.color = "#ff4e4e"; // Red
        
        // Highlight the correct one to educate user
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns[correctIndex].style.border = "1px dashed #4ece75";
    }

    // Update Progress Bar
    const pct = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;

    // Wait 1.5 seconds then go to next
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }, 1500);
}

function finishQuiz() {
    const container = document.querySelector('.dossier-box');
    
    // 1. Calculate if the player passed (4 out of 5)
    const passThreshold = 4;
    const passed = score >= passThreshold;
    
    if (passed) {
        // 2. TRIGGER THE "MISSION START" SEQUENCE
        container.innerHTML = `
            <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%;">
                <h1 class="blink-text" style="font-family:'Orbitron'; color: #4ece75; font-size: 2.5rem; margin: 0;">ASSESSMENT PASSED</h1>
                <div class="mission-line"></div>
                <p style="font-size: 1.5rem; letter-spacing: 5px; color: #fff;">STATUS: ACTIVE AGENT</p>
                <p style="color: #4ece75; margin-top: 20px; font-family: 'Share Tech Mono';">Infiltration protocols initiated. Signal scrambled.</p>
                <h2 style="margin-top: 30px; font-family:'Orbitron'; color: #fff;">GOOD LUCK, AGENT.</h2>
                <div class="loading-bar" style="margin-top:40px;">
                    <div class="loading-fill" style="animation-duration: 4s;"></div>
                </div>
            </div>
        `;

        // 3. After the loading bar "deploys" them (4.5s), show final options
        setTimeout(() => {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h1 style="font-family:'Orbitron'; color: #4ece75;">MISSION IN PROGRESS</h1>
                    <div class="mission-line"></div>
                    <p style="margin-bottom: 40px;">The simulation is complete. You are now live in the field.</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 20px; align-items: center;">
                        <button class="option-btn" onclick="window.location.href='resources.html'" style="width: 280px;">AI SAFETY RESOURCES</button>
                        <button class="option-btn" onclick="window.location.href='firstpage.html'" style="width: 280px; border-color: #fff; color: #fff;">RESTART SIMULATION</button>
                    </div>
                </div>
            `;
            // Re-add corner brackets because innerHTML cleared them
            container.innerHTML += `
                <div class="corner-bracket top-left"></div><div class="corner-bracket top-right"></div>
                <div class="corner-bracket bottom-left"></div><div class="corner-bracket bottom-right"></div>
            `;
        }, 4500);

    } else {
        // 4. SHARP FAILURE SEQUENCE
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h1 style="font-family:'Orbitron'; color: #ff4e4e;">CLEARANCE DENIED</h1>
                <div class="mission-line" style="background: #ff4e4e;"></div>
                <p>Training parameters not met. Accuracy: ${Math.round((score / questions.length) * 100)}%</p>
                <p style="color: #aaa; margin-top: 10px;">Tactical knowledge insufficient for field deployment.</p>
                <button class="option-btn" style="margin-top: 30px;" onclick="location.reload()">RETRY EVALUATION</button>
            </div>
        `;
        container.innerHTML += `
            <div class="corner-bracket top-left"></div><div class="corner-bracket top-right"></div>
            <div class="corner-bracket bottom-left"></div><div class="corner-bracket bottom-right"></div>
        `;
    }
}

// Start game on load
window.onload = initQuiz;