import './Layout.css';
import { MenuMobile } from './MenuMobile';

/*
References:

https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Realizing_common_layouts_using_grids

*/

export const Layout = (LayoutArgs) => {
	const {
		children,
		mobileMenuOpen,
		setMobileMenuFn,
		//
	} = LayoutArgs;

	//const childItems = children[1].filter((x) => x.props.type !== 'Logo');
	const Menu = children[1].find((x) => x.props.type === 'Menu');
	const Header = children[1].find((x) => x.props.type === 'Header');
	const Content = children[1].find((x) => x.props.type === 'Content');

	return (
		<>
			<div className="wrapper">
				{Header}
				<nav className="main-nav">{Menu}</nav>
				<div className="content">
					<article>{Content}</article>
					<footer className="main-footer">main-footer</footer>
				</div>
				{/* <aside className="side">Sidebar</aside> */}
				<footer className="mobile-footer">mobile-footer</footer>
			</div>
			<MenuMobile
				Menu={Menu}
				mobileMenuOpen={mobileMenuOpen}
				setMobileMenuFn={setMobileMenuFn}
			/>
		</>
	);
};
