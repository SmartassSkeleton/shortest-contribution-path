"use strict";

var _functions = require("./functions");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.get("/:user1/:user2", function (req, res) {
	Promise.resolve((0, _functions.preHops)(req.params.user1, req.params.user2)).then(function (hops) {
		return res.json({ hops: hops });
	});
});

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.listen(3000, function () {
	console.log("Server listening on port 3000! REST endpoint is: /:user1/:user2");
});
//# sourceMappingURL=index.js.map