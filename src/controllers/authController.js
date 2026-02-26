const bcrypt = require("bcryptjs");
const db = require('../../src/Service/authService');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const LoginDetail = require('../models/loginDetail')
const sendsms = require('../config/smsConfig');
const OtpCollection = require('../models/otpDetail');
const Role = require('../models/roleModel')

const register = async (req, res) => {

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Please provide username, password, and role' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await User.create({
      username,
      password: hashedPassword, // Store the hashed password
      role,
    });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

};

const login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    // Find user by username
    const user = await User.findOne({ where: { username } });

    // If user not found
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role, name: user.name, roleId: user.roleId }, // Payload
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: '1h' } // Token expiration time (1 hour)
    );

    // Respond with token
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const userregister = async (req, res) => {
  const { name, emailId, mobileNo, role } = req.body;

  if (!name || !mobileNo || !emailId || !role) {
    return res.status(400).json({ message: 'Name, mobileNo and emailId are required.' });
  }
  // console.log(req.body);

  const emailres = await db.ChecExist(mobileNo);
  // console.log("printing result here length:", emailres);

  if (emailres && emailres.dataValues && emailres.dataValues.mobileNo === mobileNo) {
    // console.log("MobileNo already registered");
    return res.status(401).json({ message: 'MobileNo already registered' });
  }

  try {
    // 🔹 Fetch roleId from role table
    const roleData = await Role.findOne({
      where: { roleName: role, isDeleted: 0 }
    });

    if (!roleData) {
      return res.status(400).json({
        message: 'Invalid role selected'
      });
    }

    const roleId = roleData?.dataValues?.id

    console.log(roleData,'roleData')

    // Insert into LoginDetail
    const result = await db.Createlogindetail(name, mobileNo, emailId, role,roleId);
    // console.log('Database result:', result);

    if (!result || !result.insertId) {
      return res.status(500).json({ message: 'Failed to register user. Please try again.' });
    }

    return res.status(200).json({
      message: 'User registered successfully.',
      // token: token,
      user: {
        loginid: result.insertId,
        name: name,
        email: '',
        role: role,
        gender: '',
        dob: '',
        imagePath: '',
        mobileNo: mobileNo,
        roleId
      },
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({
      message: 'An error occurred during registration.',
      error: error.message,
    });
  }
};




const updateUserDetails = async (req, res) => {
  const { username } = req.params;
  const { name, emailId, mobileNo, role } = req.body;

  // Ensure all necessary fields are provided
  if (!name || !mobileNo || !emailId || !role) {
    return res.status(400).json({ message: 'Name, mobileNo, emailId, and role are required.' });
  }

  try {
    // Step 1: Delete the user with the provided username
    const userToDelete = await db.FindUserByUsername(username);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found with the provided username.' });
    }

    // Delete the user from the database
    const deleteResult = await db.DeleteUserByUsername(username);
    if (!deleteResult) {
      return res.status(500).json({ message: 'Failed to delete the user. Please try again.' });
    }
    // console.log(`Deleted user with username: ${username}`);

    // Step 2: Create a new user with the provided details
    const newUser = await db.Createlogindetail(name, mobileNo, emailId, role);
    // console.log('New user created:', newUser);

    if (!newUser || !newUser.insertId) {
      return res.status(500).json({ message: 'Failed to create a new user. Please try again.' });
    }

    // Return success response with the newly created user details
    return res.status(200).json({
      message: 'User updated successfully.',
      user: {
        loginid: newUser.insertId,
        name: name,
        email: emailId,
        role: role,
        gender: '', // Optionally, you can handle gender if needed
        dob: '', // Optionally, you can handle dob if needed
        imagePath: '', // Optionally, you can handle imagePath if needed
        mobileNo: mobileNo,
      },
    });
  } catch (error) {
    console.error('Error during user update:', error);
    return res.status(500).json({
      message: 'An error occurred during user update.',
      error: error.message,
    });
  }
};




const assignrole = async (req, res) => {

  const { username, role } = req.body;

  const UserName = username;
  const Role = role;

  // Ensure Role is valid
  if (!['superadmin', 'admin', 'user', 'manager'].includes(Role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  try {
    // Find the user
    const user = await LoginDetail.findOne({
      where: {
        UserName,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.role = Role;
    await user.save();

    res.status(200).json({
      message: 'Role assigned successfully.',
      data: user,
    });
  } catch (err) {
    console.error('Error assigning role:', err);
    res.status(500).json({ message: 'Error assigning role.' });
  }

}

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Function to send OTP via SMS
const sendOtp = (mobileNo, otp) => {
  const SmsData = {
    sendorId: "PINKFD",
    mobileno: mobileNo,
    smsbody: `Your OTP code for Pinkishe dashboard login is ${otp}. Kindly, do not share it with anyone.`,
    dltno: "1707172723929817963"
  };

  sendsms.sendSMS(SmsData);
};


const userlogin = async (req, res) => {

  const { MobileNo } = req.body;

  try {
    // Step 1: Check if the MobileNo exists
    const user = await LoginDetail.findOne({ where: { MobileNo } });

    if (!user) {
      return res.status(400).json({ message: 'Please register first.' });
    }

    // Step 2: Check if Role is null
    if (!user.role) {
      return res.status(400).json({ message: 'Please ask the admin to provide you a role.' });
    }

    // Step 3: Generate and send OTP
    const otp = generateOtp();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5); // OTP is valid for 5 minutes

    // Store OTP in OtpCollection
    await OtpCollection.create({
      MobileNo,
      Otp: otp,
      ExpiryTime: expiryTime,
    });

    sendOtp(MobileNo, otp); // Send OTP to the user

    res.status(200).json({ message: 'OTP sent successfully. Please verify.' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error processing login.' });
  }

}

const verifyotp = async (req, res) => {

  const { MobileNo, Otp } = req.body;

  try {
    // Step 1: Find the OTP record in the collection
    const otpRecord = await OtpCollection.findOne({
      where: {
        MobileNo,
        Otp,
      }
    });


    const user = await LoginDetail.findOne({
      where: {
        MobileNo
      }
    });

    // Step 2: Check if OTP exists and is still valid
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (new Date() > new Date(otpRecord.ExpiryTime)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }


    // Step 3: Generate JWT token and login user
    const token = jwt.sign(
      { username: user.username, role: user.role, roleId: user.roleId, name: user.name }, // Payload
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: '10h' } // Token expiration time (1 hour)
    );

    // Step 4: Send success response with JWT token
    res.status(200).json({
      message: 'Login successful.',
      token: token,
      role: user.dataValues.role,
      roleId: user.dataValues.roleId,
      username: user.dataValues.username,
      name: user.dataValues.name
    });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
}


module.exports = { register, login, userregister, updateUserDetails, assignrole, userlogin, verifyotp };