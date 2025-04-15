const originalModule = jest.requireActual('../database');

// const categories = require('./data/category.json');
// const media = require('./data/media.json');
// const mediaPros = require('./data/mediaPros.json');
// const orders = require('./data/orders.json');
// const owners = require('./data/owners.json');
// const payments = require('./data/payments.json');
// const products = require('./data/products.json');
// const globalProducts = require('./data/globalProducts.json');
// const realtors = require('./data/realtors.json');
// const realtorsByLO = require('./data/realtorsByLO.json');
// const reservations = require('./data/reservations.json');
// const dbReservations = require('./data/dbReservation.json');
// const templates = require('./data/templates.json');
// const templatesDB = require('./data/templatesDB.json');
// const customerProducts = require('./data/customerProducts.json');
const users = require('./data/user.json');
// const invites = require('./data/invite.json');
// const mediaProNotes = require('./data/mediaProNotes.json');
// const customerNotes = require('./data/customerNotes.json');

const getWhereId = (query, idAlias = 'id') => {
	const id = query
		.split('\n')
		.map((x) => x.split(`WHERE ${idAlias} = '`)[1])
		.filter((x) => x)
		.map((x) => x.replace(/\'/, ''))[0];
	const idNoSemi = (id || '').includes(';') ? id.replace(';', '') : id;
	return (idNoSemi || '').split(' ')[0];
};

const insertOrderMock = (query) => {
	return {
		id: '' + orders.length,
		reservation: [
			{
				date: '2022-02-04T03:37:42.340Z',
				property: {
					address: {
						street1: '123 Oak Street',
						street2: 'Apartment 3',
						city: 'Pikachu',
						state: 'OK',
						zip: '12345',
					},
				},
				product: [
					{
						id: 2,
						name: '15 Photos Package',
					},
				],
				realtor: {
					first: 'Randy',
					last: 'Savage',
				},
				mediaPro: {
					first: 'Oculus',
					last: 'Rift',
				},
			},
			{
				date: '2022-02-05T03:37:42.340Z',
				property: {
					address: {
						street1: '256 Kay Lane',
						street2: '',
						city: 'Computer',
						state: 'OK',
						zip: '12345',
					},
				},
				product: [
					{
						id: 2,
						name: '15 Photos Package',
					},
					{
						id: 4,
						name: 'Video Package',
					},
					{
						id: 5,
						name: 'Arial Photos Package',
					},
				],
				realtor: {
					first: 'Hewlett',
					last: 'Packard',
				},
				mediaPro: {
					first: 'Tandy',
					last: 'Shack',
				},
			},
		],
		payment: {},
		localOwner: {
			name: 'Example Office',
			id: 75,
		},
	};
};

const readDB = jest.fn((x) => {
	const query = x.query ? x.query : x;
	const map = x.map || ((x) => x);
	const isRead = query.includes('SELECT');
	const isCreate = query.includes('INSERT INTO');

	if (query.includes('-- read reservation')) {
		return dbReservations.map((dbR) => ({
			...dbR,
			ModifiedDT: new Date(new Date().getTime() + 1800000).toISOString(),
		}));
	}

	if (query.includes('-- read order product:')) {
		return [
			{
				id: 1,
				productId: 397,
				units: 1,
				unitsPrice: 100,
			},
		];
	}

	if (query.includes('OrderBookingSchedule')) {
		return {};
	}

	if (query.includes('-- read products for order:')) {
		return [];
	}
	if (isRead && query.includes('id, BasePrice FROM dbo.Products WHERE id')) {
		return [
			{
				BasePrice: 100,
			},
		];
	}

	if (isCreate && query.includes('cart.CartProducts')) {
		return [
			{
				id: '1',
				ProductID: '5',
			},
			{
				id: '2',
				ProductID: '6',
			},
		];
	}

	if (isCreate && query.includes('cart.CartBookingSchedule')) {
		return [
			{
				id: '2',
				date: new Date().toISOString(),
			},
		];
	}

	if (query.includes('cart.Carts')) {
		return [
			{
				id: 1,
			},
		];
	}

	if (query.includes('EXEC sp_GetMediaProsForProducts')) {
		return [
			{
				id: '813',
			},
			{
				id: '881',
			},
			{
				id: '752',
			},
			{
				id: '752',
			},
		];
	}

	if (query.includes('-- update customer 86')) {
		return [
			{
				id: 86,
				CustomerBasicName: 'Customer Update',
				FirstName: 'Customer',
				LastName: 'Update',
				MailingAddress1: '123 Maple Lane',
				MailingAddress2: 'Apartment #2',
				MailingCity: 'Bowlegs',
				MailingState: 'OK',
				MailingZipCode: '74830',
				EmailAddress: 'customerUpdate@test.com',
				PhoneNumber: '555-555-5555',
				Email: 'customerUpdate@test.com',
			},
		].map(map);
	}

	if (query.includes('-- Content Insert')) {
		//TODO: should also insert into mocked DB?
		return [
			{
				id: '2',
				url: '/example',
			},
		];
	}

	if (query.includes('-- read reservation')) {
		return reservations;
	}

	if (query.includes('-- customer payment methods insert')) {
		return;
	}

	if (query.includes('-- insert guest customer')) {
		return [
			{
				UserID: users.length + 1,
				Auth0UserKey: 'auth0|newGuestCustomer',
				FirstName: 'New Guest',
				LastName: 'Customer',
				EmailAddress: 'newGuestCustomer@test.com',
				UserAccountIsActive: true,
				RoleName: 'Customer',
				RoleID: 3,
				EffectiveStartDT: '1900-01-01T00:00:00.000Z',
				EffectiveEndDT: '2030-12-31T00:00:00.000Z',
				LocalOfficeIDIfApplicable: -999,
				CustomerIDIfApplicable: users.length + 1,
			},
		];
	}

	if (query.includes('-- insert customer: auth0|newCustomer')) {
		return [
			{
				UserID: users.length + 1,
				Auth0UserKey: 'auth0|newCustomer',
				FirstName: 'New',
				LastName: 'Customer',
				EmailAddress: 'newCustomer@test.com',
				UserAccountIsActive: true,
				RoleName: 'Customer',
				RoleID: 3,
				EffectiveStartDT: '1900-01-01T00:00:00.000Z',
				EffectiveEndDT: '2030-12-31T00:00:00.000Z',
				LocalOfficeIDIfApplicable: -999,
				CustomerIDIfApplicable: users.length + 1,
			},
		];
	}

	if (query.includes('-- insert site admin')) {
		return [
			{
				UserID: users.length + 1,
				Auth0UserKey: '',
				FirstName: 'New',
				LastName: 'Site Admin',
				EmailAddress: 'newSiteAdmin@test.com',
				UserAccountIsActive: true,
				RoleName: 'SiteAdmin',
				RoleID: 1,
				EffectiveStartDT: '1900-01-01T00:00:00.000Z',
				EffectiveEndDT: '2030-12-31T00:00:00.000Z',
				LocalOfficeIDIfApplicable: -999,
				CustomerIDIfApplicable: -999,
			},
		];
	}

	if (query.includes('-- insert local office admin')) {
		return [
			{
				UserID: users.length + 1,
				Auth0UserKey: '',
				FirstName: 'New Local',
				LastName: 'Office Admin',
				EmailAddress: 'newLocalAdmin@test.com',
				UserAccountIsActive: true,
				RoleName: 'LocalOfficeAdmin',
				RoleID: 2,
				EffectiveStartDT: '1900-01-01T00:00:00.000Z',
				EffectiveEndDT: '2030-12-31T00:00:00.000Z',
				LocalOfficeIDIfApplicable: 150,
				CustomerIDIfApplicable: -999,
			},
		];
	}

	if (query.includes('FROM UserAccountInvites')) {
		const token = getWhereId(query, 'Token');
		if (token) {
			return invites.filter((x) => x.Token === token).map(map);
		}
		return [];
	}

	if (query.includes('UPDATE Users')) {
		const id = getWhereId(query);
		if (!id) return;

		const user = users.find((x) => x.UserID + '' === id);
		if (!user) return;

		if (query.includes('Auth0UserKey')) {
			user.Auth0UserKey = 'this will be updated by DB';
		}
		return map([user]);
	}

	if (query.includes('FROM') && query.includes('vAllUserRoles')) {
		const sub =
			getWhereId(query, 'Auth0UserKey') ||
			getWhereId(query, 'r.Auth0UserKey');
		if (sub) {
			return users.filter((x) => x.Auth0UserKey === sub).map(map);
		}
		return [];
	}

	if (query.includes('EXEC sp_GetProductsForLocation')) {
		return customerProducts;
	}
	if (isCreate && query.includes('INSERT INTO CustomerBrandedMedia')) {
		return [{ ...media[0], name: 'new branded media test 1' }];
	}

	if (query.includes('UPDATE CustomerBrandedMedia')) {
		return [
			{
				...media[0],
				name: 'New branded media name',
				isActive: false,
			},
		];
	}

	if (isCreate && query.includes('INSERT INTO Orders')) {
		const order = insertOrderMock(query);
		orders.push(order);
		return [order];
	}
	if (isCreate && query.includes('INSERT INTO OrderProducts')) {
		return;
	}
	if (query.includes('UPDATE Orders')) {
		const id = getWhereId(query);
		const localOfficeId = getWhereId(query, 'localOfficeId');
		if (id) {
			return [orders.find((x) => x.id === `${id}`)].filter((x) => x);
		}
		if (localOfficeId) {
			return [
				orders.find((x) => x?.localOffice?.id === `${localOfficeId}`),
			].filter((x) => x);
		}
		return orders;
	}
	if (query.includes('UPDATE LocalOfficeProducts')) {
		const [, , ProductId, , , LocalOfficeID] = query
			.split('\n')
			.find((x) => x.includes('WHERE'))
			.match(/[a-zA-Z0-9]+/g);
		const product = products.find(
			(x) =>
				x.id + '' === ProductId &&
				x.LocalOfficeID + '' === LocalOfficeID
		);
		product.description = 'TODO: update in a mocked context better';
		return [product];
	}

	if (isRead && query.includes('FROM ProductCategories')) {
		const id = getWhereId(query);
		if (id) return [categories.find((x) => x.id === id)];
		return categories;
	}
	if (isRead && query.includes('FROM LocalOffices')) {
		const id = getWhereId(query);
		if (id) return [owners.find((x) => x.id === id)];
		return owners;
	}
	if (isRead & query.includes('-- local office by zip')) {
		const zipCode = getWhereId(query, 'ZipCode');
		return owners.filter((x) => x.zip === zipCode);
	}
	if (isRead && query.includes('FROM vAllProductsByLocalOffice')) {
		const localOfficeId = getWhereId(query, 'LocalOfficeID');
		const sku = query.includes('SKU = ')
			? query.split("SKU = '")[1].split("'")[0]
			: '';
		if (localOfficeId && sku) {
			return [{ sku }];
		}
		if (localOfficeId)
			return [
				products.find((x) => x.LocalOfficeID + '' === localOfficeId),
			];
		return products;
	}
	if (isRead && query.includes('FROM vAllCustomerData')) {
		const id = getWhereId(query, 'CustomerID');
		if (id) return [realtors.find((x) => x.id === id)];
		return realtors;
	}
	if (isRead && query.includes('FROM vLocalOfficeCustomers')) {
		const localOfficeId = getWhereId(query, 'LocalOfficeID');
		return [
			realtorsByLO.find((x) => localOfficeId === x.LocalOfficeID + ''),
		].map(map);
	}
	if (isRead && query.includes('FROM cart.CartBookingSchedule')) {
		const id = getWhereId(query);
		if (id) return [reservations.find((x) => x.id === id)];
		return reservations;
	}
	if (query.includes('-- template content update for url: /about')) {
		const modifiedContent = templatesDB.find(
			(x) => x.ContentID + '' === '16'
		);
		modifiedContent.ContentValue = 'example of updated content';
		return templatesDB.filter((x) => x.FunnelURLPath === '/about');
	}
	if (isRead && query.includes('FROM cms.vWebContent')) {
		const owner = getWhereId(query, 'LocalOfficeID');
		const id = getWhereId(query, 'ContentID');
		const url = getWhereId(query, 'FunnelURLPath');
		const isLOFunnel = getWhereId(query, 'isLOFunnel');
		if (url) return templatesDB.filter((x) => x.FunnelURLPath === url);
		if (id) return templates.filter((x) => x.id === id);
		if (owner)
			return templatesDB.filter((x) => x.LocalOfficeID + '' === owner);
		if (isLOFunnel !== undefined) {
			return templatesDB.filter((x) => x.isLOFunnel + '' === isLOFunnel);
		}
		return templates;
	}
	if (isRead && query.includes('FROM CustomerBrandedMedia')) {
		const id = getWhereId(query);
		const customerId = getWhereId(query, 'CustomerID');
		if (customerId)
			return [media.find((x) => x.customer.id === customerId)];
		if (id) return [media.find((x) => x.id === id)];
		return media;
	}
	if (isRead && query.includes('FROM vAllMediaProsByLocalOffice')) {
		const id = getWhereId(query);
		const localOfficeId = getWhereId(query, 'LocalOfficeID');
		if (id) {
			return [mediaPros.find((x) => x.id === `${id}`)].filter((x) => x);
		}
		if (localOfficeId) {
			return [
				mediaPros.find((x) => x?.localOwner?.id === `${localOfficeId}`),
			].filter((x) => x);
		}
		return mediaPros.map(({ notes, ...mp }) => mp);
	}
	if (query.includes('FROM MediaPros')) {
		return [mediaPros[0]];
	}
	if (query.includes('UPDATE MediaPros')) {
		return [mediaPros[0]];
	}
	if (isRead && query.includes('FROM Orders')) {
		const id = getWhereId(query, 'LocalOfficeID');
		if (id) return [orders.find((x) => x.id === id)];
		return orders;
	}
	if (isRead && query.includes('FROM vAllProductDefinitions')) {
		return globalProducts.map(map);
	}
	if (isRead && query.includes('FROM CustomerPaymentMethods')) {
		const id = getWhereId(query, 'CustomerID');
		if (id) return [payments.find((x) => x.id === id)];
		return payments;
	}
	if (isRead && query.includes('FROM Properties')) {
		const id = getWhereId(query);
		if (id) return [properties.find((x) => x.id === id)];
		return properties;
	}
	if (query.includes('EXEC [NOTES].[sp_GetNotesForItem]')) {
		const relationId = query.split(',')[1];
		if (!relationId) return [];
		let notes = [];
		if (query.includes('LOMediaPro')) {
			notes = mediaProNotes;
		} else if (query.includes('Customer')) {
			notes = customerNotes;
		}
		return notes.filter((note) => note.author == 'Local Office Admin');
	}

	if (query.includes('EXEC [NOTES].[sp_CreateNote]')) {
		const relationId = query.split(',')[1];
		if (!relationId) return [];
		let notes = [];
		if (query.includes('LOMediaPro')) {
			notes = mediaProNotes.filter((note) => note.id == 9);
		} else if (query.includes('Customer')) {
			notes = customerNotes.filter((note) => note.id == 11);
		}
		return notes;
	}
	if (query.includes('EXEC [NOTES].[sp_UpdateNote]')) {
		let notes = [];
		if (query.includes(13)) {
			notes = mediaProNotes.filter((note) => note.id == 13);
		} else if (query.includes(11)) {
			notes = customerNotes.filter((note) => note.id == 11);
		}

		notes[0].text = 'updated note';
		return notes;
	}
	return originalModule(query);
});

const close = () => {};
module.exports = { readDB, close };
