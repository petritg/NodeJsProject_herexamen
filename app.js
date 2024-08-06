const express = require('express');
const bodyParser = require('body-parser');
const albumsRoutes = require('./routes/albums');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
