# Components

Components are React functions that receive props, and render UI based on these props. They may care about UI only (ex.: Typography renders text, Loading renders a spinner) or have some state management with it (ex.: Buttons dispatch actions, and Tables render dynamic and manageable data).

```
export const NewComponent = ({myProp, someList}) => {
  if(myProp === 'someCondition') return null;

  return (
    <SomeMUIComponentHere>
      {someList.map(item => (
        <AnotherMUIComponentHere {...item}>
      ))
    </AnotherMUIComponentHere>
  )
}

```
