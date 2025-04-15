# Validator notes

##

Validation must be agnostic to the UI and Framework since we are dealing with data.
In my opinion the logic for validation must be placed outside of react and afterwards binding it to a validator/hook.
With this approach we decouple react from validator specific behavior.
The same goes for the framework.

Pros:

-   Since the logic for validation is outside of react and the framework. It will allow to better mantaining.
-   Also will allow to test only the logic of the validator, neither React or the Framework will interfere, making easier to test.
-   In the future will be easier to extend specific use cases scenarios.

Cons:
