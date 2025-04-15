import { Button, Chip, IconButton, Link, MenuItem } from './Actions';
import { Box } from './Box';
import { TextField } from './TextField';
import { Stepper } from './Stepper';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';
import { Radio } from './Radio';
import { Pagination } from './Pagination';

const shims = {
	Button,
	Chip,
	IconButton,
	Link,
	MenuItem,

	Box,
	TextField,
	Stepper,
	Checkbox,
	Switch,
	Radio,
	Pagination,
};

export const getShim = (componentName, propsIntact, propsFilled) => {
	if (!(componentName in shims)) {
		return { propsShimmed: {} };
	}
	const { propsShimmed, childrenShimmed } = shims[componentName]({
		propsFilled,
		propsIntact,
	});
	return { propsShimmed, childrenShimmed };
};

export * from './Actions';
export * from './Box';
export * from './TextField';
export * from './Stepper';
export * from './Switch';
export * from './Checkbox';
export * from './Stepper';
export * from './Radio';
