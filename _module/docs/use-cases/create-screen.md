# I need to build a new screen

1. Identify which layout the screen shall use.
2. Understand which props that layout expects to receive, and where they're used.
3. Create a js config file for that screen, fulfilling the needed props for the layout.
4. Add the screen options to the config file for the module in which it lives.

Example:

```
//global/layouts/detail.js

const detail = ({ title, description, table, data }) => [
	{ type: 'text', children: title, props: { variant: 'h3' } },
	{ type: 'text', children: description, props: { variant: 'p' } },
	{ type: 'text', children: table?.title, props: { variant: 'h4' } },
	{ type: 'table', props: { data: data[table?.queryField] || [] } },
];

```

```
//cars/screens/detail.js

const carDetail = {
	title: 'Car Detail',
	description: 'Take a look on each part of your car',
	table: {
		title: 'Your car parts',
		queryField: 'carParts',
	},
};

```

```
//cars/index.js

import { carDetail } from './screens/detail.js';

const carModule = {
	carDetail: {
		type: 'detail',
		content: carDetail,
	},
};

```
