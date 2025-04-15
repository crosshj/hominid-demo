## Related to the Validation issue

### 1st - Import schema from external file

#### Description:

    1 -  Schema is created on the frontend
    2 -  Validator is binded to data component and schema in the config
    	Ex.: <Validator key="" useSchema="" />
    				<Data key="" />
    3 - At runtime <Validator /> will resolve schema and data
    4 - Message will be presented in the browser console, adittional behavior to be defined.

#### Pros:

    * Simplest solution
    * Better in the short term.

#### Cons:

    -	Will demand additional step (from config) on the frontend to define the schema.

#### Questions

    	- The framework is loading the file automatically on the frontend as well? Is there a pattern?

### 2nd - Translate a given pattern from config into a schema

#### Description:

     1 - Config is created
     2 - Config is translated to a given pattern defined in the frontend (separating framework from front/ui).
     3 - schemaGenerator will convert to Yup(or better option) schema and validate data.
     4 - validation result will be printed or forwarded to something in the framework or frontend state, etc.

#### Pros:

    - Good at short term implementation, better at long-term.
    - Will allow to get source from DB, XML file, JSON, etc.

#### Cons:

    - Starts simple, can get tricky at complex use cases.
    - Will need an addititonal layer for mapping from source(DB, XML, JSON, etc) to desired pattern(Yup, Zod, whatever lib or pattern being used in the frontend).

## Considerations based on my limited perspective/context of the project and how data is being handled:

### I will probably be wrong on most assumptions, but is refinement of my understanding :3

    * Both solutions consider Validator as being a React component binded to another component of type Data throught a key or identifier.

    * Wouldn't be better to create a context to handle where the given data is needed instead of exposing globally, it doesn't make sense to expose data that won't be used/needed in other parts of the application.

    * How the data are being handled, what kind approach is being used to handle cache, validity, etc? - - If the data lose it's validity, how we are handling the afterwards? What is/are the direction(s) of the validation? client to server? server to client?

    * But if the data will be needed for some reason outside of the scope, we can sync it with global store through useSyncExternalStore, for both exposing and consuming for ex. the browser API.
    	Ex:
    		<Form />
    		<Data />
    		<Validator />

## Not specifically related to the validation issue

## Questions that need to be documented to be more dev/newcomers friendly:

    * how the framework is handling dynamic file import? Is it isomorphic or exist an adapter for the frontend? React.Lazy will work normal?
    * what are the boundaries of the framework and the UI(react) and how they interact?
    * how the framework handle interaction between parent/children, siblings?
    * how the framework handle hooks, contexts, providers, external services, browser API?
    * how local context and global context are being handled by the framework and how they interact with React state management?
