/* =========================================================
   RACE TIMELINE / DRIVER CAREER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // CAMBIO ENTRE SOBRE MÍ Y MI TRAYECTORIA
    // =====================================================

    const card = document.getElementById("driver-card-toggle");
    const aboutView = document.querySelector(".driver-view-about");
    const careerView = document.querySelector(".driver-view-career");

    const navAbout = document.querySelector('a[href="#sobre-mi"]');
    const navCareer = document.querySelector('a[href="#trayectoria"]');

    function setDriverView(view) {
        const showCareer = view === "career";

        aboutView?.classList.toggle("is-active", !showCareer);
        careerView?.classList.toggle("is-active", showCareer);

        aboutView?.setAttribute("aria-hidden", String(showCareer));
        careerView?.setAttribute("aria-hidden", String(!showCareer));

        card?.setAttribute("aria-expanded", String(showCareer));
        card?.setAttribute(
            "aria-label",
            showCareer ? "Mostrar sobre mí" : "Mostrar mi trayectoria"
        );

        navAbout?.setAttribute("aria-current", showCareer ? "false" : "page");
        navCareer?.setAttribute("aria-current", showCareer ? "page" : "false");
    }

    // Estado inicial
    setDriverView("about");

    // Activar la tarjeta con clic
    card?.addEventListener("click", () => {
        const estaEnTrayectoria = card.getAttribute("aria-expanded") === "true";
        setDriverView(estaEnTrayectoria ? "about" : "career");
    });

    // Permitir activar la tarjeta con teclado
    card?.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();

            const estaEnTrayectoria = card.getAttribute("aria-expanded") === "true";
            setDriverView(estaEnTrayectoria ? "about" : "career");
        }
    });

    // El menú cambia la vista y mantiene la sección en pantalla
    navAbout?.addEventListener("click", (evento) => {
        evento.preventDefault();
        setDriverView("about");

        document.getElementById("sobre-mi")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    navCareer?.addEventListener("click", (evento) => {
        evento.preventDefault();
        setDriverView("career");

        document.getElementById("sobre-mi")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // Información de cada etapa de mi trayectoria
    const etapas = [
        {
            periodo: "año-año",
            titulo: "Primeros pasos en ingeniería",
            descripcion: "Formación en Sistemas de Control Eléctrico en el IPN, donde comenzó mi acercamiento a los sistemas, la electrónica y la resolución técnica de problemas.",
            area: "Formación técnica · Electrónica · Sistemas"
        },
        {
            periodo: "año-año",
            titulo: "Exploración de la robótica",
            descripcion: "Estudios de Ingeniería en Robótica en la Universidad de Ecatepec. Una etapa que fortaleció mi interés por integrar hardware, programación y diseño para construir soluciones.",
            area: "Robótica · Diseño · Ingeniería"
        },
        {
            periodo: "año-año",
            titulo: "FIRST y mentoría de equipos",
            descripcion: "Como coach y mentor de equipos de robótica, acompaño a jóvenes en procesos de ingeniería, diseño, estrategia y trabajo colaborativo dentro de FIRST Tech Challenge.",
            area: "Mentoría · Coordinación · Ingeniería"
        },
        {
            periodo: "año-año",
            titulo: "Innovación y proyectos tecnológicos",
            descripcion: "Participación en retos y proyectos como NASA Space Apps, Aztlan Vita F y TERRA-6, explorando soluciones que conectan tecnología, investigación y trabajo multidisciplinario.",
            area: "Innovación · Prototipado · Trabajo en equipo"
        },
        {
            periodo: "año-año",
            titulo: "Desarrollo de software",
            descripcion: "Formación en Ingeniería en Sistemas y en el programa Full Stack Java de Generation México. Actualmente enfoco mi crecimiento en desarrollo de software, backend y análisis de datos.",
            area: "Java · Desarrollo web · Backend · Datos"
        }
    ];

    // Obtener los elementos del HTML
    const marcadores = [...document.querySelectorAll(".race-marker")];

    const periodo = document.getElementById("race-period");
    const titulo = document.getElementById("race-title");
    const descripcion = document.getElementById("race-description");
    const area = document.getElementById("race-area");

    const sector = document.getElementById("race-sector");
    const progreso = document.getElementById("race-progress-fill");

    const anterior = document.getElementById("race-prev");
    const siguiente = document.getElementById("race-next");

    // Comprobar que los elementos necesarios existan
    if (!marcadores.length || !periodo || !titulo || !descripcion || !area) {
        return;
    }

    // Primera etapa seleccionada
    let etapaActual = 0;

    // Función para mostrar la información de una etapa
    function mostrarEtapa(indice) {

        // Permite avanzar y regresar de forma circular
        etapaActual = (indice + etapas.length) % etapas.length;

        const etapa = etapas[etapaActual];

        // Actualizar contenido
        periodo.textContent = etapa.periodo;
        titulo.textContent = etapa.titulo;
        descripcion.textContent = etapa.descripcion;
        area.textContent = etapa.area;

        // Actualizar número de sector
        sector.textContent =
            `SECTOR ${String(etapaActual + 1).padStart(2, "0")} / 05`;

        // Actualizar barra de progreso
        progreso.style.width =
            `${((etapaActual + 1) / etapas.length) * 100}%`;

        // Actualizar marcador activo
        marcadores.forEach((marcador, i) => {

            const activo = i === etapaActual;

            marcador.classList.toggle("is-active", activo);

            marcador.setAttribute(
                "aria-pressed",
                String(activo)
            );

        });
    }

    // Seleccionar una etapa haciendo clic en el circuito
    marcadores.forEach((marcador) => {

        marcador.addEventListener("click", () => {

            mostrarEtapa(Number(marcador.dataset.stage));

        });

        // Permitir seleccionar con Enter o barra espaciadora
        marcador.addEventListener("keydown", (evento) => {

            if (evento.key === "Enter" || evento.key === " ") {

                evento.preventDefault();

                mostrarEtapa(Number(marcador.dataset.stage));

            }

        });

    });

    // Botón para retroceder
    anterior?.addEventListener("click", () => {

        mostrarEtapa(etapaActual - 1);

    });

    // Botón para avanzar
    siguiente?.addEventListener("click", () => {

        mostrarEtapa(etapaActual + 1);

    });

    // Mostrar la primera etapa al cargar la página
    mostrarEtapa(0);

});