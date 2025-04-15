/// <reference types="cypress" />

describe('SetData - routeParams', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/setData');
	});

	it('uses route params to update a state', async () => {
		cy.wait(2000);

		cy.window().then((win) => {
			expect(win.currentState).to.not.have.property('routeParams');
		});

		cy.get('[data-test-id="buttonToModifyRouteParam"]').click();

		cy.url().should('include', '/999');

		cy.get('[data-test-id="buttonToTriggerRouteValue"]').click();

		// gotta wait for SetData and LocalData run.
		cy.wait(100);

		cy.window().then((win) => {
			expect(win.currentState)
				.to.have.property('flowQueue')
				.to.deep.equal([
					{
						key: 'withRouteValue',
						args: {
							routeParams: {
								myID: '999',
							},
						},
						stepNumber: 2,
					},
				]);
		});

		cy.get('div.MuiDialog-container').should(
			'have.text',
			'heyusing global: 999\nusing flow args: 999NoYes',
		);

		// clicking yes to leave dialog
		cy.get('div.MuiDialogActions-root button.MuiButton-root')
			.last()
			.click();

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});
	});
});
