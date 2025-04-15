/// <reference types="cypress" />

describe('Flows - Query - Call w/ Default Postal Code', () => {
	beforeEach(() => {
		cy.setupAuthCookies();
		cy.visit('/features/flows/query/call');
	});

	it('calls vertexGetGeocode with default postal code', async () => {
		cy.wait(2000);

		// defined in configs...
		const DEFAULT_POSTAL_CODE = '30076';

		cy.window().then((win) => {
			expect(win.currentState).to.have.property('address').to.deep.equal({
				postalCode: DEFAULT_POSTAL_CODE,
			});
		});

		cy.intercept('POST', '/api/graphql?call:vertexGetGeocode').as(
			'vertexGetGeocode',
		);

		const getGeocodeButton = cy.get('[data-test-id="buttonGetGeocode"]', {
			timeout: 15000,
		});

		getGeocodeButton.should('have.attr', 'label', 'Get Geocode');
		getGeocodeButton.should('have.attr', 'href', 'flow:readGeocode');

		getGeocodeButton.click();

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

		cy.get('div.MuiDialog-container').should(
			'have.text',
			`Query for GeocodeUse County name: \nUse City name: \nUse State name: \nUse postal code: ${DEFAULT_POSTAL_CODE}\n\nGet geocode?NoYes`,
		);

		// clicking yes to read geocode
		cy.get('div.MuiDialogActions-root button.MuiButton-root')
			.last()
			.click();

		cy.wait('@vertexGetGeocode').then(({ response, request }) => {
			// only POSTAL CODE was sent (default value)
			expect(request.body.variables.input[0]).to.deep.equal({
				args: { body: `{"postalCode":"${DEFAULT_POSTAL_CODE}"}` },
				call: 'vertexGetGeocode',
				name: 'ui.sp_Upsert',
			});

			expect(response.statusCode).to.equal(200);
			expect(response.body.data.FormProc[0].results).to.equal(
				'{"geocodes":[{"geocodeId":"111210990","state":"GEORGIA","county":"FULTON","city":"ROSWELL","postalRangeStart":"30075","postalRangeEnd":"30077","nameType":"ActualCityName","nameLevel":"City","apoFpoIndicator":"NotApoNorFpo","schoolDistrict":"0","psdCodes":[{"psd":"880000","jurisdictionName":"Out of State","taxingAuthorityName":"Out of State","startDate":"20120101","stopDate":"21001231"}]},{"geocodeId":"110670990","state":"GEORGIA","county":"COBB","city":"ROSWELL","postalRangeStart":"30075","postalRangeEnd":"30077","nameType":"ActualCityName","nameLevel":"City","apoFpoIndicator":"NotApoNorFpo","schoolDistrict":"0","psdCodes":[{"psd":"880000","jurisdictionName":"Out of State","taxingAuthorityName":"Out of State","startDate":"20120101","stopDate":"21001231"}]}]}',
			);
		});
	});
});
