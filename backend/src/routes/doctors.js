const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listDoctors } = require('../services/hmsService');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const doctors = await listDoctors({ departmentId: req.query.departmentId });
    res.json({ doctors });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
