import express from 'express';
const router = express.Router();
import { supabase } from '../configs/config.js'; // Pastikan Supabase client di-import

// GET semua berita
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('berita')
        .select();

    if (error) {
        return res.status(400).send(error);
    }
    
    res.send(data);
});

// GET berita berdasarkan idberita
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('berita')
        .select()
        .eq('idberita', req.params.id)
        .single();

    if (error) {
        return res.status(400).send(error);
    }
    
    res.send(data);
});

// POST berita baru
router.post('/', async (req, res) => {
    const { error } = await supabase
        .from('berita')
        .insert({
            judul: req.body.judul,
            isi: req.body.isi,
            author: req.body.author
        });

    if (error) {
        return res.status(400).send(error);
    }

    res.send("Berita created!");
});

// PUT update berita berdasarkan idberita
router.put('/:id', async (req, res) => {
    const { error } = await supabase
        .from('berita')
        .update({
            judul: req.body.judul,
            isi: req.body.isi,
            author: req.body.author
        })
        .eq('idberita', req.params.id);

    if (error) {
        return res.status(400).send(error);
    }

    res.send("Berita updated!");
});

// DELETE berita berdasarkan idberita
router.delete('/:id', async (req, res) => {
    const { error } = await supabase
        .from('berita')
        .delete()
        .eq('idberita', req.params.id);

    if (error) {
        return res.status(400).send(error);
    }

    res.send("Berita deleted!");
});

export default router;
