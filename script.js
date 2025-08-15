// Reemplaza con tu ID de Sheet y API Key
const SHEET_ID = "1wN1AcPTM_XBh3gILICWDWg4IP3HcxKFgdUBIQOHMYqQ";
const API_KEY = "AIzaSyC4GNr2hnII5MFASblto-kmxijd0BTdMFY";

const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const liveForm = document.getElementById("live-form");

// Tabla de metas de ejemplo (ajusta según tu agencia)
const META_DIAMANTES = 2000;
const META_HORAS = 60;
const META_DIAS = 20;

// Mensajes motivacionales según porcentaje
function mensajeMotivacional(porcentaje) {
    if(porcentaje < 20) return "¡Vamos, cada diamante cuenta!";
    if(porcentaje < 40) return "¡Sigue así, vas por buen camino!";
    if(porcentaje < 60) return "¡Excelente, estás alcanzando la mitad!";
    if(porcentaje < 80) return "¡Casi llegas, no te detengas!";
    if(porcentaje < 100) return "¡Último empujón, tu bono te espera!";
    return "¡Felicidades! ¡Bono desbloqueado!";
}

// Función para actualizar barra de progreso
function actualizarBarra(porcentaje) {
    let pct = Math.min(porcentaje, 100);
    progressBar.style.width = pct + "%";
    progressText.innerText = `${pct.toFixed(0)}% desbloqueado - ${mensajeMotivacional(pct)}`;
}

// Evento de envío del formulario
liveForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const creador = document.getElementById("creador").value;
    const diamantes = parseInt(document.getElementById("diamantes").value);
    const horas = parseInt(document.getElementById("horas").value);
    const dias = parseInt(document.getElementById("dias").value);

    // Calcular porcentaje promedio según las 3 metas
    const pctDiamantes = (diamantes / META_DIAMANTES) * 100;
    const pctHoras = (horas / META_HORAS) * 100;
    const pctDias = (dias / META_DIAS) * 100;
    const porcentajeTotal = (pctDiamantes + pctHoras + pctDias) / 3;

    actualizarBarra(porcentajeTotal);

    // Guardar datos en Google Sheets
    enviarAGoogleSheets(creador, diamantes, horas, dias);

    // Guardar fecha del último registro en localStorage para alertas
    localStorage.setItem(`${creador}_lastUpdate`, new Date().toISOString());
});

// Función para enviar datos a Google Sheets
function enviarAGoogleSheets(creador, diamantes, horas, dias) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Registro%20Lives:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    const data = {
        values: [[new Date().toLocaleString(), diamantes, horas, dias, creador]]
    };

    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log("Guardado:", data))
    .catch(error => console.error("Error:", error));
}

// Función de alerta automática si no hay progreso en 48h
function alertaProgreso(creador) {
    const lastUpdate = localStorage.getItem(`${creador}_lastUpdate`);
    if(!lastUpdate) return;

    const now = new Date();
    const last = new Date(lastUpdate);
    const diffHrs = (now - last) / 1000 / 60 / 60; // diferencia en horas

    if(diffHrs > 48) {
        alert(`¡Atención! ${creador} no ha actualizado su progreso en más de 48 horas.`);
    }
}

// Revisar alertas cada vez que se carga la página
document.addEventListener("DOMContentLoaded", () => {
    const creador = document.getElementById("creador").value;
    if(creador) alertaProgreso(creador);
});

