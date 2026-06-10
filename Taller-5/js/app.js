document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    
    const expressions = {
        cedula: /^\d{10}$/,                                 
        apellidos: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,40}$/,        
        nombres: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,40}$/,          
        direccion: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s.,#-]{5,100}$/,
        telefono: /^(09)\d{8}$/,                         
        correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
        facultad: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{4,50}$/,        
        nivel: /^[1-9]$|^10$/,                             
        paralelo: /^[A-Z]$/i                            
    };

    const errorMessages = {
        cedula: "La cédula debe contener exactamente 10 dígitos numéricos.",
        apellidos: "Apellido inválido. Solo letras (mínimo 3 caracteres).",
        nombres: "Nombre inválido. Solo letras (mínimo 3 caracteres).",
        direccion: "Dirección inválida (mínimo 5 caracteres).",
        telefono: "El teléfono debe ser celular de 10 dígitos (ej. 09XXXXXXXX).",
        correo: "Ingrese un correo electrónico válido.",
        facultad: "Facultad inválida (solo letras).",
        nivel: "El nivel debe ser un número del 1 al 10.",
        paralelo: "El paralelo debe ser una única letra (ej. A)."
    };

    displayStudents();

    Object.keys(expressions).forEach(field => {
        const input = document.getElementById(field);
        input.addEventListener('blur', () => validateField(input, field));
        input.addEventListener('input', () => validateField(input, field));
    });

    function validateField(input, field) {
        if (expressions[field].test(input.value.trim())) {
            input.classList.remove('invalid');
            document.getElementById(`error-${field}`).textContent = "";
            return true;
        } else {
            input.classList.add('invalid');
            document.getElementById(`error-${field}`).textContent = errorMessages[field];
            return false;
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        Object.keys(expressions).forEach(field => {
            const input = document.getElementById(field);
            const isValid = validateField(input, field);
            if (!isValid) isFormValid = false;
        });

        if (isFormValid) {
            const student = {
                cedula: document.getElementById('cedula').value.trim(),
                apellidos: document.getElementById('apellidos').value.trim(),
                nombres: document.getElementById('nombres').value.trim(),
                direccion: document.getElementById('direccion').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                correo: document.getElementById('correo').value.trim(),
                facultad: document.getElementById('facultad').value.trim(),
                nivel: document.getElementById('nivel').value.trim(),
                paralelo: document.getElementById('paralelo').value.toUpperCase().trim()
            };

            saveStudent(student);
            form.reset();
            displayStudents();
            alert("Estudiante registrado con éxito.");
        } else {
            alert("Por favor, corrija los errores en el formulario antes de enviar.");
        }
    });

    function saveStudent(student) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        
        const exists = students.some(s => s.cedula === student.cedula);
        if (exists) {
            alert("Error: Ya existe un estudiante registrado con esa cédula.");
            return;
        }

        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
    }

    function displayStudents() {
        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = '';
        
        let students = JSON.parse(localStorage.getItem('students')) || [];

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><b>${student.cedula}</b></td>
                <td>${student.apellidos}, ${student.nombres}</td>
                <td>${student.correo}</td>
                <td>${student.facultad}</td>
                <td>${student.nivel} - "${student.paralelo}"</td>
            `;
            tbody.appendChild(row);
        });
    }
});