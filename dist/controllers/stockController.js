"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var mySqlPool = require("../../modules/db");
var Sequelize = require('../../modules/sequelize');
var _require = require('sequelize'),
  Op = _require.Op;
var moment = require('moment');
var VendingMachine = require('../models/vendingMachine');
var LoginDetail = require('../models/loginDetail');
var SchoolDetail = require('../models/schoolDetails');
var GeoLocation = require('../models/geoLocationModel');
var DispenseHistory = require('../models/dispenseHistory');
var StockHistory = require('../models/stockHistory');
var _require2 = require("winston/lib/winston/config"),
  addColors = _require2.addColors;
var NgoSpoc = require('../models/ngoSpocDetails');
var School = require("../models/schoolDetails");
exports.handleEvent = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, event_type, data, itemsDispensed, machineId, stockRecord, remaingStock, dispenseHistory, stock, _machineId, existingStock, _dispenseHistory, insertStockResult, _dispenseHistory2;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, event_type = _req$body.event_type, data = _req$body.data;
          if (!(!event_type || !data || !data.machineId)) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", res.status(400).send({
            success: false,
            message: "Please provide all required fields."
          }));
        case 4:
          if (!(event_type === "1")) {
            _context.next = 22;
            break;
          }
          itemsDispensed = data.itemsDispensed;
          machineId = data.machineId; // Find the machine's stock in the StockHistory table
          _context.next = 9;
          return StockHistory.findOne({
            where: {
              machineId: machineId
            }
          });
        case 9:
          stockRecord = _context.sent;
          if (stockRecord) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", res.status(400).send({
            success: false,
            message: "Stock record not found for the machineId."
          }));
        case 12:
          if (!(stockRecord.stock < itemsDispensed)) {
            _context.next = 14;
            break;
          }
          return _context.abrupt("return", res.status(400).send({
            success: false,
            message: "Not enough stock to dispense."
          }));
        case 14:
          remaingStock = stockRecord.stock - itemsDispensed; // Insert a new dispense history record
          _context.next = 17;
          return DispenseHistory.create({
            event_type: event_type,
            machineId: machineId,
            stock: remaingStock,
            itemsDispensed: itemsDispensed
          });
        case 17:
          dispenseHistory = _context.sent;
          // Reduce the stock in the StockHistory table after dispense
          stockRecord.stock -= itemsDispensed;
          _context.next = 21;
          return stockRecord.save();
        case 21:
          return _context.abrupt("return", res.status(201).send({
            success: true,
            message: "Dispense history created and stock updated.",
            dispenseHistory: dispenseHistory
          }));
        case 22:
          if (!(event_type === "2")) {
            _context.next = 46;
            break;
          }
          stock = data.stock;
          _machineId = data.machineId; // Check if the machine already has a stock record
          _context.next = 27;
          return StockHistory.findOne({
            where: {
              machineId: _machineId
            }
          });
        case 27:
          existingStock = _context.sent;
          if (!existingStock) {
            _context.next = 39;
            break;
          }
          // Update the stock if the record exists
          existingStock.stock = stock;
          existingStock.lastUpdatedAt = new Date();
          _context.next = 33;
          return existingStock.save();
        case 33:
          _context.next = 35;
          return DispenseHistory.create({
            event_type: event_type,
            machineId: _machineId,
            stock: stock,
            itemsDispensed: null
          });
        case 35:
          _dispenseHistory = _context.sent;
          return _context.abrupt("return", res.status(201).send({
            success: true,
            message: "Stock reloaded successfully."
          }));
        case 39:
          _context.next = 41;
          return StockHistory.create({
            machineId: _machineId,
            stock: stock,
            lastUpdatedAt: new Date()
          });
        case 41:
          insertStockResult = _context.sent;
          _context.next = 44;
          return DispenseHistory.create({
            event_type: event_type,
            machineId: _machineId,
            stock: stock,
            itemsDispensed: null
          });
        case 44:
          _dispenseHistory2 = _context.sent;
          return _context.abrupt("return", res.status(201).send({
            success: true,
            message: "New stock record created and stock reloaded.",
            insertStockResult: insertStockResult
          }));
        case 46:
          return _context.abrupt("return", res.status(400).send({
            success: false,
            message: "Invalid event_type provided."
          }));
        case 49:
          _context.prev = 49;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).send({
            success: false,
            message: 'Error processing the request',
            error: _context.t0
          });
        case 53:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 49]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.getDispenseHistory = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var dispenseHistoryResult, filteredDispenseHistory, _iterator, _step, machine, schoolData;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return DispenseHistory.findAll();
        case 3:
          dispenseHistoryResult = _context2.sent;
          // Filter records to include only those with itemsDispensed not null
          filteredDispenseHistory = dispenseHistoryResult.filter(function (item) {
            return item.itemsDispensed !== null;
          });
          _iterator = _createForOfIteratorHelper(filteredDispenseHistory);
          _context2.prev = 6;
          _iterator.s();
        case 8:
          if ((_step = _iterator.n()).done) {
            _context2.next = 17;
            break;
          }
          machine = _step.value;
          if (!machine.machineId) {
            _context2.next = 15;
            break;
          }
          _context2.next = 13;
          return School.findOne({
            where: {
              machineId: machine.machineId
            }
          });
        case 13:
          schoolData = _context2.sent;
          if (schoolData) {
            machine.dataValues.school = schoolData.dataValues;
          }
        case 15:
          _context2.next = 8;
          break;
        case 17:
          _context2.next = 22;
          break;
        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](6);
          _iterator.e(_context2.t0);
        case 22:
          _context2.prev = 22;
          _iterator.f();
          return _context2.finish(22);
        case 25:
          if (!(filteredDispenseHistory.length === 0)) {
            _context2.next = 27;
            break;
          }
          return _context2.abrupt("return", res.status(404).send({
            success: false,
            message: "No dispense history records with items dispensed found."
          }));
        case 27:
          return _context2.abrupt("return", res.status(200).send({
            success: true,
            data: filteredDispenseHistory
          }));
        case 30:
          _context2.prev = 30;
          _context2.t1 = _context2["catch"](0);
          console.log(_context2.t1);
          return _context2.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error retrieving dispense history',
            error: _context2.t1
          }));
        case 34:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 30], [6, 19, 22, 25]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.getDispenseHistoryForMachineId = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var machineId, dispenseHistoryResult;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          machineId = req.params.machineId; // Extract machineId from request params
          // Fetch all data from the dispenseHistory table where the machineId matches
          _context3.next = 4;
          return DispenseHistory.findAll({
            where: {
              machineId: machineId
            } // Filter by machineId
          });
        case 4:
          dispenseHistoryResult = _context3.sent;
          if (!(dispenseHistoryResult.length === 0)) {
            _context3.next = 7;
            break;
          }
          return _context3.abrupt("return", res.status(404).send({
            success: false,
            message: "No dispense history records found for machineId: ".concat(machineId)
          }));
        case 7:
          return _context3.abrupt("return", res.status(200).send({
            success: true,
            data: dispenseHistoryResult
          }));
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error retrieving dispense history',
            error: _context3.t0
          }));
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.getAllVendingMachine = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var vendingMachineResult, _iterator2, _step2, machine, schoolData;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return VendingMachine.findAll();
        case 3:
          vendingMachineResult = _context4.sent;
          if (!(!vendingMachineResult || vendingMachineResult.length === 0)) {
            _context4.next = 6;
            break;
          }
          return _context4.abrupt("return", res.status(404).send({
            success: false,
            message: "No vending machine records found."
          }));
        case 6:
          _iterator2 = _createForOfIteratorHelper(vendingMachineResult);
          _context4.prev = 7;
          _iterator2.s();
        case 9:
          if ((_step2 = _iterator2.n()).done) {
            _context4.next = 18;
            break;
          }
          machine = _step2.value;
          if (!machine.schoolId) {
            _context4.next = 16;
            break;
          }
          _context4.next = 14;
          return School.findOne({
            where: {
              schoolId: machine.schoolId // Find the school based on the schoolId in the VendingMachine
            }
          });
        case 14:
          schoolData = _context4.sent;
          if (schoolData) {
            machine.dataValues.school = schoolData.dataValues;
          }
        case 16:
          _context4.next = 9;
          break;
        case 18:
          _context4.next = 23;
          break;
        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](7);
          _iterator2.e(_context4.t0);
        case 23:
          _context4.prev = 23;
          _iterator2.f();
          return _context4.finish(23);
        case 26:
          return _context4.abrupt("return", res.status(200).send({
            success: true,
            data: vendingMachineResult
          }));
        case 29:
          _context4.prev = 29;
          _context4.t1 = _context4["catch"](0);
          console.log(_context4.t1);
          return _context4.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error retrieving vending machine data',
            error: _context4.t1
          }));
        case 33:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 29], [7, 20, 23, 26]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.getAllGeoLocations = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var geoLocationResult;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return GeoLocation.findAll();
        case 3:
          geoLocationResult = _context5.sent;
          if (!(!geoLocationResult || geoLocationResult.length === 0)) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", res.status(404).send({
            success: false,
            message: "No geolocation records found."
          }));
        case 6:
          return _context5.abrupt("return", res.status(200).send({
            success: true,
            data: geoLocationResult
          }));
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          return _context5.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error retrieving geolocation data',
            error: _context5.t0
          }));
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 9]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.deleteGeoLocation = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var id, geoLocation;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          id = req.params.id; // Find the geolocation record by ID
          _context6.next = 4;
          return GeoLocation.findByPk(id);
        case 4:
          geoLocation = _context6.sent;
          if (geoLocation) {
            _context6.next = 7;
            break;
          }
          return _context6.abrupt("return", res.status(404).send({
            success: false,
            message: "Geolocation with id ".concat(id, " not found.")
          }));
        case 7:
          _context6.next = 9;
          return geoLocation.destroy();
        case 9:
          return _context6.abrupt("return", res.status(200).send({
            success: true,
            message: "Geolocation with id ".concat(id, " deleted successfully.")
          }));
        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          return _context6.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error deleting geolocation data',
            error: _context6.t0
          }));
        case 16:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 12]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
exports.getAllSchool = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var schoolResult;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return SchoolDetail.findAll();
        case 3:
          schoolResult = _context7.sent;
          if (!(!schoolResult || schoolResult.length === 0)) {
            _context7.next = 6;
            break;
          }
          return _context7.abrupt("return", res.status(404).send({
            success: false,
            message: "No school records found."
          }));
        case 6:
          return _context7.abrupt("return", res.status(200).send({
            success: true,
            data: schoolResult
          }));
        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          return _context7.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error retrieving school data',
            error: _context7.t0
          }));
        case 13:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 9]]);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
exports.getAllUsers = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var loginDetailsResult;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return LoginDetail.findAll({
            order: [
            // Sort by `role` where null values appear first (null values are considered smaller)
            [Sequelize.col('role'), 'ASC']]
          });
        case 3:
          loginDetailsResult = _context8.sent;
          if (!(!loginDetailsResult || loginDetailsResult.length === 0)) {
            _context8.next = 6;
            break;
          }
          return _context8.abrupt("return", res.status(404).send({
            success: false,
            message: "No user records found."
          }));
        case 6:
          return _context8.abrupt("return", res.status(200).send({
            success: true,
            data: loginDetailsResult
          }));
        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          return _context8.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error retrieving user data',
            error: _context8.t0
          }));
        case 13:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 9]]);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
var getDateRange = function getDateRange(period) {
  switch (period) {
    case 'today':
      return moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    // Start of today
    case 'yesterday':
      return moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    // Start of yesterday
    case 'week':
      return moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
    // Start of this week
    case 'month':
      return moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    // Start of this month
    case 'quarter':
      return moment().startOf('quarter').format('YYYY-MM-DD HH:mm:ss');
    // Start of this quarter
    case 'total':
      return null;
    // No date filter for total
    default:
      return null;
  }
};
exports.getDashboardData = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var totalMachinesCount, activeMachinesCount, inoperativeMachinesCount, consumptionData, _i, _Object$keys, period, startDate, query, _yield$mySqlPool$quer, _yield$mySqlPool$quer2, result, monthlyConsumptionData, i, startOfMonth, endOfMonth, _query, _yield$mySqlPool$quer3, _yield$mySqlPool$quer4, monthlyResult, monthKey, monthData, totalBlocks, totalStates, totalDistricts, totalGirls, averageGirls;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return VendingMachine.count();
        case 3:
          totalMachinesCount = _context9.sent;
          _context9.next = 6;
          return VendingMachine.count({
            where: {
              status: _defineProperty({}, Op.or, ['installed', 'procured', 'active'])
            }
          });
        case 6:
          activeMachinesCount = _context9.sent;
          inoperativeMachinesCount = totalMachinesCount - activeMachinesCount; // Machines that are not installed or procured
          consumptionData = {
            today: 0,
            yesterday: 0,
            week: 0,
            month: 0,
            quarter: 0,
            total: 0
          }; // Get the total pad consumption for each period
          _i = 0, _Object$keys = Object.keys(consumptionData);
        case 10:
          if (!(_i < _Object$keys.length)) {
            _context9.next = 24;
            break;
          }
          period = _Object$keys[_i];
          startDate = getDateRange(period);
          query = 'SELECT SUM(itemsDispensed) AS totalDispensed FROM DispenseHistories'; // If there's a start date, filter by it
          if (startDate) {
            query += " WHERE createdAt >= '".concat(startDate, "'");
          }
          _context9.next = 17;
          return mySqlPool.query(query);
        case 17:
          _yield$mySqlPool$quer = _context9.sent;
          _yield$mySqlPool$quer2 = _slicedToArray(_yield$mySqlPool$quer, 1);
          result = _yield$mySqlPool$quer2[0];
          if (result || result[0]) {
            consumptionData[period] = result.totalDispensed || 0; // Handle if no records are found (returns null)
          } else {
            consumptionData[period] = 0; // No records found, set total to 0
          }
        case 21:
          _i++;
          _context9.next = 10;
          break;
        case 24:
          monthlyConsumptionData = [];
          i = 0;
        case 26:
          if (!(i < 12)) {
            _context9.next = 41;
            break;
          }
          startOfMonth = moment().subtract(i, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss');
          endOfMonth = moment().subtract(i, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss');
          _query = "\n                SELECT SUM(itemsDispensed) AS totalDispensed\n                FROM DispenseHistories\n                WHERE createdAt >= '".concat(startOfMonth, "' AND createdAt <= '").concat(endOfMonth, "'\n            ");
          _context9.next = 32;
          return mySqlPool.query(_query);
        case 32:
          _yield$mySqlPool$quer3 = _context9.sent;
          _yield$mySqlPool$quer4 = _slicedToArray(_yield$mySqlPool$quer3, 1);
          monthlyResult = _yield$mySqlPool$quer4[0];
          monthKey = moment().subtract(i, 'months').format("MMM'YY"); // Format as 'YYYY-MM'
          // Create an object with 'x' as the month and 'y' as the totalDispensed
          monthData = {
            x: monthKey,
            y: monthlyResult.totalDispensed || 0 // Use 0 if totalDispensed is null or undefined
          }; // Push the object to the array

          monthlyConsumptionData.push(monthData);
        case 38:
          i++;
          _context9.next = 26;
          break;
        case 41:
          console.log(monthlyConsumptionData);
          _context9.next = 44;
          return GeoLocation.count({
            distinct: true,
            col: 'block'
          });
        case 44:
          totalBlocks = _context9.sent;
          _context9.next = 47;
          return GeoLocation.count({
            distinct: true,
            col: 'state'
          });
        case 47:
          totalStates = _context9.sent;
          _context9.next = 50;
          return GeoLocation.count({
            distinct: true,
            col: 'district'
          });
        case 50:
          totalDistricts = _context9.sent;
          _context9.next = 53;
          return SchoolDetail.sum('numberOfGirls');
        case 53:
          totalGirls = _context9.sent;
          averageGirls = totalGirls / activeMachinesCount || 0;
          return _context9.abrupt("return", res.status(200).send({
            success: true,
            data: {
              machines: {
                total: totalMachinesCount,
                active: activeMachinesCount,
                inoperative: inoperativeMachinesCount
              },
              padsConsumes: consumptionData,
              impact: {
                totalImpact: totalGirls,
                averageGirls: averageGirls
              },
              geoData: {
                blocks: totalBlocks,
                states: totalStates,
                districts: totalDistricts
              },
              monthlyConsumptionData: monthlyConsumptionData
            }
          }));
        case 58:
          _context9.prev = 58;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          return _context9.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error retrieving vending machine data',
            error: _context9.t0
          }));
        case 62:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 58]]);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();
exports.getAllNgoSpocs = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var ngoSpocResult;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return NgoSpoc.findAll();
        case 3:
          ngoSpocResult = _context10.sent;
          if (!(ngoSpocResult.length === 0)) {
            _context10.next = 6;
            break;
          }
          return _context10.abrupt("return", res.status(404).send({
            success: false,
            message: "No NGO SPOC records found."
          }));
        case 6:
          return _context10.abrupt("return", res.status(200).send({
            success: true,
            data: ngoSpocResult
          }));
        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          return _context10.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error retrieving NGO SPOCs',
            error: _context10.t0
          }));
        case 13:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 9]]);
  }));
  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();
exports.createNgoSpoc = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var ngoSpocName, newNgoSpoc;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          ngoSpocName = req.body.ngoSpocName;
          if (ngoSpocName) {
            _context11.next = 3;
            break;
          }
          return _context11.abrupt("return", res.status(400).send({
            success: false,
            message: 'ngoSpocName is required'
          }));
        case 3:
          _context11.prev = 3;
          _context11.next = 6;
          return NgoSpoc.create({
            ngoSpocName: ngoSpocName
          });
        case 6:
          newNgoSpoc = _context11.sent;
          return _context11.abrupt("return", res.status(201).send({
            success: true,
            message: 'Ngo Spoc created successfully',
            data: newNgoSpoc
          }));
        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](3);
          if (!(_context11.t0.name === 'SequelizeUniqueConstraintError')) {
            _context11.next = 14;
            break;
          }
          return _context11.abrupt("return", res.status(400).send({
            success: false,
            message: 'The ngoSpocName must be unique',
            error: _context11.t0
          }));
        case 14:
          console.log(_context11.t0);
          return _context11.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error creating NGO SPOC',
            error: _context11.t0
          }));
        case 16:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[3, 10]]);
  }));
  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();
exports.deleteNgoSpoc = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var id, ngoSpoc;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          id = req.params.id;
          _context12.prev = 1;
          _context12.next = 4;
          return NgoSpoc.findByPk(id);
        case 4:
          ngoSpoc = _context12.sent;
          if (ngoSpoc) {
            _context12.next = 7;
            break;
          }
          return _context12.abrupt("return", res.status(404).send({
            success: false,
            message: 'NGO SPOC not found'
          }));
        case 7:
          _context12.next = 9;
          return ngoSpoc.destroy();
        case 9:
          return _context12.abrupt("return", res.status(200).send({
            success: true,
            message: 'NGO SPOC deleted successfully'
          }));
        case 12:
          _context12.prev = 12;
          _context12.t0 = _context12["catch"](1);
          console.log(_context12.t0);
          return _context12.abrupt("return", res.status(500).send({
            success: false,
            message: 'Error deleting NGO SPOC',
            error: _context12.t0
          }));
        case 16:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[1, 12]]);
  }));
  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}();