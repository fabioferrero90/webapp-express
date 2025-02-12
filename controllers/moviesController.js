
// importo la connessione al db
const connection = require('../data/db')
const imageUpdater = require('../middlewares/imageUpdater');
const path = require('path')
const fs = require('fs')
const index = (req, res) => {

  const sql = `SELECT m.*, ROUND(AVG(r.vote), 1) AS avg_rating
    FROM movies m
    LEFT JOIN reviews r ON m.id = r.movie_id
    GROUP BY m.id`;
  
  // EFFETTUO LA QUERY AL DB
  connection.query(sql, (err, results) => {
    if (err) {return res.status(500).json({ error: "Query al database fallita" });}

    // CONTROLLO SE CI SONO LE IMMAGINI NEL DB
    for(movie of results){
      if(!movie.image){
        movie.image = imageUpdater(movie.title, movie.id);
      }
      //AGGIUNGO IL PERCORSO DELL'IMMAGINE
      movie.image = `${req.imagepath}/${movie.image}`;
    }

    // RESTITUISCO IL RISULTATO FINALE
    res.json(results);
  })
}
  

const show = (req, res) => {

  const id = req.params.id;
  const sql = `SELECT * FROM movies WHERE id = ?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {return res.status(500).json({ error: err.sqlMessage })};
    
    if (results.length === 0) {return res.status(404).json({ error: "Film non trovato" });};
    
    let movie = results[0];
    //Aggiungo il percorso dell'immagine
    if (movie.image) {
      movie.image = `${req.imagepath}/${movie.image}`;
    }

    const reviewsSql = `SELECT * FROM reviews WHERE movie_id = ?`;
    connection.query(reviewsSql, [id], (err, reviews) => {
      if (err) {return res.status(500).json({ error: err.sqlMessage })};

      movie.reviews = reviews;
      res.json(movie);
    });
  });
}

//store della review
const storeReview = (req, res) => {
  const movie_id = req.params.id;
  const { name, vote, text } = req.body;

  const sql = 'INSERT INTO reviews SET movie_id = ?, name = ?, vote = ?, text = ?';
  connection.query(sql, [movie_id, name, vote, text], (err, results) => {
    if (err) {return res.status(500).json({ error: err.sqlMessage })};

    res.json({ message: "Recensione inserita" });
  });
}


//store
const store = (req, res) => {
  const { title, director, genre, release_year, abstract } = req.body;
  const imageName = req.file.filename;


  const sql = 'INSERT INTO movies (title, director, genre, release_year, abstract, image) VALUES(?, ?, ?, ?, ?, ?)';
  connection.query(sql, [title, director, genre, release_year, abstract, imageName], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.sqlMessage });
    }
    
    console.log("Inserito nuovo film:", title);
    res.status(201).json({ message: "Film inserito" });
  });
};

// update
const update = (req, res) => {
  const id = req.params.id;
  res.send(`Modifica Film ${id}`);
}

//modifica
const modify = (req, res) => {
  const id = req.params.id;
  res.send(`Modifica Film ${id}`);
}

//delete
const destroy = (req, res) => {
  const id = req.params.id;
  const sqlSelect = 'SELECT image FROM movies WHERE id = ?';
  
  connection.query(sqlSelect, [id], (err, results) => {
    if (err) {return res.status(500).json({ error: "Errore nella selezione dell'immagine" })};
    const imageName = results[0].image;
    const imagePath = path.join(__dirname, '..', 'public/movies_cover', imageName);
    res.json({ message: imagePath });
    
    //Elimino l'immagine dal server
    fs.unlink(imagePath, (err) => {
      if (err) {return res.status(500).json({ error: "Errore nella cancellazione dell'immagine"})};
    });
  });
  
  const sqlDelete= 'DELETE FROM movies WHERE id = ?';
  connection.query(sqlDelete, [id], (err) => {
    if (err) {return res.status(500).json({ error: "Query al database fallita" })};
    res.json({ message: "Film eliminato" });
  });
}

module.exports = {
  index,
  show,
  storeReview,
  store,
  update,
  modify,
  destroy
}