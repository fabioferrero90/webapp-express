const ImagePath = (req, res, next) => {
  req.imagepath = `${req.protocol}://${req.get('host')}/movies_cover`
  next()
}

module.exports = ImagePath;