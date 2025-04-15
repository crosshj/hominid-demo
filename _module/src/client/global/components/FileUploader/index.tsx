import { Typography, Grid, Input } from '@mui/material';
import { FilePresentRounded, DeleteForever } from '@mui/icons-material';
import { FileStack, StackIcon } from './style.js';
import { useData } from '../../hooks/useData.js';

export const FileUploader = ({ label, name, required, ...props }) => {
	const { data, setData } = useData({ key: name });

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		setData(file);
	};

	const removeFile = (e) => {
		e.preventDefault();
		setData(null);
	};

	const filename = data.name;
	const file = data;
	return (
		<Grid item xs={12}>
			<Input
				inputProps={{ accept: '.xlsx, .xls, .csv' }}
				type="file"
				key={filename}
				onChange={handleFileUpload}
				name={name}
				style={{ display: 'none' }}
				id="contained-button-file"
			/>
			<label htmlFor={!file && 'contained-button-file'}>
				<FileStack>
					{filename && (
						<FilePresentRounded
							color="primary"
							sx={{ fontSize: 38, m: 1 }}
						/>
					)}
					{filename ? (
						<Typography variant="body">
							[{filename}] Uploaded
						</Typography>
					) : (
						<Typography variant="body">+ {label}</Typography>
					)}
					{file && (
						<StackIcon
							direction="row"
							spacing={2}
							onClick={removeFile}
						>
							<DeleteForever color="error" />
							<Typography
								color="error"
								sx={{ marginLeft: '8px!important' }}
							>
								Remove
							</Typography>
						</StackIcon>
					)}
				</FileStack>
			</label>
		</Grid>
	);
};
