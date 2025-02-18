// Core functionality

var undoStack = [];
var redoStack = [];

function getTournamentState() {
    const roundsArr = [16, 8, 4, 2, 1];
    let tournamentState = [];
    for (let r = 0; r < roundsArr.length; r++) {
        let roundMatches = [];
        for (let m = 0; m < roundsArr[r]; m++) {
            let p1Elem = document.getElementById("r" + r + "-m" + m + "-p1");
            let p2Elem = document.getElementById("r" + r + "-m" + m + "-p2");
            let p1Value = (r === 0) ? p1Elem.value : p1Elem.textContent;
            let p2Value = (r === 0) ? p2Elem.value : p2Elem.textContent;
            let p1Winner = p1Elem.classList.contains("winner");
            let p2Winner = p2Elem.classList.contains("winner");
            roundMatches.push({
                p1: { value: p1Value, winner: p1Winner },
                p2: { value: p2Value, winner: p2Winner }
            });
        }
        tournamentState.push(roundMatches);
    }
    let participants = document.getElementById("participants").value;
    return { rounds: tournamentState, participants: participants };
}

function restoreTournamentState(state) {
    const roundsArr = [16, 8, 4, 2, 1];
    let tournamentState = state.rounds || state;
    for (let r = 0; r < roundsArr.length; r++) {
        let roundMatches = tournamentState[r];
        for (let m = 0; m < roundsArr[r]; m++) {
            let matchData = roundMatches[m];
            let p1Elem = document.getElementById("r" + r + "-m" + m + "-p1");
            let p2Elem = document.getElementById("r" + r + "-m" + m + "-p2");
            if (r === 0) {
                p1Elem.value = matchData.p1.value;
                p2Elem.value = matchData.p2.value;
            } else {
                p1Elem.textContent = matchData.p1.value;
                p2Elem.textContent = matchData.p2.value;
            }
            if (matchData.p1.winner) {
                p1Elem.classList.add("winner");
                p2Elem.classList.remove("winner");
            } else if (matchData.p2.winner) {
                p2Elem.classList.add("winner");
                p1Elem.classList.remove("winner");
            } else {
                p1Elem.classList.remove("winner");
                p2Elem.classList.remove("winner");
            }
            // Re-enable buttons for the match.
            let btn = document.getElementById("r" + r + "-m" + m + "-btn");
            if (btn) btn.disabled = false;
            let btnP1 = document.getElementById("r" + r + "-m" + m + "-btn-p1");
            if (btnP1) btnP1.disabled = false;
            let btnP2 = document.getElementById("r" + r + "-m" + m + "-btn-p2");
            if (btnP2) btnP2.disabled = false;
        }
    }
    if (state.participants !== undefined) {
        document.getElementById("participants").value = state.participants;
    }
}

function pushStateToUndoStack() {
    undoStack.push(getTournamentState());
    // Clear the redo stack for new actions.
    redoStack = [];
}

function simulateMatch(round, matchIndex, selectedButton) {
    pushStateToUndoStack();
    let p1Elem, p2Elem;
    if (round === 0) {
        p1Elem = document.getElementById("r0-m" + matchIndex + "-p1");
        p2Elem = document.getElementById("r0-m" + matchIndex + "-p2");
    } else {
        p1Elem = document.getElementById("r" + round + "-m" + matchIndex + "-p1");
        p2Elem = document.getElementById("r" + round + "-m" + matchIndex + "-p2");
    }

    let player1 = (round === 0) ? p1Elem.value.trim() : p1Elem.textContent.trim();
    let player2 = (round === 0) ? p2Elem.value.trim() : p2Elem.textContent.trim();

    if (!player1 && !player2) {
        alert("Both players are empty in this match!");
        return;
    }

    let winner = "";
    if (selectedButton === "p1") {
        if (!player1) {
            alert("Player 1 is empty. Cannot select an empty player.");
            return;
        }
        winner = player1;
    } else if (selectedButton === "p2") {
        if (!player2) {
            alert("Player 2 is empty. Cannot select an empty player.");
            return;
        }
        winner = player2;
    } else {
        if (player1 && !player2) {
            winner = player1;
        } else if (!player1 && player2) {
            winner = player2;
        } else {
            winner = (Math.random() < 0.5 ? player1 : player2);
        }
    }

    if (winner === player1) {
        p1Elem.classList.add("winner");
        p2Elem.classList.remove("winner");
    } else {
        p2Elem.classList.add("winner");
        p1Elem.classList.remove("winner");
    }

    document.getElementById("r" + round + "-m" + matchIndex + "-btn").disabled = true;
    let btnP1 = document.getElementById("r" + round + "-m" + matchIndex + "-btn-p1");
    let btnP2 = document.getElementById("r" + round + "-m" + matchIndex + "-btn-p2");
    if (btnP1) btnP1.disabled = true;
    if (btnP2) btnP2.disabled = true;

    let nextRound = round + 1;
    if (nextRound < 5) { // There are 5 rounds (0 through 4)
        let nextMatchIndex = Math.floor(matchIndex / 2);
        let nextSlot = (matchIndex % 2 === 0) ? "p1" : "p2";
        let nextElem = document.getElementById("r" + nextRound + "-m" + nextMatchIndex + "-" + nextSlot);
        if (nextElem) {
            nextElem.textContent = winner;
        }
    } else {
        alert("Champion: " + winner + "!");
    }
}

function saveTournament() {
    let state = getTournamentState();
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tournament.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Tournament saved to file.");
}

function loadTournament() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                const state = JSON.parse(content);
                restoreTournamentState(state);
                alert("Tournament loaded from file.");
            } catch (error) {
                console.error("Error loading file:", error);
                alert("Failed to load tournament.");
            }
        };
        reader.readAsText(file);
    });
    input.click();
}

function undoTournament() {
    if (undoStack.length > 0) {
        redoStack.push(getTournamentState());
        let prevState = undoStack.pop();
        restoreTournamentState(prevState);
    } else {
        alert("No more actions to undo.");
    }
}

function redoTournament() {
    if (redoStack.length > 0) {
        undoStack.push(getTournamentState());
        let nextState = redoStack.pop();
        restoreTournamentState(nextState);
    } else {
        alert("No more actions to redo.");
    }
}