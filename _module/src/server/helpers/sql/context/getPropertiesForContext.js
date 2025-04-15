export const getPropertiesForContext = ({ key, properties }) =>
	properties
		?.split(',')
		.map((prop) => prop.trim()) //removes spaces
		.reduce((acc, prop) => {
			const [name, value] = prop.split(':');

			if (!name || !value) return acc;

			const trimmedValue = value.trim();

			return (acc += `\tEXEC ui.sp_UIComponentPropertiesUpsert '${key}', '${name}', '${trimmedValue}'\n`);
		}, '');
