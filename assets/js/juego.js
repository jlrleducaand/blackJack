
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
    const zonaScore = document.createElement('div');

    const zContJug = document.querySelector('#jug small');
    const zContCompu = document.querySelector('#compu small');

    let jugandoEn = "";
    let valorContPuntosJug = 0;
    let valorContPuntosCompu = 0;
    let valor;
    let texto = "";
    let scores = new Map();
    let cartaSobreMesa = false;

// FUNCIONES

    inicio();

    function habilitarBoton(variableBoton, funcion){
        variableBoton.addEventListener('click', funcion);
    }

    function deshabilitarBoton(variableBoton, funcion){
        variableBoton.removeEventListener('click', funcion);
    }

    function salidaNavegador(variableSalir, funcion){
        variableSalir.addEventListener('beforeunload', funcion);
    }

    function delay(texto) {
        // mostrara una alerta despues de 500mlsegundos
        setTimeout(() => alert(texto), 500);
    }

    function creaZonaLocalStorageLimpia(){
        zonaScore.id = 'localScore';  //
        zonaBTNS.append(zonaScore);
        zonaScore.innerHTML = '';    // Limpia la zona divScore de localStorage
    }

    function newScoreZERO(){
        // despues de borrar el score se puede iniciar otro contador
        scores.clear();
        const mapScore = Object.fromEntries(scores); //transforma una lista o Array de Arrays(clave, Valor) en un Objeto
        const scoresStr = JSON.stringify(mapScore); //convierte un objeto o valor de JavaScript en una cadena de texto JSON
        //Esto es necesario porque localStorage solo puede almacenar cadenas de texto.
        //por lo que debes convertirlos a una cadena de texto en formato JSON usando JSON.stringify().
        localStorage.setItem('scores', scoresStr);  //Graba una key y un value convertido en String
        console.log('localStorage puesta a cero');

        deshabilitarBoton(vBtnNewScore, newScoreZERO);
        readLocalScore();
    }

    function inicio(){
        habilitarBoton(vBtnNuevoJuego, nuevoJuego);
        habilitarBoton(vBtnNewScore,newScoreZERO);
        salidaNavegador(window, handleBeforeUnload);
        readLocalScore();
    }

    function readLocalScore(){

        // forma de dar valores estilo booleana:  o vales lo que haya si hay  o vales 0
        const scoresStoraged = localStorage.getItem('scores')||"0";   //Map lee
        const scoresJson = JSON.parse(scoresStoraged);       //Parsea la cadena a Json para leerlo
        const mapScores = new Map(Object.entries(scoresJson));  //Map carga

        if (mapScores.size === 0) {
            // Establecer los marcadores a cero si no hay datos de otras partidas
            mapScores.set("Jugador", 0);
            mapScores.set("Compu", 0);
        }
        creaZonaLocalStorageLimpia();

        // Repintado / Machaca el marcador
        // Iterar sobre los elementos del Map usando map() para rellenar la zona con los marcadores
        mapScores.forEach((value, key) => {
            // Crear un elemento h2 para cada marcador
            const h4Element = document.createElement('h4');
            h4Element.textContent = `Partidas Ganadas por ${key}: ${value}`;

            // Agregar el elemento h2 al div creado anteriormente
            zonaScore.append(h4Element);

        });
        scores = mapScores;   // iguala la variable map scores al localStorages
    }

    function updateToScore(player, points) {
        //actualizamos score de player
        if (scores.has(player)) {
            let currentScore = scores.get(player);
            scores.set(player, currentScore + points);
        } else {
            scores.set(player, points);
        }
        // Registra los nuevos datos en localStorage
        const scoreObj = Object.fromEntries(scores);    //Mapea Map Player points
        const scoreJson = JSON.stringify(scoreObj);     //Json  to String
        localStorage.setItem('scores', scoreJson);      //Graba variable  valor

        // Lee y Pinta los datos de localStorage.
        readLocalScore();
    }

    function creaBaraja() {                             // Bidimensional
        for (let i = 0; i < palos.length; i++) {        // Palos   "filas"
            for (let j = 0; j < valores.length; j++) {  // Valores "columnas"
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
        cartaSobreMesa = false;
    }

    function despiertaBotones() {
        habilitarBoton(vBtnPedirCarta, pedirCartaNueva);
        deshabilitarBoton(vBtnNewScore, newScoreZERO);
        deshabilitarBoton(vBtnNuevoJuego, nuevoJuego);
        deshabilitarBoton(vBtnDetener, detenerJugador);

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
        deshabilitarBoton(vBtnNuevoJuego, nuevoJuego);
        habilitarBoton(vBtnDetener, detenerJugador);
        cartaSobreMesa = true;

        // recoge la carta de la baraja
        let nuevaCarta = cartasArray.pop();     // saca la carta de la baraja
        valor = devValorCarta(nuevaCarta);         // recupera int valor y actualiza variable global
        //console.log("nuevaCarta");
        creaPintaCarta(nuevaCarta);
    }

    function devValorCarta(str) {
        let strValor = str.slice(0, str.length - 1);
        let indCarta = figuras.indexOf(strValor);
        let valCarta = valores[indCarta];
        //console.log("devValorCarta");
        return valCarta;
    }

    function devStrPathImgCarta(str) {
        let strPathCarta = "assets/cartas/" + str + ".png";
        //console.log("StrCartaDir");
        return strPathCarta;
    }

    function creaPintaCarta(carta) {
        // crea la etiqueta img y la agrega a su correspondiente div
        const imgCarta = document.createElement('img');  //crea en memoria
        imgCarta.setAttribute('src', devStrPathImgCarta(carta));
        imgCarta.classList.add('class', 'carta');
        if (jugandoEn === 'zonaJugador'){
            zonaJugador.append(imgCarta); //pinta la imagen
        }else{
            zonaCompu.append(imgCarta);   //pinta la imagen
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
        if (jugandoEn === 'zonaJugador' && puntosTotales >= maxPoint) {
            detenerJugador();
        }
    }

    function detenerJugador() {
        jugandoEn = 'zonaCompu';        // cambio a zona Compu
        deshabilitarBoton(vBtnPedirCarta, pedirCartaNueva);
        deshabilitarBoton(vBtnDetener, detenerJugador);

        juegaCompu();
    }

    function juegaCompu() {
        // Bandera Boolean
        let pasadoJug = valorContPuntosJug > maxPoint;

        if (pasadoJug) {
            // pedirá solo una carta
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
                updateToScore("Compu", 1);
                delay(texto);
            }else if (valorContPuntosJug > valorContPuntosCompu){
                texto = ("Enhorabuena  has ganado por puntos a la Casa");
                updateToScore("Jugador", 1);
                delay(texto);
            }else if (valorContPuntosCompu > valorContPuntosJug){
                texto = ("Lo Sentimos pierdes por Puntos");
                updateToScore("Compu", 1);
                delay(texto);
            }
        }else {                                                                 // alguno se ha pasado -> msg
            if (valorContPuntosJug > maxPoint){
                texto = ("Lo sentimos Te has pasado de 21 Gana la Casa");
                updateToScore("Compu", 1);
                delay(texto);
            }else if  (valorContPuntosCompu > maxPoint){
                texto = ("Enhorabuena  has ganado,  la Casa se ha pasado");
                updateToScore("Jugador", 1);
                delay(texto);
            }
        }
        habilitarBoton(vBtnNuevoJuego,nuevoJuego);
        deshabilitarBoton(vBtnDetener, detenerJugador);
        cartaSobreMesa = false;
    }

    function guardarVictoriaComputadora() {
        updateToScore("Compu", 1);
    }

    function handleBeforeUnload(){
        // podria haber puesto directamente  updateToScore()  pero asi queda mas legible
        if(cartaSobreMesa == true)guardarVictoriaComputadora();
    }

})()
// comentar para Debugear
