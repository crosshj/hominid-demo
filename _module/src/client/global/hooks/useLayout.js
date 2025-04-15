import { LayoutContext } from '../contexts/layout';
import { useContext } from 'react';

export const useLayout = () => {
	return useContext(LayoutContext);
};
