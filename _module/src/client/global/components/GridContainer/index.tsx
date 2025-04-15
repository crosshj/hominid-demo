import * as M from '@mui/material';

export const GridContainer = (args: any) => {
	const { children = [], spacing = 2, overflow } = args;

	return (
		<M.Grid container spacing={spacing} overflow={overflow}>
			{children.map((child: any, i: any) => {
				const { xs = '4', sm, md, lg, xl } = child?.props?.props || {};

				return (
					<M.Grid
						item
						key={i}
						xs={xs}
						sm={sm}
						md={md}
						lg={lg}
						xl={xl}
					>
						{child}
					</M.Grid>
				);
			})}
		</M.Grid>
	);
};
