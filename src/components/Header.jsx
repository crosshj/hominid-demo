import { useContext } from 'react';
import { MobileMenuContext } from './MenuMobile';
import './Header.css';

export const Header = (headerArgs) => {
	const { setMobileMenu } = useContext(MobileMenuContext);
	const { children } = headerArgs;
	const Logo = children[1].find((x) => x.props.type === 'Logo');
	return (
		<header className="main-head">
			{Logo}
			<button onClick={() => setMobileMenu(true)}>Menu</button>
		</header>
	);
};
