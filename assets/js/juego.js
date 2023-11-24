(() => {
// VARIABLES
    let cartasArray = [];
    let carta = "";
    const palos = ["C", "D", "H", "S"];
    const figuras = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const valores = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1];
    const reversos = ["gray_back", "red_back"];
    const maxPoint = 21;


    const vBtnNuevoJuego = document.getElementById('btnNuevo');
    const vBtnPedirCarta = document.getElementById('btnPedir');
    const vBtnDetener = document.getElementById('btnDetener');
    const vBtnNewScore = document.getElementById('btnNewScore');
    const zonaJugador = document.getElementById('jugador-cartas');
    const zonaCompu = document.getElementById('computadora-cartas');
    const zonaBTNS = document.getElementById('divBotones');
    const divScore = document.createElement('div');


    const zContJug = document.querySelector('#jug small');
    const zContCompu = document.querySelector('#compu small');
    let jugandoEn = "";
    let valorContPuntosJug = 0;
    let valorContPuntosCompu = 0;
    let valor;
    let texto = "";
    let scores = new Map();


    readScore();


// FUNCIONES
    vBtnNuevoJuego.addEventListener("click", nuevoJuego);
    vBtnPedirCarta.addEventListener('click', pedirCartaNueva);
    vBtnDetener.addEventListener('click', detenerJugador);
    vBtnNewScore.addEventListener('click', newScore)

    function delay(texto) {

        setTimeout(() => alert(texto), 500);
    }

    function creaZonaMarcadores(){
        divScore.id = 'localScore';
        zonaBTNS.append(divScore);
    }

    function newScore(){

        scores.clear();
        const scoreObj = Object.fromEntries(scores);
        const scoresJson = JSON.stringify(scoreObj);
        localStorage.setItem('scores', scoresJson);

        readScore();
    }

    function readScore(){
        const scoresJsonReading = localStorage.getItem('scores')||"0";   //Map lee
        const scoresObj = JSON.parse(scoresJsonReading);                //Json graba

        const newScores = new Map(Object.entries(scoresObj));           //Map carga

        if (newScores.size === 0) {
            // Establecer los marcadores a cero si no hay datos de otras partidas
            newScores.set("Jugador", 0);
            newScores.set("Compu", 0);
        }
        creaZonaMarcadores();       // Crea la zona divScore
        divScore.innerHTML = '';    // Limpia la zona divScore

        // Iterar sobre los elementos del Map usando map()
        newScores.forEach((value, key) => {
            // Crear un elemento h2 para cada marcador
            const h2Element = document.createElement('h4');
            h2Element.textContent = `Partidas Ganadas por ${key}: ${value}`;

            // Agregar el elemento h2 al div creado anteriormente
            divScore.append(h2Element);

        });
        scores = newScores;
    }

    function addToScore(player, points) {
        if (scores.has(player)) {
            let currentScore = scores.get(player);
            scores.set(player, currentScore + points);
        } else {
            scores.set(player, points);
        }
        // Registra los nuevos datos en localStorage
        const scoreObj = Object.fromEntries(scores);    //Map
        const scoreJson = JSON.stringify(scoreObj);     //Json
        localStorage.setItem('scores', scoreJson);

        // Lee y Pinta los datos de localStorage.
        readScore();
    }

    function creaBaraja() {
        for (let i = 0; i < palos.length; i++) {               // Palos
            for (let j = 0; j < valores.length; j++) {        // Valores
                carta = figuras[j] + palos[i];
                cartasArray.push(carta);
            }
        }
    }

    function mezclaBaraja(){
        cartasArray = _.shuffle(cartasArray);
    }

    function resetProcesosVariables() {
        texto = "";
        valor = 0;
        jugandoEn = "zonaJugador";
        zonaJugador.innerHTML = "";
        console.log("Borrado cartas jugador")
        zonaCompu.innerHTML = "";
        console.log("Borrado cartas Compu")
        valorContPuntosJug = 0;
        zContJug.textContent = valorContPuntosJug;
        valorContPuntosCompu = 0;
        zContCompu.textContent = valorContPuntosCompu;
    }

    function despiertaBotones() {
        vBtnPedirCarta.addEventListener('click', pedirCartaNueva);
        vBtnDetener.addEventListener('click', detenerJugador);
        vBtnNewScore.addEventListener("click", newScore);
        //console.log(Botones Despertados);
    }

    function nuevoJuego() {
        // console.log(CREA BARAJA);
        creaBaraja();
        //console.log(MEZCLA BARAJA);
        mezclaBaraja();
        //console.log(RESETEA PROCESOS Y VARIABLES)
        resetProcesosVariables();
        //console.log(DESPIERTA LOS BOTONES)
        despiertaBotones();
    }

    function pedirCartaNueva() {
        // recoge la carta de la baraja
        let nuevaCarta = cartasArray.pop();     // saca la carta de la baraja
        valor = devValorCarta(nuevaCarta);         // recupera int valor y actualiza variable global
        //console.log("nuevaCarta");
        creaPintaCarta(nuevaCarta);
    }

    function devValorCarta(str) {
        let strValor = str.slice(0, str.length - 1);
        let indCarta = figuras.indexOf(strValor);
        let intCarta = valores[indCarta];
        //console.log("devValorCarta");
        return intCarta;
    }

    function devStrImgCarta(str) {
        let vCartaDir = "assets/cartas/" + str + ".png";
        //console.log("StrCartaDir");
        return vCartaDir;
    }

    function creaPintaCarta(carta) {
        // crea la etiqueta img y la agrega a su correspondiente div
        const imgCarta = document.createElement('img');  //crea en memoria
        imgCarta.setAttribute('src', devStrImgCarta(carta));
        imgCarta.classList.add('class', 'carta');
        if (jugandoEn === 'zonaJugador'){
            zonaJugador.append(imgCarta); //pega la imagen
        }else{
            zonaCompu.append(imgCarta);   //pega la imagen
        }

        logica();

    }

    function logica() {
        // Lógica de Juego para cada jugador
        if (jugandoEn === 'zonaJugador') {
            valorContPuntosJug += valor;                // suma los puntos
            zContJug.textContent = valorContPuntosJug;  // cambia el valor small
            verificaPasadoDePuntosJugador(valorContPuntosJug);

        } else if (jugandoEn === 'zonaCompu' && valorContPuntosCompu <= maxPoint) {
            valorContPuntosCompu += valor;                  // suma los puntos
            zContCompu.textContent = valorContPuntosCompu;  // cambia el valor small

        }
    }

    function verificaPasadoDePuntosJugador(puntosTotales) {
        // console.log("verifica Puntos Pasados")
        if (jugandoEn === 'zonaJugador' && puntosTotales > maxPoint) {
            detenerJugador();
        }
    }

    function detenerJugador() {
        jugandoEn = 'zonaCompu';        // cambio a zona Compu
        vBtnPedirCarta.removeEventListener('click', pedirCartaNueva);
        vBtnDetener.removeEventListener('click', detenerJugador);
        juegaCompu();
    }

    function juegaCompu() {
        let pasadoJug = valorContPuntosJug > maxPoint;

        if (pasadoJug) {
            pedirCartaNueva();

        } else{

            while ((valorContPuntosCompu < maxPoint) && (valorContPuntosCompu < valorContPuntosJug)) {
                pedirCartaNueva();
            }

        }
        mensajes();
    }

    function mensajes() {

        if (valorContPuntosJug <= maxPoint && valorContPuntosCompu <= maxPoint ){  // ninguno se pasó -> msg
            if (valorContPuntosJug == valorContPuntosCompu) {
                texto = ("Lo sentimos pero en caso de empate gana la Casa");
                addToScore("Compu", 1);
                delay(texto);
            }else if (valorContPuntosJug > valorContPuntosCompu){
                texto = ("Enhorabuena  has ganado por puntos a la Casa");
                addToScore("Jugador", 1);
                delay(texto);
            }else if (valorContPuntosCompu > valorContPuntosJug){
                texto = ("Lo Sentimos pierdes por Puntos");
                addToScore("Compu", 1);
                delay(texto);
            }
        }else {                                                                 // alguno se ha pasado -> msg
            if (valorContPuntosJug > maxPoint){
                texto = ("Lo sentimos Te has pasado de 21 Gana la Casa");
                addToScore("Compu", 1);
                delay(texto);
            }else if  (valorContPuntosCompu > maxPoint){
                texto = ("Enhorabuena  has ganado,  la Casa se ha pasado");
                addToScore("Jugador", 1);
                delay(texto);
            }
        }
    }

})()
