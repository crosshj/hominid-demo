# I need to add a query/mutation to a screen

1. create the action file in the graphql folder of the module

```
//myModule/graphql/detail.gql

query myModuleDetail($input: ModuleInput) {
	Module(input: $input) {
		id
    title
    value
	}
}

```

2. adds the action to the actions list in the graphql folder

```
//myModule/graphql/index.js

import { loader } from 'graphql.macro';

const myModuleActions = {
  myModuleDetailQuery: loader('./detail.gql')
}

```
