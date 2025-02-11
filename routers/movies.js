const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');


// index
router.get('/', moviesController.index);

// show
router.get('/:id', moviesController.show);

// store
router.post('/', moviesController.store);

// update
router.put('/:id', moviesController.update);

// modify
router.patch('/:id', moviesController.modify);

// destroy
router.delete('/:id', moviesController.destroy);

// store review
router.post('/:id/review', moviesController.storeReview);

module.exports = router;