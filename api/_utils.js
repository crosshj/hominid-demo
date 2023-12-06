const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
	format: "plain",
	sentencesPerParagraph: {
		max: 10,
		min: 4
	},
	wordsPerSentence: {
		max: 25,
		min: 10
	},
	suffix: "\n\n",
});

const Cookie = (o) =>
	Object.entries(o).reduce((a, [k, v]) => {
		if (!a.trim().length) return `${k}=${v}`;
		if (['HttpOnly'].includes(k) && v) return `${a} ;${k}`;
		return `${a} ;${k}=${v}`;
	}, '');

const ParamString = (o) =>
	Object.entries(o).reduce((a, [k, v]) => `${a}&${k}=${v}`, '');

const match = (target, fn, predicates) => {
	const matcher = fn.bind(target);
	let found;
	for (const [key, value] of Object.entries(predicates)) {
		if (key === 'default') continue;
		if (!matcher.call({}, key)) continue;
		found = value;
		break;
	}
	if (!found && predicates.default) return predicates.default;
	return found;
};

const btoa = (text) => {
	return Buffer.from(text, 'binary').toString('base64');
};
const atob = (base64) => {
	return Buffer.from(base64, 'base64').toString('binary');
};

module.exports = {
	Cookie,
	ParamString,
	lorem,
	match,
	base64: { encode: btoa, decode: atob },
};
