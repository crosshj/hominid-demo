import { Card, CardContent, Stack, Typography } from '@mui/material';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	BarChart,
	Bar,
} from 'recharts';

export const Dashboard = () => {
	const data = [
		{
			name: 'Page A',
			uv: 4000,
			pv: 2400,
			amt: 2400,
		},
		{
			name: 'Page B',
			uv: 3000,
			pv: 1398,
			amt: 2210,
		},
		{
			name: 'Page C',
			uv: 2000,
			pv: 9800,
			amt: 2290,
		},
		{
			name: 'Page D',
			uv: 2780,
			pv: 3908,
			amt: 2000,
		},
		{
			name: 'Page E',
			uv: 1890,
			pv: 4800,
			amt: 2181,
		},
		{
			name: 'Page F',
			uv: 2390,
			pv: 3800,
			amt: 2500,
		},
		{
			name: 'Page G',
			uv: 3490,
			pv: 4300,
			amt: 2100,
		},
	];

	const bar = [
		{
			name: 'Lorem',
			uv: 4000,
			pv: 2400,
			amt: 2400,
		},
		{
			name: 'Ipsum',
			uv: 3000,
			pv: 1398,
			amt: 2210,
		},
		{
			name: 'Dollor',
			uv: 2000,
			pv: 9800,
			amt: 2290,
		},
	];

	return (
		<Stack sx={{ width: '100%', pt: 2 }} spacing={4}>
			<Stack direction="row" justifyContent="space-between">
				<Card sx={{ width: '33%' }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 14 }}
							color="text.secondary"
							gutterBottom
						>
							Billing
						</Typography>
						<Stack
							direction="row"
							justifyContent="space-between"
							spacing={2}
						>
							<Typography variant="h5">4582</Typography>
							<LocalAtmIcon color="error" fontSize="large" />
						</Stack>
					</CardContent>
				</Card>
				<Card sx={{ width: '33%' }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 14 }}
							color="text.secondary"
							gutterBottom
						>
							Accounts Receivable
						</Typography>
						<Stack
							direction="row"
							justifyContent="space-between"
							spacing={2}
						>
							<Typography variant="h5">121</Typography>
							<MonetizationOnIcon
								color="success"
								fontSize="large"
							/>
						</Stack>
					</CardContent>
				</Card>
				<Card sx={{ width: '33%' }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 14 }}
							color="text.secondary"
							gutterBottom
						>
							Post Cash
						</Typography>
						<Stack
							direction="row"
							justifyContent="space-between"
							spacing={2}
						>
							<Typography variant="h5">343</Typography>
							<CreditScoreIcon color="info" fontSize="large" />
						</Stack>
					</CardContent>
				</Card>
			</Stack>
			<Stack direction="row" justifyContent="space-between">
				<Card sx={{ width: '33%' }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 14, mb: 2 }}
							color="text.secondary"
							gutterBottom
						>
							Lorem ipsum
						</Typography>
						<BarChart width={200} height={200} data={bar}>
							<Bar dataKey="uv" fill="#005CB9" />
						</BarChart>
					</CardContent>
				</Card>
				<Card sx={{ width: '66%' }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 14 }}
							color="text.secondary"
							gutterBottom
						>
							Data
						</Typography>
						<LineChart
							width={700}
							height={200}
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="pv"
								activeDot={{ r: 8 }}
							/>
							<Line type="monotone" dataKey="uv" />
						</LineChart>
					</CardContent>
				</Card>
			</Stack>
		</Stack>
	);
};
