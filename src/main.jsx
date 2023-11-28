import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from './theme/theme';

//import { App } from '../../dist/es6/client';
//import { App } from '../../src/client/client';

import client from '@awoss/web/client';
import { App } from '@awoss/web/client';
import '@awoss/web/client.css';
import { Container } from './components/Container';
import { Layout } from './components/Layout';
import { Menu } from './components/Menu';
import { Header } from './components/Header';
import { MenuMobile } from './components/MenuMobile';

console.log({ client });

const container = document.querySelector('#root');
const root = ReactDOM.createRoot(container);
const components = {
	Container,
	Layout,
	Menu,
	MenuMobile,
	Header,
};
const page = {
	fragment: 'helloWorld',
	authorized: false,
	title: 'Hello World',
};
if (document.location.pathname !== '/') {
	page.fragment = 'fooBar';
	page.title = 'Woops!';
}
root.render(<App {...{ components, theme, page }} />);
