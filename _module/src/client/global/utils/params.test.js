const { cleanSubmittedProps } = require('./params');

describe('utils/params', () => {
	it('cleanSubmittedProps: in-name same as out-name', async () => {
		const args = {
			param_talentID: 'global_currentPaysRow.TalentID',
			param_unbillableIncluded: 'global_unbillableIncluded',
			paramsMap: {
				TalentID: 'talentID',
				unbillableIncluded: 'unbillableIncluded',
			},
		};
		const propsToSubmit = {
			key: 'ui.sp_OLActiveAssignmentsByTalentIDDates',
			unbillableIncluded: 1,
			'currentPaysRow.TalentID': '304',
		};
		const result = cleanSubmittedProps(args, propsToSubmit);
		const expected = ['key', 'unbillableIncluded', 'TalentID', 'talentID'];
		expect(Object.keys(result)).toEqual(expected);
	});
});
