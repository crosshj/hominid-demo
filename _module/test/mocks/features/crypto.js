const { faker } = require('@faker-js/faker');

/*
SELECT TOP (1000) [LastName]
      ,[FirstName]
      ,[TaxpayerID]
      ,[Address1]
      ,[Address2]
      ,[City]
      ,[State]
      ,[ZipCode]
      ,[MobilePhone]
      ,[HomePhone]
      ,[EmailAddress1]
      ,[EmailAddress2]
      ,[EmergencyContactName]
      ,[EmergencyContactPhone]
      ,[PreferredName]
      ,[Gender]
      ,[SendSMSUpdates]
      ,[SendEmailUpdates ]
      ,[TenantID]
  FROM [xSTG].[FlatTalent]

  */

const getItem = (x, i) => ({
	id: Number(i),
	FirstName: faker.name.firstName(),
	LastName: faker.name.lastName(),
	Secret_Encrypted: '89lD1dezbO14+LTUsfEsbsRqv/DJ8shHheHt4AwFkzQ=',
	Address1: faker.address.streetAddress(),
	Address2: faker.address.secondaryAddress(),
	City: faker.address.city(),
	State: faker.address.state(),
	ZipCode: faker.address.zipCode(),
});

module.exports = (args, query, session) => {
	try {
		const items = new Array(10).fill().map(getItem);
		//simulate a column which would error
		items[0].Secret_Encrypted = 'oopsMESSEDUP===';
		return JSON.stringify(items);
	} catch (e) {
		console.error(e);
		return '[]';
	}
};
