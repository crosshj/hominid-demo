export const Intro = (args) => {
  console.log({ introArgs: args });
  return <div>{args.textContent}</div>;
};
