let reversos = ["gray_back", "red_back"];


// Cartas reversos
for (let j = 0; j < reversos.length; j++) {
    carta = reversos[j];
    barajaCartasArray.push(carta);
};


// Barajar las cartas  con Algoritmo de Fisher Yates
function shuffle(barajaCartasArray) {
    for (let i = barajaCartasArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [barajaCartasArray[i], barajaCartasArray[j]] = [barajaCartasArray[j], barajaCartasArray[i]];
    }
    return barajaCartasArray;
}