import express from 'express';
const router = express.Router();
import { supabase } from '../configs/config.js'; // Import Supabase client dari config.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../configs/auth.js'; 



// GET token
router.get('/login', async (req, res) => {
    const { name, password } = req.body;
    const { data:users, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', name)
        .single();

    if (error || !users) {
        return res.status(400).json({ message:'Invalid Credentials' });
    }
    //verifikasi password
    const validPassword = await bcrypt.compare(password, users.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid Credentials' });
        }
    //jika valid buat jwt token
    const token = jwt.sign({ id: users.id, name: users.name }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json(token);
});

//get all user
router.get('/', authenticateJWT, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('name');

  if (error) {
    return res.status(400).send(error);
  }

  res.send(data);
});

// GET user berdasarkan id
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', req.params.id)
        .single();

    if (error) {
        return res.status(400).send(error);
    }
    
    res.send(data);
});

// POST user baru
router.post('/', authenticateJWT, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash password sebelum menyimpan
  const { error } = await supabase
    .from('users')
    .insert({
      created_at: req.body.created_at,
      name: req.body.name,
      level: req.body.level,
      password: hashedPassword
    });

  if (error) {
    return res.status(400).send(error);
  }

  res.send("User created!");
});


// PUT update user berdasarkan id
router.put('/:id', authenticateJWT, async (req, res) => {
  const { error } = await supabase
    .from('users')
    .update({
      name: req.body.name,
      level: req.body.level,
      password: req.body.password
    })
    .eq('id', req.params.id);

  if (error) {
    return res.status(400).send(error);
  }

  res.send("User updated!");
});


// DELETE user berdasarkan id
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    return res.status(400).send(error);
  }

  res.send("User deleted!");
});

export default router;
