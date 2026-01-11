/* * SOLOMON GOH | CLASSIFIED 
 * Game Logic Controller
 */

const clueSfx = new Audio('digga.wav');
const loadingSfx = new Audio('loading.wav');
window.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname;
    const overlay = document.getElementById('mission-overlay');
    const title = document.getElementById('mission-title');
    const desc = document.getElementById('mission-desc');

    if (!overlay) return; // Exit if the overlay HTML isn't present on the page

    // Context-switching logic based on filename
    if (page.includes('email.html')) {
        title.innerText = "LEVEL 01: PHISH-NET";
        desc.innerText = "OBJECTIVE: Analyze incoming transmissions. Identify and flag AI-generated social engineering attempts.";
    } else if (page.includes('deepfake-analysis.html')) {
        title.innerText = "LEVEL 02: BIOMETRIC SCAN";
        desc.innerText = "OBJECTIVE: Use the scanner to find visual inconsistencies in the subject's profile. Verify authenticity.";
    } else if (page.includes('quiz.html')) {
        title.innerText = "FINAL LEVEL: CLEARANCE QUIZ";
        desc.innerText = "OBJECTIVE: Test tactical knowledge. 4/5 correct is required for final security clearance.";
    }

    // Standard timing for all pages: 3s display + 0.8s fade out
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 800);
    }, 4000);
});

/* =========================================
   GAME 1: PHISHING ANALYZER LOGIC
   ========================================= */
const foundEmailClues = new Set();

// Database of mock emails
const emails = [
    {
        id: 0,
        sender: "IT Support <support@company-internal.com>",
        subject: "Scheduled Maintenance",
        body: "Team,\n\nPlease be advised that server maintenance is scheduled for this Friday at 10 PM. No action is required on your part.\n\nRegards,\nIT Dept",
        isPhishing: false
    },
    {
        id: 1,
        sender: "CEO@compnay-secure.net", // Subtle typo in domain
        subject: "URGENT: WIRE TRANSFER REQUEST",
        isPhishing: true,
        body: `Agent,

I am in a meeting and cannot take calls. I need you to process an <span class="clue-hotspot" onclick="analyzeClue('urgency')">urgent payment</span> to a new vendor immediately. 

Please click the link below to view the invoice and wire instructions:
<span class="clue-hotspot" onclick="analyzeClue('link')">http://secure-portal-auth-login.com/invoice</span>

Do not discuss this with anyone else as it is part of a <span class="clue-hotspot" onclick="analyzeClue('secret')">confidential acquisition</span>.

Sent from my iPad`,
        clues: {
            urgency: {
                title: "PSYCHOLOGICAL TRIGGER: URGENCY",
                text: "AI models are trained to generate text that induces panic. The phrase 'immediately' combined with 'cannot take calls' is a classic social engineering tactic to bypass your critical thinking."
            },
            link: {
                title: "MALICIOUS DOMAIN",
                text: "Hover over the link. The domain 'secure-portal-auth-login.com' does not match our official company domain. It uses generic security buzzwords to look legitimate."
            },
            secret: {
                title: "ISOLATION TACTIC",
                text: "The sender explicitly tells you 'do not discuss this.' Phishers use isolation to prevent you from verifying the request with colleagues."
            }
        }
    },
    {
        id: 2,
        sender: "HR Team <hr@company.com>",
        subject: "Policy Update",
        body: "Hi Agent,\n\nThe employee handbook has been updated for Q1 2025. You can find the PDF on the shared intranet drive.\n\nBest,\nSarah",
        isPhishing: false
    }
];

function initEmailGame() {
    const listContainer = document.getElementById('email-list');
    if (!listContainer) return; // Not on the email page

    // Render Sidebar
    emails.forEach(email => {
        const item = document.createElement('div');
        item.className = 'email-item' + (email.id === 0 ? ' active' : '');
        item.innerHTML = `
            <h4>${email.sender.split('<')[0]}</h4>
            <p>${email.subject}</p>
        `;
        item.onclick = () => loadEmail(email.id, item);
        listContainer.appendChild(item);
    });

    // Load first email
    loadEmail(0, document.querySelector('.email-item'));
}

function loadEmail(id, element) {
    // Update active visual state
    document.querySelectorAll('.email-item').forEach(el => el.classList.remove('active'));
    if(element) element.classList.add('active');

    const email = emails[id];
    const contentDiv = document.getElementById('email-content');
    
    // Determine sender display (highlight if phishing clue in header)
    let senderDisplay = email.sender;
    if(email.isPhishing) {
        senderDisplay = `<span class="clue-hotspot" onclick="analyzeClue('sender')">${email.sender}</span>`;
    }

    contentDiv.innerHTML = `
        <div class="email-header">
            <div class="meta-row"><span class="meta-label">FROM:</span> <span>${senderDisplay}</span></div>
            <div class="meta-row"><span class="meta-label">TO:</span> <span>Agent</span></div>
            <div class="meta-row"><span class="meta-label">SUBJECT:</span> <span>${email.subject}</span></div>
        </div>
        <div class="email-body">${email.body}</div>
    `;

    // Add sender clue logic dynamically if it's the phishing email
    if(email.isPhishing) {
        // We inject the sender clue data here for the 'sender' click
        email.clues.sender = {
            title: "SPOOFED ADDRESS",
            text: "Look closely at the domain: 'compnay-secure.net'. There is a typo (Transposition: 'compnay'). Gen AI can create credible-looking email aliases that fail close inspection."
        };
    }
}

function analyzeClue(type) {
    clueSfx.currentTime = 0; // Resets sound so it can play instantly again if clicked fast
    clueSfx.play().catch(e => console.log("Audio play failed:", e));
    // Hardcoded logic for the specific phishing email (ID 1)
    const email = emails[1]; 
    const clue = email.clues[type];
    
    if(clue) {
        document.getElementById('analysis-overlay').style.display = 'flex';
        document.querySelector('.analysis-card h3').innerText = clue.title;
        document.getElementById('analysis-text').innerText = clue.text;

        if(!foundEmailClues.has(type)) {
            foundEmailClues.add(type);
            // ADD THIS LINE HERE:
            updateEmailProgress(); 
        }
    }
}

function closeAnalysis() {
    document.getElementById('analysis-overlay').style.display = 'none';
    
    // Check if all 4 clues (sender, urgency, link, secret) have been clicked
    // Note: ensure your analyzeClue function adds the 'type' to foundEmailClues
    if (foundEmailClues.size >= 4) {
        const classification = document.querySelector('.classification');
        if(classification) {
            classification.innerText = "ACCESS GRANTED: REDIRECTING...";
            classification.style.color = "#fff";
        }
        const transition = document.getElementById('transition-overlay');
        if (transition) transition.style.opacity = '1'; // Start Fade Out

        setTimeout(() => {
            window.location.href = 'deepfake-analysis.html';
        }, 1500);
    }
}


/* =========================================
   GAME 2: DEEPFAKE SCANNER LOGIC
   ========================================= */

let detectedCount = 0;
const totalClues = 3;
const foundClues = new Set();

const deepfakeData = {
    eyes: {
        title: "IRREGULAR PUPIL REFLECTION",
        desc: "Deepfake GANs (Generative Adversarial Networks) often struggle with physics. The reflection in the eyes (specular highlight) does not match the light source or differs between the left and right eye."
    },
    lips: {
        title: "LIP SYNC",
        desc: "One of the most difficult things for AI to render is the connection between the mouth and the rest of the face. When the subject speaks, the mouth moves independently of the cheek muscles and jawbone"
    },
    skin: {
        title: "SKIN TEXTURE ANOMALY",
        desc: "To hide the seams between the original video and the AI-generated face, creators often apply a blur or smoothing filter. If you compare the sharp, textured details of his suit jacket and tie to the skin on his forehead and cheeks, there is a mismatch."
    }
};

function analyzeDeepfake(part) {
    clueSfx.currentTime = 0;
    clueSfx.play().catch(e => console.log("Audio play failed:", e));
    const data = deepfakeData[part];
    if(data) {
        // Update Modal
        document.getElementById('modal-title').innerText = data.title;
        document.getElementById('modal-desc').innerText = data.desc;
        document.getElementById('analysis-overlay').style.display = 'flex';

        // Update Score if not already found
        if(!foundClues.has(part)) {
            foundClues.add(part);
            detectedCount++;
            updateProgress();
        }
    }
}

function closeDeepfakeModal() {
    document.getElementById('analysis-overlay').style.display = 'none';

    // detectedCount is already being updated in analyzeDeepfake()
    if(detectedCount >= 3) {
        const classification = document.querySelector('.classification');
        if(classification) {
            classification.innerText = "THREAT NEUTRALIZED // MISSION COMPLETE";
        }
        const transition = document.getElementById('transition-overlay');
        if (transition) transition.style.opacity = '1';

        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 1500);
    }
}

function updateProgress() {
    document.getElementById('found-count').innerText = detectedCount;
    const pct = (detectedCount / totalClues) * 100;
    document.getElementById('scan-progress').style.width = pct + "%";
    
    if(detectedCount === totalClues) {
        document.querySelector('.classification').innerText = "THREAT CONFIRMED";
        document.querySelector('.classification').style.backgroundColor = "#ff4e4e";
        document.querySelector('.classification').style.color = "#000";
    }
}
function updateEmailProgress() {
    const countDisplay = document.getElementById('email-found-count');
    const bar = document.getElementById('email-progress');
    
    if (countDisplay) {
        countDisplay.innerText = foundEmailClues.size;
    }
    
    if (bar) {
        // Calculate percentage (based on 4 total clues)
        const pct = (foundEmailClues.size / 4) * 100;
        bar.style.height = pct + "%";
    }
}
// --- CONSOLIDATED OVERLAY & VIDEO LOGIC ---
window.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname;
    const overlay = document.getElementById('mission-overlay');
    const title = document.getElementById('mission-title');
    const desc = document.getElementById('mission-desc');
    const introVideo = document.getElementById('intro-cinematic');
    const gameContent = document.getElementById('game-content');
    const videoContainer = document.querySelector('.video-preloader-container');

    if (overlay) {
        // 1. Set Overlay Text
        if (page.includes('email.html')) {
            title.innerText = "LEVEL 01: PHISH-NET";
            desc.innerText = "OBJECTIVE: Analyze incoming transmissions...";
            initEmailGame(); // Initialize email game if on this page
        } else if (page.includes('deepfake-analysis.html')) {
            title.innerText = "LEVEL 02: BIOMETRIC SCAN";
            desc.innerText = "OBJECTIVE: Use the scanner to find visual inconsistencies...";
        }

        loadingSfx.currentTime = 0;
        loadingSfx.play().catch(e => console.log("Audio play failed:", e));

        // 2. Sequence: Overlay -> Video -> Game
        setTimeout(() => {
            overlay.style.opacity = '0';
            
            loadingSfx.pause();
            loadingSfx.currentTime = 0;

            setTimeout(() => {
                overlay.style.display = 'none';
                
                // Start Video Playback
                if (introVideo) {
                    introVideo.muted = false; // Enable audio
                    introVideo.volume = 1.0;  // Set full volume
                    
                    introVideo.play().catch(error => {
                        console.log("Audio playback requires user interaction first.", error);
                        // Fallback: If blocked, try playing muted so the game doesn't break
                        introVideo.muted = true;
                        introVideo.play();
                    });
                } else {
                    revealGame();
                }
            }, 800);
        }, 4000);
    }

    // 3. Handle Video Finishing
    if (introVideo) {
        introVideo.onended = () => {
            revealGame();
        };
    }

    function revealGame() {
        if (videoContainer) {
            videoContainer.style.transition = "opacity 0.8s ease";
            videoContainer.style.opacity = "0";
            videoContainer.style.pointerEvents = "none";
        }
        if (gameContent) {
            gameContent.style.opacity = "1";
        }
        setTimeout(() => {
            if (videoContainer) videoContainer.style.display = "none";
        }, 800);
    }
});