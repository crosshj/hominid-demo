import './Header.css';

export const Header = (headerArgs) => {
	const { setMobileMenuFn, children } = headerArgs;
	const Logo = children[1].find((x) => x.props.type === 'Logo');
	return (
		<header className="main-head">
			{Logo}
			<button
				className="mobileMenuButton"
				onClick={() => setMobileMenuFn({ value: true })}
			>
				Menu
			</button>
		</header>
	);
};
