
// importo la connessione al db
const connection = require('../data/db')
const imageUpdater = require('../middlewares/imageUpdater');

const index = (req, res) => {

  const sql = 'SELECT * FROM movies';

  // effettuo la query al db
  connection.query(sql, (err, results) => {
    if (err) {return res.status(500).json({ error: "Query al database fallita" });
    }

    // CONTROLLO SE CI SONO LE FOTO NEL DB
    for(movie of results){
      if(!movie.image){
        movie.image = imageUpdater(movie.title, movie.id);
      }
    }

    res.json(results);
  })
}

const show = (req, res) => {

  const id = req.params.id;
  const sql = `SELECT m.*, ROUND(AVG(r.vote), 1) AS avg_rating
    FROM movies m
    LEFT JOIN reviews r ON m.id = r.movie_id
    WHERE m.id = ?;`;
  
  connection.query(sql, [id], (err, results) => {
    if (err) {return res.status(500).json({ error: err.sqlMessage })};
    
    if (results.length === 0) {return res.status(404).json({ error: "Film non trovato" });};
    
    const postObj = {
      id: results[0].id,
      title: results[0].title,
      director: results[0].director,
      genre: results[0].genre,
      release_year: results[0].release_year,
      abstract: results[0].abstract,
      image: results[0].image,
      created_at: results[0].created_at,
      updated_at: results[0].updated_at,
      avg_rating: results[0].avg_rating,
      reviews: []
    };
    // console.log(results)
    // results.forEach(review => {
    //   postObj.reviews.push({
    //     id: reviews.review_vote,
    //     name: reviews.review_text
    //   })
    // });

    res.json(postObj);
  })
}

//store
const store = (req, res) => {
  res.send('Film inserito')
}

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
  
  const sql = 'DELETE FROM movies WHERE id = ?';
  connection.query(sql, [id], (err) => {
    if (err) {res.status(500).json({ error: "Query al database fallita" })};
    res.json({ message: "Film eliminato" });
  })
}

module.exports = {
  index,
  show,
  store,
  update,
  modify,
  destroy
}