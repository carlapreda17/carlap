
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//afisam datele in pagina principala
router.get('/', catchAsync(async function(req,res){
       const campgrounds= await Campground.find({}); //scoatem datele
        res.render('campgrounds/index', {campgrounds}); //le scoatem din index
}))

//pagina pt a crea un nou element(trebuie sa fie inaintea id ului)
router.get('/new', isLoggedIn, (req, res) => {
    
    res.render('campgrounds/new');
})

//extrage elementul nou, il salveaza,  ii creeaza pagina
router.post("/", catchAsync(async function(req,res,next){
   // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
       
        const campground=new Campground(req.body.campground);
        await campground.save();
        req.flash('success','Successfully made a new campground')
        res.redirect(`/campgrounds/${campground._id}`);
   
   

}))

//pagina cu detaliile fiecarui camp
router.get('/:id', catchAsync( async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews') //extragem id-ul si salvam data +bagam si ce gasim in review uri
    if(!campground){
        req.flash('error', 'Cannot find campground');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

//pagina pt edit
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'Cannot find campground');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
})

//postare element editat
router.put('/:id', isLoggedIn,validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));
//stergere
router.delete('/:id', async function(req,res){
     const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
})

module.exports=router;