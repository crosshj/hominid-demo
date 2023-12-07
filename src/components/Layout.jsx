import { useState } from 'react';
import './Layout.css';
import { MenuMobile, MobileMenuContext } from './MenuMobile';

/*
References:

https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Realizing_common_layouts_using_grids

*/

export const Layout = (args) => {
	const [selected, setSelected] = useState(document.location.hash);
	const [mobileMenuVisible, setMobileMenu] = useState(false);
	const { slug, title, children } = args;
	const childItems = children[1].filter((x) => x.props.type !== 'Logo');
	const Menu = children[1].find((x) => x.props.type === 'Menu');
	const Header = children[1].find((x) => x.props.type === 'Header');
	const Content = children[1].find((x) => x.props.type === 'Content');

	return (
		<MobileMenuContext.Provider
			value={{
				selected,
				setSelected,
				mobileMenuVisible,
				setMobileMenu,
			}}
		>
			<div className="wrapper">
				{Header}
				<nav className="main-nav">{Menu}</nav>
				<div className="content">
					<article>
						{Content}
					</article>
					<footer className="main-footer">main-footer</footer>
				</div>	
				{/* <aside className="side">Sidebar</aside> */}
				<footer className="mobile-footer">mobile-footer</footer>
			</div>
			<MenuMobile
				Menu={Menu}
				mobileMenuVisible={mobileMenuVisible}
				setMobileMenu={setMobileMenu}
			/>
		</MobileMenuContext.Provider>
	);
};
