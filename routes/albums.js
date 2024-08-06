const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new album
router.post('/albums', (req, res) => {
    const { album_naam, bandofartist } = req.body;
    const sql = 'INSERT INTO albums (album_naam, bandofartist) VALUES (?, ?)';
    db.query(sql, [album_naam, bandofartist], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Album created', albumId: result.insertId });
    });
  });

// Read all albums
router.get('/albums', (req, res) => {
    const sql = 'SELECT * FROM albums';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  });

// Read a single album by ID
router.get('/albums/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM albums WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Album not found' });
      }
      res.status(200).json(result[0]);
    });
  });

// Update an album by ID
router.put('/albums/:id', (req, res) => {
    const { id } = req.params;
    const { album_naam, bandofartist } = req.body;
    const sql = 'UPDATE albums SET album_naam = ?, bandofartist = ? WHERE id = ?';
    db.query(sql, [album_naam, bandofartist, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Album not found' });
      }
      res.status(200).json({ message: 'Album updated' });
    });
  });

// Delete an album by ID
router.delete('/albums/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM albums WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Album not found' });
      }
      res.status(200).json({ message: 'Album deleted' });
    });
  });

module.exports = router;
