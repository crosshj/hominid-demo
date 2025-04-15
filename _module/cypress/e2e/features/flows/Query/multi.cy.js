/// <reference types="cypress" />

describe('Flows - Query - Multi', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/query/multi');
	});

	it('call multiple queries inside a flow', async () => {
		cy.wait(2000);

		cy.window().then((win) => {
			expect(
				win.currentState,
				'assert flowQueue is empty',
			).to.not.have.property('flowQueue');
		});

		cy.intercept('/api/graphql?submit:featuresFlowsQueryMultiOne').as(
			'multiOne',
		);
		cy.intercept('/api/graphql?submit:featuresFlowsQueryMultiTwo').as(
			'multiTwo',
		);

		cy.get('[data-test-id="buttonExecuteMultiQuery"]')
			.should('have.attr', 'href', 'flow:multiQuery')
			.click();

		cy.wait('@multiOne')
			.then(({ response, request }) => {
				// ensure correct args were sent
				expect(
					request.body.variables.input[0],
					'assert query 1 args',
				).to.deep.equal({
					name: 'ui.sp_Upsert',
					args: { key: 'featuresFlowsQueryMultiOne' },
				});

				// assert result
				expect(
					response.body.data.FormProc[0].results,
					'assert query 1 result',
				).to.equal(JSON.stringify({ message: 'hello from one!' }));
			})
			.then(() => {
				cy.wait(300);
			})
			.then(() => {
				cy.window().then((win) => {
					// ensure flowQueue has correct arguments
					expect(
						win.currentState,
						'assert flow has correct arguments before calling query 2',
					)
						.to.have.property('flowQueue')
						.to.deep.equal([
							{ key: 'multiQuery', args: {}, stepNumber: 1 },
						]);

					expect(
						win.currentState,
						'assert query 1 message was stored on state',
					)
						.to.have.property('multiOneMessage')
						.to.equal('hello from one!');

					expect(
						win.currentState,
						'assert query 2 message is not on state',
					).to.not.have.property('multiTwoMessage');
				});
			});

		cy.wait('@multiTwo')
			.then(({ response, request }) => {
				expect(
					request.body.variables.input[0],
					'assert query 2 args',
				).to.deep.equal({
					name: 'ui.sp_Upsert',
					args: {
						oneMessage: 'hello from one!',
						key: 'featuresFlowsQueryMultiTwo',
					},
				});

				// assert result
				expect(
					response.body.data.FormProc[0].results,
					'assert query 2 result',
				).to.equal(JSON.stringify({ message: 'hello from two!' }));
			})
			.then(() => {
				cy.window().then((win) => {
					expect(
						win.currentState,
						'assert flow has correct arguments',
					)
						.to.have.property('flowQueue')
						.to.deep.equal([
							{ key: 'multiQuery', args: {}, stepNumber: 2 },
						]);

					expect(
						win.currentState,
						'assert result from query 1 is intact',
					)
						.to.have.property('multiOneMessage')
						.to.equal('hello from one!');

					expect(
						win.currentState,
						'assert result from query 2 was stored on state',
					)
						.to.have.property('multiTwoMessage')
						.to.equal('hello from two!');
				});
			});

		// validating confirm data
		cy.get('div.MuiDialog-container').should(
			'have.text',
			'SuccessThat worked!Okay',
		);

		cy.window().then((win) => {
			expect(
				win.currentState,
				'assert flow has correct args before closing dialog',
			)
				.to.have.property('flowQueue')
				.to.deep.equal([
					{ key: 'multiQuery', args: {}, stepNumber: 2 },
				]);
		});

		// clicking yes to close modal
		cy.get('div.MuiDialogActions-root button.MuiButton-root')
			.last()
			.click();

		cy.wait(200);

		cy.window().then((win) => {
			expect(
				win.currentState,
				'assert flow has finished',
			).to.have.property('flowQueue').is.empty;
		});
	});
});
