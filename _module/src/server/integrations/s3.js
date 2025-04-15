const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const upload = async ({ Key, Body }) => {
	const params = {
		Bucket: process.env.DOCS_BUCKET_NAME,
		Key,
		Body,
	};
	const s3Result = await new Promise((resolve, reject) => {
		s3.upload(params, (error, data) => resolve({ data, error }));
	});
	return s3Result;
};

const download = async ({ Key }) => {
	const params = {
		Bucket: process.env.DOCS_BUCKET_NAME,
		Key,
	};
	const s3Result = await new Promise((resolve, reject) => {
		s3.getObject(params, (error, data) => resolve({ data, error }));
	});
	return s3Result;
};

module.exports = { upload, download };
