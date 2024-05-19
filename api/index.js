const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json())

app.listen(
	PORT,
	() => console.log('it`s alive on localhost:${PORT}')
)

//OBJECT CONSTRUCTORS
//WISH OBJECT
let wish = {

	states : [
		'listening',
		'made',
		'granted'
	],

	status: 'listening',

	//getter for wish status
	getStatus : function() {
		return wish.status;
	},

	//setter for wish status
	setStatus : function(status) {
		if (wish.states.includes(status)) {
			wish.status = status;
			console.log('Wish status: ' + wish.getStatus());
		}
	},
}

//GATES OBJECT
let gates = {

	states : [
		'closed',
		'opening',
		'open',
		'closing'
	],

	status: 'closed',

	//getter for gates status
	getStatus : function() {
		return gates.status;
	},

	//setter for gates status
	setStatus : function(status) {
		if (gates.states.includes(status)) {
			gates.status = status;
			console.log('Gates status: ' + gates.getStatus());
		}
	},
}

//GET REQUESTS
//Gates Status
app.get('/gates', (req, res) => {
	res.status(200).send({
		serverStatus: 'online',
		status: gates.states.indexOf(gates.getStatus()),
	})
})

//Wish Status
app.get('/wish', (req, res) => {
	res.status(200).send({
		serverStatus: 'online',
		status: wish.states.indexOf(wish.getStatus()),
	})
})

//Changes Wish Status to 'made' when accessed
app.get('/open', (req, res) => {
	wish.setStatus('made');
	res.status(200).send({
		serverStatus: 'online',
		status: 'you`ve opened the garage',
	})
})

//All Statuses - Server, Wish and Gates
app.get('/allStatuses', (req, res) => {
	console.log('allStatuses endpoint accessed once');
	console.log(Date.now())
	res.status(200).send({
		serverStatus: 'online',
		wish: wish.getStatus(),
		gates: gates.getStatus(),
	})
	console.log(Date.now())
})

//POST REQUESTS
//Post to update gates status
app.post('/gates', (req, res) => {
	const { status } = req.body;

	if (!status) {
		console.log('Failed to post req to gates, no status!');
		res.status(400),send({ message: 'We need a status!', status: 'missing' });
	}
	else if (!gates.states.includes(status)) {
		console.log('Failed to post req to gates, wrong status: ', status);
		res.status(400).send({ message: 'Incorrect action provided.', status: 'unsuccessful' });
	}
	else {
		gates.setStatus(status);
		console.log('Successful post to gates with status: ' + status);
		res.status(200).send({
			serverStatus: 'online',
			status: 'successful',
		})
	};
})

//Post to update the wish status

app.post('/wish', (req, res) => {
	const { status } = req.body;

	console.log('Wish endpoint accessed.')

	if (!status) {
		res.status(400).send({ message: 'We need a status!', status: 'missing' });
		console.log('Failed to post req to wish, no action');
	}
	else if (!wish.states.includes(status)) {
		console.log('Failed to post req to wish, wrong action: ' + status);
		res.status(400).send({ message: 'Incorrect action provided.', status: 'unsuccessful' });
	}
	else {
		wish.setStatus(status);
		console.log('Successful post to wish with action: ' + status);
		res.status(200).send({
			serverStatus: 'online',
			status: 'successful',
		})
	}
})
