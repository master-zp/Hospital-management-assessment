#!/usr/bin/env node
const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'Password123!';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
