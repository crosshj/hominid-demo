const helper = require('./uihelp');

describe('get JSON from XML', () => {
	const { jsonFromXML } = helper;
	const baseExpect = {
		parent: expect.any(String),
		key: expect.any(String),
		label: expect.any(String),
		type: expect.any(String),
		order: expect.any(Number),
		properties: expect.any(String),
		target: expect.any(String),
		value: expect.any(String),
		default: expect.any(String),
	};
	it('should handle a basic case', async () => {
		const result = jsonFromXML(`
			<Page />
		`);
		expect(result.length).toBe(1);
		expect(result[0]).toStrictEqual({
			...baseExpect,
			key: 'Page',
			type: 'Page',
		});
	});
	it('key should be path-based', async () => {
		const result = jsonFromXML(`
			<Page>
				<Header>
					<Title />
				</Header>
			</Page>
		`);
		expect(result.length).toBe(3);
		expect(result[2]).toStrictEqual({
			...baseExpect,
			parent: 'Page.Header',
			key: 'Page.Header.Title',
		});
	});
	it('key should be path-based', async () => {
		const result = jsonFromXML(`
			<Page key="thisPage">
				<Header>
					<Title />
				</Header>
			</Page>
		`);
		expect(result.length).toBe(3);
		expect(result[2]).toStrictEqual({
			...baseExpect,
			parent: 'thisPage.Header',
			key: 'thisPage.Header.Title',
		});
	});
	it('key should be path-based, respect parent keys', async () => {
		const result = jsonFromXML(`
			<Page key="thisPage">
				<Header key="thisHeader">
					<Title />
				</Header>
			</Page>
		`);
		expect(result.length).toBe(3);
		expect(result[1]).toStrictEqual({
			...baseExpect,
			parent: 'thisPage',
			key: 'thisHeader',
		});
		expect(result[2]).toStrictEqual({
			...baseExpect,
			parent: 'thisHeader',
			key: 'thisHeader.Title',
		});
	});
	it('multiple children', async () => {
		const result = jsonFromXML(`
			<Page>
				<Item />
				<Text />
				<Item />
			</Page>
		`);
		expect(result.length).toBe(4);
		expect(result[1]).toStrictEqual({
			...baseExpect,
			key: 'Page.Item.0',
			order: 101,
		});
		expect(result[2]).toStrictEqual({
			...baseExpect,
			key: 'Page.Text',
			order: 102,
		});
		expect(result[3]).toStrictEqual({
			...baseExpect,
			key: 'Page.Item.1',
			order: 103,
		});
	});
	it('multiple children, with keys', async () => {
		const result = jsonFromXML(`
			<Page>
				<Item />
				<Item key="itemTwo"/>
			</Page>
		`);
		expect(result.length).toBe(3);
		expect(result[2]).toStrictEqual({
			...baseExpect,
			parent: 'Page',
			key: 'itemTwo',
		});
	});
	it('multiple children, with keys with children', async () => {
		const result = jsonFromXML(`
			<Page>
				<Item />
				<Item key="itemTwo">
					<Child />
				</Item>
				<Item />
			</Page>
		`);
		expect(result.length).toBe(5);
		expect(result[3]).toStrictEqual({
			...baseExpect,
			parent: 'itemTwo',
			key: 'itemTwo.Child',
			type: 'Child',
			order: 10201,
		});
		expect(result[4]).toStrictEqual({
			...baseExpect,
			order: 103,
		});
	});
	it('order, with repeated/mixed order children', async () => {
		const result = jsonFromXML(`
			<Page>
				<Item />
				<Spacing />
				<Item />
				<Spacing />
			</Page>
		`);
		expect(result.length).toBe(5);
		expect(result[1]).toStrictEqual({ ...baseExpect, type: 'Item' });
		expect(result[2]).toStrictEqual({ ...baseExpect, type: 'Spacing' });
	});
	it('handle attributes/properties', async () => {
		const result = jsonFromXML(`
			<Page
				label="hello"
				foo="bar"
				baz="wow"
				type="bold"
				order="10"
				number="20"
				otherNumber="21"
				spaces="one two three"
				target="thisTarget"
				value="thisValue"
				default="thisDefault"
			/>
		`);
		expect(result.length).toBe(1);
		expect(result[0]).toStrictEqual({
			...baseExpect,
			label: 'hello',
			type: 'Page',
			order: 10,
			target: 'thisTarget',
			value: 'thisValue',
			default: 'thisDefault',
			properties:
				'foo:bar, baz:wow, type:bold, number:20, otherNumber:21, spaces:one two three',
		});
	});
	it('text nodes, escape special', async () => {
		const result = jsonFromXML(`
			<Text>I have, some "text" on me: see!?!</Text>
		`);
		expect(result.length).toBe(1);
		expect(result[0]).toStrictEqual({
			...baseExpect,
			properties: 'textContent: I have\\, some "text" on me\\: see!?!',
		});
	});
	it('text nodes, with line feeds', async () => {
		const result = jsonFromXML(`
			<Text>
				One line here
				This is another line

				Skip one and then one more line!
			</Text>
		`);
		expect(result.length).toBe(1);
		expect(result[0]).toStrictEqual({
			...baseExpect,
			properties: [
				'textContent: One line here',
				'This is another line',
				'',
				'Skip one and then one more line!',
			].join('\\n'),
		});
	});
	it('automatic label: do not auto-label', async () => {
		const result = jsonFromXML(`
			<Page>
				<Item />
				<Card />
			</Page>
		`);
		expect(result.length).toBe(3);
		expect(result[1]).toStrictEqual({ ...baseExpect, label: '' });
		expect(result[2]).toStrictEqual({ ...baseExpect, label: '' });
	});
});

xdescribe('get XML from json', () => {
	it('gets table results from DB', async () => {
		expect(true).toBeTruthy();
	});
});
