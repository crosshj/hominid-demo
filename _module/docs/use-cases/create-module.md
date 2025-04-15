# I need to build a new module

1. create a folder with you module name, with a index file inside it, containing a module config object

```
//myNewModule/index.js

const myNewModuleConfig = {}
```

2. Register this module in the globalConfig file:

```
//global/config/index.js

import { myNewModuleConfig } from 'myNewModule'

const globalConfig = {
  ...{
    welcome: {
      type: 'login'
    },
    dashboard: {
      type: 'dashboard',
      query: dashboardQuery
    }
  },
  ...alreadyRegisteredModule,
  ...myNewModuleConfig //here it is
}
```

3. add the config for the screens you need

```
//myNewModule/index.js

import { newModule, newModuleDetail } from './screens'
import { newModuleActions } from './graphql'

const myNewModuleConfig = {
  newModule: {
    type:'list',
    content: newModule,
    query: newModuleActions.listQuery,
  },
  newModuleDetail: {
    type:'list',
    content: newModuleDetail,
    query: newModuleActions.detailQuery,
    mutation: newModuleActions.detailMutation,
  }

}
```
