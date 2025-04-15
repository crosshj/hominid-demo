import { StateManager } from '../../state/state';
import { parseUseData } from '../utils/parseProperties';

export const useData = (args = {}) => {
	const propParsed = parseUseData(args.key);
	const { key } = propParsed[0];
	const [data, setData] = StateManager.useListener(key);
	const getData = StateManager.get;

	return { getData, setData, data };
};
