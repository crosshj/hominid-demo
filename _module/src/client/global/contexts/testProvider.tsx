import { GlobalProvider } from './global';
import { ToastContainer } from 'react-toastify';
import { useModuleBuilder } from '../hooks/useModuleBuilder';

export const TestProvider = ({ children }: any) => {
	const globalModule = useModuleBuilder({ name: 'test' });
	return (
		<GlobalProvider {...globalModule}>
			{children}
			<ToastContainer />
		</GlobalProvider>
	);
};
