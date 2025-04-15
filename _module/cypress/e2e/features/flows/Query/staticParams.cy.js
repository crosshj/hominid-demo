/// <reference types="cypress" />

describe('Flows - Query - Static Params', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/query/staticParams');
	});

	it('call a query with static params', async () => {
		cy.wait(2000);

		cy.window().then((win) => {
			expect(
				win.currentState,
				'assert flowQueue is empty',
			).to.not.have.property('flowQueue');
		});

		cy.intercept(
			'/api/graphql?submit:featuresFlowsQueryStaticParamsData',
		).as('withStaticParams');

		cy.get('[data-test-id="buttonExecuteQueryWithStaticParams"]', {
			timeout: 15000,
		})
			.should('have.attr', 'href', 'flow:executeQuery')
			.click();

		cy.wait('@withStaticParams')
			.then(({ response, request }) => {
				// ensure correct args were sent
				expect(
					request.body.variables.input[0],
					'assert query args',
				).to.deep.equal({
					name: 'ui.sp_Upsert',
					args: {
						key: 'featuresFlowsQueryStaticParamsData',
						clientId: '15',
					},
				});

				expect(
					JSON.parse(response.body.data.FormProc[0].results),
					'assert query result',
				).to.deep.equal({
					message: 'Results submitted with: {\n  "clientId": "15"\n}',
				});

				cy.wait(200);

				return cy.window();
			})
			.then((win) => {
				expect(
					win.currentState,
					'assert query result.message was stored on state',
				)
					.to.have.property('results')
					.to.equal(
						'Results submitted with: {\n  "clientId": "15"\n}',
					);

				expect(
					win.currentState,
					'assert flow has finished',
				).to.have.property('flowQueue').is.empty;
			});
	});
});
