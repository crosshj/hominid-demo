/*
 * @jest-environment jsdom
 */
import { parsePath } from './routes';

describe('context/global/routes', () => {
	it('parses path with no param', () => {
		const parsed = parsePath('/some/path/over/there');
		expect(parsed.target).toBe('somePathOverThere');
	});
	it('parses path with param properly', () => {
		const param = '12435';
		const parsed = parsePath('/some/path/' + param);
		expect(parsed.param).toBe(param);
	});
	it('parses path with long param properly', () => {
		const param = '12435/extra/thing/234';
		const parsed = parsePath('/some/path/' + param);
		expect(parsed.param).toBe(param);
	});
});
