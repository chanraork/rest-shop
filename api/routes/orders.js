const express = require("express");

const router = express();

// Handle incoming GET requests to /orders
router.get('/', (req, res) => {
	res.status(200).json({
		message: 'Orders were fatched'
	});
});

router.post('/', (req, res) => {
	const order = {
		productId: req.body.productId,
		quantity: req.body.quantity
	};
	res.status(201).json({
		message: 'Order was created',
		order: order
	});
});

router.get('/:orderId', (req, res) => {
	res.status(200).json({
		message: 'Order details',
		id: req.params.orderId
	});
});

router.patch('/:orderId', (req, res) => {
	res.status(200).json({
		message: 'Order updated',
		id: req.params.orderId
	});
});

router.delete('/:orderId', (req, res) => {
	res.status(200).json({
		message: 'Order deleted',
		id: req.params.orderId
	});
});

module.exports = router;