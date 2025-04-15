import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from './theme/theme';
import { Gantt } from './components/Gantt';
import { Kanban } from './components/Kanban';

//import { App } from '../../dist/es6/client';
//import { App } from '../../src/client/client';
import { App } from '@awoss/web/client';
import '@awoss/web/client.css';

const components = {
	Gantt,
	Kanban,
};
const icons = {
	//TODO: support adding custom svg icons here
	//const: 'foo',
};

ReactDOM.createRoot(document.getElementById('root')).render(
	<App
		theme={theme}
		components={components}
		icons={icons}
		//TODO: customize what else?
	/>,
);
