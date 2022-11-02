const UserProfile = require("../models/userprofile");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

exports.addUserProfile = BigPromise( async (req, res, next) => {
    //images
    let imageArray = [];

    if (!req.files){
        return next(new CustomError('images are required', 401));
    }

    if(req.files){
        for(let index=0; index < req.files.photos.length; index++){
            let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "profile"
            });

            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }
    }
    
    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const userprofile = await UserProfile.create(req.body);

    res.status(200).json({
        success: true,
        userprofile
    })
});

exports.editUserProfile = BigPromise(async (req, res, next) => {
    let userprofile = await UserProfile.findById(req.params.id);

    if(!userprofile){
        return next(new CustomError('No product found with this id', 401));
    }

    let imagesArray = [];

    if(req.files){
        //destroy the existing images
        for(let index=0; index<userprofile.photos.length; index++){
            const res = await cloudinary.v2.uploader.destroy(userprofile.photos[index].id);
        }

        //upload and save the images
        for(let index=0; index < req.files.photos.length; index++){
            let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "products"
            });

            imagesArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }
    }

    req.body.photos = imagesArray

    userprofile = await UserProfile.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        userprofile
    })
});