## How to develop

```bash
npm install
cd src/client && npm install && cd ../..
cd src/server && npm install && cd ../..
npm run build
```

module is now available at `dist/`

// notes regarding usage

-   source index.mjs contains the API formatting code
-   in source, the main composer and screen constant/component exist, but the sub components for each were not made clear yet
-   in source, the layout compwidegt onent does exist - I didn't know if the framework necessarily needed it though

### Publish

uses: https://github.com/pascalgn/npm-publish-action

-   change the version in package.json to 1.2.3 (for example)
-   push a commit with the message Release 1.2.3
-   action will create a new tag v1.2.3 and publish
