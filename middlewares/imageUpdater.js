const connection = require('../data/db')

const imageUpdater = (movieName, id, res) => {
  console.log(movieName)
  const imagename = movieName.toLowerCase().replace(/ /g, '_').replace(/:/g, '') + '.jpg';
  console.log(imagename)

  const sql = `UPDATE movies SET image = '${imagename}' WHERE id = ${id}`;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.sqlMessage });
    }

    console.log('Immagine aggiornata per il film ' + movieName);
  });
}

module.exports = imageUpdater;