
// Información de los proyectos
const proyectos = [
    {
        titulo: "Ajolote y Grulla",
        anio: "2026",
        categoria: "Desarrollo de software",
        descripcion: "Desarrollo de una plataforma de comercio electrónico, enfocada en ofrecer una experiencia de compra y gestión de productos mediante una solución web.",
        rol: "Desarrollo Full Stack y participación en la construcción de la plataforma.",
        tecnologias: ["Java", "JavaScript", "HTML", "CSS", "Bootstrap"],
        repo: "https://github.com/USUARIO/REPOSITORIO",
        demo: "https://enlace-del-proyecto.com"
    },
    {
        titulo: "TERRA-6",
        anio: "2026",
        categoria: "Mars Challenge | Exploración espacial",
        descripcion: "Propuesta de diseño de un hábitat para seis astronautas durante una misión de 310 días en Marte, considerando sistemas de energía, habitabilidad y aprovechamiento de recursos.",
        rol: "Responsable técnico del proyecto y coordinación del desarrollo de la propuesta.",
        tecnologias: ["Ingeniería", "Energía solar", "Kilopower", "AQUA-RAÍZ"],
        repo: "https://github.com/USUARIO/REPOSITORIO",
        demo: "https://enlace-del-proyecto.com"
    },
    {
        titulo: "ReRuta",
        anio: "2026",
        categoria: "Innovación social",
        descripcion: "Proyecto orientado a ayudar a personas que se sienten perdidas en su trayectoria académica o profesional, brindándoles herramientas para reorganizar su camino y encontrar nuevas oportunidades.",
        rol: "Participación en la conceptualización y desarrollo de la propuesta.",
        tecnologias: ["Desarrollo web", "Diseño de soluciones"],
        repo: "https://github.com/USUARIO/REPOSITORIO",
        demo: "https://enlace-del-proyecto.com"
    },
    {
        titulo: "Aztlan Vita F",
        anio: "2026",
        categoria: "Talent Land | Salud e inteligencia artificial",
        descripcion: "Desarrollo de una propuesta tecnológica basada en inteligencia artificial para optimizar los flujos de atención y procesos hospitalarios.",
        rol: "Desarrollo Full Stack y colaboración en la construcción de la solución.",
        tecnologias: ["Desarrollo web", "Inteligencia artificial"],
        repo: "https://github.com/USUARIO/REPOSITORIO",
        demo: "https://enlace-del-proyecto.com"
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
        demo: "https://enlace-del-proyecto.com"
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

        const etiqueta = document.createElement("span");

        etiqueta.classList.add("etiqueta-tecnologia");
        etiqueta.textContent = tecnologia;

        contenedorTecnologias.appendChild(etiqueta);

    });

    // ACTUALIZAR BOTONES
    const botonRepo = document.getElementById("proyecto-repo");
    const botonDemo = document.getElementById("proyecto-demo");

    botonRepo.href = proyecto.repo || "#";
    botonDemo.href = proyecto.demo || "#";

    // Ocultar botones si no hay enlaces
    botonRepo.style.display = proyecto.repo ? "inline-flex" : "none";
    botonDemo.style.display = proyecto.demo ? "inline-flex" : "none";

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
