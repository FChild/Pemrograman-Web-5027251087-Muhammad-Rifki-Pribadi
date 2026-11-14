require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
// Satu client dipakai bersama oleh controller, bukan dibuat per request.
const prisma = new PrismaClient();
module.exports = prisma;
