import express from 'express';
const router = express.Router();
import { supabase } from '../configs/config.js'; // Pastikan Supabase client di-import
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../configs/auth.js'; 

//get token
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

// GET semua kabupaten
router.get('/', authenticateJWT, async (req, res) => {
    const { data, error } = await supabase
        .from('kabupaten')
        .select();

    if (error) {
        return res.status(400).send(error);
    }
    
    res.send(data);
});

// GET kabupaten berdasarkan idkabupaten
router.get('/:id', authenticateJWT, async (req, res) => {
    const { data, error } = await supabase
        .from('kabupaten')
        .select()
        .eq('idkabupaten', req.params.id)
        .single();

    if (error) {
        return res.status(400).send(error);
    }
    
    res.send(data);
});

// POST kabupaten baru
router.post('/', authenticateJWT,  async (req, res) => {
    const { error } = await supabase
        .from('kabupaten')
        .insert({
            kabupaten: req.body.kabupaten
        });

    if (error) {
        return res.status(400).send(error);
    }

    res.send("Kabupaten created!");
});

// PUT update kabupaten berdasarkan idkabupaten
router.put('/:id',  authenticateJWT, async (req, res) => {
    const { error } = await supabase
        .from('kabupaten')
        .update({
            kabupaten: req.body.kabupaten
        })
        .eq('idkabupaten', req.params.id);

    if (error) {
        return res.status(400).send(error);
    }

    res.send("Kabupaten updated!");
});

// DELETE kabupaten berdasarkan idkabupaten
router.delete('/:id',  authenticateJWT, async (req, res) => {
    const { error } = await supabase
        .from('kabupaten')
        .delete()
        .eq('idkabupaten', req.params.id);

    if (error) {
        return res.status(400).send(error);
    }

    res.send("Kabupaten deleted!");
});

export default router;
