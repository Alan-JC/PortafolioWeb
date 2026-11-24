
// Información de los proyectos
const proyectos = [
   {
    titulo: "Ajolote y Grulla",
    anio: "2026",
    categoria: "Desarrollo Full Stack y gestión ágil",
    descripcion: "Desarrollo de una plataforma de comercio electrónico especializada en papelería japonesa, enfocada en ofrecer una experiencia de compra personalizada. Participo en la implementación de funcionalidades frontend y backend, el desarrollo de interfaces responsivas y la integración de componentes interactivos. Además, desempeño el rol de Scrum Master, coordinando las actividades del equipo, dando seguimiento a las tareas y promoviendo el trabajo colaborativo mediante metodologías ágiles.",
    rol: "Desarrollador Full Stack Java y Scrum Master.",
    tecnologias: [
        "fa-brands fa-java",
        "fa-brands fa-js",
        "fa-brands fa-html5",
        "fa-brands fa-css3-alt",
        "fa-brands fa-bootstrap",
        "fa-brands fa-git-alt",
        "fa-brands fa-github"
    ],
    repo: "https://github.com/Alan-JC/Ajolote-y-Grulla",
    demo: "https://alan-jc.github.io/Ajolote-y-Grulla/"
},
    {
    titulo: "TERRA-6",
    anio: "2026",
    categoria: "Mars Challenge | Exploración espacial",
    descripcion: "Desarrollo de una propuesta de hábitat marciano para seis astronautas durante una misión de 310 días, fundamentada en investigación técnica y referencias de NASA, Curiosity e ISS. El proyecto contempla el dimensionamiento de sistemas de protección radiológica, generación de energía híbrida solar con respaldo tipo Kilopower y aprovechamiento de agua mediante el sistema AQUA-RAÍZ.",
    rol: "Responsable técnico del proyecto e investigación, dimensionamiento y coordinación de la propuesta de ingeniería.",
    tecnologias: [
    "Ingeniería aeroespacial",
    "Sistemas de soporte vital",
    "Energía solar",
    "Kilopower",
    "Protección radiológica",
    "AQUA-RAÍZ"
    ],
    pdf: "assets/proyectos/mars/Mars.pdf"
    },

    {
    titulo: "Rumbo",
    anio: "2026",
    categoria: "Innovación social | Proyecto en desarrollo",
    descripcion: "Plataforma web en desarrollo que busca facilitar la orientación educativa y profesional mediante inteligencia artificial. Su objetivo es generar rutas personalizadas de oportunidades académicas, becas, cursos y desarrollo profesional según el perfil e intereses de cada usuario.",
    rol: "Participación en la conceptualización, diseño y desarrollo de la solución mediante un enfoque de vibe coding, utilizando herramientas de IA como apoyo durante la implementación.",
    tecnologias: [
        "fa-brands fa-react",
        "fa-brands fa-js",
        "fa-brands fa-python",
        "fa-solid fa-bolt",
        "fa-solid fa-brain"
    ],
    repo: "https://github.com/Alan-JC/rumbo-app",
    demo: "https://alan-jc.github.io/rumbo-app/"
    },
    {
    titulo: "Aztlán Vita F",
    anio: "2026",
    categoria: "Talent Land | Salud e inteligencia artificial",
    descripcion: "Prototipo web de una plataforma de acompañamiento y gestión de atención clínica. Busca organizar el recorrido del paciente y facilitar la coordinación entre pacientes y personal médico mediante herramientas de registro, seguimiento y orientación informativa.",
    rol: "Participación en el desarrollo de la plataforma y la implementación de funcionalidades para la gestión y seguimiento del flujo de pacientes.",
    tecnologias: [
        "fa-brands fa-react",
        "fa-solid fa-bolt",
        "fa-solid fa-fire",
        "fa-solid fa-wind",
        "fa-solid fa-robot"
    ],
    repo: "https://github.com/Alan-JC/aztlan-vita-f"
},
    {
        titulo: "Project Aztlan",
        anio: "2026",
        categoria: "Ciencia de datos | Exoplanetas",
        descripcion: "Proyecto de análisis de datos astronómicos utilizando información de la NASA y modelos de Machine Learning para identificar y estimar la probabilidad de que determinados cuerpos celestes sean exoplanetas.",
        rol: "Desarrollo del modelo predictivo y visualización de resultados.",
        tecnologias: ["Python", "Random Forest", "NASA", "Streamlit"],
        repo: "https://github.com/USUARIO/REPOSITORIO",
        demo: "https://enlace-del-proyecto.com"
    },
    {
        titulo: "NASA Space Apps",
        anio: "2025",
        categoria: "Innovación tecnológica",
        descripcion: "Participación en el NASA Space Apps Challenge, trabajando en equipo para desarrollar una solución tecnológica a partir de desafíos relacionados con datos y ciencia espacial.",
        rol: "Desarrollo y colaboración en la solución del reto.",
        tecnologias: ["Tecnología", "Desarrollo de software"],
        repo: "https://github.com/USUARIO/REPOSITORIO",
        demo: "https://enlace-del-proyecto.com"
    },
    {
        titulo: "Equipos de robótica",
        anio: "2024 - 2026",
        categoria: "FIRST Tech Challenge | Robótica",
        descripcion: "Formación y dirección de equipos de robótica competitiva, participando en temporadas de FIRST Tech Challenge y desarrollando proyectos de ingeniería, diseño y construcción de robots.",
        rol: "Coach y mentor. Dirección de equipos, enseñanza de ingeniería y acompañamiento en el desarrollo de proyectos.",
        tecnologias: ["Java", "Robótica", "CAD", "Electrónica", "Ingeniería"],
        repo: "https://github.com/USUARIO/REPOSITORIO",
        demo: "https://enlace-del-proyecto.com",
        modelo: "/assets/proyectos/Robotica/modelos/robot.gltf"
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
