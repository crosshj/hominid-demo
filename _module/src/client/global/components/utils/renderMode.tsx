// ########################################################################
// #                                                                      #
// #                      THIS FILE IS ABOUT                              #
// #           HOW WE RENDER COMPONENTS INSIDE COLUMNS                    #
// #                                                                      #
// ########################################################################

import _ from 'lodash';
import { format } from 'date-fns';
import * as M from '@mui/material';
import { Checkbox, Chip, TextField, Typography } from '@mui/material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

import { components as MUIGeneric } from '../_MUI';

import { Icon } from '../Icon';
import { Button } from '../Button';
import { ErrorBoundaryBasic } from '../ErrorBoundary';

import { StateManager } from '../../../state/state';

import { getColor } from '../../utils/getColor';
import obscureData from '../../utils/obscureData';
import { replaceTokens } from '../../utils/parseProperties';
import { Selector } from '../../../framework/components/Selector';

const Action = (args: any) => {
	const { onClick, key, color, icon } = args;
	return (
		<M.IconButton onClick={onClick} key={key}>
			<Icon color={color} icon={icon} />
		</M.IconButton>
	);
};

const supported = {
	Checkbox: MUIGeneric.Checkbox,
	Link: MUIGeneric.Link,
	Radio: MUIGeneric.Radio,
	TextField: MUIGeneric.TextField,
	Typography: MUIGeneric.Typography,
	Box: MUIGeneric.Box,
	Switch: MUIGeneric.Switch,
	OptionList: TextField, //deprecate
	RadioButton: M.Radio, //deprecate
	IconButton: MUIGeneric.IconButton,
	Chip: MUIGeneric.Chip,
	Action, //deprecate
	Button: MUIGeneric.Button,
};

const isExtensible = (children: any) => {
	return children.some((child: any) => {
		return child?.type in supported || child?.type === 'Case';
	});
};

export const extensible = (args: any) => {
	const { colDef = {}, row: rowState, children: argsChildren } = args;

	const { children: colDefChildren } = colDef;

	const childrenSrc = argsChildren || colDefChildren;

	if (!Array.isArray(childrenSrc)) return;

	if (isExtensible(childrenSrc) === false) return;

	const isCaseComponentACTIVE = (child: any) => {
		if (typeof child?.props?.when === 'undefined') return false;

		let [source, target] = child.props.when
			.split(' IS ')
			.map((x: any) => x.trim());

		source = source.includes('row_')
			? rowState[source.replace('row_', '')]
			: source;
		source = source + '';

		target = target.includes('row_')
			? rowState[target.replace('row_', '')]
			: target;
		target = target + '';

		return source === target;
	};

	const childrenWithCase = childrenSrc
		.filter((child) => {
			if (child?.type !== 'Case') return true;

			try {
				return isCaseComponentACTIVE(child);
			} catch (e) {}
			return false;
		})
		.map((child) => {
			if (child.type !== 'Case') return child;
			try {
				return child.children[0];
			} catch (e) {}
			return undefined;
		})
		.filter((x) => !!x);

	return (
		<>
			{childrenWithCase.map((x) => {
				const {
					type,
					key,
					label,
					target,
					value,
					props = {},
					children,
				} = x;

				const rowProps = {
					__rowTotals: _.get(rowState, 'totals'),
					__rowIndex: _.get(rowState, '__index'),
					__rowStateKey: _.get(rowState, '__rowStateKey'),
				};

				const foldedProps = {
					label,
					target,
					value,
					...props,
					...rowProps,
				};

				const Component = (supported as any)[type];

				const componentChildren = Array.isArray(children)
					? children.map((child) => (
							<Selector {...child} {...rowProps} />
					  ))
					: null;
				return (
					<ErrorBoundaryBasic key={key}>
						<Component key={key} _src={x.props} {...foldedProps}>
							{componentChildren}
						</Component>
					</ErrorBoundaryBasic>
				);
			})}
		</>
	);
};

export const renderMode = {
	text: (args = {}) => {
		const extensibleResult = extensible(args);
		const { value, colDef }: any = args;
		if (extensibleResult) return extensibleResult;

		const { content, numeric, obscured } = colDef || {};
		const v = content || value;
		const parsedValue = numeric === true ? parseInt(v || '0') : v;

		return <Typography>{obscureData(parsedValue, obscured)}</Typography>;
	},
	date: ({ value }: any) => {
		const date = new Date(value);
		if (!date) return null;
		try {
			const parsedDate = format(date, 'MM/dd/yyyy');
			return <Typography>{parsedDate}</Typography>;
		} catch (e) {
			return null;
		}
	},
	dialog: ({ colDef, row, value }: any) => {
		const { param: paramName, target, content } = colDef;
		const param = row[paramName];

		return (
			<Button
				variant="text"
				type="setDialogState"
				target={target}
				param={param}
				disabled={!target || (paramName && !param)}
			>
				{value || content}
			</Button>
		);
	},
	link: ({ colDef, row, value }: any) => {
		const { param: paramName, route: target, content } = colDef;
		const param = row[paramName];

		return (
			<Button
				variant="text"
				type="navigate"
				target={target}
				param={param}
			>
				{value || content}
			</Button>
		);
	},
	secondary: ({ colDef, row, value }: any) => {
		const { param: paramName, route: target, content } = colDef;
		const param = row[paramName];
		return (
			<Button
				variant="secondary"
				type="navigate"
				target={target}
				param={param}
				disabled={!target || (paramName && !param)}
			>
				{value || content}
			</Button>
		);
	},
	icon: ({ icon, color, value, colDef }: any = {}) => {
		const cases = colDef.children
			.filter((x: any) => x.type.toLowerCase() === 'case')
			.map(
				({
					props: { when = '', color = '', icon = '' } = {},
				}: any = {}) => ({
					when,
					color,
					icon,
				}),
			);
		const thisCase = cases.find(
			({ when }: any) => when.toLowerCase() === value.toLowerCase(),
		) ||
			cases.find((x: any) => x.when === '???') || {
				when: '',
				color: '',
				icon: '',
			};

		return (
			<Icon
				icon={icon || thisCase.icon}
				color={color || thisCase.color}
			/>
		);
	},
	decimal: ({ value }: any) => {
		let decimalValue: any = parseFloat(value).toFixed(2);
		if (isNaN(decimalValue)) {
			decimalValue = 0.0;
		}
		return <Typography>{decimalValue}</Typography>;
	},
	// need to solve this
	// input: ({ value, colDef, id, name: customName }) => {
	// 	const name = customName || `values[${id}].${colDef?.field}`;
	// 	return <TableInput value={value} name={name} {...colDef} />;
	// },
	input2: ({ value, onChange = () => {} }: any) => {
		return (
			<TextField
				onChange={onChange}
				hiddenLabel
				fullWidth
				defaultValue={value}
				variant="outlined"
				size="small"
			/>
		);
	},
	select: () => {
		return <Checkbox />;
	},
	edit: () => {
		return <CreateOutlinedIcon />;
	},
	options: ({ options, value, onChange }: any) => {
		const uniqueOptions: any = [];
		for (const opt of options) {
			const found = uniqueOptions.find(
				(x: any) => x?.label === opt?.label || x?.value === opt?.value,
			);
			if (found) continue;
			uniqueOptions.push(opt);
		}

		return (
			<TextField
				fullWidth
				onChange={onChange}
				select
				defaultValue={value}
				size="small"
				SelectProps={{
					native: true,
				}}
			>
				{uniqueOptions.map((opt: any) => (
					<option value={opt?.value}>{opt?.label}</option>
				))}
			</TextField>
		);
	},
	pill: ({ colDef, value }: any = {}) => {
		const cases = colDef.children
			.filter((x: any) => x.type.toLowerCase() === 'case')
			.map(
				({
					props: { when = '', color = '', icon = '' } = {},
				}: any = {}) => ({
					when,
					color,
					icon,
				}),
			);
		const thisCase = cases.find(
			({ when }: any) =>
				when.toLowerCase() === (value || '').toLowerCase(),
		) ||
			cases.find((x: any) => x.when === '???') || {
				when: '',
				color: '#fff0',
				icon: '',
			};

		return (
			<Chip
				label={thisCase.when.toUpperCase()}
				color="primary"
				style={{ backgroundColor: getColor(thisCase.color) }}
				size="small"
				icon={<Icon icon={thisCase.icon} />}
			/>
		);
	},
	actions: (args: any) => {
		//console.log({ args });
		const { children: argsChildren, row: rowSrc, colDef } = args;
		const { children: colDefChildren } = colDef || {};
		const childrenSrc = argsChildren || colDefChildren;

		if (!childrenSrc || !childrenSrc.length) return null;
		const { level, isOpen, rowType, _type, ...row } = rowSrc || {};

		const children = [];
		for (const child of childrenSrc) {
			const { when } = child?.props || {};
			if (typeof when === 'undefined') {
				children.push(child);
				continue;
			}
			const [whenKey, whenValue] = when
				.split(':')
				.map((x: any) => x.trim());
			if (!whenKey || !whenValue) continue;
			if (row[whenKey].toLowerCase() !== whenValue.toLowerCase())
				continue;
			children.push(child);
		}

		return (
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'end',
				}}
			>
				{children.map((x, i) => {
					const { props = {} } = x || {};
					const {
						icon,
						useData,
						useFlow: flowKey,
						color,
						href,
					} = props;

					const onClick = () => {
						console.log({
							row,
							column: x,
						});

						const currentQueue = StateManager.get('flowQueue');

						const newFlow = { key: flowKey };
						StateManager.update(useData || 'flowArgs', row);
						StateManager.update('flowQueue', [
							...(currentQueue || []),
							newFlow,
						]);
					};

					if (href) {
						const filledHref = replaceTokens(row, href);
						return (
							<M.Link
								href={filledHref}
								target="_blank"
								rel="noreferrer"
							>
								<M.IconButton
									onClick={onClick}
									key={'action-icon-' + i}
								>
									<Icon color={color} icon={icon} />
								</M.IconButton>
							</M.Link>
						);
					}

					return (
						<M.IconButton
							onClick={onClick}
							key={'action-icon-' + i}
						>
							<Icon color={color} icon={icon} />
						</M.IconButton>
					);
				})}
			</div>
		);
	},
};
