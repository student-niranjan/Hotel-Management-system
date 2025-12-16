import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import ApiError from './apiError';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
}); 
const uploadRoomImages = async(localFilepath) => {
    try {  
        if(!localFilepath) 
        throw new ApiError ( 401,"File path is required");
    const result = await cloudinary.uploader.upload(localFilepath, {
        folder: 'public/rooms',
    });
console.log( "images is upload sucessfully",result);
    // Remove file from server after upload
    fs.unlinkSync(localFilepath);
    return {
        public_id: result.public_id,
        url: result.secure_url,
    };              
    
} catch (error) {

    throw new ApiError(500, "Cloudinary upload failed");
}
}

const deleteImage = async(public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);

    } catch (error) {
        throw new ApiError(500, "Cloudinary deletion failed");
    }       
    
}

export {uploadRoomImages,deleteImage}  


