import express from 'express';
const router = express.Router();
import { supabase } from '../configs/config.js'; // Pastikan Supabase client di-import
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


// GET semua berita
router.get('/', authenticateJWT,  async (req, res) => {
    const { data, error } = await supabase
        .from('anak')
        .select();

    if (error) {
        return res.status(400).send(error);
    }
    
    res.send(data);
});

// GET berita berdasarkan idberita
router.get('/:id',  authenticateJWT, async (req, res) => {
    const { data, error } = await supabase
        .from('anak')
        .select()
        .eq('idanak', req.params.id)
        .single();

    if (error) {
        return res.status(400).send(error);
    }
    
    res.send(data);
});

// POST berita baru
router.post('/',  authenticateJWT, async (req, res) => {
    const { error } = await supabase
        .from('anak')
        .insert({
            idanak:req.body.idanak,
            nama: req.body.nama,
            tempatlahir: req.body.tempatlahir,
            tanggallahir: req.body.tanggallahir
        });

    if (error) {
        return res.status(400).send(error);
    }

    res.send("data anak dibuat!");
});

// PUT update berita berdasarkan idberita
router.put('/:id',  authenticateJWT, async (req, res) => {
    const { error } = await supabase
        .from('anak')
        .update({
            idanak:req.body.idanak,
            nama: req.body.nama,
            tempatlahir: req.body.tempatlahir,
            tanggallahir: req.body.tanggallahir
        })
        .eq('idanak', req.params.id);

    if (error) {
        return res.status(400).send(error);
    }

    res.send("Data anak sudah diupdate");
});

// DELETE berita berdasarkan idberita
router.delete('/:id',  authenticateJWT, async (req, res) => {
    const { error } = await supabase
        .from('anak')
        .delete()
        .eq('idanak', req.params.id);

    if (error) {
        return res.status(400).send(error);
    }

    res.send("Data anak berhasil dihapus!");
});

export default router;
