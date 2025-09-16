"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Organisation = require('../models/organizationMaster');
var VendingMachine = require('../models/vendingMachine');
var School = require('../models/schoolDetails');
var GeoLocation = require('../models/geoLocationModel');
var saveOrganisation = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, organisationName, organisationType, newOrganisation;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, organisationName = _req$body.organisationName, organisationType = _req$body.organisationType;
          console.log("printing organisation Type :", req.body);
          console.log("printing organisation Name :", organisationName);
          console.log("printing organisation Type :", organisationType);
          if (!(!organisationName || !organisationType)) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            message: 'Both organisationName and organisationType are required'
          }));
        case 6:
          _context.prev = 6;
          _context.next = 9;
          return Organisation.create({
            organisationName: organisationName,
            organisationType: organisationType
          });
        case 9:
          newOrganisation = _context.sent;
          return _context.abrupt("return", res.status(201).json({
            message: 'Organisation added successfully',
            organisation: newOrganisation
          }));
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](6);
          console.error('Error creating organisation:', _context.t0);
          return _context.abrupt("return", res.status(500).json({
            message: 'Failed to create organisation'
          }));
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[6, 13]]);
  }));
  return function saveOrganisation(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var saveVendingMachine = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body2, machineId, gsmModuleImei, vendorName, simCardNumber, padCapacity, status, newVendingMachine;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, machineId = _req$body2.machineId, gsmModuleImei = _req$body2.gsmModuleImei, vendorName = _req$body2.vendorName, simCardNumber = _req$body2.simCardNumber, padCapacity = _req$body2.padCapacity, status = _req$body2.status;
          console.log("Machine Details:", req.body);
          if (!(!machineId || !gsmModuleImei || !vendorName || !simCardNumber || !padCapacity || !status)) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            message: 'All fields are required'
          }));
        case 4:
          _context2.prev = 4;
          _context2.next = 7;
          return VendingMachine.create({
            machineId: machineId,
            gsmModuleImei: gsmModuleImei,
            vendorName: vendorName,
            simCardNumber: simCardNumber,
            padCapacity: padCapacity,
            status: status
          });
        case 7:
          newVendingMachine = _context2.sent;
          return _context2.abrupt("return", res.status(201).json({
            message: 'Vending Machine added successfully',
            vendingMachine: newVendingMachine
          }));
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](4);
          console.error('Error creating vending machine:', _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            message: 'Failed to create vending machine'
          }));
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[4, 11]]);
  }));
  return function saveVendingMachine(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var updateVendingMachine = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var machineId, _req$body3, gsmModuleImei, vendorName, simCardNumber, padCapacity, status, existingVendingMachine;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          machineId = req.params.machineId;
          _req$body3 = req.body, gsmModuleImei = _req$body3.gsmModuleImei, vendorName = _req$body3.vendorName, simCardNumber = _req$body3.simCardNumber, padCapacity = _req$body3.padCapacity, status = _req$body3.status;
          console.log("Updated Machine Details:", req.body);
          if (!(!gsmModuleImei || !vendorName || !simCardNumber || !padCapacity || !status)) {
            _context3.next = 5;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            message: 'All fields are required'
          }));
        case 5:
          _context3.prev = 5;
          _context3.next = 8;
          return VendingMachine.findOne({
            where: {
              machineId: machineId
            }
          });
        case 8:
          existingVendingMachine = _context3.sent;
          if (existingVendingMachine) {
            _context3.next = 11;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: 'Vending Machine not found'
          }));
        case 11:
          existingVendingMachine.gsmModuleImei = gsmModuleImei;
          existingVendingMachine.vendorName = vendorName;
          existingVendingMachine.simCardNumber = simCardNumber;
          existingVendingMachine.padCapacity = padCapacity;
          existingVendingMachine.status = status;

          // Save the updated vending machine
          _context3.next = 18;
          return existingVendingMachine.save();
        case 18:
          return _context3.abrupt("return", res.status(200).json({
            message: 'Vending Machine updated successfully',
            vendingMachine: existingVendingMachine
          }));
        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](5);
          console.error('Error updating vending machine:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            message: 'Failed to update vending machine'
          }));
        case 25:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[5, 21]]);
  }));
  return function updateVendingMachine(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var saveSchool = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$body4, schoolName, schoolAddress, schoolBlock, schoolDistrict, state, pinCode, geoLocation, numberOfGirls, schoolSpocName, ngoSpocName, newSchool;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _req$body4 = req.body, schoolName = _req$body4.schoolName, schoolAddress = _req$body4.schoolAddress, schoolBlock = _req$body4.schoolBlock, schoolDistrict = _req$body4.schoolDistrict, state = _req$body4.state, pinCode = _req$body4.pinCode, geoLocation = _req$body4.geoLocation, numberOfGirls = _req$body4.numberOfGirls, schoolSpocName = _req$body4.schoolSpocName, ngoSpocName = _req$body4.ngoSpocName;
          console.log("Received school data: ", req.body);
          if (!(!schoolName || !schoolAddress || !schoolBlock || !schoolDistrict || !state || !pinCode || !geoLocation || !numberOfGirls || !schoolSpocName || !ngoSpocName)) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            message: 'All fields are required'
          }));
        case 4:
          _context4.prev = 4;
          _context4.next = 7;
          return School.create({
            schoolName: schoolName,
            schoolAddress: schoolAddress,
            schoolBlock: schoolBlock,
            schoolDistrict: schoolDistrict,
            state: state,
            pinCode: pinCode,
            geoLocation: geoLocation,
            numberOfGirls: numberOfGirls,
            schoolSpocName: schoolSpocName,
            ngoSpocName: ngoSpocName
          });
        case 7:
          newSchool = _context4.sent;
          return _context4.abrupt("return", res.status(201).json({
            message: 'School added successfully',
            school: newSchool
          }));
        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](4);
          console.error('Error creating school:', _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            message: 'Failed to create school'
          }));
        case 15:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[4, 11]]);
  }));
  return function saveSchool(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var saveMachineAllocation = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _req$body5, schoolId, machineId, school, machine;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _req$body5 = req.body, schoolId = _req$body5.schoolId, machineId = _req$body5.machineId;
          console.log("Received machine allocation data: ", req.body);
          if (!(!schoolId || !machineId)) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            message: 'All fields are required'
          }));
        case 4:
          _context5.prev = 4;
          _context5.next = 7;
          return School.findOne({
            where: {
              schoolId: schoolId,
              machineId: null
            }
          });
        case 7:
          school = _context5.sent;
          if (school) {
            _context5.next = 10;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: 'School not found or machine already assigned'
          }));
        case 10:
          console.log("founded school:", school);

          // Step 2: Update the Machine collection where machineId matches
          _context5.next = 13;
          return VendingMachine.findOne({
            where: {
              machineId: machineId,
              schoolId: null,
              status: "inactive"
            }
          });
        case 13:
          machine = _context5.sent;
          if (machine) {
            _context5.next = 16;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: 'Machine not found which is inactive'
          }));
        case 16:
          // Assign the machineId to the school
          school.machineId = machineId;
          _context5.next = 19;
          return school.save();
        case 19:
          // Check the machine's status and update it to 'procured' if it's inactive
          if (machine.status === 'inactive') {
            machine.status = 'procured';
          }

          // Assign the schoolId to the machine
          machine.schoolId = schoolId;
          _context5.next = 23;
          return machine.save();
        case 23:
          return _context5.abrupt("return", res.status(200).json({
            message: 'Machine allocation updated successfully',
            school: school,
            machine: machine
          }));
        case 26:
          _context5.prev = 26;
          _context5.t0 = _context5["catch"](4);
          console.error('Error updating machine allocation:', _context5.t0);
          return _context5.abrupt("return", res.status(500).json({
            message: 'Failed to update machine allocation'
          }));
        case 30:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[4, 26]]);
  }));
  return function saveMachineAllocation(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteMachineAllocation = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var id, schoolId, school, machineId, machine;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id; // Receiving schoolId from the request parameters
          schoolId = id;
          _context6.prev = 2;
          _context6.next = 5;
          return School.findOne({
            where: {
              schoolId: schoolId
            }
          });
        case 5:
          school = _context6.sent;
          if (!(!school || !school.machineId)) {
            _context6.next = 8;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: 'School not found or no machine allocated'
          }));
        case 8:
          machineId = school.machineId; // Get the assigned machineId
          // Step 2: Retrieve the machine assigned to the school
          _context6.next = 11;
          return VendingMachine.findOne({
            where: {
              machineId: machineId
            }
          });
        case 11:
          machine = _context6.sent;
          if (machine) {
            _context6.next = 14;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: 'Machine not found'
          }));
        case 14:
          // Step 3: Unassign the machine from the school
          school.machineId = null; // Remove the machineId from the school
          _context6.next = 17;
          return school.save();
        case 17:
          // Step 4: Set the machine's status to inactive and remove the schoolId from the machine
          machine.status = 'inactive'; // Set the machine status back to inactive
          machine.schoolId = null; // Remove the schoolId from the machine
          _context6.next = 21;
          return machine.save();
        case 21:
          return _context6.abrupt("return", res.status(200).json({
            message: 'Machine allocation removed successfully',
            school: school,
            machine: machine
          }));
        case 24:
          _context6.prev = 24;
          _context6.t0 = _context6["catch"](2);
          console.error('Error deleting machine allocation:', _context6.t0);
          return _context6.abrupt("return", res.status(500).json({
            message: 'Failed to remove machine allocation'
          }));
        case 28:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[2, 24]]);
  }));
  return function deleteMachineAllocation(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var saveGeoLocation = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var _req$body6, state, district, block, newGeoLocation;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _req$body6 = req.body, state = _req$body6.state, district = _req$body6.district, block = _req$body6.block;
          if (!(!state || !district || !block)) {
            _context7.next = 3;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            message: 'State, District, and Block are required'
          }));
        case 3:
          _context7.prev = 3;
          _context7.next = 6;
          return GeoLocation.create({
            state: state,
            district: district,
            block: block
          });
        case 6:
          newGeoLocation = _context7.sent;
          return _context7.abrupt("return", res.status(201).json({
            message: 'Geolocation saved successfully',
            geoLocation: newGeoLocation
          }));
        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](3);
          console.error('Error saving geolocation:', _context7.t0);
          return _context7.abrupt("return", res.status(500).json({
            message: 'Failed to save geolocation'
          }));
        case 14:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[3, 10]]);
  }));
  return function saveGeoLocation(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
var updateGeoLocation = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var id, _req$body7, state, district, block, geoLocation;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id; // Get the id from the URL parameter
          _req$body7 = req.body, state = _req$body7.state, district = _req$body7.district, block = _req$body7.block; // Get the new data from the request body
          // Validate if at least one field is provided for update
          if (!(!state && !district && !block)) {
            _context8.next = 4;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            message: 'At least one field (State, District, or Block) is required to update'
          }));
        case 4:
          _context8.prev = 4;
          _context8.next = 7;
          return GeoLocation.findByPk(id);
        case 7:
          geoLocation = _context8.sent;
          if (geoLocation) {
            _context8.next = 10;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: 'GeoLocation not found'
          }));
        case 10:
          // Update the fields that were provided in the request body
          if (state) geoLocation.state = state;
          if (district) geoLocation.district = district;
          if (block) geoLocation.block = block;

          // Save the updated geo-location
          _context8.next = 15;
          return geoLocation.save();
        case 15:
          return _context8.abrupt("return", res.status(200).json({
            message: 'Geolocation updated successfully',
            geoLocation: geoLocation
          }));
        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](4);
          console.error('Error updating geo-location:', _context8.t0);
          return _context8.abrupt("return", res.status(500).json({
            message: 'Failed to update geolocation'
          }));
        case 22:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[4, 18]]);
  }));
  return function updateGeoLocation(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
module.exports = {
  saveOrganisation: saveOrganisation,
  saveVendingMachine: saveVendingMachine,
  saveSchool: saveSchool,
  saveMachineAllocation: saveMachineAllocation,
  updateVendingMachine: updateVendingMachine,
  saveGeoLocation: saveGeoLocation,
  updateGeoLocation: updateGeoLocation,
  deleteMachineAllocation: deleteMachineAllocation
};