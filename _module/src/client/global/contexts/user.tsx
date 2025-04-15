import React, { useState, useEffect } from 'react';
import { StateManager } from '../../state/state';

export const UserContext = React.createContext({});

const getUser = async (): Promise<any> => {
	const x = await fetch('/api/auth/me');
	return await x.json();
};

export const UserProvider = ({ children }: any) => {
	const [user]: any = StateManager.useListener('currentUser');
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		getUser().then((user) => {
			StateManager.update('currentUser', user);
			setLoading(false);
		});
	}, []);

	return (
		<UserContext.Provider value={{ user, isLoading }}>
			{children}
		</UserContext.Provider>
	);
};
