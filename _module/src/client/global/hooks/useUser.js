import { UserContext } from '../contexts';
import { useContext } from 'react';

export const useUser = () => {
	return useContext(UserContext);
};
