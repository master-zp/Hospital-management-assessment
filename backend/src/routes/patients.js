const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listPatients, getPatient, createPatient } = require('../services/hmsService');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const patients = await listPatients({ q: req.query.q });
    res.json({ patients });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const patient = await getPatient(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    return res.json({ patient });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, phone, email, city, bloodType, mrn } =
      req.body || {};
    if (!firstName || !lastName || !dateOfBirth || !gender) {
      return res.status(400).json({
        error: 'firstName, lastName, dateOfBirth, and gender are required',
      });
    }
    if (!['M', 'F', 'O'].includes(gender)) {
      return res.status(400).json({ error: 'gender must be M, F, or O' });
    }
    const patient = await createPatient(
      { firstName, lastName, dateOfBirth, gender, phone, email, city, bloodType, mrn },
      req.user.id
    );
    return res.status(201).json({ patient });
  } catch (err) {
    if (err.errorNum === 1) {
      return res.status(409).json({ error: 'MRN already exists' });
    }
    return next(err);
  }
});

module.exports = router;
