## Overview

Config's are defined in XML this way:

```xml
<Page>
    <Validator>
        <Object>
            <String
                name="username"
                alphanum="true"
                min="3"
                max="30"
                required="true"
            />
        </Object>
    </Validator>
</Page>
```

However, when we code inside a component, `_src` looks much different. It can be quite difficult to see what was expressed in the original XML because of this.

> NOTE: `_src` is a special property set on all components to get around all the tricks we play to support React components. This looks much closer to the JSON that comes from API than what comes from the component's props in general.
>
> Further, `_src` is mostly the tree that is built from the flat JSON that comes from the API.

```javascript
{
    id: "Page.Validator",
    type: "Validator",
    props: undefined,
    // many other props (ommitted here for clarity)
    children: [{
        type: "Object",
        id: "Page.Validator.Object",
        props: undefined,
        // many other props (ommitted here for clarity)
        children: [{
            type: "String",
            id: "Page.Validator.Object.String",
            props: {
                name: "username",
                alphanum: true,
                min: 3,
                max: 30,
                required: true
            }
            // many other props (ommitted here for clarity)
        }]
    }]
}
```

## Purpose

This function transforms this component's `_src` into something that looks much more like the original XML.

The original usecase for this was with our `Validator` component, but we could use this elsewhere given that the code is extended where needed to account for the caveats mentioned later in this document.

## Usage

```javascript
import { ObjectFromIdTree } from 'global/utils/objectFromIdTree';

// the component in this example
const Validator = ({ _src }) => {
	const schema = ObjectFromIdTree(_src, 'Validator');
	console.log(schema);
	return null;
};
```

Console will show the value of `schema` variable to be:

```javascript
{
    Object: {
        String: {
            name: "username",
            alphanum: true,
            min: 3,
            max: 30,
            required: true
        }
    }
}
```

This is much closer to what was defined in XML for Validator:

```xml
<Object>
    <String
        name="username"
        alphanum="true"
        min="3"
        max="30"
        required="true"
    />
</Object>
```

## Caveats

-   there are some XML properties that do NOT get placed in `props`. As of writing, these propetries are not considered. Be mindful!!!
-   XML allows multiple children to have the same tag name. Javascript object property names must be unique. Here we rely strongly on the notion that `id` will be set in a way that accounts for this. So these multiple children must be indicated somehow. Currently, we postfix an index to the child's id, ie. `String.0, String.1`. This module will probably not handle this properly.
-   `id`'s are essentially `key`'s, when a `key` is specified in XML, things will go wrong. Instead, do not specify a `key` for elements in your XML when possible.
