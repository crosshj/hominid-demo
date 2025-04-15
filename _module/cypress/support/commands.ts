/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add(
	// @ts-ignore
	'setupAuthCookies',
	(token: string = '', accessToken: string = '') => {
		cy.setCookie(
			'token',
			// token,
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImN0IiwiZW1haWwiOiJhdHdvcmtyb2xlK2NoaWxkQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNoaWxkIiwibGFzdE5hbWUiOiJUZW5hbnQiLCJicmFuY2hJZCI6MSwicm9sZUlkIjo1LCJ0ZW5hbnRJZCI6MX0.4cu0yJYvMvzW50aRGwAKEzNK7YqCHBvdF-nZ9CwUxh8',
			{
				domain: 'localhost',
				path: '/',
				httpOnly: true,
			},
		);
		cy.setCookie(
			'accessToken',
			// accessToken,
			'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9ncmVlbmZpZWxkLXdlYi1kZXYudXMuYXV0aDAuY29tLyJ9..RdsszIAF1vSdKIQS.84_CeCHZ661CCd-GUnytuvZe8w5sh4OfdMzgSkfR-iAlZZa945qaqGWS8nupZK-YS4oHs1kRyiNa687qmmOawFy0JfEcAaeni6BSgfZGHfvqSYNaEaGp-yDGpqupytLQNCGqilywzk0od_sUj0NKJvLE_4n-E8DO0uRqG3Bm7l_y_2kCOdtXr5uy7r8aNSYyTgomHeswj4mMrsri7T7ZvqT0naTY02tnV6pFWZ3wkKtVNK5OB5dPqQo5oTO_htBMkYCEvyo0gmU8_N_qDgXAH2hPs06pmtbG2DzpNTGOt0mlkNNaIMV5D7eqUN4ZIG_GrxFsYEXX1Lc.-8DenN1JzrpQanCFwME6lA',
			{
				domain: 'localhost',
				path: '/',
				httpOnly: true,
			},
		);
		cy.setCookie('sessionExpires', '86400', {
			domain: 'localhost',
			path: '/',
			httpOnly: true,
		});
		// cy.visit('/');

		// cy.wait(1000);

		// cy.get('button').first().click();

		// cy.wait(1000);

		// cy.origin('https://greenfield-web-dev.us.auth0.com', () => {
		// 	// `<commands targeting https://greenfield-web-dev.us.auth0.com go here>`;

		// 	cy.get('input#username').type(Cypress.env().USERNAME);
		// 	cy.get('input#password').type(Cypress.env().PASSWORD);

		// 	cy.getAllCookies().then((x) => console.log({ x }));
		// 	cy.get('[data-action-button-primary="true"]').click();
		// });

		// cy.wait(3000);
	},
);
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
