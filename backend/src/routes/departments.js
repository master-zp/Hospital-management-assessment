const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listDepartments } = require('../services/hmsService');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const departments = await listDepartments();
    res.json({ departments });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
