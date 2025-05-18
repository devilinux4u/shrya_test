const express = require('express');
const router = express.Router();
const { users } = require('../../Database/Sequelize');
const { enc } = require('../../Controllers/Hash');

router.post('/admin/register', async (req, res) => {
    try {
        let data = req.body;

        // Check if the username already exists
        let existingUser = await users.findOne({ where: { uname: data.uname } });
        if (existingUser) {
            return res.json({ success: false, msg: 'Username already exists' });
        }

        // Check if the email already exists
        let existingEmail = await users.findOne({ where: { email: data.email } });
        if (existingEmail) {
            return res.json({ success: false, msg: 'Email already registered' });
        }

        let existingPhone = await users.findOne({ where: { num: data.num } });
        if (existingPhone) {
            return res.json({ success: false, msg: 'Number already registered' });
        }

        // Encrypt the password
        let hashedPass = enc(data.password);

        // Create a new user
        let newUser = await users.create({
            fname: data.fname,
            uname: data.uname,
            email: data.email,
            num: data.num,
            pass: hashedPass,
            otp: Math.floor(100000 + Math.random() * 900000),
            verified: true
        });


        res.json({ success: true, msg: newUser });
    } catch (err) {
        console.log(err.message);
        res.json({ success: false, msg: 'An error occurred' });
    }
});


// GET all users
router.get("/users/all", async (req, res) => {
    try {
      const allusers = await users.findAll({
        attributes: ["id", "fname", "uname", "email", "num", "profile", "createdAt"],
        order: [["createdAt", "DESC"]], // Order by latest users
      });
  
      res.status(200).json({ success: true, data: allusers });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
    }
  });


// DELETE a user by ID
router.delete("/admin/user/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user
        const user = await users.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete the user
        await user.destroy();
        res.status(200).json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
    }
});

module.exports = router;