// const _ = require('lodash');

// const getValue = (prop, dataSources) => {
// 	if (prop.startsWith('static_')) return prop.replace('static_', '');

// 	if (!prop.startsWith('global_')) return prop;

// 	return _.get(dataSources, prop.replaceAll('_', '.'));
// };

// const parseValue = (value) => {
// 	if (value == null) return value + '';

// 	if (typeof value === 'object') {
// 		try {
// 			const _parsed = JSON.stringify(value);
// 			return _parsed;
// 		} catch (error) {
// 			return value;
// 		}
// 	}

// 	return String(value);
// };

// const isWhenEqual = (whenProp, dataSources) => {
// 	if (!whenProp || typeof whenProp === 'undefined') return false;

// 	const key = whenProp.includes('IS NOT') ? 'IS NOT' : 'IS';

// 	const [sourcePath, targetPath] = whenProp.split(key).map((x) => x.trim());

// 	const sourceValue = parseValue(getValue(sourcePath, dataSources));
// 	const targetValue = parseValue(getValue(targetPath, dataSources));

// 	console.log({
// 		sourceValue,
// 		targetValue,
// 	});

// 	if (key === 'IS NOT') return sourceValue !== targetValue;

// 	return sourceValue === targetValue;
// };

// describe('Case', () => {
// 	it('isWhenEqual', () => {
// 		const result_1 = isWhenEqual('global_emptyObject IS static_{}', {
// 			global: { emptyObject: {} },
// 		});

// 		const result_2 = isWhenEqual('global_emptyObject IS {}', {
// 			global: { emptyObject: {} },
// 		});

// 		const result_3 = isWhenEqual(
// 			'global_emptyObject IS global_anotherEmptyObj',
// 			{
// 				global: { emptyObject: {}, anotherEmptyObj: {} },
// 			},
// 		);

// 		const result_4 = isWhenEqual(
// 			'global_schema.jobOrdersSomethingErrors IS undefined',
// 			{
// 				global: { schema: { jobOrdersSomethingErrors: 'undefined' } },
// 			},
// 		);

// 		const result_5 = isWhenEqual(
// 			'global_myPrettyObject.insideAnother.ID IS 123',
// 			{
// 				global: {
// 					myPrettyObject: {
// 						insideAnother: {
// 							ID: 123,
// 						},
// 					},
// 				},
// 			},
// 		);

// 		const result_6 = isWhenEqual(
// 			'global_myPrettyObject.insideAnother.ID IS global_myPrettyObject.butThereIsOtherToo.foo',
// 			{
// 				global: {
// 					myPrettyObject: {
// 						insideAnother: {
// 							ID: [],
// 						},
// 						butThereIsOtherToo: {
// 							foo: ,
// 						},
// 					},
// 				},
// 			},
// 		);

// 		expect(result_1).toBe(true);
// 		expect(result_2).toBe(true);
// 		expect(result_3).toBe(true);
// 		expect(result_4).toBe(true);
// 		expect(result_5).toBe(true);
// 		expect(result_6).toBe(true);
// 	});
// });
