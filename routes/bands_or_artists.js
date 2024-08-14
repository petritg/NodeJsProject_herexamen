const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create new Band/Artist
router.post('/', (req, res) => {
    const { name, genre, location } = req.body;
    const sql = 'INSERT INTO bands_or_artists (name, genre, location) VALUES (?, ?, ?)';
    db.query(sql, [name, genre, location], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Album created', albumId: result.insertId });
    });
  });

// Read all Bands/Artists
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM bands_or_artists';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Read a single Band/Artist by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM bands_or_artists WHERE id = ?';
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
// Update a Band/Artist by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, genre, location } = req.body;
  const sql = 'UPDATE bands_or_artists SET name = ?, genre = ?, location = ? WHERE id = ?';
  db.query(sql, [name, genre, location, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Album not found' });
    }
    res.status(200).json({ message: 'Album updated' });
  });
});

// Delete a Band/Artist by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM bands_or_artists WHERE id = ?';
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