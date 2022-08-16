const { userSchema } = require('./schemas/user-schema.js');
const { dblink } = require('./json/config.json');
const mongoose = require('mongoose');

mongoose.connect(dblink);

function toModel(name, schema) {
	return mongoose.model(name, schema);
}

async function insertNew(model, data, collection) {
	const newModel = new model(data, collection);
	return await newModel.save();
}

async function registerUser(id) {
	const userModel = toModel('user', userSchema);
	return new Promise((resolve, reject) => {
		userModel.findOne({ id: id }, (err, user) => {
			if (err) return reject(err);
			if (!user) {
				(async () => {
					await insertNew(userModel, { id: id, tokens: 0 }, 'data').then((user) => {
						resolve(user);
					});
				})();
			}
			else {
				resolve(user);
			}
		});
	});
}

async function addTokens(id, tokens) {
	await registerUser(id).then((user) => {
		user.tokens += Number(tokens);
		user.save();
	}).catch((err) => {
		console.log(err);
	});
}

async function removeTokens(id, tokens) {
	await registerUser(id).then((user) => {
		user.tokens -= Number(tokens);
		user.save();
	}).catch((err) => {
		console.log(err);
	});
}

async function getTokens(id) {
	const userModel = toModel('user', userSchema);
	return new Promise((resolve, reject) => {
		userModel.findOne({ id: id }, (err, user) => {
			if (err) return reject(err);
			if (!user) {
				insertNew(userModel, { id: id, tokens: 0 }, 'data');
				resolve(0);
			}
			else {
				resolve(user.tokens);
			}
		});
	});
}

module.exports = { toModel, insertNew, addTokens, removeTokens, getTokens, registerUser };
