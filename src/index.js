import { preHops } from "./functions";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/:user1/:user2", function(req, res) {
	Promise.resolve(preHops(req.params.user1, req.params.user2)).then(hops =>
		res.json({ hops: hops })
	);
});

app.listen(3000, function() {
	console.log(
		"Server listening on port 3000! REST endpoint is: /:user1/:user2"
	);
});
