import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/material';
import { Link } from '../../../router';

export const BackButton = (props: any) => {
	return (
		<Link {...props}>
			<Box>
				<ArrowBackIcon />
			</Box>
		</Link>
	);
};
