const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new album
router.post('/', (req, res) => {
    const { name, band_or_artist, year } = req.body;

    // Validate that none of the required fields are empty or undefined
    if (!name || !band_or_artist || !year) {
      return res.status(400).json({ 
        error: 'All fields (name, band_or_artist, and year) are required and cannot be empty.'
      });
    }

    // Validate that the year is a number
  if (isNaN(year)) {
    return res.status(400).json({ 
      error: 'Year must be a valid number.'
    });
  }
    const sql = 'INSERT INTO albums (name, band_or_artist, year) VALUES (?, ?, ?)';
    db.query(sql, [name, band_or_artist, year], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Album created', albumId: result.insertId });
    });
  });

// Read all albums
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM albums';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  });

// Read a single album by ID
router.get('/:id', (req, res) => {
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

// Read album with limit and offset
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;  // Default limit to 10
  const offset = parseInt(req.query.offset) || 0; // Default offset to 0

  const sql = 'SELECT * FROM albums LIMIT ? OFFSET ?';
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Read album based on search value
router.get('/search', (req, res) => {
  const searchField = req.query.field;  // Field to search
  const searchValue = req.query.value; // Value to search for

  if (!searchField || !searchValue) {
    return res.status(400).json({ error: 'Search field and value are required' });
  }

  const sql = 'SELECT * FROM albums WHERE ?? LIKE ?';
  db.query(sql, [searchField, `%${searchValue}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Update an album by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, band_or_artist, year } = req.body;
    const sql = 'UPDATE albums SET name = ?, band_or_artist = ?, year = ? WHERE id = ?';
    db.query(sql, [name, band_or_artist, year, id], (err, result) => {
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
router.delete('/:id', (req, res) => {
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
