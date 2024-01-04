import React from 'react';

export const Container = (args) => {
	const { slug, title, children } = args;
	const childItems = children[1].filter((x) => x.props.type !== 'Logo');
	const Logo = children[1].find((x) => x.props.type === 'Logo');
	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: '-4em',
			}}
		>
			{Logo}
			<div
				style={{
					backgroundColor: 'white',
					padding: '1em',
					minWidth: '600px',
					borderRadius: '5px',
					marginTop: '1em',
				}}
			>
				<h2 style={{ marginTop: '2' }}>{title}</h2>
				<div>{slug}</div>
				<div
					style={{
						gap: '1em',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						marginTop: '2em',
						marginBottom: '1em',
					}}
				>
					{childItems}
				</div>
			</div>
		</div>
	);
};
