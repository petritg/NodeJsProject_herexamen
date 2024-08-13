const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create new Band/Artist
router.post('/bands_or_artists', (req, res) => {
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

// Read a single Band/Artist by ID

// Update a Band/Artist by ID

// Delete a Band/Artist by ID