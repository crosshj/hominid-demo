export const genericAdapter =
	(Component) =>
	({ props, ...rest }) => {
		return { Component, ...props, ...rest };
	};
