"use strict";

/* global Promise */

function wrapFunc(test) {
	return function () {
		var args = Array.prototype.slice.call(arguments, 0)
			.map(function (arg) {
				return typeof arg === "function" ? wrapCallback(arg) : arg;
			});

		test.apply(this, args); // eslint-disable-line no-invalid-this
	};
}

function wrapTest(test) {
	var wrapped = wrapFunc(test);
	wrapped.only = wrapFunc(test.only);

	for (var key in test) {
		if (test.hasOwnProperty(key)) {
			if (key === "only") continue;
			wrapped[key] = test[key];
		}
	}

	return wrapped;
}

function wrapCallback(callback) {
	return function (t) {
		var wrapped = Object.create(t, {
			test: {
				value: wrapFunc(t.test),
			},
		});

		try {
			new Promise(function (resolve) {
				resolve(callback(wrapped));
			}).catch(function (err) {
				t.error(err);
			}).then(function () {
				t.end();
			});
		}
		catch (e) {
			t.error(e);
			t.end();
		}
	};
}

exports.wrapFunc = wrapFunc;
exports.wrapTest = wrapTest;
exports.wrapCallback = wrapCallback;
