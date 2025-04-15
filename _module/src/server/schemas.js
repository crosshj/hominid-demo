module.exports = `
input ProcInput {
	name: String
	call: String
	uuid: String
	args: String #stringify-ed args
}

type ContextResult {
	key: String
	label: String
	default: String
	value: String
	type: String
	parent: String
	target: String
	properties: String
	order: String
}
type ContextProcResult {
	uuid: String
	name: String
	cacheExpires: String
	error: String
	results: [ContextResult]
}
type Query {
	ContextProc(input: [ProcInput]): [ContextProcResult]
}

type DataResult {
	uuid: String
	name: String
	cacheExpires: String
	error: String
	results: String
}
type Query {
	Data(input: [ProcInput]): [DataResult]
}

type FormProcResult {
	uuid: String
	name: String
	cacheExpires: String
	error: String
	results: String
}
type Mutation {
	FormProc(input: [ProcInput]): [FormProcResult]
}

type FormProcResult {
	uuid: String
	name: String
	cacheExpires: String
	error: String
	results: String
}
type Mutation {
	FormProc(input: [ProcInput]): [FormProcResult]
}

type Column {
	key: String
	label: String
	hidden: Boolean
	target: String
	properties: String
	order: String
}
type ListResults {
	columns: [Column]
	rows: [[String]]
}
type ListProcResult {
	uuid: String
	name: String
	cacheExpires: String
	error: String
	results: ListResults
}
type Query {
	ListProc(input: [ProcInput]): [ListProcResult]
}

type SessionResult {
	email: String
	firstName: String
	lastName: String
	token: String
}
input SessionInput {
	email: String
	id: String
	invite: String
}
type Query {
	Session(input: SessionInput): SessionResult
}
`.trim();
