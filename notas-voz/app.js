const btnGuardar = document.getElementById("guardar");
const imgBtn = document.getElementById('imagen-button');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


if (!SpeechRecognition) {
  alert('Tu navegador no soporta la API de reconocimiento de voz');
} else {
  const reconocimiento = new SpeechRecognition();

  // Configuración básica
  reconocimiento.lang = 'es-ES';
  reconocimiento.continuous = false;
  reconocimiento.interimResults = true;

  let textoFinal = ""; // acumulador
  let textoInterino = "";
  let fecha = "";
  let textoResumido = '';

  reconocimiento.onresult = (event) => {
    textoInterino = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        textoFinal += result[0].transcript + " ";
      } else {
        textoInterino += result[0].transcript;
      }
    }

    document.getElementById("transcript").textContent = `📝 ${textoFinal} ${textoInterino}`;
    fecha = new Date().toLocaleString();
    
  };

  // Guardar en localStorage
  btnGuardar.addEventListener("click", async () => {
  if (textoFinal) {
    const pantallaCarga = document.getElementById("pantalla-carga");
    pantallaCarga.style.display = "flex"; // Mostrar pantalla de carga

    try {
      textoResumido = await resumir(textoFinal);

      // Guardamos la nota con resumen
      localStorage.setItem(fecha, JSON.stringify({
        nota: textoFinal.trim(),
        resumen: textoResumido
      }));

      console.log("Nota guardada:", fecha, textoFinal, textoResumido);
    } catch (error) {
      console.error("Error al guardar nota:", error);
    } finally {
      //aqui vamos a colocar el cambio del transcript a su estado original
      document.getElementById("transcript").textContent = `🎤 Esperando grabación...`;
      pantallaCarga.style.display = "none"; // Ocultar pantalla de carga
    }
    }
  });


  // Volver a empezar automáticamente
  reconocimiento.onend = () => {
    if (isRecording) {
      console.log("Reiniciando reconocimiento...");
      reconocimiento.start();
    }
  };

  // Manejo de errores
  reconocimiento.onerror = (event) => {
    console.error("Error de reconocimiento:", event.error);
  };

  // Activar/desactivar grabación
  const btn = document.getElementById("toggle-recording");
  let isRecording = false;

  btn.addEventListener("click", () => {
    if (!isRecording) {
      textoFinal = ""; // Limpiamos acumulador al iniciar una nueva nota
      reconocimiento.start();
      imgBtn.src = '/images/icono-stop.svg'
      isRecording = true;
    } else {
      reconocimiento.stop();
      imgBtn.src = '/images/icono-microfono.svg'
      isRecording = false;
    }
  });
}





// Mostrar notas guardadas

const mostrarNotasGuardadas = () => {
    // Limpiar el contenedor de notas guardadas
    document.querySelector('.notas-guardadas').innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        let fecha = localStorage.key(i);
        let datos = JSON.parse(localStorage.getItem(fecha));
        let nota = datos.nota;
        let resumenTexto = datos.resumen;


        let tarjetaNota = document.createElement("div");
        tarjetaNota.className = "tarjeta-nota";

        let titulo = document.createElement("h2");
        titulo.textContent = fecha;
        tarjetaNota.appendChild(titulo);

        let resumen = document.createElement("p");
        resumen.className = "resumen";
        resumen.textContent = resumenTexto || 'Sin resumen';
        tarjetaNota.appendChild(resumen);

        let contenido = document.createElement("p");
        contenido.className = "nota";
        contenido.textContent = nota;
        tarjetaNota.appendChild(contenido);

        let divBotonEliminar = document.createElement("p");
        divBotonEliminar.className = "div-boton-eliminar";        
        tarjetaNota.appendChild(divBotonEliminar);

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "eliminar-nota";


            // funcionalidad de eliminar
        botonEliminar.addEventListener("click", () => {
            localStorage.removeItem(fecha);
            tarjetaNota.remove();
        });

        divBotonEliminar.appendChild(botonEliminar);

        document.querySelector('.notas-guardadas').appendChild(tarjetaNota);
        


    }
}


const btn = document.getElementById("toggle-recording");
const btnContenedorGuardarNota = document.getElementById("contenedor-guardar-general");
const elTranscript = document.getElementById("transcript");

// Mostrar notas con el boton ver notas guardadas
const btnVerNotas = document.querySelector(".ver-notas");
const divTranscript = document.querySelector('.div-transcript');


btnVerNotas.addEventListener("click", () => {
  mostrarNotasGuardadas()
  btnOcultarNotas.style.display = 'block';
  btnVerNotas.style.display = 'none';
  btn.style.display = 'none';
  btnContenedorGuardarNota.style.display = 'none';
  elTranscript.style.display = 'none';
  divTranscript.style.display = 'none';
  document.getElementById('titulo-div').textContent = 'Notas guardadas';
});

// ocultar notas guardadas

const btnOcultarNotas = document.querySelector(".ocultar-notas");
btnOcultarNotas.addEventListener("click", () => {
  document.querySelector('.notas-guardadas').innerHTML = '';
  btnVerNotas.style.display = 'block';
  btnOcultarNotas.style.display = 'none';
  btn.style.display = 'block';
  btnContenedorGuardarNota.style.display = 'flex';
  elTranscript.style.display = 'flex';
  divTranscript.style.display = 'flex';
  document.getElementById('titulo-div').textContent = 'Nota en curso';
});





// Configuración de la API de gemini
// Configuración de la API de Gemini
const API_KEY = "AIzaSyC86djppWlPBjxMc4CQMc2S-vXMAJE7DDg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Función para resumir texto y mostrar resultado en consola
const resumir = async (texto) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Genera un resumen o un titulo con no mas de 5 palabras para el siguiente texto: \n\n${texto}, no quiero que coloques arteriscos ni coloques 'titulo:', solo necesito el contenido del titulo` }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const resumen = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (resumen) {
      return resumen;
    } else {
      console.error("⚠️ No se pudo obtener el resumen:", data);
    }

  } catch (error) {
    console.error("❌ Error al usar Gemini:", error);
  }
};

// Prueba
