#Composers

A composer takes as its input the UI context that came from the DB when it's still formatted as a list of Context items with no hierarchy. The output is the object needed as input to a specific layout. **Therefore, there is a composer for each layout**.

The way to build the desired object is to search for a specific Context Item type in the UIContext, and manipulate it as needed.

```
const listComposer = (UIContext, find, filter) {
  const title = UIContext.find('title')
  const description = UIContext.find('description')

  const tables = UIContext.filter('table').map(table =>
    doSomethingWithThis(table)
  )
  const tableSelector = UIContext.find('tableSelector')

  return {
    title,
    description,
    tables,
    tableSelector
  }
}

```
