const connection = require('../data/db')

const imageUpdater = (movieName, id, res) => {
  const imagename = movieName.toLowerCase().replace(/ /g, '_').replace(/:/g, '') + '.jpg';
  const sql = `UPDATE movies SET image = '${imagename}' WHERE id = ${id}`;
  connection.query(sql, (err, results) => {
    if (err) {res.status(500).json({ error: err.sqlMessage });}
    console.log('Immagine aggiornata per il film ' + movieName);
    return imagename;
  });
}

module.exports = imageUpdater;