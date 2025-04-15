/// <reference types="cypress" />

describe('Flows - Confirm - With Custom Continue Button', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/confirm');
	});

	it('opens modal with custom continue button and not displaying CANCEL one', async () => {
		cy.wait(2000);

		cy.window().then((win) => {
			expect(win.currentState).to.not.have.property('flowQueue');
		});

		cy.get(
			'[data-test-id="buttonWithCustomContinueAndWithoutCancel"]',
		).click();

		cy.wait(100);

		cy.window().then((win) => {
			expect(win.currentState)
				.to.have.property('flowQueue')
				.to.deep.equal([{ key: 'customContinue', args: {} }]);
		});

		// dialog should be open
		cy.get('div.MuiDialog-container').should('not.be.undefined');

		// dialog should have custom title
		cy.get('div.MuiDialog-container h2').should(
			'have.text',
			'Continue Only!',
		);

		// dialog should have specific text
		cy.get('div.MuiDialogContent-root').should(
			'have.text',
			'No Choice but to go on!',
		);

		// dialog should have ONE button
		const buttonsSelector =
			'div.MuiDialogActions-root button.MuiButton-root';

		cy.get(buttonsSelector).should('have.length', 1);

		cy.get(buttonsSelector).first().should('have.text', 'Accept').click();

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});
	});
});
