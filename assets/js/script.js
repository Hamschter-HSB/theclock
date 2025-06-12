const clockCanvas = document.getElementById('clockCanvas');
const clockContext = clockCanvas.getContext('2d');

clockContext.strokeStyle = "black";

let clockCanvasWidth = clockCanvas.width;
let clockCanvasHeight = clockCanvas.height;

const timeDisplay = document.getElementById("timeDisplay");

const secondsCircleRadius = clockCanvasHeight / 2;
const minutesCircleRadius = clockCanvasHeight / 3.5;
const hoursCircleRadius = clockCanvasHeight / 8;

let secondsSound, minutesSound, hoursSound;

let soundMuted = false;
let intervalId = null;

// Uhr passt sich an Fenstergröße an
function resizeCanvasToFullScreen() {
    const dpr = window.devicePixelRatio || 1;

    const width = window.innerWidth;
    const height = window.innerHeight;

    clockCanvas.width = width * dpr;
    clockCanvas.height = height * dpr;

    clockCanvas.style.width = width + "px";
    clockCanvas.style.height = height + "px";

    clockContext.setTransform(dpr, 0, 0, dpr, 0, 0);

    clockCanvasWidth = clockCanvas.width;
    clockCanvasHeight = clockCanvas.height;
}

function clearCanvas(bg = "black") {
    clockContext.fillStyle = bg;
    clockContext.fillRect(0, 0, clockCanvas.width, clockCanvas.height);
}

function drawSeconds(currentDate) {
    const currentAmountOfSeconds = currentDate.getSeconds();
    const degreeForSpacingBlobs = (2 * Math.PI) / currentAmountOfSeconds;

    clockContext.fillStyle = "white";

    for (let i = 1; i <= currentAmountOfSeconds; i++) {
        const secondX = (secondsCircleRadius * Math.cos((Math.PI / 2) + (degreeForSpacingBlobs * i))) + (clockCanvasWidth / 2);
        const secondY = -(secondsCircleRadius * Math.sin((Math.PI / 2) + (degreeForSpacingBlobs * i))) + (clockCanvasHeight / 2);

        clockContext.beginPath();
        clockContext.arc(secondX, secondY, 5, 0, 2 * Math.PI, true);
        clockContext.fill();
        clockContext.closePath();
    }
}

function drawMinutes(currentDate) {
    const currentAmountOfMinutes = currentDate.getMinutes();
    const degreeForSpacingBlobs = (2 * Math.PI) / currentAmountOfMinutes;

    clockContext.fillStyle = "white";

    for (let i = 1; i <= currentAmountOfMinutes; i++) {
        const minuteX = (minutesCircleRadius * Math.cos((Math.PI / 2) + (degreeForSpacingBlobs * i))) + (clockCanvasWidth / 2);
        const minuteY = -(minutesCircleRadius * Math.sin((Math.PI / 2) + (degreeForSpacingBlobs * i))) + (clockCanvasHeight / 2);

        clockContext.beginPath();
        clockContext.arc(minuteX, minuteY, 5, 0, 2 * Math.PI, true);
        clockContext.fill();
        clockContext.closePath();
    }
}

function drawHours(currentDate) {
    const currentAmountOfHours = currentDate.getHours();
    const degreeForSpacingBlobs = (2 * Math.PI) / currentAmountOfHours;

    clockContext.fillStyle = "white";

    for (let i = 1; i <= currentAmountOfHours; i++) {
        const hourX = (hoursCircleRadius * Math.cos((Math.PI / 2) + (degreeForSpacingBlobs * i))) + (clockCanvasWidth / 2);
        const hourY = -(hoursCircleRadius * Math.sin((Math.PI / 2) + (degreeForSpacingBlobs * i))) + (clockCanvasHeight / 2);

        clockContext.beginPath();
        clockContext.arc(hourX, hourY, 5, 0, 2 * Math.PI, true);
        clockContext.fill();
        clockContext.closePath();
    }
}

function drawCircles() {
    clockContext.beginPath();
    clockContext.arc((clockCanvasWidth / 2), (clockCanvasHeight / 2), secondsCircleRadius, 0, 2 * Math.PI, true);
    clockContext.stroke();
    clockContext.closePath();

    clockContext.beginPath();
    clockContext.arc((clockCanvasWidth / 2), (clockCanvasHeight / 2), minutesCircleRadius, 0, 2 * Math.PI, true);
    clockContext.stroke();
    clockContext.closePath();

    clockContext.beginPath();
    clockContext.arc((clockCanvasWidth / 2), (clockCanvasHeight / 2), hoursCircleRadius, 0, 2 * Math.PI, true);
    clockContext.stroke();
    clockContext.closePath();
}

function clockLoop() {
    const currentDate = new Date();

    clearCanvas();
    drawCircles();
    drawSeconds(currentDate);
    drawMinutes(currentDate);
    drawHours(currentDate);

    if (!soundMuted && secondsSound && minutesSound && hoursSound) {
        if (currentDate.getSeconds() !== 0) {
            secondsSound.currentTime = 0;
            secondsSound.play();
        } else if (currentDate.getMinutes() !== 0) {
            minutesSound.currentTime = 0;
            minutesSound.play();
        } else {
            hoursSound.currentTime = 0;
            hoursSound.play();
        }
    }

    timeDisplay.innerHTML = "Es ist " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + " Uhr.";
}

window.addEventListener("resize", resizeCanvasToFullScreen);

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        resizeCanvasToFullScreen();

        // Audio erst bei Enter initialisieren
        if (!secondsSound) {
            secondsSound = new Audio('assets/sound/secondsSound.mp3');
            minutesSound = new Audio('assets/sound/minutesSound.mp3');
            hoursSound = new Audio('assets/sound/hoursSound.mp3');
        }

        clockLoop();
        if (intervalId === null) {
            intervalId = setInterval(clockLoop, 1000);
        }
    }

    if (event.key === "w") {
        clockContext.strokeStyle = "white";
    }
    if (event.key === "b") {
        clockContext.strokeStyle = "black";
    }
    if (event.key === "g") {
        clockContext.strokeStyle = "grey";
    }
    if (event.key === "Shift") {
        timeDisplay.style.visibility =
            timeDisplay.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }
    if (event.key === "m") {
        soundMuted = !soundMuted;
        console.log("Sound: " + (soundMuted ? "aus" : "an"));
    }
});
