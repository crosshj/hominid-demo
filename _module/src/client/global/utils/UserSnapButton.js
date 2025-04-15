let stylesheet;
export const UserSnapButton = {
	show: () => {
		try {
			stylesheet =
				stylesheet || document.getElementById('usersnap-hider');
			stylesheet.disabled = true;
		} catch (e) {
			console.log(e);
		}
	},
	hide: () => {
		try {
			stylesheet =
				stylesheet || document.getElementById('usersnap-hider');
			stylesheet.disabled = false;
		} catch (e) {
			console.log(e);
		}
	},
};
