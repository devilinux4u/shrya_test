const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const { users } = require('../../db/sequelize')

// Ensure the "uploads/profile" directory exists
const uploadDir = path.join(__dirname, '../uploads/profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multer = require('multer');

// Configure Multer storage to save images in "uploads/profile"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


// GET route to fetch user profile from the database
router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userProfile = await users.findByPk(userId, {
            attributes: ['fname', 'uname', 'email', 'num', 'profile', 'createdAt']
        });

        if (userProfile) {
            res.status(200).json({success: true, data: userProfile});
        } else {
            res.status(404).json({success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({success: false, message: 'Internal server error' });
    }
});

// PUT route to update user 
router.put('/profileChange/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { fname, uname, email, num } = req.body;

        const userProfile = await users.findByPk(userId);

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile fields
        userProfile.fname = fname || userProfile.fname;
        userProfile.uname = uname || userProfile.uname;
        userProfile.email = email || userProfile.email;
        userProfile.num = num || userProfile.num;
        userProfile.pass = userProfile.pass;
        userProfile.otp = userProfile.otp;
        userProfile.verified = userProfile.verified;

        await userProfile.save();

        res.status(200).json({success: true, message: 'Profile updated successfully', user: userProfile });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to update profile image
router.post('/profile/:id/update-avatar', upload.single('profile'), async (req, res) => {
    try {
        const userId = req.params.id;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
        const profileImage = `/uploads/profile/${req.file.filename}`;
    
        // Ensure the user exists before updating
        const user = await users.findOne({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        // Update user profile with new image path
        await users.update({ profile: profileImage }, { where: { id: userId } });
    
        return res.status(200).json({ message: 'Profile image updated', profile: profileImage });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
      }
});

router.delete('/profile/:id/delete-avatar', async (req, res) => {
    try {
      const userId = req.params.id; // Ensure user is authenticated
  
      await users.update(
        { profile: null },
        { where: { id: userId } }
      );
  
      return res.status(200).json({success: true, message: 'Profile image deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, error: 'Something went wrong' });
    }
  });

module.exports = router;
