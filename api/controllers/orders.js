const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res) => {
	Order.find()
	.select('_id product quantity')
	.populate('product', 'name')
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			orders: docs.map(doc => {
				return { 
					_id: doc._id,
					product: doc.product,
					quantity: doc.quantity,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/orders/' + doc._id
					}
				}
			})
		};
		res.status(200).json(response);
	})
	.catch(err => { error: err });
};

exports.orders_create_order = (req, res) => {
	Product.findById(req.body.productId)
	.then(product => {
		if (!product) {
			return res.status(404).json({
				message: 'Product not found'
			});
		}
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			quantity: req.body.quantity,
			product: req.body.productId
		}); 
		return order.save();
	})
	.then(result => {
		res.status(201).json({
			message: 'Created order successfully',
			createdOrder: {
				_id: result._id,
				product: result.product,
				quantity: result.quantity,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + result._id
				}
			}
		});
	})
	.catch(err => {
		res.status(500).json({ error: err });
	}); 
};

exports.orders_get_order = (req, res) => {
	const id = req.params.orderId;
	Order.findById(id)
	.select('_id product quantity')
	.populate('product')
	.exec()
	.then(result => {
		if (!result) {
			return res.status(404).json({
				message: 'Order not found'
			});
		}
		res.status(200).json({
			order: result,
			request: {
				type: 'GET',
				url: 'http://localhost:3000/orders/'
			}
		});
	})
	.catch(err => {
		res.status(500).json({ error: err });
	}); 
};

exports.orders_update_order = (req, res) => {
	const id = req.params.orderId;
	const updateOps = {};
	for (ops of req.body) {
		updateOps[ops.propName] = ops.value; 
	}
	Order.update({ _id: id }, { $set: updateOps }) 
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Order updated',
			request: {
				type: 'GET',
				url: 'http://localhost:3000/orders/' + id
			}
		});
	})
	.catch(err => {
		res.status(500).json({ error: err });
	}); 
};

exports.orders_delete_order = (req, res) => {
	const id = req.params.orderId;
	Order.remove({ _id: id })
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Order is deleted',
			request: {
				type: 'POST',
				url: 'http://localhost:3000/orders/',
				body: { productId: 'ID', quantity: 'Number' }
			}
		});
	})
	.catch(err => { 
		res.status(500).json({ error: err });
	});
};