const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose.connect(
	'mongodb://node-shop:' + 
	process.env.MONGO_ATLAS_PW + 
	'@node-rest-shop-shard-00-00-y1jrs.mongodb.net:27017,node-rest-shop-shard-00-01-y1jrs.mongodb.net:27017,node-rest-shop-shard-00-02-y1jrs.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin'
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	// res.header('Access-Control-Allow-Origin', 'https://reahoo.net/'); accept only https://reahoo.net/ can access
	res.header('Access-Control-Allow-Origin', '*'); // accept all clients
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // * accept all clients

	if (req.method === "OPTIONS"){
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});

// Routes whics should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
	const error = new Error("Not found!!");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;