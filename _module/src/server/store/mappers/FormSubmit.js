// const FormSubmit = (dbResult) => {
// 	return dbResult;
// };

const FormSubmitTransform = (dbResults) => {
	//return dbResults.map(FormSubmit);
	return JSON.stringify(dbResults);
};

exports.FormSubmitTransform = FormSubmitTransform;
