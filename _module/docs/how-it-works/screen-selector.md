# Screen Selector

In its core, the framework has a ScreenSelector that reads the selected screen at that time from the GlobalContext.

```
const { screen } = useGlobal();
```

Each screen has a configuration object, so the ScreenSelector picks it, and searches for the needed layout.

```
const screenOptions = globalConfig[screen];
const { layout } = screenOptions;

const layoutFunction = screenMap[layout];
```

A config object is created by passing the Context that came from DB and the layout type to the main composer, which will internally select the specialized composer for that layout.

```
const config = composer(UIContext, layout)
```

Now knowing which layout is needed, the ScreenSelector passes the screen config for the layout function, expecting to get back a widgets(components) list.

```
const widgets = layoutFunction(config);
```

The ScreenSelector then iterates over the list, calling a widget Selector component, which is able to render the called widget and to pass the provided props to it.

```
  {widgets?.map((widget, index) => {
    return <Selector key={index} {...widget} />;
  })}
```
