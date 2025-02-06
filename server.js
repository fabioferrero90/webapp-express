const express = require('express');
const app = express();
const port = 3000;

const errorsHandler = require('./middlewares/errorsHandler')
const notFound = require('./middlewares/notFound')

const moviesRouter = require('./routers/movies');

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server dei Film');
})

app.use('/movies', moviesRouter)

app.use(errorsHandler)

app.use(notFound)

app.listen(port, () => {
  console.log(`Sono in ascolto sulla porta ${port} `);
})