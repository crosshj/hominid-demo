import React from 'react';
import './MenuMobile.css';

export const MenuMobile = ({ Menu, mobileMenuOpen, setMobileMenuFn }) => {
	if (mobileMenuOpen + '' !== 'true') return null;
	return (
		<nav className="mobile-nav">
			<div className="mobile-nav-header">
				<div></div>
				<button
					className="mobileMenuButton"
					onClick={() => setMobileMenuFn({ value: false })}
				>
					Close
				</button>
			</div>
			{Menu}
		</nav>
	);
};
