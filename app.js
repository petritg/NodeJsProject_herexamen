const express = require('express');
const bodyParser = require('body-parser');
const albumsRoutes = require('./routes/albums');
const bandsOrArtistsRoutes = require('./routes/bands_or_artists');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/albums', albumsRoutes)
app.use('/bands_or_artists', bandsOrArtistsRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
