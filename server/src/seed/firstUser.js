import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

async function run() {
  const { MONGO_URI = 'mongodb://127.0.0.1:27017/ibac' } = process.env;

  await mongoose.connect(MONGO_URI);
  console.log('Mongo conectado para seed.');

  const name = 'Felipe Hilário Cesar dos Santos';
  const email = 'hilariofelipe622@gmail.com';
  const plainPassword = 'Fg89203195@';
  const role = 'volunteer';           // acesso ao Dashboard
  const position = '1º Secretário';   // cargo

  // sempre gerar o hash da senha para garantir consistência
  const hash = await bcrypt.hash(plainPassword, 10);

  let user = await User.findOne({ email });

  if (user) {
    console.log('Usuário já existe, atualizando dados...');
    user.name = name;
    user.position = position;
    user.role = role;
    user.password = hash; // <-- garante que existe password válido
    await user.save();
  } else {
    await User.create({
      name,
      email,
      password: hash,
      role,
      position,
    });
    console.log('Usuário criado com sucesso!');
  }

  await mongoose.disconnect();
  console.log('Seed concluído.');
}

run().catch(err => { console.error(err); process.exit(1); });
