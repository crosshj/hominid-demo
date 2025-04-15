import _ from 'lodash';
import { getColor } from '../../utils/getColor';
import { extensible } from '../utils';
import { getColumns } from './styles';
import { getItemStyle } from './getItemStyle';

const itOrUndefined = (v: any) => (typeof v !== 'undefined' ? v : undefined);
const toMUIColor = (v: any) => (v ? getColor(v) : undefined);

export const AddonItem = (args: any, _debug: boolean) => {
	const {
		className: classNameSrc,
		row,
		leftSpacers,
		//rightSpacers,
		columns: columnsSrc,
		color,
		background,
		backgroundColor,

		borderRadius,
		display,
		justifyContent,
		alignItems,
		padding,
		style: styleSrc = {},
	} = args;
	//TODO: use rightSpacers, columns to troubleshoot?

	let columns = [];
	let currentIndex = leftSpacers.length + 1;
	const colSpans = args.children.reduce((a: number, o: any) => {
		if (o?.props?.span === 'auto') return a + 1;
		if (typeof o?.props?.span === 'undefined') return a + 1;
		return a + Number(o?.props?.span);
	}, 0);

	for (const child of args.children) {
		let thisSpan = child.props?.span || 1;
		if (thisSpan === 'auto') {
			const otherCellsSpan = colSpans - 1;
			const availableSpan = columnsSrc.length + 1;
			thisSpan = availableSpan - otherCellsSpan;
		}
		const className =
			typeof classNameSrc === 'undefined' || !classNameSrc
				? 'nest-level-1 nest-cell nest-header no-underline'.split(' ')
				: classNameSrc.split(' ');

		if (child?.props?.align === 'right') className.push('justifyEnd');
		if (child?.props?.align === 'left') className.push('justifyStart');
		if (child?.props?.align === 'center') className.push('justifyCenter');

		columns.push({
			child,
			className: className.join(' '),
			gridColumn: [currentIndex, `span ${thisSpan}`].join(' / '),
		});

		currentIndex += thisSpan;
	}

	const style: any = _.omitBy(
		{
			...styleSrc,

			color: toMUIColor(color),
			background: toMUIColor(background),
			backgroundColor: toMUIColor(backgroundColor),

			borderRadius: itOrUndefined(borderRadius),
			display: itOrUndefined(display),
			padding: itOrUndefined(padding),
			justifyContent: itOrUndefined(justifyContent),
			alignItems: itOrUndefined(alignItems),
		},
		_.isNil,
	);

	return (
		<>
			{columns.map((col) => (
				<div
					className={col.className}
					style={{
						gridColumn: col.gridColumn,
						...style,
					}}
				>
					{extensible({ ...col.child, row })}
				</div>
			))}
		</>
	);
};

export const Addons = (args: any) => {
	const { _src } = args;
	const addons = _src.children.filter((x: any) => x.type === 'Addon');
	if (!addons.length) return null;
	const { leftSpacers, rightSpacers, columns } = getColumns(args);

	for (const addon of addons) {
		if (addon.children.length === 1) {
			addon.children[0].props.span = [
				...leftSpacers,
				...rightSpacers,
				...columns,
			].length;
		}
	}

	return (
		<>
			{addons.map((addon: any) => {
				return (
					<AddonItem
						key={addon.key}
						children={addon.children}
						padding="16px"
						row={addon}
						style={getItemStyle(addon.props)}
						{...addon.props}
						{...{ leftSpacers: [], columns, rightSpacers: [] }}
					/>
				);
			})}
		</>
	);
};
