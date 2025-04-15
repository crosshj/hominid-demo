/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback } from 'react';
export const useMount = (mount) => {
	const callback = useCallback(mount, []);
	useEffect(mount, [callback]);
};
