import { parseUseData } from './parseProperties';
import parseValue from './parseValue';

describe('parseValue', () => {
	it('parseBooleanString', async () => {
		const parsedTrue = parseValue('true');
		const parsedFalse = parseValue('false');
		expect(parsedTrue).toEqual(true);
		expect(parsedFalse).toEqual(false);
	});
	it('parseIntegerString', async () => {
		const parsedInteger = parseValue('65');
		expect(parsedInteger).toEqual(65);
	});
	it('parseDecimalString', async () => {
		const parsedDecimal = parseValue('65.65');
		expect(parsedDecimal).toEqual(65.65);
	});
	it('parseString', async () => {
		const parsedString = parseValue('Hello');
		expect(parsedString).toEqual('Hello');
	});
	it('parseStringInteger', async () => {
		const parsedIntegerString = parseValue('"65"');
		expect(parsedIntegerString).toEqual('65');
	});
	it('parseInteger', async () => {
		const parsedInteger = parseValue(65);
		expect(parsedInteger).toEqual(65);
	});
	it('parseBoolean', async () => {
		const parsedFalse = parseValue(false);
		const parsedTrue = parseValue(true);
		expect(parsedFalse).toEqual(false);
		expect(parsedTrue).toEqual(true);
	});
	it('parseObjectString', async () => {
		const parsedObject = parseValue('{}');
		expect(parsedObject).toEqual({});
	});
	it('parseObject', async () => {
		const parsedObject = parseValue({});
		expect(parsedObject).toEqual({});
	});
	it('parseNull', async () => {
		const parsedObject = parseValue(null);
		expect(parsedObject).toEqual(null);
	});
	it('parseUndefined', async () => {
		const parsedObject = parseValue(undefined);
		expect(parsedObject).toEqual(undefined);
	});
	it('parseNullString', async () => {
		const parsedObject = parseValue('null');
		expect(parsedObject).toEqual(null);
	});
	it('parseUndefinedString', async () => {
		const parsedObject = parseValue('undefined');
		expect(parsedObject).toEqual('undefined');
	});
	it('parseMixedString1', async () => {
		const parsedObject = parseValue('Hi, Im 37.');
		expect(parsedObject).toEqual('Hi, Im 37.');
	});
	it('parseMixedString2', async () => {
		const parsedObject = parseValue('2023, what up?');
		expect(parsedObject).toEqual('2023, what up?');
	});
});
