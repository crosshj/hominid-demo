# I need to build a new component

1. Create the component you want in the components folder

```
//global/components/NewComponent/index.jsx

export const NewComponent = ({title, children, things, actions, ...props}) => {
  return <>some JSX over here</>
}
```

2. Add the component to the widgetMap

```
//global/config/widgetMap.js

import { Button, NewComponent } from 'global/components'

const widgetMap = {
  button: Button,
  newComponentName: NewComponent
}
```

3. Use it in a layout

```
//global/layouts/someLayout.js

const someLayout = ({title, things, actions, anotherArg}) => [
  { type: 'newComponentName', props: { title, things, actions, anotherProp: 'someValue' }}
]
```
