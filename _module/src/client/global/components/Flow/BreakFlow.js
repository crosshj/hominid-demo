export const BreakFlow = (props) => {
	const { debug, onExit } = props;

	setTimeout(() => {
		if (debug) {
			console.log({
				_: 'Breaking flow',
			});
		}

		onExit && onExit();
	}, 1);

	return null;
};
