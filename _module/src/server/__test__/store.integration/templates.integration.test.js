const createHomeFunnel = async ({ readDB, insertQuery }) => {
	const contentObjects = [
		{
			ObjectName: `'Your Media Your Way'`,
			ObjectID: `'your-media-your-way-text'`,
			ContentValue: `'Your listings are an extension of your brand, and your media should reflect your standards. Select any of our ready-to-order products or create a custom package and publish the type of listings you want to see.'`,
		},
		{
			ObjectName: `'The Difference Is In The Details'`,
			ObjectID: `'the-difference-is-in-the-details-text'`,
			ContentValue: `'When it comes to your listing media, don''t settle for anything but the best. Quick to order and deliver, we make the whole process easy and do it with a personal touch. Experience the Next Door Photos difference.'`,
		},
		{
			ObjectName: `'Meet Your Local Owner'`,
			ObjectID: `'meet-your-local-owner-text'`,
			ContentValue: `'We call them Local Owners, and they make it all happen for you. Based on your location, we partner you with a Local Owner who is connected to the community, knows the area, and has a network of local media pros and editors at the ready. They work directly with you to deliver phenomenal service, commitment, support, and results on every shoot, every time.'`,
		},
		{
			ObjectName: `'List It Forward'`,
			ObjectID: `'list-it-forward-text'`,
			ContentValue: `'Next Door Photos has earned the B Corp™ designation by continuing to meet high standards of social and environmental performance, transparency, and accountability.\n\nWhen you partner with us, you also partner with our commitment to using business as a force for good™.'`,
		},
	];

	const [homeFunnel] = await readDB(
		insertQuery('cms.WebFunnels', {
			FunnelName: `'Home'`,
			FunnelURLPath: `'/'`,
			FunnelIdentifier: `'/'`,
			CreatedDT: `'2022-01-15T00:00:00'`,
			//ModifiedDT: `'null'`,
			//CreatedBy: `'null'`,
			EffectiveStartDT: `'2022-01-15T00:00:00'`,
			EffectiveStartDT: `'2999-12-31T00:00:00'`,
			isActive: `'true'`,
			isLOFunnel: `'false'`,
			//LocalOfficeID: `'null'`,
			isFunnelTemplate: `'false'`,
			//isLandingPage: `'null'`,
		})
	);

	contentObjects.forEach((x) => (x.WebFunnelId = homeFunnel.id));

	for (var object of contentObjects) {
		const { ObjectName, ObjectID } = contentObjects;
		const insert = { ObjectName, ObjectID };
		const { id } = await readDB(
			insertQuery('cms.WebContentObjects', insert)
		);
		object.WebContentObjectID = id;
	}

	for (var object of contentObjects) {
		const { WebContentObjectID, WebFunnelId, ContentValue } =
			contentObjects;
		const insert = { WebContentObjectID, WebFunnelId, ContentValue };
		await readDB(insertQuery('cms.WebFunnelContentValues', insert));
	}
	return contentObjects;
};

const read = async ({ readDB, limit }) => {
	const top = limit ? `TOP ${limit}` : '';
	return {
		funnels: await readDB(`SELECT ${top} * FROM cms.WebFunnels`),
		content: await readDB(`SELECT ${top} * FROM cms.WebContentObjects`),
		values: await readDB(`SELECT ${top} * FROM cms.WebFunnelContentValues`),
	};
};

const createContent = async ({ readDB, insertQuery, content }) => {
	// for (var object of content) {
	// 	const { ObjectName, ObjectID } = object;
	// 	const insert = { ObjectName, ObjectID };
	// 	const { id } = await readDB(
	// 		insertQuery('cms.WebContentObjects', insert)
	// 	);
	// 	object.WebContentObjectID = id;
	// }
	// for (var object of content) {
	// 	const { WebContentObjectID, WebFunnelId, ContentValue } = object;
	// 	const insert = { WebContentObjectID, WebFunnelId, ContentValue };
	// 	await readDB(insertQuery('cms.WebFunnelContentValues', insert));
	// }
};

module.exports = {
	createContent,
	createHomeFunnel,
	read,
};
