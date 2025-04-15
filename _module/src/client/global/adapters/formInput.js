import { StateManager } from '../../state/state';
import { Input } from '../components/Input';
import obscureData from '../utils/obscureData';

/*

parent usedata
0				0
0				1
1				0
1				1

rule 1: were not handling the case of having both parent and useData
!!! potential exception: usedata on a child as an alias

rule 2: form children should be keep close to the parent
we may support multiple parents with the same use data

rule 3: parent value has priority over global value

*/

export const FormInputAdapter = (args) => {
	const { label, children, props, id: name, type, context } = args;
	const {
		'data-name': dataName,
		source,
		gridVariant,
		select,
		grid = 'true', //to be removed
		useData: useDataParam,
		obscured,
	} = props || {};

	const parsedName = name?.split('.').slice(-1)[0];
	const finalKey = dataName ? `${useDataParam}.${dataName}` : useDataParam;

	const [globalValue, setData] = StateManager.useListener(
		finalKey,
		undefined,
		{
			note: 'global/adapters/formInput',
		},
	);
	const [options] = StateManager.useListener(source, undefined, {
		note: 'global/adapters/formInput',
	});

	return {
		Component: Input,
		dataName,
		name: parsedName,
		id: name,
		label,
		children,
		options,
		context,
		value: obscureData(globalValue, obscured) || '',
		setValue: setData,
		disabled: props?.readOnly + '' === 'true',
		select: type === 'OptionList' || select === 'true',
		grid: grid === 'false',
		gridVariant,
		onChange: (e) => setData(e?.target?.value),
	};
};

export const formInputAdapter = FormInputAdapter;
