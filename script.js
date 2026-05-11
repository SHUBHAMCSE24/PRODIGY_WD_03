const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const restartBtn = document.querySelector(".restartBtn");

const popup = document.querySelector(".popup");
const winnerText = document.getElementById("winnerText");
const closePopup = document.getElementById("closePopup");

const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");

let aiMode = false;

twoPlayerBtn.classList.add("active-mode");

let currentPlayer = "X";
let gameRunning = true;

let xScore = 0;
let oScore = 0;

let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", cellClicked);
});

restartBtn.addEventListener("click", restartGame);
closePopup.addEventListener("click", restartGame);

twoPlayerBtn.addEventListener("click", () => {

    aiMode = false;

    twoPlayerBtn.classList.add("active-mode");
    aiBtn.classList.remove("active-mode");

    restartGame();
});

aiBtn.addEventListener("click", () => {

    aiMode = true;

    aiBtn.classList.add("active-mode");
    twoPlayerBtn.classList.remove("active-mode");

    restartGame();
});

function cellClicked(){

    const cellIndex = this.getAttribute("data-index");

    if(gameState[cellIndex] !== "" || !gameRunning){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
    if(gameRunning && aiMode && currentPlayer === "O"){
        aiMove();
    }
}

function updateCell(cell, index){

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWinner(){

    let roundWon = false;
    let winningCombo = [];

    for(let i = 0; i < winningConditions.length; i++){

        const condition = winningConditions[i];

        const a = gameState[condition[0]];
        const b = gameState[condition[1]];
        const c = gameState[condition[2]];

        if(a === "" || b === "" || c === ""){
            continue;
        }

        if(a === b && b === c){

            roundWon = true;
            winningCombo = condition;
            break;
        }
    }

    if(roundWon){

        winningCombo.forEach(index => {
            cells[index].classList.add("winning-cell");
        });

        statusText.textContent = `Player ${currentPlayer} Wins!`;

        showPopup(`Player ${currentPlayer} Wins!`);

        if(currentPlayer === "X"){
            xScore++;
            xScoreText.textContent = xScore;
        }else{
            oScore++;
            oScoreText.textContent = oScore;
        }

        confetti({
            particleCount: 200,
            spread: 100
        });

        gameRunning = false;
        return;
    }

    if(!gameState.includes("")){
        statusText.textContent = "Game Draw!";
        showPopup("Game Draw!");
        gameRunning = false;
        return;
    }

    changePlayer();

}

function aiMove(){

    if(!gameRunning){
        return;
    }

    let emptyCells = [];

    gameState.forEach((cell, index) => {

        if(cell === ""){
            emptyCells.push(index);
        }
    });

    if(emptyCells.length === 0){
        return;
    }

    const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    gameRunning = false;

    setTimeout(() => {

        gameState[randomIndex] = "O";
        cells[randomIndex].textContent = "O";

        currentPlayer = "O";

        gameRunning = true;

        checkWinner();

    }, 500);
}

function showPopup(message){

    popup.classList.remove("hidden");
    winnerText.textContent = message;
}

function restartGame(){

    currentPlayer = "X";
    gameRunning = true;

    gameState = ["", "", "", "", "", "", "", "", ""];

    statusText.textContent = `Player ${currentPlayer}'s Turn`;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell");
    });

    popup.classList.add("hidden");
}