/*
when using variant on Stack, TS will complain
MUI recommends something like the following, but this wasn't working
instead, we trick TS using something like <Stack {...{variant: 'myVariant'}}>
this is ugly, please fix if you know how
*/

// import { StackProps as MuiStackProps } from '@mui/material/Stack';

// declare module '@mui/material/Stack' {
// 	interface StackProps extends MuiStackProps {
// 		variant?: 'fullScreen' | 'default';
// 	}
// }

// declare module "@material-ui/core/Button/Button" {
//     export interface ButtonProps {
//       to?: string;
//     }
//   }
