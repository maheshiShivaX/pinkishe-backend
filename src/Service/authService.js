
const LoginDetail = require('../models/loginDetail')

// async function fatchloginDetail(username) {
//     try {


//         // Ensure baseurl is a valid string
//         if (!baseurl || typeof baseurl !== 'string') {
//             throw new Error('Invalid baseurl provided');
//         }
//         // Use parameterized query to prevent SQL injection
//         const queryText = `SELECT LoginId,Password,UserName,MobileNo,EmailId,Name,
//         RoleId, CONCAT(?, ImagePath) AS ImagePath, Gender, DOB,case when IsDeleted=1 then 1 else 0 end as IsDeleted FROM 
//         logindetail where IsDeleted=0 and EmailId = ?`;
//         const result = await query(queryText, [baseurl, username]);



//         // console.log('Fetching user details for username:', username);
//         // const result = await query('SELECT * FROM logindetail WHERE UserName = ?', [username]);
//         if (!result || result.length === 0) {
//             console.error('No user found for username:', username);
//         }
//         return result;
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         throw err;
//     }
// }

// async function fatchloginDetailByMobileNo(username) {
//     try {


//         // Ensure baseurl is a valid string
//         if (!baseurl || typeof baseurl !== 'string') {
//             throw new Error('Invalid baseurl provided');
//         }
//         // Use parameterized query to prevent SQL injection
//         const queryText = `SELECT LoginId,Password,UserName,MobileNo,EmailId,Name,
//         RoleId, CONCAT(?, ImagePath) AS ImagePath, Gender, DOB,case when IsDeleted=1 then 1 else 0 end as IsDeleted FROM 
//         logindetail where IsDeleted=0 and MobileNo = ?`;
//         const result = await query(queryText, [baseurl, username]);



//         // console.log('Fetching user details for username:', username);
//         // const result = await query('SELECT * FROM logindetail WHERE UserName = ?', [username]);
//         if (!result || result.length === 0) {
//             console.error('No user found for username:', username);
//         }
//         return result;
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         throw err;
//     }
// }



// async function fatchuserDetail() {
//     try {
//         // Ensure baseurl is a valid string
//         if (!baseurl || typeof baseurl !== 'string') {
//             throw new Error('Invalid baseurl provided');
//         }
//         // Use parameterized query to prevent SQL injection
//         const queryText = `SELECT LoginId,Password,UserName,MobileNo,EmailId,Name,RoleId, CONCAT(?, ImagePath) AS ImagePath,
//          Gender, DOB,case when IsDeleted=1 then 1 else 0 end as IsDeleted, DeviceToken FROM logindetail`;
//         const result = await query(queryText, [baseurl]);

//         return result;
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         throw err;
//     }
// }



async function Createlogindetail(name, mobileNo, emailId, role) {
    try {
       
        // Use Sequelize to create a new entry in the logindetail table
        const loginDetail = await LoginDetail.create({
            username: mobileNo,  // Assuming UserName is meant to be mobileNo here
            name: name,
            mobileNo: mobileNo,
            emailId: emailId,
            role: role
        });

        return { insertId: loginDetail.dataValues.username }; // Sequelize automatically creates an id field if your model has one
    } catch (err) {
        console.error('Error creating login detail:', err);
        throw err;
    }
}


// db.FindUserByUsername(username)
const FindUserByUsername = async (username) => {
    try {
      // Assuming you have a `User` model in Sequelize
      const user = await LoginDetail.findOne({
        where: {
          username: username
        }
      });
  
      // If the user is not found, return null
      if (!user) {
        return null;
      }
  
      return user;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw new Error('Error finding user by username');
    }
  };
  


  // db.DeleteUserByUsername(username)
const DeleteUserByUsername = async (username) => {
    try {
      // Assuming you have a `User` model in Sequelize
      const result = await LoginDetail.destroy({
        where: {
          username: username
        }
      });
  
      // If the result is 0, no rows were deleted (user not found)
      if (result === 0) {
        return null;
      }
  
      return true;  // Successfully deleted the user
    } catch (error) {
      console.error('Error deleting user by username:', error);
      throw new Error('Error deleting user by username');
    }
  };
  

// async function updateProfileDetail(name, gender, dob, emailId, loginId, imagePath) {
//     try {
//         const sqlQuery = `
//             UPDATE logindetail
//             SET Name = ?, Gender = ?, DOB = ? , EmailId=? , ImagePath=?
//             WHERE LoginId = ? 
//         `;
//         const result = await query(sqlQuery, [name, gender, dob, emailId, imagePath, loginId]);
//         return result;
//     } catch (err) {
//         console.error('Error updating data:', err);
//         logger.error('Error updating data: ' + err.message);
//         throw err;
//     }
// }
// async function updateotp(emailId, otp) {
//     try {
//         const sqlQuery = `
//             UPDATE logindetail
//             SET otp = ?
//             WHERE EmailId = ? 
//         `;
//         const result = await query(sqlQuery, [otp, emailId]);
//         return result;
//     } catch (err) {
//         console.error('Error updating data:', err);
//         logger.error('Error updating data: ' + err.message);
//         throw err;
//     }
// }
// async function saveeotp(emailId, otp) {
//     try {


//         const sqlQuery = `
//     INSERT INTO otpdetail 
//     (otp, emailid) 
//     VALUES (?, ?)
//   `;
//         const result = await query(sqlQuery, [otp, emailId]);
//         return result;



//     } catch (err) {
//         console.error('Error updating data:', err);
//         logger.error('Error updating data: ' + err.message);
//         throw err;
//     }
// }
// async function deleteOtpByEmail(emailId) {
//     try {
//         const sqlQuery = `
//           DELETE FROM otpdetail 
//           WHERE emailid = ?
//         `;
//         const result = await query(sqlQuery, [emailId]);
//         return result;
//     } catch (err) {
//         console.error('Error deleting OTP:', err);
//         logger.error('Error deleting OTP: ' + err.message);
//         throw err;
//     }
// }
// async function deleteaccountByLoginId(loginId) {
//     try {
//         const sqlQuery = `
//           Update logindetail Set IsDeleted =1 
//           WHERE LoginId = ?
//         `;
//         const result = await query(sqlQuery, [loginId]);
//         return result;
//     } catch (err) {
//         console.error('Error deleting OTP:', err);
//         logger.error('Error deleting OTP: ' + err.message);
//         throw err;
//     }
// }
// async function getOtpByEmail(emailId) {
//     try {
//         const sqlQuery = `
//           SELECT otp 
//           FROM otpdetail 
//           WHERE emailid = ?
//         `;
//         const result = await query(sqlQuery, [emailId]);
//         // if (result.length === 0) {
//         //     // No OTP found for the given emailId
//         //     throw new Error('No OTP found for this email.');
//         // }
//         return result; // Assuming only one OTP per emailId
//     } catch (err) {
//         console.error('Error fetching OTP:', err);
//         logger.error('Error fetching OTP: ' + err.message);
//         throw err;
//     }
// }
// async function updatepassword(username, password,logintype) {
//     try {
//         let sqlQuery;
//         if (logintype == 'E') {
//             sqlQuery = `
//             UPDATE logindetail
//             SET Password = ?
//             WHERE IsDeleted=0 and  EmailId = ?` ;
//         } else {
//             sqlQuery = `
//             UPDATE logindetail
//             SET Password = ?
//             WHERE IsDeleted=0 and  MobileNo = ? `;
//         }

//         const result = await query(sqlQuery, [password, username]);
//         return result;
//     } catch (err) {
//         console.error('Error updating data:', err);
//         logger.error('Error updating data: ' + err.message);
//         throw err;
//     }
// }
// async function resetepassword(username, password, newpassword,logintype) {
//     try {
//         let sqlQuery;
//         if (logintype == 'E') {
//             sqlQuery = `
//             UPDATE logindetail
//             SET Password = ? 
//             WHERE IsDeleted=0 and EmailId = ? and Password = ? `
//         } else {
//             sqlQuery = `
//             UPDATE logindetail
//             SET Password = ?
//             WHERE IsDeleted=0 and  MobileNo = ? and Password = ? `
//         }
//         const result = await query(sqlQuery, [newpassword, username, password]);
//         return result;
//     } catch (err) {
//         console.error('Error updating data:', err);
//         logger.error('Error updating data: ' + err.message);
//         throw err;
//     }
// }


async function ChecExist(mobileNo) {
    try {
       
        const result = await LoginDetail.findOne({
            where: {
                mobileNo: mobileNo
            }
        });
        return result; 
    } catch (err) {
        console.error('Error checking existence:', err);
        // logger.error('Error checking existence: ' + err.message);
        throw err;
    }
}
// async function getlogindetail(emailId) {
//     try {
//         const sqlQuery = `
//             Select * from logindetail
//             WHERE IsDeleted=0 and  EmailId = ? 
//         `;
//         const result = await query(sqlQuery, [emailId]);
//         return result;
//     } catch (err) {
//         console.error('Error updating data:', err);
//         logger.error('Error updating data: ' + err.message);
//         throw err;
//     }
// }
// async function fatchloginDetailbyloginId(loginId) {
//     try {
//         // Ensure baseurl is a valid string
//         if (!baseurl || typeof baseurl !== 'string') {
//             throw new Error('Invalid baseurl provided');
//         }
//         // Use parameterized query to prevent SQL injection
//         const queryText = 'SELECT LoginId,Password,UserName,MobileNo,EmailId,Name,RoleId, CONCAT(?, ImagePath) AS ImagePath, Gender, DOB FROM logindetail where LoginId = ?';
//         const result = await query(queryText, [baseurl, loginId]);
//         // console.log('Fetching user details for username:', username);
//         // const result = await query('SELECT * FROM logindetail WHERE UserName = ?', [username]);
//         if (!result || result.length === 0) {
//             console.error('No user found for username:');
//         }
//         return result;
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         throw err;
//     }
// }
// async function updatedevicetoken(loginId, devicetoken) {
//     try {
//         const sqlQuery = `
//             UPDATE logindetail
//             SET DeviceToken = ? 
//             WHERE IsDeleted=0 and  LoginId = ? 
//         `;
//         const result = await query(sqlQuery, [devicetoken, loginId]);
//         return result;
//     } catch (err) {
//         console.error('Error updating data:', err);
//         logger.error('Error updating data: ' + err.message);
//         throw err;
//     }
// }


// module.exports = {ChecExist,fatchloginDetailByMobileNo,fatchloginDetailbyloginId, fatchloginDetail, Createlogindetail, updateProfileDetail,deleteaccountByLoginId,
//      updateotp, updatepassword, getlogindetail, resetepassword, saveeotp, getOtpByEmail, deleteOtpByEmail,fatchuserDetail,updatedevicetoken };
module.exports = { ChecExist, Createlogindetail, FindUserByUsername,DeleteUserByUsername};