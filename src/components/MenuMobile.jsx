import './MenuMobile.css';

export const MenuMobile = ({ Menu, closeMobileMenuFn, mobileMenuOpen }) => {
	if (!mobileMenuOpen) return null;
	return (
		<nav className="mobile-nav">
			<div className="mobile-nav-header">
				<div></div>
				<button
					className="mobileMenuButton"
					onClick={closeMobileMenuFn}
				>
					Close
				</button>
			</div>
			{Menu}
		</nav>
	);
};
