import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@anthroware_dev/web/client';
import '@anthroware_dev/web/client.css';

import { theme } from './theme/theme';

//TODO: find/write a vite plugin for importing entire directory (because updating/keeping this is annoying)
import { Container } from './components/Container';
import { Layout } from './components/Layout';
import { Menu } from './components/Menu';
import { Header } from './components/Header';
import { MenuMobile } from './components/MenuMobile';
import { Content } from './components/Content';
const components = {
	Container,
	Layout,
	Menu,
	MenuMobile,
	Header,
	Content,
};

const container = document.querySelector('#root');
const root = ReactDOM.createRoot(container);
const page = {
	fragment: 'hominidLayout',
	authorized: false,
	title: 'hominid',
};
if (document.location.pathname !== '/') {
	page.fragment = 'fooBar';
	page.title = 'Woops!';
}
if (document.location.pathname.startsWith('/ai')) {
	page.fragment = 'aiHome';
	page.title = 'hominid GPT';
}
if (document.location.pathname.startsWith('/fundpaw')) {
	page.fragment = 'fundpawLayout';
	page.title = 'fundpaw';
}

root.render(<App {...{ components, theme, page }} />);
