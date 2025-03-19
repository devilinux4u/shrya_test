const express = require('express');
const multer = require('multer');
const router = express.Router();
const { vehicleWishlist, wishlistImage } = require('../../db/sequelize');
const path = require('path');
const fs = require('fs');

// Ensure the uploads/wishlist directory exists
const uploadDir = path.join(__dirname, '../../uploads/wishlist');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image file.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).array('images[]', 10);

// Route for creating a wishlist item with images
router.post('/wishlistForm', upload, async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);

        const {
            id,
            purpose,
            model,
            vehicleName,
            year,
            color,
            budget,
            duration,
            kmRun,
            ownership,
            fuelType,
            description,
        } = req.body;

        // Validate required fields
        if (
            !purpose || !model || !vehicleName || !year ||
            !color || !budget || !kmRun || !ownership || !fuelType
        ) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Create wishlist item first
        const newWishlist = await vehicleWishlist.create({
            uid: id,
            purpose,
            model,
            vehicleName,
            year: parseInt(year),
            color,
            budget: parseFloat(budget),
            duration: purpose === 'rent' ? duration : null,
            kmRun: parseInt(kmRun),
            ownership,
            fuelType,
            description,
        });

        // Save image paths in the WishlistImage table
        if (req.files && req.files.length > 0) {
            const imagesToSave = req.files.map((file) => ({
                wishlistId: newWishlist.id,
                imageUrl: `/uploads/wishlist/${file.filename}`, // Save relative path
            }));

            await wishlistImage.bulkCreate(imagesToSave);
        }

        return res.status(201).json({
            success: true,
            message: 'Wishlist item created successfully with images',
            data: newWishlist,
        });
    } catch (error) {
        console.error('Error submitting wishlist:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});


// Route to get all wishlists for a user by ID
router.get('/wishlist/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      const wishlists = await vehicleWishlist.findAll({
          where: { uid: userId },
          include: [
              {
                  model: wishlistImage,
                  as: 'images',
                  attributes: ['id', 'imageUrl'], // Customize fields you want from image
              },
          ],
          order: [['createdAt', 'DESC']], // Optional: order by latest first
      });

      if (!wishlists || wishlists.length === 0) {
          return res.status(404).json({ success: false, message: 'No wishlists found for this user.' });
      }
      

      return res.json({ success: true, data: wishlists });
  } catch (error) {
      console.error('Error fetching user wishlists:', error);
      return res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message,
      });
  }
});

// Delete a wishlist item by ID
router.delete('/wishlist/delete/:wishlistId', async (req, res) => {
  const { wishlistId } = req.params;

  try {
      // Check if the wishlist exists
      const wishlist = await vehicleWishlist.findByPk(wishlistId, {
          include: [{ model: wishlistImage, as: 'images' }],
      });

      if (!wishlist) {
          return res.status(404).json({ success: false, message: 'Wishlist item not found' });
      }

      // Delete images from the file system
      for (let image of wishlist.images) {
          const filePath = path.join(__dirname, '../../', image.imageUrl);
          if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
          }
      }

      // Delete wishlist + associated images from DB (due to CASCADE)
      await wishlist.destroy();

      res.json({ success: true, message: 'Wishlist item deleted successfully' });
  } catch (error) {
      console.error('Error deleting wishlist item:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get one wishlist item by ID
router.get('/wishlist/one/:wishlistId', async (req, res) => {
  const { wishlistId } = req.params;

  try {
      const wishlist = await vehicleWishlist.findByPk(wishlistId, {
          include: [{ model: wishlistImage, as: 'images' }]
      });

      if (!wishlist) {
          return res.status(404).json({ success: false, message: 'Wishlist item not found' });
      }

      res.json({ success: true, data: wishlist });
  } catch (error) {
      console.error('Error fetching wishlist item:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});


module.exports = router;
