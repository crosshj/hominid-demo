import { useGlobal } from './useGlobal.js';

jest.mock('../hooks/useGlobal.js');

export const setState = jest.fn();
export const dispatch = jest.fn();
export const navigate = jest.fn();

export const mockUseGlobal = (state = {}) => {
	useGlobal.mockImplementation(() => ({
		state,
		setState,
		dispatch,
		navigate,
	}));
};

export const useActualUseGlobal = () =>
	useGlobal.mockImplementation(
		jest.requireActual('./useGlobal.js').useGlobal,
	);

export const exportable = {
	setState,
	dispatch,
	navigate,
	mockUseGlobal,
	useActualUseGlobal,
};
