const fs = require("fs");
const path = require("path");

const reservasPath = path.join(__dirname, "../data/reservas.json");

// Función para leer las reservas desde el archivo
const leerReservas = () => {
    if (!fs.existsSync(reservasPath)) {
        return {};
    }
    const data = fs.readFileSync(reservasPath, "utf8");
    return JSON.parse(data);
};

// Función para guardar reservas en el archivo
const guardarReservas = (reservas) => {
    fs.writeFileSync(reservasPath, JSON.stringify(reservas, null, 2), "utf8");
};

// Función para verificar si dos horarios se solapan
const horariosSeSolapan = (nuevoHorario, horariosExistentes) => {
    const [nuevaInicio, nuevaFin] = nuevoHorario.split(" - ").map(hora => convertirAHoras(hora));

    return horariosExistentes.some(reserva => {
        const [inicio, fin] = reserva.horario.split(" - ").map(hora => convertirAHoras(hora));
        return !(nuevaFin <= inicio || nuevaInicio >= fin); // Si no hay separación, hay choque
    });
};

// Función para convertir formato "10:00 AM" a número (ejemplo: 10.00, 13.30)
const convertirAHoras = (hora) => {
    let [tiempo, periodo] = hora.split(" ");
    let [horas, minutos] = tiempo.split(":").map(Number);

    if (periodo === "PM" && horas !== 12) horas += 12;
    if (periodo === "AM" && horas === 12) horas = 0;

    return horas + minutos / 60;
};

// PUT: Crear una nueva reserva con horario de rango
const crearReserva = (req, res) => {
    const { profesorID, precio, fecha, ubicacion, descripcion, horario } = req.body;

    if (!profesorID || !precio || !fecha || !ubicacion || !descripcion || !horario) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const reservas = leerReservas();

    // Si la fecha no existe, la creamos
    if (!reservas[fecha]) {
        reservas[fecha] = [];
    }

    // Verificar si hay choque de horarios con el mismo profesor
    const conflicto = horariosSeSolapan(horario, reservas[fecha].filter(r => r.profesorID === profesorID));

    if (conflicto) {
        return res.status(400).json({ error: "El horario ya está ocupado para este profesor en esta fecha" });
    }

    // Crear nueva reserva
    const nuevaReserva = {
        profesorID,
        precio,
        ubicacion,
        descripcion,
        horario
    };

    reservas[fecha].push(nuevaReserva);
    guardarReservas(reservas);

    res.status(201).json({ mensaje: "Reserva creada con éxito", reserva: nuevaReserva });
};

// GET: Obtener reservas (todas, por fecha o por profesorID)
const obtenerReservas = (req, res) => {
    const { profesorID, fecha } = req.query;
    const reservas = leerReservas();

    if (!profesorID && !fecha) {
        return res.json(reservas);
    }

    let resultados = {};

    if (fecha && reservas[fecha]) {
        resultados[fecha] = reservas[fecha];
    }

    if (profesorID) {
        Object.keys(reservas).forEach(f => {
            reservas[f] = reservas[f].filter(reserva => reserva.profesorID === profesorID);
            if (reservas[f].length > 0) {
                resultados[f] = reservas[f];
            }
        });
    }

    res.json(resultados);
};

module.exports = { crearReserva, obtenerReservas };
