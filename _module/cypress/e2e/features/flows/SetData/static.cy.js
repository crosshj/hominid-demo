/// <reference types="cypress" />

describe('SetData - static', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/setData');
	});

	it('changes "data1" from 100 to 500', async () => {
		cy.wait(2000);

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('data1').to.eql('');

			// flow queue is not even initialized yet
			expect(win.currentState).to.not.have.property('flowQueue');
		});

		const changeTo100Button = cy.get('a[href="flow:data1To100"]', {
			timeout: 50000,
		});

		changeTo100Button.click();

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('data1').to.eql(100);
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});

		const changeTo500Button = cy.get('a[href="flow:data1To500"]', {
			timeout: 50000,
		});

		changeTo500Button.click();

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('data1').to.eql(500);
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});

		// click on 100 button again
		changeTo100Button.click();

		cy.wait(10);

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('data1').to.eql(100);
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});
	});
});
