const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// @desc Register User
// @route POST / api / users
// @access public
const registerUser = async (req, res) =>
{
    const { name, email, password } = req.body;
    //check if all the details are filled or not
    if (!name || !email || !password)
    {
        res.status(400).json({ error: 'Please enter all the details' })
    }

    //check if the user's email(user) already exist
    const userExists = await User.findOne({ email });
    if (userExists)
    {
        res.status(400).json({error:'User already exist'})
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    //check if user was created
    if (user)
    {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token:generateToken(user._id),
        })
    }
    else
    {
        res.status(400).json({ error: 'Invalid user data' });
    }
}


// @desc Authenticate(login) a User
// @route POST / api / users / login
// @access public
const loginUser = async (req, res) =>
{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
    {
        res.status(400).json({ error: "User with the given email is not found" });
    }
    const compared = await bcrypt.compare(password, user.password);
    if (compared)
    {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            // doubt : even if we are using user.id in this we are generating the token so try we can do that for actual authentication in the
        })
    }
    else
    {
        res.status(400).json({
            error:"Incorrect pasword",
        })
    }
}


// @desc Get User data
// @route GET / api / users / me
// @access private
const getMe = async (req, res) =>
{
    res.status(200).json(req.user);
}

// Generate JWT
const generateToken = (id) =>
{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn:'30d',
    })
}

module.exports = { registerUser, loginUser, getMe}