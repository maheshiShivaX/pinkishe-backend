const bcrypt = require("bcryptjs");
const db = require('../../src/Service/authService');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const LoginDetail = require('../models/loginDetail')
const sendsms = require('../config/smsConfig');
const OtpCollection = require('../models/otpDetail')

const register = async(req, res) =>{

   const {username, password, role} = req.body;

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

const login = async(req, res) =>{
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
      { userId: user.id, username: user.username, role: user.role }, // Payload
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
  console.log(req.body);

  const emailres = await db.ChecExist(mobileNo);
  console.log("printing result here length:",emailres);

  if (emailres && emailres.dataValues && emailres.dataValues.mobileNo === mobileNo) {
    console.log("MobileNo already registered");
    return res.status(401).json({ message: 'MobileNo already registered' });
  }
  try {
      // Insert into LoginDetail
      const result = await db.Createlogindetail( name, mobileNo, emailId,role);
      console.log('Database result:', result);

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
      console.log(`Deleted user with username: ${username}`);
  
      // Step 2: Create a new user with the provided details
      const newUser = await db.Createlogindetail(name, mobileNo, emailId, role);
      console.log('New user created:', newUser);
  
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
  



const assignrole = async(req, res) => {

  const { username, role } = req.body;

  const UserName = username;
  const Role = role;

    // Ensure Role is valid
    if (!['admin', 'user', 'manager'].includes(Role)) {
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


const userlogin = async(req, res) => {

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

const verifyotp = async(req, res) => {

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
          {  username: user.username, role: user.role }, // Payload
          process.env.JWT_SECRET, // Secret key for signing the token
          { expiresIn: '10h' } // Token expiration time (1 hour)
        );

        // Step 4: Send success response with JWT token
        res.status(200).json({
            message: 'Login successful.',
            token: token,
            role: user.dataValues.role,
            username: user.dataValues.username
        });
    } catch (err) {
        console.error('Error verifying OTP:', err);
        res.status(500).json({ message: 'Error verifying OTP.' });
    }
}

// exports.login = async (req, res) => {
//   const { username, password, devicetoken, logintype } = req.body;


//   // Check if both fields are provided
//   if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required.' });
//   }
//   try {
//       let results;
//       if (logintype == "M") {
//           results = await db.fatchloginDetailByMobileNo(username);
//       } else if (logintype == "E") {
//           results = await db.fatchloginDetail(username);
//       } else {
//           return res.status(404).json({ message: 'Login Type Not found.' });
//       }

//       if (results.length === 0) {
//           return res.status(404).json({ message: 'User not found or inactive.' });
//       }

//       const user = results[0];
//       //return res.status(200).json({ message: 'An error occurred during login.',user });


//       if (user.IsDeleted == 1) {
//           return res.status(404).json({ message: 'User Account Deleted.' });
//       }
//       //  return res.status(404).json({ message: 'User Account Delete.' + user });

//       const passwordMatch = password == user.Password ? true : false;
//       if (!passwordMatch) {
//           return res.status(401).json({ message: 'Invalid credentials.' });
//       }

//       const rd = await db.updatedevicetoken(user.LoginId, devicetoken);



//       // // Generate a JWT token
//       // const token = jwt.sign(
//       //     { userId: user.LoginId, username: user.UserName, role: user.RoleId },
//       //     '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwo',
//       //     { expiresIn: '100h' }
//       // );

//       return res.status(200).json({
//           message: 'Login successful.',
//           //   token: token,
//           user: {
//               loginid: user.LoginId,
//               name: user.Name,
//               email: user.EmailId,
//               role: user.RoleId,
//               gender: user.Gender == null ? '' : user.Gender,
//               dob: user.DOB == null ? '' : user.DOB,
//               imagePath: user.ImagePath == null ? '' : user.ImagePath,
//               mobileNo: user.MobileNo == null ? '' : user.MobileNo,
//           },
//       });
//   } catch (error) {
//       console.error('Error during login:', error);
//       return res.status(500).json({ message: 'An error occurred during login.', error: error.message });
//   }
// };
// exports.adminlogin = async (req, res) => {
//   const { username, password } = req.body;


//   // Check if both fields are provided
//   if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required.' });
//   }

//   try {

//       const results = await db.fatchloginDetail(username);

//       if (results.length === 0) {
//           return res.status(404).json({ message: 'User not found or inactive.' });
//       }

//       const user = results[0];
//       //return res.status(200).json({ message: 'An error occurred during login.',user });


//       if (user.IsDeleted == 1) {
//           return res.status(404).json({ message: 'User Account Deleted.' });
//       }
//       //  return res.status(404).json({ message: 'User Account Delete.' + user });

//       const passwordMatch = password == user.Password ? true : false;
//       if (!passwordMatch && user.RoleId == 1) {
//           return res.status(401).json({ message: 'Invalid credentials.' });
//       }
//       if (user.RoleId != 2) {
//           return res.status(401).json({ message: 'Invalid credentials.' });
//       }

//       // // Generate a JWT token
//       // const token = jwt.sign(
//       //     { userId: user.LoginId, username: user.UserName, role: user.RoleId },
//       //     '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwo',
//       //     { expiresIn: '100h' }
//       // );

//       return res.status(200).json({
//           message: 'Login successful.',
//           //   token: token,
//           user: {
//               loginid: user.LoginId,
//               name: user.Name,
//               email: user.EmailId,
//               role: user.RoleId,
//               gender: user.Gender == null ? '' : user.Gender,
//               dob: user.DOB == null ? '' : user.DOB,
//               imagePath: user.ImagePath == null ? '' : user.ImagePath,
//               mobileNo: user.MobileNo == null ? '' : user.MobileNo,
//           },
//       });
//   } catch (error) {
//       console.error('Error during login:', error);
//       return res.status(500).json({ message: 'An error occurred during login.', error: error.message });
//   }
// };


// exports.updateprofile = async (req, res) => {
//   const { name, gender, dob, emailId, loginId } = req.body;
//   const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Save image path

//   // if (!name || !emailId || !password) {
//   //     return res.status(400).json({ message: 'Name, email, and password are required.' });
//   // }
//   try {
//       // Insert into LoginDetail
//       const result = await db.updateProfileDetail(name, gender, dob, emailId, loginId, imagePath);


//       const resultslogin = await db.fatchloginDetailbyloginId(loginId);

//       if (resultslogin.length === 0) {
//           return res.status(404).json({ message: 'User not found or inactive.' });
//       }
//       const user = resultslogin[0];
//       return res.status(200).json({
//           message: 'Profile Update Successfully',
//           user: {
//               loginid: user.LoginId,
//               name: user.Name,
//               email: user.EmailId,
//               role: user.RoleId,
//               gender: user.Gender == null ? '' : user.Gender,
//               dob: user.DOB == null ? '' : user.DOB,
//               imagePath: user.ImagePath == null ? '' : user.ImagePath,
//               mobileNo: user.MobileNo == null ? '' : user.MobileNo,
//           },
//       });
//   } catch (error) {
//       console.error('Error during user profile updation:', error);
//       return res.status(500).json({
//           message: 'An error occurred during user profile updation.',
//           error: error.message,
//       });
//   }
// };
// function getRandomNumber(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// exports.forgotpassword = async (req, res) => {
//   const { username, logintype, statustype } = req.body;

//   let resultsemail;
//   if (logintype == "M") {
//       resultsemail = await db.fatchloginDetailByMobileNo(username);
//   } else if (logintype == "E") {
//       resultsemail = await db.fatchloginDetail(username);
//   } else {
//       return res.status(404).json({ message: 'Login Type Not found.' });
//   }


//   if (statustype == 'N') {
//       if (resultsemail.length > 0) {
//           return res.status(404).json({ message: 'User already Exists' });
//       }
//   } else if (statustype == 'A') {
//       if (resultsemail.length == 0) {
//           return res.status(404).json({ message: 'User not Exists' });
//       }
//   } else {
//       return res.status(404).json({ message: 'Status Not Found' });
//   }

//   const otp = getRandomNumber(100001, 999999);;
//   const r = await db.deleteOtpByEmail(username);
//   if (r != null) {
//       const result = await db.saveeotp(username, otp);
//       if (result.length > 0) {


//       }
//       if (logintype == 'E') {
//           await transporter.sendMail({
//               from: 'ishivaxllc@gmail.com',
//               to: username,

//               subject: 'OTP Verification',
//               html: 'OTP for Verification Purpose : ' + otp,
//           });
//       } else if (logintype == 'M') {

//           const SmsData = {
//               sendorId: "iShivx",
//               mobileno: username,
//               smsbody: "Your one time verification code for Ishivax Website login is " + otp + ".Kindly, do not share it with anyone. Ishivax",
//               dltno: "1707172723929817963"
//           };

          

//           sendsms.sendSMS(SmsData);
//       }

//       return res.status(200).json({
//           message: 'OTP sent successfully.'
//       });
//   }
//   return res.status(401).json({
//       message: 'Please Resend OTP'
//   });



// };
// exports.verifyotp = async (req, res) => {
//   const { username, otp } = req.body;

//   const result = await db.getOtpByEmail(username);

//   console.log(result);

//   if (result != null && result.length > 0) {
//       const passwordMatch = otp == result[0].otp ? true : false;
//       if (!passwordMatch) {
//           return res.status(401).json({ message: 'Invalid OTP.' });
//       }

//       return res.status(200).json({
//           message: 'OTP Match successfully.'
//       });
//   }
//   return res.status(404).json({
//       message: 'OTP Expired, Please Resend OTP'
//   });
// };
// exports.deleteaccount = async (req, res) => {
//   const { loginId } = req.body;

//   const result = await db.deleteaccountByLoginId(loginId);

//   console.log(result);

//   if (result.affectedRows > 0) {

//       return res.status(200).json({
//           message: 'Account delete successfully'
//       });
//   }
//   return res.status(404).json({
//       message: 'User Not found'
//   });
// };


// exports.getuserdetail = async (req, res) => {
//   try {
//       const result = await db.fatchuserDetail(); // Call service layer
//       return res.status(200).json({
//           message: 'Data fetched successfully',
//           data: result,
//       });
//   } catch (err) {
//       console.error('Error fetching data:', err);
//       logger.error('Error fetching data: ' + err.message);
//       return res.status(500).json({
//           message: 'Internal Server Error',
//           error: err.message,
//       });
//   }
// }

module.exports = {register,login,userregister,updateUserDetails, assignrole, userlogin,verifyotp};