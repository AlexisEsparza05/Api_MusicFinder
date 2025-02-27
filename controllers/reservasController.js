const reservas = []; // Aquí se guardarán las reservas temporalmente (usualmente usarías una base de datos)

const getReservas = (req, res) => {
  const { fecha } = req.params;

  // Filtramos las reservas por fecha
  const reservasFiltradas = reservas.filter(reserva => reserva.fecha === fecha);

  if (reservasFiltradas.length > 0) {
    return res.status(200).json(reservasFiltradas);
  } else {
    return res.status(404).json({ message: 'No se encontraron reservas para esta fecha.' });
  }
};

const crearReserva = (req, res) => {
  const { fecha } = req.params;
  const { hora, profesor, alumno, clase } = req.body; // Datos que se esperan en el cuerpo de la solicitud

  // Verifica que los datos sean correctos
  if (!hora || !profesor || !alumno || !clase) {
    return res.status(400).json({ message: 'Faltan datos para crear la reserva.' });
  }

  // Crear una nueva reserva
  const nuevaReserva = { fecha, hora, profesor, alumno, clase };

  // Agregar la nueva reserva a la lista
  reservas.push(nuevaReserva);

  return res.status(201).json({ message: 'Reserva creada correctamente', reserva: nuevaReserva });
};

const actualizarReserva = (req, res) => {
  const { fecha, hora } = req.params;
  const { profesor, alumno, clase } = req.body;

  // Buscar la reserva existente
  const reservaIndex = reservas.findIndex(r => r.fecha === fecha && r.hora === hora);

  if (reservaIndex === -1) {
    return res.status(404).json({ message: 'Reserva no encontrada.' });
  }

  // Actualizar la reserva
  reservas[reservaIndex] = { fecha, hora, profesor, alumno, clase };

  return res.status(200).json({ message: 'Reserva actualizada correctamente', reserva: reservas[reservaIndex] });
};

const eliminarReserva = (req, res) => {
  const { fecha, hora } = req.params;

  // Buscar la reserva para eliminarla
  const reservaIndex = reservas.findIndex(r => r.fecha === fecha && r.hora === hora);

  if (reservaIndex === -1) {
    return res.status(404).json({ message: 'Reserva no encontrada.' });
  }

  // Eliminar la reserva
  reservas.splice(reservaIndex, 1);

  return res.status(200).json({ message: 'Reserva eliminada correctamente' });
};

module.exports = {
  getReservas,
  crearReserva,
  actualizarReserva,
  eliminarReserva
};
