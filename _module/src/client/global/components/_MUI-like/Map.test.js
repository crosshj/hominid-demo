import { bindItem } from './Map.utils';

describe('bindItem', () => {
	it('replaces item_prop with item.prop value', () => {
		const child = {
			children: [{ prop: 'item_foo' }],
		};
		const item = {
			foo: 'bar',
		};
		const bound = bindItem(child, item);
		expect(bound.children[0].prop).toBe('bar');
	});

	it('replaces {{item_prop}} with item.prop value', () => {
		const child = {
			children: [{ prop: 'templated {{item_foo}}' }],
		};
		const item = {
			foo: 'bar',
		};
		const bound = bindItem(child, item);
		expect(bound.children[0].prop).toBe('templated bar');
	});

	it('(with formatter) replaces {{item_prop:moneyshort}} with item.prop value', () => {
		const child = {
			children: [{ textContent: '{{item_AmountPaid:moneyshort}}' }],
		};

		const item = {
			AmountPaid: 55555,
		};

		const bound = bindItem(child, item);
		expect(bound.children[0].textContent).toBe('$55.6K');
	});

	it('Real scenario', () => {
		const child = {
			type: 'Box',
			props: {
				display: 'grid',
			},
			children: [
				{
					type: 'Typography',
					props: { textContent: 'item_PayPeriodStart' },
				},
				{
					type: 'Typography',
					props: { textContent: '{{item_PayPeriodEnd:dateformat}}' },
				},
				{
					type: 'Typography',
					props: { textContent: '{{item_AmountPaid:moneyshort}}' },
				},
			],
		};

		const item = {
			PayPeriodName: '[Pay Period 1]',
			PayPeriodStart: '05/14/2023',
			PayPeriodEnd: '06/16/2023',
			AmountPaid: 55555,
			DateIssued: '05/30/2023',
			PayPeriodID: 240,
			myIndex: 0,
		};

		const bound = bindItem(child, item);
		expect(bound.children[0].props.textContent).toBe('05/14/2023');
		expect(bound.children[1].props.textContent).toBe('06/16/23 12:00 AM');
		expect(bound.children[2].props.textContent).toBe('$55.6K');
	});
});
