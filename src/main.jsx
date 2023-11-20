import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from './theme/theme';

//import { App } from '../../dist/es6/client';
//import { App } from '../../src/client/client';
import { App } from '@awoss/web/client';
import '@awoss/web/client.css';

const container = document.querySelector('#root');
const root = ReactDOM.createRoot(container);
const components = {};
const page = {
	fragment: 'helloWorld',
	authorized: false,
	title: 'Hello World',
};
if(document.location.pathname !== "/"){
	page.fragment = 'fooBar';
	page.title = 'Woops!';
}
root.render(<App {...{ components, theme, page }} />);

