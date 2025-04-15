# Selector

The Selector is a component that returns components according to the passed props. The selection occurs based in a widget map. If there are children for that widget, they're also rendered with the selector.

```
import { widgetMap } from 'global/config/widgetMap';

export const Selector = ({ type, children, style, props }) => {
	const SelectedWidget = widgetMap[type];

	return (
		<SelectedWidget sx={{ ...style }} {...props}>
			{alsoRendersChildrenUsingSomeLogicHere}
		</SelectedWidget>
	);
};
```
