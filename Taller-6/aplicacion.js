// Variables globales
let libros = JSON.parse(localStorage.getItem('listaLibros')) || [];
let estaEditando = false;

// Selectores del DOM
const formulario = document.getElementById('formulario-crud');
const entradaTitulo = document.getElementById('titulo');
const entradaAutor = document.getElementById('autor');
const entradaId = document.getElementById('id-elemento');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');

// Función para renderizar el listado en la tabla
function renderizarLibros() {
    cuerpoTabla.innerHTML = '';

    if (libros.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="3" style="text-align: center;">No hay libros registrados.</td></tr>`;
        localStorage.setItem('listaLibros', JSON.stringify(libros));
        return;
    }

    libros.forEach(function (libro) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>
                <button class="btn-editar" onclick="prepararEdicion('${libro.id}')">Editar</button>
                <button class="btn-eliminar" onclick="eliminarLibro('${libro.id}')">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    localStorage.setItem('listaLibros', JSON.stringify(libros));
}

// Evento de escucha para el envío del formulario (Guardar / Modificar)
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const valorTitulo = entradaTitulo.value.trim();
    const valorAutor = entradaAutor.value.trim();
    const idActual = entradaId.value;

    if (estaEditando) {
        // Modo Edición: mapear y actualizar el registro correspondiente
        libros = libros.map(function (libro) {
            if (libro.id === idActual) {
                return { id: libro.id, titulo: valorTitulo, autor: valorAutor };
            }
            return libro;
        });

        estaEditando = false;
        botonGuardar.textContent = 'Guardar Libro';
        botonCancelar.classList.add('oculto');
    } else {
        // Modo Creación: añadir un nuevo objeto libro con ID único
        const nuevoLibro = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            titulo: valorTitulo,
            autor: valorAutor
        };
        libros.push(nuevoLibro);
    }

    reiniciarFormulario();
    renderizarLibros();
});

// Función global para cargar un libro en el formulario y editarlo
window.prepararEdicion = function (id) {
    const libroEncontrado = libros.find(function (libro) {
        return libro.id === id;
    });

    if (!libroEncontrado) return;

    entradaTitulo.value = libroEncontrado.titulo;
    entradaAutor.value = libroEncontrado.autor;
    entradaId.value = libroEncontrado.id;
    
    estaEditando = true;
    botonGuardar.textContent = 'Actualizar Libro';
    botonCancelar.classList.remove('oculto');
};

// Función global para eliminar registros
window.eliminarLibro = function (id) {
    if (confirm('¿Está seguro de que desea eliminar este libro?')) {
        libros = libros.filter(function (libro) {
            return libro.id !== id;
        });

        // Si se elimina el libro que se estaba editando actualmente, resetea el formulario
        if (estaEditando && entradaId.value === id) {
            reiniciarFormulario();
        }
        
        renderizarLibros();
    }
};

// Cancelar edición mediante el botón dedicado
botonCancelar.addEventListener('click', reiniciarFormulario);

// Restablecer el estado del formulario a sus valores iniciales
function reiniciarFormulario() {
    formulario.reset();
    entradaId.value = '';
    estaEditando = false;
    botonGuardar.textContent = 'Guardar Libro';
    botonCancelar.classList.add('oculto');
}

// Renderizado inicial al cargar la página
renderizarLibros();