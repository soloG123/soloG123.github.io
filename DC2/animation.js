function startBriefing() {
    const placeholderImg = document.querySelector('.map-overlay');
    const video = document.getElementById('briefing-video');

    if (placeholderImg && video) {
        // Hide the static image to reveal the video underneath
        placeholderImg.style.display = 'none';
        
        // Play the video
        video.play().catch(error => {
            console.log("Video play failed:", error);
        });
    }
}

/**
 * 2. VIDEO ENDED LOGIC
 * Redirects to the next page automatically
 */
window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('briefing-video');
    if (video) {
        video.onended = function() {
            window.location.href = "intro.html";
        };
    }
});

document.querySelectorAll('.start-btn').forEach(link => {
    link.addEventListener('click', function(e) {
        // 1. Prevent the default instant page jump
        e.preventDefault();
        const targetUrl = this.getAttribute('href');
        
        const startSound = new Audio('skull_laugh.wav'); 
        startSound.play().catch(error => {
            console.log("Audio play failed (likely browser policy):", error);
        });

        // 2. Trigger the fade effect
        const overlay = document.getElementById('fade-overlay');
        overlay.classList.add('is-active');

        // 3. Wait for the CSS transition (500ms) then redirect
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 3000); 
    });
});

let storySteps = [];

// Determine which steps to use based on the current HTML file
if (window.location.pathname.includes("intro.html")) {
    storySteps = [
        "Welcome, agent 00543."
    ];
} else if (window.location.pathname.includes("familiarisation.html")|| window.location.pathname.includes("test.html")) {
    storySteps = [
        "But before you go, be reminded that the field can be dangerous.",
        "Don't worry. We have designed a new pen with advanced AI detection system to help you identify synthetic entities.",
        "Let's get you familiarised with the functions of this pen, agent."
    ];
}

let currentStep = 0;
let isTyping = false; // Prevents overlapping animations

function nextStep() {
    if (isTyping) return;

    const textElement = document.getElementById('next'); 
    const button = document.getElementById('next-btn');
    const penImg = document.getElementById('pen-image');
    

    if (currentStep < storySteps.length) {
        typeWriter(textElement, storySteps[currentStep]);
        currentStep++;
    } else {
        // Use .includes() to be safe across different server environments
        const path = window.location.pathname;
        const loginAudio = document.getElementById('login')
        
        if (path.includes("intro.html")) {
            const overlay = document.getElementById('fade-overlay');
            
        
            if (overlay) {
                // 2. Trigger the fade to black
                overlay.classList.add('is-active');
                loginAudio.play().catch(e => console.log("Audio autoplay blocked:", e));

                // 3. Wait for the transition (matching your 3000ms from firstpage)
                setTimeout(() => {
                    window.location.href = 'mission.html';
                }, 3000); 
            } else {
                window.location.href = 'mission.html';
            }
        }
        // Checking both spellings just in case
        else if (path.includes("familiarisation.html")|| path.includes("test.html")) {
            typeWriter(textElement, "Take this pen.");
            if (penImg) penImg.style.display = "block";
            button.style.display = "none";
            
            penImg.onclick = () => {
            const overlay = document.getElementById('fade-overlay');
            const penAudio = new Audio('take-pen.wav');

            penAudio.play().catch(e => console.log("Audio autoplay blocked:", e));
            
            if (overlay) {
                overlay.classList.add('is-active');
                setTimeout(() => {
                    window.location.href = 'email.html';
                }, 2000); // Wait for fade effect
            } else {
                window.location.href = 'email.html';
            }
        };
    }
}}

const typingAudio = new Audio('type2-sfx.wav');
typingAudio.loop = true;   // Ensures sound doesn't cut out for long text
typingAudio.volume = 0.6;  // Adjust this number (0.0 to 1.0) to lower volume

function typeWriter(element, text) {
  isTyping = true;
  element.textContent = ""; 
  let i = 0;
  const speed = 15;

  // Play sound ONLY if we are on the familiarisation page
  // (We check the URL to ensure this doesn't break other pages)
  if (window.location.pathname.includes("familiarisation.html") || window.location.pathname.includes("test.html")) {
      typingAudio.currentTime = 0; // Reset sound to start
      typingAudio.play().catch(e => console.log("Audio autoplay blocked:", e));
  }

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i); 
      i++;
      setTimeout(type, speed);
    } else {
      isTyping = false;
      
      // --- STOP SOUND INSTANTLY WHEN DONE ---
      typingAudio.pause();
    }
  }
  type();
}

// animation.js
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('fade-overlay');
    if (overlay) {
        // Use a small delay so the browser definitely renders the black first
        setTimeout(() => {
            // Simply remove the class to trigger the CSS transition
            overlay.classList.remove('is-active');
            // Also clear manual styles if any were applied
            overlay.style.opacity = "0"; 
            overlay.style.pointerEvents = "none";
        }, 100);
    }
});

window.onload = () => {
    // Add a tiny delay to ensure the DOM is fully ready
    setTimeout(() => {
        nextStep(); 
    }, 100);
};