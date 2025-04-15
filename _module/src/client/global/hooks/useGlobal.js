import { useContext } from 'react';
import { GlobalContext } from '../contexts/global';

export const useGlobal = () => {
	return useContext(GlobalContext);
};
