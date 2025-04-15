import { ObjectFromIdTree } from './objectFromIdTree';
import { idTree1, schema1 } from './testData/idTree';

describe("transform tree with id's to object", () => {
	test('should replace token with value when value found', () => {
		const transformed = ObjectFromIdTree(idTree1, 'Validator');
		//console.log(JSON.stringify(transformed, null, 2));
		expect(transformed).toEqual(schema1);
	});
});
