import { createContext, useContext } from 'react';
import './MenuMobile.css';

export const MobileMenuContext = createContext({});

export const MenuMobile = ({ Menu }) => {
	const { setMobileMenu, mobileMenuVisible } = useContext(MobileMenuContext);
	if (!mobileMenuVisible) return null;
	return (
		<nav className="mobile-nav">
			<div classname="mobile-nav-header">
				<div></div>
				<button onClick={() => setMobileMenu(false)}>hide mobile</button>
			</div>
			{Menu}
		</nav>
	);
};
