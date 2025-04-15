// import { TestProvider } from 'global/contexts';
// import { render, waitFor } from '@testing-library/react';
// import { useGlobal } from '../../hooks';
// // import { Validator } from 'global/components/Validator';
// import { Selector } from 'framework/components/Selector';
//
// import { objectFromIdTree } from 'global/utils';

// jest.mock('global/hooks/useGlobal.js');
// jest.mock('global/services/getData');

// const useEffect = jest.spyOn(React, 'useEffect');
// const setState = jest.fn();

// const mockUseGlobal = (state = {}) => {
// 	useGlobal.mockImplementation(() => {
// 		return {
// 			state,
// 			setState,
// 			dispatch: jest.fn(),
// 		};
// 	});
// };

// const mockUseEffect = () => {
// 	useEffect.mockImplementationOnce((f) => f());
// };

// // Mock Validator component
// const Validator = ({ _src }) => {
// 	const schema = objectFromIdTree(_src, 'Validator');
// 	console.log(schema);
// 	return null;
// };

// // PASSED CONFIG
// const mockConfig = {
// 	id: 'Page.Validator',
// 	type: 'Validator',
// 	props: undefined,
// 	// many other props (ommitted here for clarity)
// 	children: [
// 		{
// 			type: 'Object',
// 			id: 'Page.Validator.Object',
// 			props: undefined,
// 			// many other props (ommitted here for clarity)
// 			children: [
// 				{
// 					type: 'String',
// 					id: 'Page.Validator.Object.String',
// 					props: {
// 						name: 'username',
// 						alphanum: true,
// 						min: 3,
// 						max: 30,
// 						required: true,
// 					},
// 					// many other props (ommitted here for clarity)
// 				},
// 			],
// 		},
// 	],
// };
// const mockExpectedSchema = {};

xdescribe('Validator implementation', () => {
	beforeEach(() => {
		mockUseGlobal({});
		mockUseEffect();
	});

	xit('should add schemas to global ', async () => {
		const res = Validator({ _src: mockConfig });
		expect(res).toBeNull();
		// TODO: assert  schema
		waitFor(() => expect(setState).toHaveBeenCalledWith({ schemas: {} }));
	});

	/*
		transformFromConfig
		transformToSchema
		composeSchema
	 */
});
