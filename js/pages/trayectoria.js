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



// Línea morada que recorre el circuito hasta la etapa elegida
const pista = document.querySelector(".race-track");
const largoTotal = pista.getTotalLength();

const linea = pista.cloneNode();
linea.setAttribute("class", "race-linea");
linea.setAttribute("stroke", "#a855f7");
linea.setAttribute("stroke-width", "9");
linea.style.strokeLinecap = "butt";
linea.style.transition = "stroke-dasharray .6s ease";
linea.style.filter = "drop-shadow(0 0 5px rgba(168, 85, 247, .7))";
marcadores[0].before(linea);

// Qué tan lejos del inicio de la pista queda cada marcador
const posiciones = marcadores.map((marcador) => {
    const c = marcador.querySelector("circle");
    const x = c.cx.baseVal.value;
    const y = c.cy.baseVal.value;
    let mejor = 0;
    let menor = Infinity;

    for (let largo = 0; largo <= largoTotal; largo += 2) {
        const punto = pista.getPointAtLength(largo);
        const distancia = Math.hypot(punto.x - x, punto.y - y);
        if (distancia < menor) {
            menor = distancia;
            mejor = largo;
        }
    }
    return mejor;
});

function trazarLinea(indice) {
    const inicio = posiciones[0];
    const tramo = posiciones[indice] - inicio;
    linea.style.strokeDasharray = `0 ${inicio} ${tramo} ${largoTotal}`;
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
            sector.textContent =
          `SECTOR ${String(etapaActual + 1).padStart(2, "0")} / ${String(etapas.length).padStart(2, "0")}`;

        // Actualizar barra de progreso
        progreso.style.width =
            `${((etapaActual + 1) / etapas.length) * 100}%`;

        // Actualizar marcador activo
        marcadores.forEach((marcador, i) => {

            trazarLinea(etapaActual);

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