/// <reference types="cypress" />

describe('SetData - mutate', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/setData');
	});

	it('mutates "exampleData" by adding or subtracting 1', async () => {
		cy.wait(2000);

		cy.window().then((win) => {
			// initial value is -1
			expect(win.currentState).to.have.property('exampleData').to.eql(-1);
			expect(win.currentState).to.not.have.property('flowQueue');
		});

		cy.get('[data-test-id="buttonToSubtractOne"]').click();

		cy.window().then((win) => {
			// ensure the MIN property works, the MIN is -1, it shouldn't go further than that.
			expect(win.currentState).to.have.property('exampleData').to.eql(-1);
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});

		cy.get('[data-test-id="buttonToAddOne"]').click();

		cy.window().then((win) => {
			// added one
			expect(win.currentState).to.have.property('exampleData').to.eql(0);
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});

		cy.get('[data-test-id="buttonToAddOne"]').click();

		cy.window().then((win) => {
			// added one
			expect(win.currentState).to.have.property('exampleData').to.eql(1);
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});

		cy.get('[data-test-id="buttonToAddOne"]').click();
		cy.get('[data-test-id="buttonToAddOne"]').click();
		cy.get('[data-test-id="buttonToAddOne"]').click();
		cy.get('[data-test-id="buttonToAddOne"]').click();
		cy.get('[data-test-id="buttonToAddOne"]').click();
		cy.get('[data-test-id="buttonToAddOne"]').click();

		cy.wait(200);

		cy.window().then((win) => {
			// even though we clicked 6 times, that MAX is 4. it shouldn't go further than that.
			expect(win.currentState).to.have.property('exampleData').to.eql(4);
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});

		cy.get('[data-test-id="buttonToSubtractOne"]').click();

		cy.wait(10);

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('exampleData').to.eql(3);
			expect(win.currentState).to.have.property('flowQueue').is.empty;
		});
	});
});
