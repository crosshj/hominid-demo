import State from './state.js';

const interceptLinkClicks = () => {
	document.addEventListener('click', (e) => {
		const nearestLink = e.target.closest('a');
		if (!nearestLink) return;
		e.preventDefault();
		const hrefProp = nearestLink.getAttribute('href');
		document.location.hash = '#/' + hrefProp;
		State.update({ path: 'route', value: hrefProp });
	});
};

const attach = () => {
	interceptLinkClicks();
};

export default { attach };
