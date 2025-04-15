/*
	run:
		nodemon -r dotenv/config store/Session.test.mjs
*/

import { read } from './Session.js';

const input = {
	//email: 'atworkrole+approveClient@gmail.com',
	email: 'atworkrole+requestClient@gmail.com',
};

const ctx = {};
const results = await read({ input, ctx });

//TODO: this should be a proper test
