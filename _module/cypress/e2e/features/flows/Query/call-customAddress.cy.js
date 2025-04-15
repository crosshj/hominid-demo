/// <reference types="cypress" />

describe('Flows - Query - Call w/ Custom Address', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/query/call');
	});

	it('calls vertexGetGeocode with custom user address', async () => {
		cy.wait(2000);
		// defined in configs...
		const DEFAULT_POSTAL_CODE = '30076';

		// default values
		cy.window().then((win) => {
			expect(win.currentState).to.have.property('address').to.deep.equal({
				postalCode: DEFAULT_POSTAL_CODE,
			});
		});

		cy.intercept('POST', '/api/graphql?call:vertexGetGeocode').as(
			'vertexGetGeocode',
		);

		const cityName = 'ATLANTA';
		const stateName = 'GEORGIA';
		const newPostalCode = '30313';

		cy.get('[data-testid="input-1"]').type(cityName);
		cy.get('[data-testid="input-2"]').type(stateName);
		cy.get('[data-testid="input-3"]').clear().type(newPostalCode);

		cy.window().then((win) => {
			expect(win.currentState)
				.to.have.property('address')
				.to.deep.equal({
					postalCode: newPostalCode,
					city: { name: cityName },
					state: { name: stateName },
				});
		});

		cy.get('[data-test-id="buttonGetGeocode"]', {
			timeout: 15000,
		}).click();

		cy.window().then((win) => {
			expect(win.currentState)
				.to.have.property('flowQueue')
				.to.deep.equal([
					{
						key: 'readGeocode',
						args: {},
					},
				]);
		});

		// validating confirm data
		cy.get('div.MuiDialog-container').should(
			'have.text',
			`Query for GeocodeUse County name: \nUse City name: ${cityName}\nUse State name: ${stateName}\nUse postal code: ${newPostalCode}\n\nGet geocode?NoYes`,
		);

		// clicking yes to read geocode
		cy.get('div.MuiDialogActions-root button.MuiButton-root')
			.last()
			.click();

		cy.wait('@vertexGetGeocode').then(({ response, request }) => {
			// new data was sent
			expect(request.body.variables.input[0]).to.deep.equal({
				args: {
					body: JSON.stringify({
						postalCode: newPostalCode,
						city: { name: cityName },
						state: { name: stateName },
					}),
				},
				call: 'vertexGetGeocode',
				name: 'ui.sp_Upsert',
			});

			expect(response.statusCode).to.equal(200);
			expect(response.body.data.FormProc[0].results).to.equal(
				'{"geocodes":[{"geocodeId":"111210080","state":"GEORGIA","county":"FULTON","city":"ATLANTA","postalRangeStart":"30301","postalRangeEnd":"30321","nameType":"ActualCityName","nameLevel":"City","apoFpoIndicator":"NotApoNorFpo","schoolDistrict":"0","psdCodes":[{"psd":"880000","jurisdictionName":"Out of State","taxingAuthorityName":"Out of State","startDate":"20120101","stopDate":"21001231"}]}]}',
			);
		});
	});
});
