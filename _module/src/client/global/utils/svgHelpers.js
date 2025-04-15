export const InlineSrcSVG = (svgString) => {
	const prefix = `data:image/svg+xml;base64,`;
	if (!svgString) return prefix;
	const base64data = btoa(svgString);
	const source = `${prefix}${base64data}`;
	return source;
};
