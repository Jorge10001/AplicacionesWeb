// Selección de elementos del DOM
const formularioTareas = document.getElementById('formulario-tareas');
const tituloTarea = document.getElementById('titulo-tarea');
const descripcionTarea = document.getElementById('descripcion-tarea');
const listaTareas = document.getElementById('lista-tareas');
const btnExportarJson = document.getElementById('btn-exportar-json');
const btnExportarXml = document.getElementById('btn-exportar-xml');

// Cargar colección inicial desde LocalStorage o inicializar vacía
let coleccionTareas = JSON.parse(localStorage.getItem('tareasGuardadas')) || [];

// Función para renderizar las tareas en la pantalla
function redibujarInterfaz() {
    listaTareas.innerHTML = '';
    
    coleccionTareas.forEach((tarea, indice) => {
        const elementoLista = document.createElement('li');
        elementoLista.className = 'elemento-tarea';
        
        elementoLista.innerHTML = `
            <div>
                <h3>${tarea.titulo}</h3>
                <p>${tarea.descripcion}</p>
                <small><strong>Código:</strong> ${tarea.codigo} | <strong>Registro:</strong> ${tarea.fecha}</small>
            </div>
            <button class="btn-eliminar" onclick="removerTarea(${indice})">Eliminar</button>
        `;
        listaTareas.appendChild(elementoLista);
    });
}

// Función para actualizar LocalStorage
function actualizarAlmacenamientoLocal() {
    localStorage.setItem('tareasGuardadas', JSON.stringify(coleccionTareas));
}

// Evento para añadir una nueva tarea
formularioTareas.addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    const nuevaTarea = {
        codigo: Date.now().toString(),
        titulo: tituloTarea.value,
        descripcion: descripcionTarea.value,
        fecha: new Date().toLocaleDateString()
    };
    
    coleccionTareas.push(nuevaTarea);
    actualizarAlmacenamientoLocal();
    redibujarInterfaz();
    formularioTareas.reset();
});

// Función global para remover una tarea
window.removerTarea = function(indice) {
    coleccionTareas.splice(indice, 1);
    actualizarAlmacenamientoLocal();
    redibujarInterfaz();
};

// Exportación a JSON
btnExportarJson.addEventListener('click', () => {
    if (coleccionTareas.length === 0) return alert('No existen tareas para exportar.');
    
    const textoJson = JSON.stringify(coleccionTareas, null, 2);
    console.log("FLUJO DE DATOS: JSON GENERADO");
    console.log(textoJson);
    generarDescarga(textoJson, 'tareas_academicas.json', 'application/json');
});

// Exportación a XML
btnExportarXml.addEventListener('click', () => {
    if (coleccionTareas.length === 0) return alert('No existen tareas para exportar.');
    
    let textoXml = `<?xml version="1.0" encoding="UTF-8"?>\n<tareas>\n`;
    
    coleccionTareas.forEach(tarea => {
        textoXml += `  <tarea codigo="${tarea.codigo}">\n`;
        textoXml += `    <titulo>${sanitizarTextoXml(tarea.titulo)}</titulo>\n`;
        textoXml += `    <descripcion>${sanitizarTextoXml(tarea.descripcion)}</descripcion>\n`;
        textoXml += `    <fecha>${tarea.fecha}</fecha>\n`;
        textoXml += `  </tarea>\n`;
    });
    
    textoXml += `</tareas>`;
    console.log("FLUJO DE DATOS: XML GENERADO");
    console.log(textoXml);
    generarDescarga(textoXml, 'tareas_academicas.xml', 'application/xml');
});

// Función auxiliar para descargar los archivos creados en el cliente
function generarDescarga(contenidoTexto, nombreArchivo, tipoMime) {
    const bloqueDatos = new Blob([contenidoTexto], { type: tipoMime });
    const urlDescarga = URL.createObjectURL(bloqueDatos);
    
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = urlDescarga;
    enlaceDescarga.download = nombreArchivo;
    enlaceDescarga.click();
    
    URL.revokeObjectURL(urlDescarga);
}

// Función para sanitizar entidades especiales en XML
function sanitizarTextoXml(textoInseguro) {
    return textoInseguro.replace(/[<>&'"]/g, (caracter) => {
        switch (caracter) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "'": return '&apos;';
            case '"': return '&quot;';
            default: return caracter;
        }
    });
}

// Renderizado inicial al cargar la página
redibujarInterfaz();