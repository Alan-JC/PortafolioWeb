
// Información de cada etapa de mi trayectoria
const etapas = [
    {
        periodo: "2016 – 2021",
        titulo: "Primeros pasos en ingeniería",
        descripcion: "Estudié Sistemas de Control Eléctrico en el IPN y fui jefe de taller electrónico en Copydigsa, reparando equipos y tarjetas a nivel componente. También trabajé como dibujante Jr. en AutoCAD.",
        area: "Electrónica · AutoCAD · Sistemas"
    },
    {
        periodo: "2020 – 2023",
        titulo: "Exploración de la robótica",
        descripcion: "Cursé tres años de Ingeniería en Robótica en la Universidad de Ecatepec, donde se reforzó mi interés por integrar hardware, programación y diseño.",
        area: "Robótica · Diseño · Ingeniería"
    },
    {
        periodo: "2022 – 2026",
        titulo: "FIRST y mentoría de equipos",
        descripcion: "Fui coach y líder de proyectos tecnológicos en el Club de Niños y Niñas de CDMX y Edo. Méx. Dirigí equipos en FIRST Tech Challenge y WRO, y formé a estudiantes en programación, mecánica y electrónica.",
        area: "Mentoría · Coordinación · Ingeniería"
    },
    {
        periodo: "2025 – 2026",
        titulo: "Retos de innovación",
        descripcion: "Backend y modelo Random Forest en NASA Space Apps para clasificar exoplanetas con datos de la NASA, y responsable técnico del hábitat TERRA-6 para 6 personas en Mars Challenge.",
        area: "Machine Learning · Investigación · Diseño"
    },
    {
        periodo: "2026 – actualidad",
        titulo: "Desarrollo de software",
        descripcion: "Estudio Ingeniería en Sistemas en Univermilenium. Desarrollo frontend y backend de un e-commerce (Ajolote y Grulla) con Java, JavaScript, Bootstrap y GitHub, y coordino al equipo como Scrum Master.",
        area: "Java · Full Stack · Scrum · Backend"
    },
    {
        periodo: "2025 – 2026",
        titulo: "Formación continua",
        descripcion: "Cursos de Cisco (Python Essentials 1 e Introduction to Cybersecurity), Introducción a Java con Accenture, el propedéutico de IA de INFOTEC y la certificación Scrum Fundamentals de SCRUMstudy.",
        area: "Python · Java · Ciberseguridad · IA · Scrum"
    },
    {
        periodo: "Sep – Dic 2026",
        titulo: "Bootcamp Generation México",
        descripcion: "Bootcamp de Desarrollador Java Full Stack en Generation México, donde fortalezco mi perfil de desarrollador con enfoque en backend y desarrollo web con Java.",
        area: "Java · Full Stack · Backend · Desarrollo web"
    }
];


// Seleccionar elementos del carrusel
const tarjetasProyecto = document.querySelectorAll(".tarjeta-proyecto");


function actualizarProyecto(indice) {

    const proyecto = proyectos[indice];

    if (!proyecto) return;

    // Actualizar información
    document.getElementById("proyecto-titulo").textContent = proyecto.titulo;
    document.getElementById("proyecto-anio").textContent = proyecto.anio;
    document.getElementById("proyecto-categoria").textContent = proyecto.categoria;
    document.getElementById("proyecto-descripcion").textContent = proyecto.descripcion;
    document.getElementById("proyecto-rol").textContent = proyecto.rol;

   // Actualizar tecnologías
const contenedorTecnologias = document.getElementById("proyecto-tecnologias");

contenedorTecnologias.innerHTML = "";

proyecto.tecnologias.forEach(function (tecnologia) {

    if (tecnologia.startsWith("fa-") || tecnologia.startsWith("devicon-")) {

        const icono = document.createElement("i");

        icono.className = tecnologia + " icono-tecnologia";
        icono.setAttribute("aria-hidden", "true");

        contenedorTecnologias.appendChild(icono);

    } else {

        const etiqueta = document.createElement("span");

        etiqueta.classList.add("etiqueta-tecnologia");
        etiqueta.textContent = tecnologia;

        contenedorTecnologias.appendChild(etiqueta);

    }

});

    // ACTUALIZAR BOTONES
    const botonRepo = document.getElementById("proyecto-repo");
    const botonDemo = document.getElementById("proyecto-demo");
    const botonPdf = document.getElementById("proyecto-pdf");

    botonRepo.href = proyecto.repo || "#";
    botonDemo.href = proyecto.demo || "#";
    botonPdf.href = proyecto.pdf || "#";
botonPdf.style.display = proyecto.pdf ? "inline-flex" : "none";

    // Ocultar botones si no hay enlaces
    botonRepo.style.display = proyecto.repo ? "inline-flex" : "none";
    botonDemo.style.display = proyecto.demo ? "inline-flex" : "none";

        // MODELO 3D
    const visorModelo = document.getElementById("proyecto-modelo-3d");

    if (proyecto.modelo) {
        // El proyecto tiene modelo: se le pone la ruta y se muestra
        visorModelo.setAttribute("src", proyecto.modelo);
        visorModelo.hidden = false;
    } else {
        // El proyecto no tiene modelo: se oculta y se quita la ruta
        visorModelo.removeAttribute("src");
        visorModelo.hidden = true;
    }

}


// Comportamiento del carrusel
tarjetasProyecto.forEach(function (tarjeta, indice) {

    tarjeta.addEventListener("click", function () {

        // Cerrar todas las tarjetas
        tarjetasProyecto.forEach(function (tarjetaCerrada) {
            tarjetaCerrada.classList.remove("tarjeta-proyecto-activa");
        });

        // Activar la tarjeta seleccionada
        tarjeta.classList.add("tarjeta-proyecto-activa");

        // Actualizar información
        actualizarProyecto(indice);

    });

});


// Mostrar información del proyecto activo al cargar
const indiceInicial = [...tarjetasProyecto].findIndex(
    tarjeta => tarjeta.classList.contains("tarjeta-proyecto-activa")
);

actualizarProyecto(indiceInicial >= 0 ? indiceInicial : 0);
