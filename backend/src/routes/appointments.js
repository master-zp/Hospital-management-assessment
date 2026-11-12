const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listAppointments,
  createAppointment,
  updateAppointmentStatus,
} = require('../services/hmsService');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const appointments = await listAppointments({
      status: req.query.status,
      doctorId: req.query.doctorId,
      from: req.query.from,
      to: req.query.to,
    });
    res.json({ appointments });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { patientId, doctorId, scheduledAt, durationMinutes, reason, notes } = req.body || {};
    if (!patientId || !doctorId || !scheduledAt) {
      return res.status(400).json({
        error: 'patientId, doctorId, and scheduledAt are required',
      });
    }
    const appointment = await createAppointment(
      { patientId, doctorId, scheduledAt, durationMinutes, reason, notes },
      req.user.id
    );
    return res.status(201).json({ appointment });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    return next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status is required' });
    const appointment = await updateAppointmentStatus(req.params.id, status);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    return res.json({ appointment });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    return next(err);
  }
});

module.exports = router;
