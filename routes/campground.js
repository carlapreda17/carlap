
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds=require('../cotrollers/campgrounds')

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.CreateCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


/*
//afisam datele in pagina principala
router.get('/', catchAsync(campgrounds.index))

//pagina pt a crea un nou element(trebuie sa fie inaintea id ului)
router.get('/new', isLoggedIn, catchAsync(camprgounds.renderNewForm));

//extrage elementul nou, il salveaza,  ii creeaza pagina
router.post("/", validateCampground,catchAsync(camprgounds.CreateCampground))

//pagina cu detaliile fiecarui camp
router.get('/:id', catchAsync(camprgounds.showCampground));

//pagina pt edit
router.get('/:id/edit', isLoggedIn, isAuthor, camprgounds.renderEditForm)

//postare element editat
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(camprgounds.updateCampground));
//stergere
router.delete('/:id', camprgounds.deleteCampground); */

module.exports=router;
