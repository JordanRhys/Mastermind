// Default Settings
var colArr = ['White', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'];
var colorMode = "Multi"; //If Multi target array can contain duplicates
var numGuesses = 12; //Max number of guesses
var numColors = 4; //Number of colours to guess

// HTML Locators
var currGuessArea = document.getElementById("currentguessframe");
var guessArea = document.getElementById("guessframe");
var gameOver = document.getElementById("gameover");
var winScreen = document.getElementById("winscreen");
var remGuesses = document.getElementById("remguesses");
var winCode = document.getElementById("wincode");
var lostCode = document.getElementById("lostcode");

/* Breakdown
Generate a colour pattern at random
Ask player to guess pattern
Compare guess to target pattern
Return match info to player
Repeat until guessed correctly or X turns pass
*/

//Start Game
var target = [];
var guessArr = [];
var currGuess = [];
var currMatch = [];
var matchArr = [];
var guessNum = 0;
var gamesWon = 0;
var gamesLost = 0;

//Tells the game to start, and resets all variables
function play() {

    //Hide all Overlays
    intro.style.opacity = "0";
    intro.style.pointerEvents = "none"
    gameOver.style.opacity = "0";
    gameOver.style.pointerEvents = "none";
    winScreen.style.opacity = "0";
    winScreen.style.pointerEvents = "none";

    //Reset all variables
    currGuessArea.innerHTML = "";
    guessArea.innerHTML = "";
    lostCode.innerHTML = "";
    winCode.innerHTML = "";
    colArr = ['White', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'];
    target = [];
    guessArr = [];
    currGuess = [];
    currMatch = [];
    matchArr = [];
    guessNum = 0;
    remGuesses.innerText = (numGuesses - guessNum);
    generateTarget();
}

//Generate hidden code
function generateTarget() {
    //If Multi, allows Multiple of same colour
    if (colorMode == "Multi") {
        //Generate number between 0 and 7, used to select from colArr
        for (let i = 0; i < numColors; i++) {
            target.push(colArr[(Math.floor(Math.random() * colArr.length))]);         
        }
    } else {
        //Generate number between 0 and 7, used to select from colArr
        for (let i = 0; i < numColors; i++) {
            let splicedColor = "";
            splicedColor = colArr.splice((Math.floor(Math.random() * colArr.length)), 1);
            target.push(splicedColor[0]);
        }
    }
}

//Adds a colour to the current guess list
function insertColour(pin) {
    if (currGuess.length < numColors) {
    currGuess.push(pin);
    updateCurrGuess(); //Update Visuals
    }
    //When enough pins are selected, compare against code
    if (currGuess.length == numColors) {
        compareGuess();
    }
}

//Removes a colour from the current guess list
function deleteColour() {
    if (currGuess.length > 0) {
        currGuess.pop();
        updateCurrGuess(); //Update Visuals
    }
}

//Updates the visuals for current guess
function updateCurrGuess() {
    //Create "Your Guess:" text next to guess
    currGuessArea.innerHTML = "";
    text = document.createElement("p");
    text.innerText = "Your Guess: ";
    text.className = "yourguess";
    currGuessArea.appendChild(text);

    //Display selected pins
    currGuess.forEach(function(item) {
        guess = document.createElement("div");
        guess.className = "colourbutton colourbutton--" + item.toLowerCase();
        currGuessArea.appendChild(guess);
    })
}


// Compare for direct matches
function compareGuess() {

    //Create Match Array used to total matched pins
    currMatch = [];
    for (let i = 0; i < numColors; i++) {
        //First digit is used for storing Match Data, and second digit
        //marks the individual pin as matched.
        currMatch.push([0,0]);
    }

    //Add currGuess to guessArr, keeps info stored for previous rounds
    //Resets currGuess to blank so it can be reused
    guessArr.push(currGuess);
    currGuess = [];

    updateCurrGuess(); //Updates Visuals

    //Check for exact matches
    for (let i = 0; i < numColors; i++) {
        if (target[i] == guessArr[guessNum][i]) {
            currMatch[i] = [2,"x"];
        }
    }

    //Check for colour matches
    for (let i = 0; i < numColors; i++) {
        for (let j = 0; j < numColors; j++) {
            if ((target[i] == guessArr[guessNum][j]) && (currMatch[j][1] == 0) && (currMatch[i][0] == 0)) {
                currMatch[i][0] = 1;
                currMatch[j][1] = "x";
            }
        }
    }
    //Store current match infor in Matches Array
    matchArr.push(currMatch);

    //Display list of guesses
    updateGuesses();

    //Move onto next turn
    guessNum++;

    //Update remaining guesses
    remGuesses.innerText = numGuesses - guessNum;

    //If out of turns end game
    if (guessNum == numGuesses) {
        //Display correct code
        target.forEach(function(item) {
            pin = document.createElement("div");
            pin.className = "colourbutton colourbutton--" + item.toLowerCase();
            lostCode.appendChild(pin);
        });
        gameOver.style.opacity = "1";
        gameOver.style.pointerEvents = "all";
        guessNum = 0;
        gamesLost++;
    }
}

//Updates the visuals for previous guesses
function updateGuesses() {
    for (let i = 0; i < guessArr.length; i++) {
        if(i == guessNum) {
            guess = document.createElement("div");
            guess.className = "guessholder guessholder--" + i;
            guessArea.appendChild(guess);
            //Create Div for each pin
            guessArr[i].forEach(function(item) {
            pin = document.createElement("div");
            pin.className = "colourbutton colourbutton--" + item.toLowerCase();
            document.getElementsByClassName("guessholder--" + i)[0].appendChild(pin);
        });

        //Count Matches
        let oneCount = 0;
        let twoCount = 0;
        for (let i = 0; i < numColors; i++) {
            if (matchArr[guessNum][i][0] == 1) {
                oneCount += 1;
            } else if (matchArr[guessNum][i][0] == 2) {
                twoCount += 1;
            }
        }
        
        //If correctly guessed, display win screen
        if (twoCount == numColors) {
            //Display winning code
            target.forEach(function(item) {
                pin = document.createElement("div");
                pin.className = "colourbutton colourbutton--" + item.toLowerCase();
                winCode.appendChild(pin);
            });
            winScreen.style.opacity = "1";
            winScreen.style.pointerEvents = "all";
            gamesWon++;
            guessNum = 0;
            break;
        }
        //Create holder for match info
        matchholder = document.createElement("div");
        matchholder.className = "matchholder matchholder--" + i;
        document.getElementsByClassName("guessholder--" + i)[0].appendChild(matchholder);
        
        //Display matches
        onematch = document.createElement("p");
        onematch.className = "match onematch onematch--" + i;
        onematch.innerText = oneCount + " Colour Match(es)"
        document.getElementsByClassName("matchholder--" + i)[0].appendChild(onematch);
        twomatch = document.createElement("p");
        twomatch.className = "match twomatch twomatch--" + i;
        twomatch.innerText = twoCount + " Exact Match(es)"
        document.getElementsByClassName("matchholder--" + i)[0].appendChild(twomatch);
        }        
    }
}

//Used to change length of code
function changeDifficulty(value) {
    numColors = value;
    play();
}

//Used to change number of turns
function changeTurns(value) {
    numGuesses = value;
    play();
}

//Used to change if Multiples are allowed
function changeMultiples(value) {
    colorMode = value;
    play();
}