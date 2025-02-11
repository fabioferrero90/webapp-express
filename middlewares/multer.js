const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'public/movies_cover',

  filename: function (req, file, cb) {

    //creo un nome univoco per il file
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName)
  }
})

const upload = multer({storage});

module.exports = upload;
