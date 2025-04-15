const mediaProNotes = require('../../integrations/__mocks__/data/mediaProNotes.json');
const customerNotes = require('../../integrations/__mocks__/data/customerNotes.json');

const getAllNotesFromRelation = ({ table, relationId }) => {
	if (table == 'LOMediaPro') {
		if (relationId != '345') return mediaProNotes;
		return mediaProNotes.filter((note) => note.author == 'Arial Droneman');
	}
	if (table == 'Customer') return customerNotes;
	return [];
};

const createNote = ({ table, relationId, text, authorId }) => {
	return {
		id: '1',
		text,
		author: authorId,
	};
};

const updateNote = ({ id, newText, authorId }) => {
	return {
		id,
		text: newText,
		author: authorId,
	};
};

module.exports = {
	getAllNotesFromRelation,
	createNote,
	updateNote,
};
