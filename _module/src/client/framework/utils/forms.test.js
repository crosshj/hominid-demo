describe('disabled', () => {
	it('disabled', () => {});
});

// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { formParser, formTreeBuilder } from './forms';
// import { parseProperties } from '../../global/utils/parseProperties';
// import { getChildren } from './../tree.js';
// import { CompareSharp } from '@mui/icons-material';

// jest.mock('./../../global/utils');
// jest.mock('./../tree.js');

// const mockParseProperties = (mockReturn = {}) => {
// 	parseProperties.mockImplementation(() => mockReturn);
// };
// const mockGetChildren = (children = {}) => {
// 	getChildren.mockImplementation(() => children);
// };

// describe('formParser', () => {
// 	beforeEach(() => {
// 		mockParseProperties();
// 		mockGetChildren();
// 	});
// 	it('test case', () => {
// 		// mockContextParser(0);
// 		console.log(contextParser(1));
// 		console.log(contextParser(2));
// 	});
// 	it('basic case', () => {
// 		const formResult = formParser();
// 		expect(formResult).toBe(null);
// 	});
// 	it('form def is just an object', () => {
// 		const formDef = {};
// 		const formResult = formParser(formDef);
// 		expect(formResult).toBe(null);
// 	});
// 	it('form def is an evil object', () => {
// 		const formDef = { length: 2 };
// 		const formResult = formParser(formDef);
// 		expect(formResult).toBe(null);
// 	});
// 	it.only('form def is basic', () => {
// 		mockParseProperties({ icon: 'foo' });
// 		mockGetChildren({
// 			properties: [{ icon: 'foo' }, { variant: 'bar' }],
// 			key: 'myKey',
// 		});
// 		//Arrange
// 		const formDef = [
// 			{
// 				type: 'Form',
// 				label: 'Form Example',
// 				target: '/target',
// 				properties: 'foo',
// 			},
// 		];
// 		const formResult = formParser(formDef);
// 		expect(formResult.label).toBe(formDef[0].label);
// 		expect(formResult.target).toBe(formDef[0].target);
// 		expect(formResult.icon).toBe('foo');
// 		expect(parseProperties).toBeCalledWith('foo');
// 		expect(formResult.fields).toStrictEqual({
// 			properties: [{ icon: 'foo' }, { variant: 'bar' }],
// 			key: 'myKey',
// 		});
// 		expect(getChildren).toBeCalledTimes(1);
// 	});
// 	it('form def item has type other than Form', () => {
// 		const formDef = [{ type: 'funk' }];
// 		const formResult = formParser(formDef);
// 		expect(formResult).toBe(null);
// 	});
// 	it('form def cant have multiple items of type form', () => {
// 		const formDef = [
// 			{
// 				type: 'Form',
// 				label: 'Anna Form',
// 				target: '/annaTarget',
// 			},
// 			{
// 				type: 'Form',
// 				label: 'Harrison Form',
// 				target: 'harrisonTarget',
// 			},
// 		];
// 		const formResult = formParser(formDef);
// 		expect(formResult.label).toBe(formDef[0].label);
// 	});
// 	//don't think i can do this test without learning how to mock dependencies
// 	it('form def contains form item', () => {
// 		const formDef = [
// 			{
// 				type: 'Form',
// 				label: 'Anna Form',
// 				target: 'annaTarget',
// 			},
// 			{
// 				type: 'Input',
// 				label: 'Harrison Form',
// 				target: 'harrisonTarget',
// 			},
// 		];
// 		const formResult = formParser(formDef);
// 		expect(formResult.label).toBe(formDef[0].label);
// 	});
// 	it('form def item has type other than Form', () => {
// 		const formDef = [{ type: 'funk' }];
// 		const formResult = formParser(formDef);
// 		expect(formResult).toBe(null);
// 	});
// 	it('form def cant have multiple items of type form', () => {
// 		const formDef = [
// 			{
// 				type: 'Form',
// 				label: 'Anna Form',
// 				target: '/annaTarget',
// 			},
// 			{
// 				type: 'Form',
// 				label: 'Harrison Form',
// 				target: 'harrisonTarget',
// 			},
// 		];
// 		const formResult = formParser(formDef);
// 		expect(formResult.label).toBe(formDef[0].label);
// 	});
// 	//don't think i can do this test without learning how to mock dependencies
// 	/* 	it('form def contains form item', () => {
// 		const formDef = [
// 			{
// 				type: 'Form',
// 				label: 'Anna Form',
// 				target: '/annaTarget',
// 			},
// 			{
// 				type: 'Input',
// 				label: 'Harrison Form',
// 				target: 'harrisonTarget',
// 			},
// 		];
// 		const formResult = formParser(formDef);
// 		console.log(formResult.fields);
// 		expect(formResult.label).toBe(formDef[0].label);
// 	}); */
// });

// describe('formTreeBuilder', () => {
// 	it('basic case', () => {
// 		//Arrange
// 		//Act
// 		const tree = formTreeBuilder();
// 		//Assert
// 		expect(tree).toEqual([]);
// 	});
// 	it('context is an empty array case', () => {
// 		//Arrange
// 		const context = [];
// 		//Act
// 		const tree = formTreeBuilder();
// 		//Assert
// 		expect(tree).toEqual([]);
// 	});
// 	/* 	it('context has one nested item case', () => {
// 		//Arrange
// 		const context = [
// 			{
// 				type: 'Section',
// 				key: 'iamparent',
// 			},
// 			{
// 				type: 'Input',
// 				parent: 'iamparent',
// 			},

// 		];
// 		const result = {
// 			[
// 				{
// 					type: Section,
// 					key: iamparent,
// 					childrent: [ ]
// 				}
// 			]
// 		};
// 		//Act
// 		const tree = formTreeBuilder(context);
// 		//Assert
// 		console.log(JSON.stringify(tree, null, 2));
// 	}); */
// 	it('context has multiple items case', () => {
// 		//Arrange
// 		const context = [
// 			{
// 				type: 'Section',
// 				key: 'iamparent',
// 			},
// 			{
// 				type: 'Section',
// 				key: 'iamuncle',
// 			},
// 			{
// 				type: 'Input',
// 				parent: 'iamparent',
// 			},
// 			{
// 				type: 'Button',
// 				parent: 'iamuncle',
// 			},
// 		];
// 		//Act
// 		const tree = formTreeBuilder(context);
// 		//Assert
// 		console.log(JSON.stringify(tree, null, 2));
// 	});
// 	it('form def item has type other than Form', () => {
// 		const formDef = [{ type: 'funk' }];
// 		const formResult = formParser(formDef);
// 		expect(formResult).toBe(null);
// 	});
// 	it('form def cant have multiple items of type form', () => {
// 		const formDef = [
// 			{
// 				type: 'Form',
// 				label: 'Anna Form',
// 				target: '/annaTarget',
// 			},
// 			{
// 				type: 'Form',
// 				label: 'Harrison Form',
// 				target: 'harrisonTarget',
// 			},
// 		];
// 		const formResult = formParser(formDef);
// 		expect(formResult.label).toBe(formDef[0].label);
// 	});
// 	//don't think i can do this test without learning how to mock dependencies
// 	it('form def contains form item', () => {
// 		const formDef = [
// 			{
// 				type: 'Form',
// 				label: 'Anna Form',
// 				target: 'annaTarget',
// 			},
// 			{
// 				type: 'Input',
// 				label: 'Harrison Form',
// 				target: 'harrisonTarget',
// 			},
// 		];
// 		const formResult = formParser(formDef);
// 		expect(formResult.label).toBe(formDef[0].label);
// 	});
// });

/* describe('formTreeBuilder', () => {
	it('basic case', () => {
		//Arrange
		//Act
		const tree = formTreeBuilder();
		//Assert
		expect(tree).toEqual([]);
	});
	it('context is an empty array case', () => {
		//Arrange
		const context = [];
		//Act
		const tree = formTreeBuilder();
		//Assert
		expect(tree).toEqual([]);
	});
	it('context has one nested item case', () => {
		//Arrange
		const context = [
			{
				type: 'Section',
				key: 'iamparent',
			},
			{
				type: 'Input',
				parent: 'iamparent',
			},

		];
		const result = {
			[
				{
					type: Section,
					key: iamparent,
					childrent: [ ]
				}
			]
		};
		//Act
		const tree = formTreeBuilder(context);
		//Assert
		console.log(JSON.stringify(tree, null, 2));
	});
	it('context has multiple items case', () => {
		//Arrange
		const context = [
			{
				type: 'Section',
				key: 'iamparent',
			},
			{
				type: 'Section',
				key: 'iamuncle',
			},
			{
				type: 'Input',
				parent: 'iamparent',
			},
			{
				type: 'Button',
				parent: 'iamuncle',
			},
		];
		//Act
		const tree = formTreeBuilder(context);
		//Assert
		console.log(JSON.stringify(tree, null, 2));
	});
});

/* describe('formTreeBuilder', () => {
	it('basic case', () => {
		//Arrange
		//Act
		const tree = formTreeBuilder();
		//Assert
		expect(tree).toEqual([]);
	});
	it('context is an empty array case', () => {
		//Arrange
		const context = [];
		//Act
		const tree = formTreeBuilder();
		//Assert
		expect(tree).toEqual([]);
	});
	it('context has one nested item case', () => {
		//Arrange
		const context = [
			{
				type: 'Section',
				key: 'iamparent',
			},
			{
				type: 'Input',
				parent: 'iamparent',
			},

		];
		const result = {
			[
				{
					type: Section,
					key: iamparent,
					childrent: [ ]
				}
			]
		};
		//Act
		const tree = formTreeBuilder(context);
		//Assert
		console.log(JSON.stringify(tree, null, 2));
	});
	it('context has multiple items case', () => {
		//Arrange
		const context = [
			{
				type: 'Section',
				key: 'iamparent',
			},
			{
				type: 'Section',
				key: 'iamuncle',
			},
			{
				type: 'Input',
				parent: 'iamparent',
			},
			{
				type: 'Button',
				parent: 'iamuncle',
			},
		];
		//Act
		const tree = formTreeBuilder(context);
		//Assert
		console.log(JSON.stringify(tree, null, 2));
	});
}); */
