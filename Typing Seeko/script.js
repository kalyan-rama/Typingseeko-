const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".wrapper .input-field"),
    tryAgainBtn = document.querySelector(".content button"),
    timeTag = document.querySelector(".time span b"),
    mistakeTag = document.querySelector(".mistake span"),
    wpmTag = document.querySelector(".wpm span"),
    popup = document.querySelector(".popup"),
    popupText = document.querySelector(".popup-content"),
    cpmTag = document.querySelector(".cpm span");

const url = window.location.pathname;
const fillName = url.split("/").pop();
const level = parseInt(fillName.split('.')[0])

let timer,
    maxTime = 30+level*2,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0;
    timeTag.innerText = maxTime
    
function loadParagraph() {
    typingText.innerHTML = "";
    paragraphs[level-1].split("").forEach(char => {
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function updateStats() {
    let timeSpent = (maxTime - timeLeft) || 1;
    let wpm = Math.round(((charIndex - mistakes) / 5) / timeSpent * 60);
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    wpmTag.innerText = wpm;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];

    if (charIndex < characters.length && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        if (typedChar == null) { 
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }

        characters.forEach(span => span.classList.remove("active"));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add("active");
        } else {
            completeLevel();  // Show popup when typing is complete
        }

        updateStats();
    } else {
        clearInterval(timer);
        inpField.value = "";
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        updateStats();
    } else {
        clearInterval(timer);
        completeLevel(); // Show popup when time runs out
    }
}


function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
}

function completeLevel() {
    clearInterval(timer);
    inpField.value = "";

    let finalWPM = wpmTag.innerText;
    let finalMistakes = mistakeTag.innerText;
    let finalCPM = cpmTag.innerText;

    popupText.innerHTML = `
        <h2>Level ${level} Complete!</h2>
        <p><strong>WPM:</strong> ${finalWPM}</p>
        <p><strong>Mistakes:</strong> ${finalMistakes}</p>
        <p><strong>CPM:</strong> ${finalCPM}</p>
        <button id="Reset">Reset</button>
        <button class="next-level">Next Level</button>
        
    `;

    popup.style.display = "block";
    
    document.querySelector(".next-level").addEventListener("click", () => {
        popup.style.display = "none";
        window.location.href = `./${level+1}.html`; 
    });
    reset = document.getElementById("Reset");
    console.log(reset);
    reset.addEventListener("click", () => {
        popup.style.display = "none";
        resetGame();
    }  );
}

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
