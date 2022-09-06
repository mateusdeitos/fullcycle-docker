const express = require("express");
const server = express();

const config = {
	host: 'db',
	user: 'root',
	password: 'root',
	database: 'nodedb',
}

server.use(express.json());

server.get("/", (req, res) => {
	return res.send({
		message: "Hello World 2"
	})
})

server.listen(3000, () => {
	console.log("Server is running on port 3000");
})
