/// <reference types="cypress" />

describe('Flows - Confirm - With Cancel Button', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/confirm');
	});

	it('opens modal with both confirm and cancel button', async () => {
		cy.wait(2000);

		cy.window().then((win) => {
			expect(win.currentState).to.not.have.property('flowQueue');
		});

		cy.get('[data-test-id="buttonWithCancel"]').click();

		cy.wait(100);

		cy.window().then((win) => {
			expect(win.currentState)
				.to.have.property('flowQueue')
				.to.deep.equal([{ key: 'withCancel', args: {} }]);
		});

		// dialog should be open
		cy.get('div.MuiDialog-container').should('not.be.undefined');

		// dialog should have custom title
		cy.get('div.MuiDialog-container h2').should(
			'have.text',
			'Continue / Cancel?',
		);

		// dialog should have specific text
		cy.get('div.MuiDialogContent-root').should(
			'have.text',
			'Your text here. You can use  here if they are present.',
		);

		// should have 2 buttons: cancel and confirm
		const buttonsSelector =
			'div.MuiDialogActions-root button.MuiButton-root';
		cy.get(buttonsSelector).should('have.length', 2);

		cy.get(buttonsSelector).first().should('have.text', 'No');
		cy.get(buttonsSelector).last().should('have.text', 'Yes');

		cy.get(buttonsSelector).last().click();

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});

		// clicking again
		cy.get('[data-test-id="buttonWithCancel"]').click();
		cy.window().then((win) => {
			expect(win.currentState)
				.to.have.property('flowQueue')
				.to.deep.equal([{ key: 'withCancel', args: {} }]);
		});

		// now clicking on cancel button
		cy.get(buttonsSelector).first().click();

		// result is the same, the flow ends
		cy.window().then((win) => {
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});
	});
});
