var matrice
var matricePlayer
var game
var nBombes
let startTime = 0
let time = 0
let timerInterval
let affichage = document.getElementById("affichage")
var dejaAfficher = false
let classementList = [];

function forWinner() {
    const nom = prompt("Veuillez entrer votre nom :");
    const classement = document.getElementById('classement');

    classementList.push({ nom: nom, temps: time });

    classementList.sort((a, b) => a.temps - b.temps);

    classement.innerHTML = '';

    classementList.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.nom} - ⏱️${entry.temps} secondes`;
        classement.appendChild(li);
    });
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

function setRandomBombe(cote, nBombes) {
    for (let i = 0; i < nBombes; i++) {
        let x, y
        do {
            x = getRandomInt(cote)
            y = getRandomInt(cote)
        } while (matrice[x][y] === -1)
        
        matrice[x][y] = -1;  
    }
}

function caseIsValid(x, y) {
    return x >= 0 && x < matrice.length && y >= 0 && y < matrice[0].length
}

function caseIsBombe(x, y) {
    return matrice[x][y] === -1
}

function caseAutour(x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const x2 = x + i
            const y2 = y + j
            if (caseIsValid(x2, y2)) {
                if (caseIsBombe(x2, y2)) {
                    matrice[x][y] += 1
                }
            }
        } 
    }
}

function nombreur2000() {
    for (let x = 0; x < matrice.length; x++) {
        for (let y = 0; y < matrice[x].length; y++) {
            if (!caseIsBombe(x, y)) {
                caseAutour(x, y)
            }
        } 
    }
}

function propagation(x, y) {
    if (caseIsValid(x, y)) {

        if (matricePlayer[x][y] !== "n") {
            return;
        }

        if (matrice[x][y] === 0) {
            matricePlayer[x][y] = "0";
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i !== 0 || j !== 0) { 
                        const x2 = x + i;
                        const y2 = y + j;
                        propagation(x2, y2);
                    }
                }
            }
        } else {
            matricePlayer[x][y] = "a"
        }
    }
}


function gameover() {
    game = false
    clearInterval(timerInterval)
    alert('perdu !!Vous avez touché une bombe')
}

function isWin() {
    let drapeauxCorrects = 0
    let casesNonRevelees = 0

    for (let x = 0; x < matrice.length; x++) {
        for (let y = 0; y < matrice[x].length; y++) {
            if (matricePlayer[x][y] === "d") {
                drapeauxCorrects++
            }
            if (matricePlayer[x][y] === "n") {
                casesNonRevelees++
            }
        }
    }

    if (drapeauxCorrects === nBombes && casesNonRevelees <= nBombes) {
        alert("Félicitations, vous avez gagné !")
        game = false
        clearInterval(timerInterval)
        forWinner()
    }
}


function clickPlayer(x, y) {
    if (matricePlayer[x][y] == "d") {
        console.log("un drapeau a été placer ici")
    } else if (matrice[x][y] == -1) {
        gameover()
    } else {
        propagation(x, y)
        mettreAJourGrille()
    }
}

function afficherGrille() {

    const container = document.getElementById('container')
    container.innerHTML = '';
    const grille = document.createElement('div')
    container.appendChild(grille)

    for (let x = 0; x < matrice.length; x++) {
        const row = document.createElement("div")
        row.style.display = "flex"

        for (let y = 0; y < matrice[x].length; y++) {
            const cell = document.createElement("div")
            cell.className = "cell"
            cell.dataset.x = x
            cell.dataset.y = y

            cell.addEventListener("click", () => {
                if (game) {   
                    clickPlayer(x, y)
                    mettreAJourGrille()
                    isWin()
                }
            });
            
            cell.addEventListener("contextmenu", function(event) {
                if (game) {            
                    event.preventDefault()
                    if (matricePlayer[x][y] == "d") {
                        matricePlayer[x][y] = "n"
                    } else {
                        matricePlayer[x][y] = "d"
                    }
                    mettreAJourGrille()
                    isWin()
                }
            })

            row.appendChild(cell)
        }
        grille.appendChild(row)
    }
}

function mettreAJourGrille() {
    if (!game) {
        renovation()
    }
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x, 10);
        const y = parseInt(cell.dataset.y, 10);
        const valeur = matricePlayer[x][y];

        if (valeur === "0") {
            cell.style.backgroundColor = "#eee"
            cell.textContent = ""
        } else if (valeur === "a") {
            cell.style.backgroundColor = "#ddd"
            cell.textContent = matrice[x][y];
        } else if (valeur === -1) {
            game = false
            clearInterval(timerInterval)
        } else if (valeur === "d") {
            cell.textContent = "🚩"
        } else if (valeur === "n") {
            cell.textContent = ""
        } else if (valeur === "b") {
            cell.textContent = "💣"
        }
    })
}

function renovation() {
    for (let x = 0; x < matrice.length; x++) {
        for (let y = 0; y < matrice[x].length; y++) {
            if (matrice[x][y] === 0) {
                matricePlayer[x][y] = "0";
            } else if (matrice[x][y] === -1) {
                matricePlayer[x][y] = "b";
            } else {
                matricePlayer[x][y] = "a";
            }
        }
    }
}

function updateDisplay() {
    document.getElementById('affichage').textContent = time;
}


function start() {
    const select = document.getElementById("difficulte");
    let selectedOption = null;

    for (const option of select.options) {
        if (option.selected) {
            if (selectedOption) {
                alert("Veuillez ne choisir qu'une seule option.");
                return;
            }
            selectedOption = option.text;
        }
    }

    if (!selectedOption) {
        alert("Veuillez choisir une difficulté.");
        return
    }

    const match = selectedOption.match(/(\d+)x\d+ cases, (\d+) bombes/)
    const cote = parseInt(match[1], 10)
    nBombes = parseInt(match[2], 10)

    matrice = Array.from({ length: cote }, () => 
        Array.from({ length: cote }, () => 0)
    );

    matricePlayer = Array.from({ length: cote }, () => 
        Array.from({ length: cote }, () => "n")
    );

    setRandomBombe(cote, nBombes)

    nombreur2000()

    afficherGrille()
    
    game = true
    startTime = Date.now()
    timerInterval = setInterval(() => {
        time = Math.round((Date.now() - startTime) / 1000)
        updateDisplay()
    }, 1000)

    mettreAJourGrille()
    return matrice
}
