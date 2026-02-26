"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() { } function GeneratorFunction() { } function GeneratorFunctionPrototype() { } var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a; ;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg; else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var bcrypt = require("bcryptjs");
var db = require('../../src/Service/authService');
var jwt = require("jsonwebtoken");
var User = require("../models/userModel");
var LoginDetail = require('../models/loginDetail');
var sendsms = require('../config/smsConfig');
var OtpCollection = require('../models/otpDetail');
var register = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, username, password, role, hashedPassword, user;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password, role = _req$body.role;
          if (!(!username || !password || !role)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            message: 'Please provide username, password, and role'
          }));
        case 3:
          _context.prev = 3;
          _context.next = 6;
          return bcrypt.hash(password, 10);
        case 6:
          hashedPassword = _context.sent;
          _context.next = 9;
          return User.create({
            username: username,
            password: hashedPassword,
            // Store the hashed password
            role: role
          });
        case 9:
          user = _context.sent;
          return _context.abrupt("return", res.status(201).json({
            message: 'User registered successfully',
            user: user
          }));
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          return _context.abrupt("return", res.status(500).json({
            message: 'Internal Server Error'
          }));
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 13]]);
  }));
  return function register(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var login = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body2, username, password, user, isPasswordValid, token;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password; // Validate input
          if (!(!username || !password)) {
            _context2.next = 3;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            message: 'Please provide both username and password'
          }));
        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return User.findOne({
            where: {
              username: username
            }
          });
        case 6:
          user = _context2.sent;
          if (user) {
            _context2.next = 9;
            break;
          }
          return _context2.abrupt("return", res.status(401).json({
            message: 'Invalid username or password'
          }));
        case 9:
          _context2.next = 11;
          return bcrypt.compare(password, user.password);
        case 11:
          isPasswordValid = _context2.sent;
          if (isPasswordValid) {
            _context2.next = 14;
            break;
          }
          return _context2.abrupt("return", res.status(401).json({
            message: 'Invalid Credentials'
          }));
        case 14:
          // Create JWT token
          token = jwt.sign({
            userId: user.id,
            username: user.username,
            role: user.role
          },
            // Payload
            process.env.JWT_SECRET,
            // Secret key for signing the token
            {
              expiresIn: '1h'
            } // Token expiration time (1 hour)
          ); // Respond with token
          return _context2.abrupt("return", res.status(200).json({
            message: 'Login successful',
            token: token
          }));
        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](3);
          return _context2.abrupt("return", res.status(500).json({
            message: 'Internal Server Error'
          }));
        case 22:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 18]]);
  }));
  return function login(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var userregister = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body3, name, emailId, mobileNo, role, emailres, result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, name = _req$body3.name, emailId = _req$body3.emailId, mobileNo = _req$body3.mobileNo, role = _req$body3.role;
          if (!(!name || !mobileNo || !emailId || !role)) {
            _context3.next = 3;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            message: 'Name, mobileNo and emailId are required.'
          }));
        case 3:
          _context3.next = 6;
          return db.ChecExist(mobileNo);
        case 6:
          emailres = _context3.sent;
          // console.log("printing result here length:", emailres);
          if (!(emailres && emailres.dataValues && emailres.dataValues.mobileNo === mobileNo)) {
            _context3.next = 11;
            break;
          }
          // console.log("MobileNo already registered");
          return _context3.abrupt("return", res.status(401).json({
            message: 'MobileNo already registered'
          }));
        case 11:
          _context3.prev = 11;
          _context3.next = 14;
          return db.Createlogindetail(name, mobileNo, emailId, role);
        case 14:
          result = _context3.sent;
          // console.log('Database result:', result);
          if (!(!result || !result.insertId)) {
            _context3.next = 18;
            break;
          }
          return _context3.abrupt("return", res.status(500).json({
            message: 'Failed to register user. Please try again.'
          }));
        case 18:
          return _context3.abrupt("return", res.status(200).json({
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
              mobileNo: mobileNo
            }
          }));
        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](11);
          console.error('Error during user registration:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            message: 'An error occurred during registration.',
            error: _context3.t0.message
          }));
        case 25:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[11, 21]]);
  }));
  return function userregister(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var updateUserDetails = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var username, _req$body4, name, emailId, mobileNo, role, userToDelete, deleteResult, newUser;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          username = req.params.username;
          _req$body4 = req.body, name = _req$body4.name, emailId = _req$body4.emailId, mobileNo = _req$body4.mobileNo, role = _req$body4.role; // Ensure all necessary fields are provided
          if (!(!name || !mobileNo || !emailId || !role)) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            message: 'Name, mobileNo, emailId, and role are required.'
          }));
        case 4:
          _context4.prev = 4;
          _context4.next = 7;
          return db.FindUserByUsername(username);
        case 7:
          userToDelete = _context4.sent;
          if (userToDelete) {
            _context4.next = 10;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: 'User not found with the provided username.'
          }));
        case 10:
          _context4.next = 12;
          return db.DeleteUserByUsername(username);
        case 12:
          deleteResult = _context4.sent;
          if (deleteResult) {
            _context4.next = 15;
            break;
          }
          return _context4.abrupt("return", res.status(500).json({
            message: 'Failed to delete the user. Please try again.'
          }));
        case 15:
          // console.log("Deleted user with username: ".concat(username));

          // Step 2: Create a new user with the provided details
          _context4.next = 18;
          return db.Createlogindetail(name, mobileNo, emailId, role);
        case 18:
          newUser = _context4.sent;
          // console.log('New user created:', newUser);
          if (!(!newUser || !newUser.insertId)) {
            _context4.next = 22;
            break;
          }
          return _context4.abrupt("return", res.status(500).json({
            message: 'Failed to create a new user. Please try again.'
          }));
        case 22:
          return _context4.abrupt("return", res.status(200).json({
            message: 'User updated successfully.',
            user: {
              loginid: newUser.insertId,
              name: name,
              email: emailId,
              role: role,
              gender: '',
              // Optionally, you can handle gender if needed
              dob: '',
              // Optionally, you can handle dob if needed
              imagePath: '',
              // Optionally, you can handle imagePath if needed
              mobileNo: mobileNo
            }
          }));
        case 25:
          _context4.prev = 25;
          _context4.t0 = _context4["catch"](4);
          console.error('Error during user update:', _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            message: 'An error occurred during user update.',
            error: _context4.t0.message
          }));
        case 29:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[4, 25]]);
  }));
  return function updateUserDetails(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var assignrole = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _req$body5, username, role, UserName, Role, user;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _req$body5 = req.body, username = _req$body5.username, role = _req$body5.role;
          UserName = username;
          Role = role; // Ensure Role is valid
          if (['superadmin', 'admin', 'user', 'manager'].includes(Role)) {
            _context5.next = 5;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            message: 'Invalid role.'
          }));
        case 5:
          _context5.prev = 5;
          _context5.next = 8;
          return LoginDetail.findOne({
            where: {
              UserName: UserName
            }
          });
        case 8:
          user = _context5.sent;
          if (user) {
            _context5.next = 11;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: 'User not found.'
          }));
        case 11:
          user.role = Role;
          _context5.next = 14;
          return user.save();
        case 14:
          res.status(200).json({
            message: 'Role assigned successfully.',
            data: user
          });
          _context5.next = 21;
          break;
        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](5);
          console.error('Error assigning role:', _context5.t0);
          res.status(500).json({
            message: 'Error assigning role.'
          });
        case 21:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[5, 17]]);
  }));
  return function assignrole(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var generateOtp = function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Function to send OTP via SMS
var sendOtp = function sendOtp(mobileNo, otp) {
  var SmsData = {
    sendorId: "iShivx",
    mobileno: mobileNo,
    smsbody: "Your one time verification code for Ishivax Website login is ".concat(otp, ". Kindly, do not share it with anyone. Ishivax"),
    dltno: "1707172723929817963"
  };
  sendsms.sendSMS(SmsData);
};
var userlogin = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var MobileNo, user, otp, expiryTime;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          MobileNo = req.body.MobileNo;
          _context6.prev = 1;
          _context6.next = 4;
          return LoginDetail.findOne({
            where: {
              MobileNo: MobileNo
            }
          });
        case 4:
          user = _context6.sent;
          if (user) {
            _context6.next = 7;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            message: 'Please register first.'
          }));
        case 7:
          if (user.role) {
            _context6.next = 9;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            message: 'Please ask the admin to provide you a role.'
          }));
        case 9:
          // Step 3: Generate and send OTP
          otp = generateOtp();
          expiryTime = new Date();
          expiryTime.setMinutes(expiryTime.getMinutes() + 5); // OTP is valid for 5 minutes

          // Store OTP in OtpCollection
          _context6.next = 14;
          return OtpCollection.create({
            MobileNo: MobileNo,
            Otp: otp,
            ExpiryTime: expiryTime
          });
        case 14:
          sendOtp(MobileNo, otp); // Send OTP to the user

          res.status(200).json({
            message: 'OTP sent successfully. Please verify.'
          });
          _context6.next = 22;
          break;
        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](1);
          console.error('Error during login:', _context6.t0);
          res.status(500).json({
            message: 'Error processing login.'
          });
        case 22:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 18]]);
  }));
  return function userlogin(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var verifyotp = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var _req$body6, MobileNo, Otp, otpRecord, user, token;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _req$body6 = req.body, MobileNo = _req$body6.MobileNo, Otp = _req$body6.Otp;
          _context7.prev = 1;
          _context7.next = 4;
          return OtpCollection.findOne({
            where: {
              MobileNo: MobileNo,
              Otp: Otp
            }
          });
        case 4:
          otpRecord = _context7.sent;
          _context7.next = 7;
          return LoginDetail.findOne({
            where: {
              MobileNo: MobileNo
            }
          });
        case 7:
          user = _context7.sent;
          if (otpRecord) {
            _context7.next = 10;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            message: 'Invalid OTP.'
          }));
        case 10:
          if (!(new Date() > new Date(otpRecord.ExpiryTime))) {
            _context7.next = 12;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            message: 'OTP has expired. Please request a new one.'
          }));
        case 12:
          // console.log("printing the user details after login:", user.dataValues.username);
          // console.log("printing the user details after login:", user.dataValues.role);
          // console.log("printing the user details after login:", user.dataValues);

          // Step 3: Generate JWT token and login user
          token = jwt.sign({
            username: user.username,
            role: user.role
          },
            // Payload
            process.env.JWT_SECRET,
            // Secret key for signing the token
            {
              expiresIn: '1h'
            } // Token expiration time (1 hour)
          ); // Step 4: Send success response with JWT token

          res.status(200).json({
            message: 'Login successful.',
            token: token,
            role: user.dataValues.role
          });
          _context7.next = 23;
          break;
        case 19:
          _context7.prev = 19;
          _context7.t0 = _context7["catch"](1);
          console.error('Error verifying OTP:', _context7.t0);
          res.status(500).json({
            message: 'Error verifying OTP.'
          });
        case 23:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 19]]);
  }));
  return function verifyotp(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

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

module.exports = {
  register: register,
  login: login,
  userregister: userregister,
  updateUserDetails: updateUserDetails,
  assignrole: assignrole,
  userlogin: userlogin,
  verifyotp: verifyotp
};