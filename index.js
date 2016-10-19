"use strict";

var tape = require("tape");
var wrapTest = require("./lib").wrapTest;

module.exports = wrapTest(tape);
