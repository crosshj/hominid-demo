import { StateManager } from '../../state/state';

export const useDynamicString = ({ string, source }) => {
	const [sourceValue] = StateManager.useListener(source);

	const isDynamicString =
		string && string?.includes('{{') && string?.includes('}}');

	if (!isDynamicString) return string;

	const start = string.search('{{');
	const end = string.search('}}');
	if (!start || !end) return;

	const paramName = string.substring(start + 2, end);

	const value = (source && sourceValue && sourceValue[paramName]) || '';

	return `${string.slice(0, start)}${value}${string.slice(
		end + 2,
		string.length,
	)}`;
};
