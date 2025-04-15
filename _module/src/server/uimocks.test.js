const uimocks = require('./uimocks');

const log = (x) => console.log(JSON.stringify(x, null, 2));

xdescribe('get and manipulate mocks', () => {
	const baseArgs = {};
	const baseQuery = '';
	const baseSession = {};

	it('basic case', async () => {
		const result = await uimocks(baseArgs, baseQuery, baseSession);
		expect(result).toBeUndefined();
	});

	//assumes exist /mocks/staffChild.xml
	it('finds XML mock', async () => {
		const result = await uimocks(
			{ ...baseArgs, key: 'staffChild' },
			baseQuery,
			baseSession,
		);
		expect(result).toBeTruthy();
	});

	//assumes exist /mocks/paybill/parentHome.xml
	it('finds nested XML mock', async () => {
		const result = await uimocks(
			{ ...baseArgs, key: 'paybillParentHome' },
			baseQuery,
			baseSession,
		);
		expect(result).toBeTruthy();
	});

	//assumes exist /mocks/root/child.xml
	it('finds nested XML mock with session profile', async () => {
		const result = await uimocks({ ...baseArgs, key: 'root' }, baseQuery, {
			...baseSession,
			roleId: 5,
			//email: 'atworkrole+child@gmail.com',
		});
		expect(result).toBeTruthy();
	});

	//assumes exist /mocks_json/talent/listView.js
	it('finds nested JSON mock, function type', async () => {
		const result = await uimocks(
			{ ...baseArgs, key: 'talentListView' },
			baseQuery,
			baseSession,
		);
		expect(result).toBeTruthy();
	});
});
