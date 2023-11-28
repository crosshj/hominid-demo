import { createContext, useContext } from 'react';
import './MenuMobile.css';

export const MobileMenuContext = createContext({});

export const MenuMobile = ({ Menu }) => {
	const { setMobileMenu, mobileMenuVisible } = useContext(MobileMenuContext);
	if (!mobileMenuVisible) return null;
	return (
		<nav className="mobile-nav">
			<div className="mobile-nav-header">
				<div></div>
				<button onClick={() => setMobileMenu(false)}>Close</button>
			</div>
			{Menu}
		</nav>
	);
};
