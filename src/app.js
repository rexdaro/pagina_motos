const divNegro = document.querySelector('#color_negro');
const divBlanco = document.querySelector('#color_blanco');
const divAmarillo = document.querySelector('#color_amarillo');

const motoNegra = document.querySelector('#moto_negra');
const motoBlanca = document.querySelector('#moto_blanca');
const motoAmarilla = document.querySelector('#moto_amarilla');

const menu = document.querySelector('#menu');
const header = document.querySelector('#header');

const icono_menu = document.querySelector('#contenedor_icono_menu');
const icono_cerrar = document.querySelector('#contenedor_icono_cerrar');

function mostrarImagen(id) {
    document.getElementById(id).style.display = "block";
}

function ocultarImagen(id) {
    document.getElementById(id).style.display = "none";
}


// colocando el mouse por arriva como un hover

divNegro.addEventListener('mouseover', () => {
    motoBlanca.style.display = 'none';
    motoNegra.style.display = 'block';
    motoAmarilla.style.display = 'none';
    
})

divBlanco.addEventListener('mouseover', () => {
    motoBlanca.style.display = 'block';
    motoNegra.style.display = 'none';
    motoAmarilla.style.display = 'none';
    
})

divAmarillo.addEventListener('mouseover', () => {
    motoBlanca.style.display = 'none';
    motoNegra.style.display = 'none';
    motoAmarilla.style.display = 'block';
})

// haciendo click

divNegro.addEventListener('click', () => {
    motoBlanca.style.display = 'none';
    motoNegra.style.display = 'block';
    motoAmarilla.style.display = 'none';
})

divBlanco.addEventListener('click', () => {
    motoBlanca.style.display = 'block';
    motoNegra.style.display = 'none';
    motoAmarilla.style.display = 'none';
    
})

divAmarillo.addEventListener('click', () => {
    motoBlanca.style.display = 'none';
    motoNegra.style.display = 'none';
    motoAmarilla.style.display = 'block';
})

// funcionalidad menu

menu.addEventListener('click', () => {
    
    if(header.style.top !== '-50dvh'){
        header.style.top = '-50dvh';
        icono_menu.style.display = 'none';
        icono_cerrar.style.display = 'block';
        
    }
     else{
        header.style.top = '-83dvh';
        icono_cerrar.style.display = 'none';
        icono_menu.style.display = 'block';
    }
    
    
})




