import { getLogo } from './logo';
import { lightMode } from './lightMode';
import { darkMode } from './darkMode';

export const theme = (mode) => {
	const logo = getLogo(mode);
	const palette = mode === 'light' ? lightMode : darkMode;
	return {
		logo,
		palette,
		typography: {
			fontFamily: ['Open Sans', 'sans-serif'].join(),
			h1: {
				fontWeight: '300',
				fontSize: '2rem',
				lineHeight: '116.7%',
			},
			h2: {
				fontWeight: '300',
				fontSize: '1.5rem',
				lineHeight: '120%',
			},
			h3: {
				fontWeight: '400',
				fontSize: '1.17rem',
				lineHeight: '116.7%',
			},
			h4: {
				fontWeight: '400',
				fontSize: '1rem',
				lineHeight: '123.5%',
			},
			h5: {
				fontWeight: '400',
				fontSize: '0.83rem',
				lineHeight: '133.4%',
			},
			h6: {
				fontWeight: '500',
				fontSize: '0.67rem',
				lineHeight: '160%',
			},
			body1: {
				fontWeight: '400',
				fontSize: '1rem',
				lineHeight: '150%',
			},
			body2: {
				fontWeight: '400',
				fontSize: '0.875rem',
				lineHeight: '143%',
			},
			subtitle1: {
				fontWeight: '400',
				fontSize: '1rem',
				lineHeight: '175%',
			},
			subtitle2: {
				fontWeight: '500',
				fontSize: '0.875rem',
				lineHeight: '157%',
			},
			overline: {
				fontWeight: '400',
				fontSize: '0.75rem',
				lineHeight: '266%',
			},
			caption: {
				fontWeight: '400',
				fontSize: '0.75rem',
				lineHeight: '166%',
			},
		},
		components: {
			MuiStack: {
				variants: [
					{
						props: { variant: 'fullScreen' },
						style: {
							justifyContent: 'center',
							alignItems: 'center',
							width: '99%',
							height: '99%',
						},
					},
				],
			},
			MuiIcon: {
				variants: [
					{
						props: { fontSize: 'x-large' },
						style: {
							fontSize: '3rem',
						},
					},
				],
			},
		},
	};
};
