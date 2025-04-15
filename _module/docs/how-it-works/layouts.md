#Layouts

Layouts are JS functions that receive args and return a list of widgets with the needed style and props coming from these args. Widgets may have children, and they can render or not, depending on the received args.

Putting it simple, layouts describe how the screen is organized, by selecting the widgets that live in it. A layout isn't supposed to know how a widget renders the passed props, though.

```
const listLayout = ({ title, description, tables, tableSelector }) = [
  {
    type:'text',
    props: title
  },
  {
    type:'tooltip',
    props: description
  },
  {
    type:'table',
    props: { tables, someOtherProp: 'propValue'}
  }
  {
    type:'tableSelector',
    props: tableSelector,
    style: { mt: 2 }
  }
]

```
