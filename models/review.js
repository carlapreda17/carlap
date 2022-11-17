const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    body:String,
    rating:Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' //fiecare review are un autor si se va face legatura cu datele din user
    }
})


module.exports=mongoose.model("Review", reviewSchema)