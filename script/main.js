console.log("main.js is running!");

let selectedBall1 = null;
let selectedBall2 = null;

function createBalls(containerId, probabilities) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error("Container not found:", containerId);
        return;
    }

    // Clear previous balls
    container.innerHTML = "";

    probabilities.forEach((probability, index) => {
        const ballGroup = document.createElement("div");
        ballGroup.className = "ball-group";

        const ball = document.createElement("div");
        ball.className = "ball";
        ball.textContent = index + 1;
        ball.style.cursor = "pointer";
        
        if (containerId === "ball1-probabilities") {

        ball.addEventListener("click", function () {
        selectBall(index + 1, "ball1");
             });
        }

        if (containerId === "ball2-probabilities") {

        ball.addEventListener("click", function () {
        selectBall(index + 1, "ball2");
            });
        }

        const probabilityText = document.createElement("div");
        probabilityText.className = "probability";
        probabilityText.textContent =
            (probability * 100).toFixed(2) + "%";

        ballGroup.appendChild(ball);
        ballGroup.appendChild(probabilityText);

        container.appendChild(ballGroup);
    });
}
function displayTop5(containerId, probabilities) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error("Top 5 container not found:", containerId);
        return;
    }

    const results = probabilities.map((probability, index) => {
        return {
            number: index + 1,
            probability: probability
        };
    });

    // Highest probability first
    results.sort((a, b) => b.probability - a.probability);

    // Top 5 only
    const top5 = results.slice(0, 5);

    // Clear previous results
    container.innerHTML = "";

    top5.forEach((item) => {

        const ballGroup = document.createElement("div");
        ballGroup.className = "top5-ball-group";

        const ball = document.createElement("div");

        // Give Ball 1 and Ball 2 different classes
        if (containerId === "top5-ball1") {
            ball.className = "top5-yellow-ball";
        } else {
            ball.className = "top5-green-ball";
        }

        ball.textContent = item.number;

        const probability = document.createElement("div");
        probability.className = "top5-probability";

        probability.textContent =
            (item.probability * 100).toFixed(2) + "%";

        ballGroup.appendChild(ball);
        ballGroup.appendChild(probability);

        container.appendChild(ballGroup);
    });
}

function calculatePairProbability(ball1Number, ball2Number, ball1Data, ball2Data) {

    // Array index is number - 1
    const ball1Probability =
        ball1Data[ball1Number - 1];

    const ball2Probability =
        ball2Data[ball2Number - 1];

    // Straight: Ball 1 → Ball 2
    const straight1 =
        ball1Probability * ball2Probability;


    // Reverse: Ball 2 → Ball 1
    const reverseBall1Probability =
        ball1Data[ball2Number - 1];

    const reverseBall2Probability =
        ball2Data[ball1Number - 1];

    const straight2 =
        reverseBall1Probability *
        reverseBall2Probability;


    // Rambol = both possible orders
    const rambol =
        straight1 + straight2;


    return {
        straight1: straight1,
        straight2: straight2,
        rambol: rambol
    };
}

function selectBall(ballNumber, ballType) {

    // Remove previous selection of the same type
    if (ballType === "ball1") {

        document
            .querySelectorAll("#ball1-probabilities .ball")
            .forEach(ball => {
                ball.classList.remove("selected-ball1");
            });

        selectedBall1 = ballNumber;
    }


    if (ballType === "ball2") {

        document
            .querySelectorAll("#ball2-probabilities .ball")
            .forEach(ball => {
                ball.classList.remove("selected-ball2");
            });

        selectedBall2 = ballNumber;
    }


    // Highlight the newly selected ball
    if (ballType === "ball1") {

        const balls =
            document.querySelectorAll(
                "#ball1-probabilities .ball"
            );

        const selected =
            balls[ballNumber - 1];

        if (selected) {
            selected.classList.add("selected-ball1");
        }
    }


    if (ballType === "ball2") {

        const balls =
            document.querySelectorAll(
                "#ball2-probabilities .ball"
            );

        const selected =
            balls[ballNumber - 1];

        if (selected) {
            selected.classList.add("selected-ball2");
        }
    }


    // Update selected number display
    updateSelectedDisplay();


    // Calculate if both are selected
    if (
        selectedBall1 !== null &&
        selectedBall2 !== null
    ) {
        updatePairProbability();
    }
}


function updateProbabilities() {
    const datePicker = document.getElementById("datePicker");
    const timePicker = document.getElementById("timePicker");

    if (!datePicker || !timePicker) {
        console.error("Date picker or time picker not found.");
        return;
    }

    const selectedDate = datePicker.value;
    const selectedTime = timePicker.value;

    if (!selectedDate || !selectedTime) {
        console.error("Date or time is empty.");
        return;
    }

    // Convert selected date
    const date = new Date(selectedDate + "T00:00:00");

    // Get day of week
    const dayOfWeek = date.toLocaleDateString("en-US", {
        weekday: "long"
    });

    console.log("Selected date:", selectedDate);
    console.log("Day:", dayOfWeek);
    console.log("Time:", selectedTime);

    // Get probability data for the weekday
    const dayData = probabilityData[dayOfWeek];

    if (!dayData) {
        console.error("No probability data found for:", dayOfWeek);
        return;
    }

    // Get probability data for selected time
    const data = dayData[selectedTime];

    selectedBall1 = null;
    selectedBall2 = null;

    updateSelectedDisplay();

    document.getElementById("pair-results").innerHTML = `
    <p>Select one Ball 1 and one Ball 2.</p>
    `;

    if (!data) {
        console.error(
            "No probability data found for:",
            dayOfWeek,
            selectedTime
        );
        return;
    }

    // Format date for display
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    // Display selected date and time
    const selectedDraw = document.getElementById("selectedDraw");

    if (selectedDraw) {
        selectedDraw.textContent =
            formattedDate + " - " + selectedTime;
    }

    // Display probabilities
    createBalls(
    "ball1-probabilities",
    data.ball1
);

createBalls(
    "ball2-probabilities",
    data.ball2
);

// Display top 5 probabilities
displayTop5(
    "top5-ball1",
    data.ball1
);

displayTop5(
    "top5-ball2",
    data.ball2
);
}


// Wait until the HTML is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM loaded.");

    const datePicker =
        document.getElementById("datePicker");

    const timePicker =
        document.getElementById("timePicker");


    // Check if elements exist
    if (!datePicker) {
        console.error("datePicker was not found.");
        return;
    }

    if (!timePicker) {
        console.error("timePicker was not found.");
        return;
    }


    // =========================
    // SET DEFAULT DATE
    // =========================

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(today.getDate())
        .padStart(2, "0");


    datePicker.value =
        `${year}-${month}-${day}`;


    // =========================
    // SET DEFAULT TIME = 2 PM
    // =========================

    timePicker.value = "2PM";


    console.log(
        "Default date:",
        datePicker.value
    );

    console.log(
        "Default time:",
        timePicker.value
    );


    // =========================
    // LOAD DEFAULT PROBABILITIES
    // =========================

    updateProbabilities();


    // =========================
    // UPDATE WHEN DATE CHANGES
    // =========================

    datePicker.addEventListener(
        "change",
        updateProbabilities
    );


    // =========================
    // UPDATE WHEN TIME CHANGES
    // =========================

    timePicker.addEventListener(
        "change",
        updateProbabilities
    );

});

function updateSelectedDisplay() {

    const ball1Display =
        document.getElementById("selected-ball1");

    const ball2Display =
        document.getElementById("selected-ball2");


    if (ball1Display) {

        if (selectedBall1 !== null) {
            ball1Display.innerHTML =
                `<strong>Ball 1: ${selectedBall1}</strong>`;
        } else {
            ball1Display.textContent = "None";
        }

    }


    if (ball2Display) {

        if (selectedBall2 !== null) {
            ball2Display.innerHTML =
                `<strong>Ball 2: ${selectedBall2}</strong>`;
        } else {
            ball2Display.textContent = "None";
        }

    }
}

function updatePairProbability() {

    const datePicker =
        document.getElementById("datePicker");

    const timePicker =
        document.getElementById("timePicker");


    if (!datePicker || !timePicker) {
        return;
    }


    const selectedDate =
        datePicker.value;

    const selectedTime =
        timePicker.value;


    if (!selectedDate || !selectedTime) {
        return;
    }


    const date =
        new Date(selectedDate + "T00:00:00");


    const dayOfWeek =
        date.toLocaleDateString("en-US", {
            weekday: "long"
        });


    const dayData =
        probabilityData[dayOfWeek];


    if (!dayData) {
        return;
    }


    const data =
        dayData[selectedTime];


    if (!data) {
        return;
    }


    // Calculate probabilities
    const result =
        calculatePairProbability(
            selectedBall1,
            selectedBall2,
            data.ball1,
            data.ball2
        );


    // =====================================
    // NORMAL / SUPPOSED PROBABILITIES
    // =====================================

    const supposedStraight = 0.104 / 100;

    const supposedRambol = 0.208 / 100;


    // =====================================
    // BETTER ODDS CALCULATION
    // =====================================

    const betterOddsStraight1 =
        (result.straight1 - supposedStraight)
        / supposedStraight;


    const betterOddsStraight2 =
        (result.straight2 - supposedStraight)
        / supposedStraight;


    const betterOddsRambol =
        (result.rambol - supposedRambol)
        / supposedRambol;


    // Convert to percentage
    const straight1Odds =
        betterOddsStraight1 * 100;

    const straight2Odds =
        betterOddsStraight2 * 100;

    const rambolOdds =
        betterOddsRambol * 100;


    // =====================================
    // COLOR
    // =====================================

    const straight1Class =
        straight1Odds >= 0
            ? "positive"
            : "negative";

    const straight2Class =
        straight2Odds >= 0
            ? "positive"
            : "negative";

    const rambolClass =
        rambolOdds >= 0
            ? "positive"
            : "negative";


    // =====================================
    // DISPLAY
    // =====================================

    const pairResults =
        document.getElementById("pair-results");


    if (!pairResults) {
        return;
    }


    pairResults.innerHTML = `

        <h6>
            Selected Combination:
            <strong>
                ${selectedBall1} - ${selectedBall2}
            </strong>
        </h6>


        <!-- STRAIGHT 1 -->

        <div class="probability-result">

            <strong>
                Straight ${selectedBall1}-${selectedBall2}:
            </strong>

            <span>
                ${(result.straight1 * 100).toFixed(4)}%
            </span>

            <span class="better-odds ${straight1Class}">
                (${straight1Odds >= 0 ? "+" : ""}
                ${straight1Odds.toFixed(2)}% better odds)
            </span>

        </div>


        <!-- STRAIGHT 2 -->

        <div class="probability-result">

            <strong>
                Straight ${selectedBall2}-${selectedBall1}:
            </strong>

            <span>
                ${(result.straight2 * 100).toFixed(4)}%
            </span>

            <span class="better-odds ${straight2Class}">
                (${straight2Odds >= 0 ? "+" : ""}
                ${straight2Odds.toFixed(2)}% better odds)
            </span>

        </div>


        <hr>


        <!-- RAMBOL -->

        <div class="probability-result">

            <strong>
                Rambol ${selectedBall1}-${selectedBall2}:
            </strong>

            <span>
                ${(result.rambol * 100).toFixed(4)}%
            </span>

            <span class="better-odds ${rambolClass}">
                (${rambolOdds >= 0 ? "+" : ""}
                ${rambolOdds.toFixed(2)}% better odds)
            </span>

        </div>

    `;
}

