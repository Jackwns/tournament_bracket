// UI and DOM manipulation

document.addEventListener("DOMContentLoaded", function() {
    // Create two container columns
    const round1Container = document.createElement("div");
    round1Container.className = "column";
    const restContainer = document.createElement("div");
    restContainer.className = "column";

    const bracketDiv = document.getElementById("bracketDiv");
    bracketDiv.innerHTML = "";
    bracketDiv.appendChild(round1Container);
    bracketDiv.appendChild(restContainer);

    const rounds = [16, 8, 4, 2, 1];
    // Loop through each round.
    for (let r = 0; r < rounds.length; r++) {
        const roundDiv = document.createElement("div");
        roundDiv.className = "round";
        const roundTitle = document.createElement("h2");
        roundTitle.textContent = "Round " + (r + 1);
        roundDiv.appendChild(roundTitle);
        // Create each match in the round.
        for (let m = 0; m < rounds[r]; m++) {
            const matchDiv = document.createElement("div");
            matchDiv.className = "match";
            if (r === 0) {
                const input1 = document.createElement("input");
                input1.type = "text";
                input1.placeholder = "Player 1";
                input1.id = "r" + r + "-m" + m + "-p1";
                const input2 = document.createElement("input");
                input2.type = "text";
                input2.placeholder = "Player 2";
                input2.id = "r" + r + "-m" + m + "-p2";
                matchDiv.appendChild(input1);
                matchDiv.appendChild(input2);
            } else {
                const player1 = document.createElement("span");
                player1.className = "player";
                player1.id = "r" + r + "-m" + m + "-p1";
                player1.textContent = "";
                const player2 = document.createElement("span");
                player2.className = "player";
                player2.id = "r" + r + "-m" + m + "-p2";
                player2.textContent = "";
                matchDiv.appendChild(player1);
                matchDiv.appendChild(player2);
            }

            // Buttons for match simulation.
            const btnRandom = document.createElement("button");
            btnRandom.textContent = "Random Winner";
            btnRandom.id = "r" + r + "-m" + m + "-btn";
            btnRandom.addEventListener("click", function () {
                simulateMatch(r, m);
            });
            matchDiv.appendChild(btnRandom);

            const btnSelectP1 = document.createElement("button");
            btnSelectP1.textContent = "Select P1";
            btnSelectP1.id = "r" + r + "-m" + m + "-btn-p1";
            btnSelectP1.addEventListener("click", function () {
                simulateMatch(r, m, "p1");
            });
            matchDiv.appendChild(btnSelectP1);

            const btnSelectP2 = document.createElement("button");
            btnSelectP2.textContent = "Select P2";
            btnSelectP2.id = "r" + r + "-m" + m + "-btn-p2";
            btnSelectP2.addEventListener("click", function () {
                simulateMatch(r, m, "p2");
            });
            matchDiv.appendChild(btnSelectP2);

            roundDiv.appendChild(matchDiv);
        }
        // Append round div to the proper container.
        if (r === 0) {
            round1Container.appendChild(roundDiv);
        } else {
            roundDiv.classList.add("vertical");
            restContainer.appendChild(roundDiv);
        }
    }

    // Attach event listeners for additional UI controls.
    document.getElementById("randomizeBtn").addEventListener("click", function () {
        const participantsString = document.getElementById("participants").value;
        let participants = participantsString.split(",").map(name => name.trim()).filter(name => name);
        if (participants.length !== 32) {
            alert("Please enter exactly 32 participant names.");
            return;
        }
        participants.sort(() => Math.random() - 0.5);
        for (let m = 0; m < 16; m++) {
            document.getElementById("r0-m" + m + "-p1").value = participants[m * 2];
            document.getElementById("r0-m" + m + "-p2").value = participants[m * 2 + 1];
        }
    });

    document.getElementById("saveBtn").addEventListener("click", saveTournament);
    document.getElementById("loadBtn").addEventListener("click", loadTournament);

    document.getElementById("undoBtn").addEventListener("click", undoTournament);
    document.getElementById("redoBtn").addEventListener("click", redoTournament);

    document.getElementById("darkModeBtn").addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        document.querySelector(".header").classList.toggle("dark-mode");
        document.querySelectorAll(".round").forEach(function(round) {
            round.classList.toggle("dark-mode");
            round.querySelector("h2").classList.toggle("dark-mode");
        });
        document.querySelectorAll(".match").forEach(function(match) {
            match.classList.toggle("dark-mode");
            match.querySelectorAll("input[type='text']").forEach(function(input) {
                input.classList.toggle("dark-mode");
            });
        });
        // Toggle dark-mode for all buttons except the dark mode button itself.
        document.querySelectorAll(".btn:not(#darkModeBtn)").forEach(function(btn) {
            btn.classList.toggle("dark-mode");
        });
        // Update dark mode button icon and text.
        const textSpan = this.querySelector(".text");
        const iconSpan = this.querySelector(".icon");
        if (textSpan) {
            textSpan.textContent = document.body.classList.contains("dark-mode") ? " Light Mode" : " Dark Mode";
        }
        if (iconSpan) {
            iconSpan.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        }
    });

    console.log("Bracket generated");
});