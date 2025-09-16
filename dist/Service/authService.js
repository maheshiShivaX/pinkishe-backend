"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var LoginDetail = require('../models/loginDetail');

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
function Createlogindetail(_x, _x2, _x3, _x4) {
  return _Createlogindetail.apply(this, arguments);
} // db.FindUserByUsername(username)
function _Createlogindetail() {
  _Createlogindetail = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(name, mobileNo, emailId, role) {
    var loginDetail;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return LoginDetail.create({
            username: mobileNo,
            // Assuming UserName is meant to be mobileNo here
            name: name,
            mobileNo: mobileNo,
            emailId: emailId,
            role: role
          });
        case 3:
          loginDetail = _context3.sent;
          return _context3.abrupt("return", {
            insertId: loginDetail.dataValues.username
          });
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error('Error creating login detail:', _context3.t0);
          throw _context3.t0;
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return _Createlogindetail.apply(this, arguments);
}
var FindUserByUsername = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(username) {
    var user;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return LoginDetail.findOne({
            where: {
              username: username
            }
          });
        case 3:
          user = _context.sent;
          if (user) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", null);
        case 6:
          return _context.abrupt("return", user);
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('Error finding user by username:', _context.t0);
          throw new Error('Error finding user by username');
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function FindUserByUsername(_x5) {
    return _ref.apply(this, arguments);
  };
}();

// db.DeleteUserByUsername(username)
var DeleteUserByUsername = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(username) {
    var result;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return LoginDetail.destroy({
            where: {
              username: username
            }
          });
        case 3:
          result = _context2.sent;
          if (!(result === 0)) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", null);
        case 6:
          return _context2.abrupt("return", true);
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error('Error deleting user by username:', _context2.t0);
          throw new Error('Error deleting user by username');
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 9]]);
  }));
  return function DeleteUserByUsername(_x6) {
    return _ref2.apply(this, arguments);
  };
}();

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
function ChecExist(_x7) {
  return _ChecExist.apply(this, arguments);
} // async function getlogindetail(emailId) {
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
function _ChecExist() {
  _ChecExist = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(mobileNo) {
    var result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return LoginDetail.findOne({
            where: {
              mobileNo: mobileNo
            }
          });
        case 3:
          result = _context4.sent;
          return _context4.abrupt("return", result);
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error('Error checking existence:', _context4.t0);
          // logger.error('Error checking existence: ' + err.message);
          throw _context4.t0;
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return _ChecExist.apply(this, arguments);
}
module.exports = {
  ChecExist: ChecExist,
  Createlogindetail: Createlogindetail,
  FindUserByUsername: FindUserByUsername,
  DeleteUserByUsername: DeleteUserByUsername
};