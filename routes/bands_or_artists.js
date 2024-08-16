const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create new Band/Artist
router.post('/', (req, res) => {
    const { name, genre, location } = req.body;

    // Validate that none of the required fields are empty or undefined
    if (!name || !genre || !location) {
      return res.status(400).json({ 
        error: 'All fields (name, genre, and location) are required and cannot be empty.'
      });
    }

    const sql = 'INSERT INTO bands_or_artists (name, genre, location) VALUES (?, ?, ?)';
    db.query(sql, [name, genre, location], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Band or artist created', albumId: result.insertId });
    });
  });

// Read all bands or artists (optional: limit and/or offset)
router.get('/', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
  const offset = req.query.offset ? parseInt(req.query.offset, 10) : null;

  let sql = 'SELECT * FROM bands_or_artists';

  if (limit !== null && offset !== null) {
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
  } else if (limit !== null) {
    sql += ` LIMIT ${limit}`;
  } else if (offset !== null) {
    sql += ` OFFSET ${offset}`;
  }

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
      return res.status(404).json({ message: 'Band or Artist not found' });
    }
    res.status(200).json(result[0]);
  });
});


// Read band or artist based on search value
router.get('/search', (req, res) => {
  const searchField = req.query.field;  // Field to search
  const searchValue = req.query.value; // Value to search for

  if (!searchField || !searchValue) {
    return res.status(400).json({ error: 'Search field and value are required' });
  }

  const sql = 'SELECT * FROM bands_or_artists WHERE ?? LIKE ?';
  db.query(sql, [searchField, `%${searchValue}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Update a Band/Artist by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, genre, location } = req.body;

  const updates = [];
  const values = [];

  if (name !== undefined)  {
    updates.push('name = ?');
    values.push(name);
  }

  if (genre !== undefined) {
    updates.push('genre = ?');
    values.push(genre);
  }

  if (location !== undefined) {
    updates.push('location = ?');
    values.push(location);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'At least one field (name, genre, or location) must be provided for update.' });
  }

  const sql = `UPDATE bands_or_artists SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Band or artist not found' });
    }
    res.status(200).json({ message: 'Band or artist updated' });
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
      return res.status(404).json({ message: 'Band or artist not found' });
    }
    res.status(200).json({ message: 'Band or artist deleted' });
  });
});

module.exports = router;