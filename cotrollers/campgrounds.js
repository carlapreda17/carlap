const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
module.exports.index=async function(req,res){
    const campgrounds= await Campground.find({}); //scoatem datele
     res.render('campgrounds/index', {campgrounds}); //le scoatem din index
}

module.exports.renderNewForm= async (req, res) => {
    
    res.render('campgrounds/new');

}

module.exports.CreateCampground= async function(req,res,next){
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
         const campground=new Campground(req.body.campground);
         campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); //daca fac un vector va contine adresa url a fiecarei poze si path ul, le adaugam in campground
      //  console.log(req.body,req.files);
         campground.author = req.user._id; //salveaza in autor id ul
         await campground.save();
         req.flash('success','Successfully made a new campground')
         res.redirect(`/campgrounds/${campground._id}`);
    
 }

 module.exports.showCampground= async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' //populam authorul pt campground dar si cel pt review
        }
    }).populate('author');//extragem id-ul si salvam data +bagam si ce gasim in review uri
    if(!campground){
        req.flash('error', 'Cannot find campground');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}



 module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'Cannot find campground');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}


 module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //luam datele campgroundului
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename })); //face vectorul de poze
    campground.images.push(...imgs); //luam datele din array si facem push
    await campground.save(); //salvam noul campground
    if (req.body.deleteImages) { //daca sunt in array imagini de sters
        for (let filename of req.body.deleteImages) { //loop over each one
            await cloudinary.uploader.destroy(filename); //le stergem si din cloudinary
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) //scoatem elementele din images array unde filename este in deleteimages care e din edit
    }

    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
    
}

 module.exports.deleteCampground = async function(req,res){
    const { id } = req.params;
   await Campground.findByIdAndDelete(id);
   req.flash('success', 'Successfully deleted campground')
   res.redirect('/campgrounds');
}