# I need to build a new layout

1. Create a file with a function using the name of the layout you want in the layouts folder.

```
//global/layouts/myNewLayout.js

const myNewLayout = () => {}
```

2. Register the layout in the screenMap object

```
const screenMap = {
  list: listLayout,
  detail: detailLayout,
  dashboard: dashboardLayout,
  myNewLayout: myNewLayout // here it is
}

```

3. Add to the layout args the props that make the layout dynamic, and that should be passed by a screen config

```
//global/layouts/myNewLayout.js

const myNewLayout = ({title, form, actions}) => {}
```

4. Make the layout return a list of widgets that builds what you need, using the args as props or children to the widgets.

**Important**: a widget in the layout file can be described as an object that may have:

-   type - which component to get from the widgetMap
-   children - other widgets or text
-   props - an object with static or dynamic props
-   style - an object with static or dynamic style definitions

```
//global/layouts/myNewLayout.js

const myNewLayout = ({ title, form, actions }) => [
	{ type: 'text', children: title, props: { variant: 'h3' } },
	{ type: 'form', props: form },
	{
		type: 'container',
		children: actions.map((action) => {
			return { type: 'button', props: action };
		}),
	},
];
```
