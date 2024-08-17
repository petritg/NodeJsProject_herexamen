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

// Read all albums (optional: limit and/or offset)
router.get('/', (req, res) => {
  const searchKeyword = req.query.search; // Get the search keyword from the query parameter
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
  const offset = req.query.offset ? parseInt(req.query.offset, 10) : null;

  let sql = 'SELECT * FROM albums';
  const values = [];

  if (searchKeyword) {
      sql += ' WHERE name LIKE ? OR band_or_artist LIKE ? OR year LIKE ?';
      const likeSearch = `%${searchKeyword}%`;
      values.push(likeSearch, likeSearch, likeSearch);
  }

  if (limit !== null) {
      sql += ' LIMIT ?';
      values.push(limit);
  }

  if (offset !== null) {
      sql += ' OFFSET ?';
      values.push(offset);
  }

  db.query(sql, values, (err, results) => {
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


// Update an album by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, band_or_artist, year } = req.body;

  // Create an array to hold the SQL updates and values
  const updates = [];
  const values = [];

  // Validate and add fields to the update array if provided
  if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
  }

  if (band_or_artist !== undefined) {
      updates.push('band_or_artist = ?');
      values.push(band_or_artist);
  }

  if (year !== undefined) {
      if (isNaN(year)) {
          return res.status(400).json({ error: 'Year must be a valid number.' });
      }
      updates.push('year = ?');
      values.push(year);
  }

  // Check if there's something to update
  if (updates.length === 0) {
      return res.status(400).json({ error: 'At least one field (name, band_or_artist, or year) must be provided for update.' });
  }

  // Build the SQL query
  const sql = `UPDATE albums SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
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
