const express = require("express");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
	return res.send({
		message: "Hello World 2"
	})
})

server.listen(3000, () => {
	console.log("Server is running on port 3000");
})
