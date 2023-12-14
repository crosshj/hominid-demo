import './Header.css';

export const Header = (headerArgs) => {
	const { openMobileMenuFn, children } = headerArgs;
	const Logo = children[1].find((x) => x.props.type === 'Logo');
	return (
		<header className="main-head">
			{Logo}
			<button
				className="mobileMenuButton"
				onClick={openMobileMenuFn}
			>
				Menu
			</button>
		</header>
	);
};
