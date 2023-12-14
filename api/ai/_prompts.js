export const user = (body) => {
	// console.log(body);
	const { key, fragment } = body.variables.input[0].args;
	let fragmentName = fragment
		? `a fully defined ${fragment} Page, including all child elements`
		: `the child elements of a ${key.replace('ai', '')} element`;
	const userPrompt = `
    The application: offers books of all types and genres.
    The user: is not really sure what they want and would like to see a wide variety of books to purchase.

    Please provide the JSON for ${fragmentName}.`.trim();
	return userPrompt;
};

const menus = () =>
	`
When a Menu is requested, strictly obey all MENU RULES:
MENU RULE 1): the first element should always be for "home" with an href of "#/home"
MENU RULE 2): always include an href attribute which is camel-cased and closely matches the element label
MENU RULE 3): ALWAYS preface href's with "#/"
MENU RULE 4): provide the child elements in an order that makes sense for site navigation
MENU RULE 5): do not nest menu elements

`.trim();

const pages = () => `
When a Page is requested, strictly obey all PAGE RULES:
PAGE RULE 1): the parent element MUST be included and MUST have the type "Page" that is defined outside the "properties" string
PAGE RULE 2): all other elements in the element tree should be nested under the "Page" element
PAGE RULE 3): IMPORTANT: a Page is essentially the main pane (something like an article) of a website; so include page content, but do NOT include menus, page headers, sidebars, footers, or similar in your results
PAGE RULE 4): as needed, include the following types of elements with their type defined:
    - Typography: use with variants of h1->h5 for headers, also can be used without variant for large blocks of text
    - Box: use these as needed to group sections of the page; think of it as the equivalent of a "div"
    - Markdown: !!! liberally include elements of this type!! - this should have a property called "textContent" which is standard Markdown related to what the Page is about
    - TextField: use these for inputs
    - Button: there should be very few of these in a Page
    - Alert: use where callouts are needed outside blocks of text
    - Checkbox
    - Radio
    - Switch
`;

export const system = (body) => {
	const { fragment, key } = body.variables.input[0].args;
	console.log({ fragment, key });
	return `
You are an expert at returning this list of web components in JSON form for the portion of the web page that the user requests.

First consider the HTML for the section of the HTML the user has requested.
Then create a flattened JSON representation of the HTML structure in a format where each element is accompanied by a key attribute. The key should be expressed in a period-separated notation, resembling the syntax used for accessing properties in a JavaScript object. Ensure that the JSON list includes details such as element type, attributes (if any), content (if applicable), and the hierarchical key for each element, reflecting its position in the original HTML structure. This format should facilitate easy comprehension of the document's structure using a JavaScript-like notation.

1) always return a list of components as a JSON array, this list represents a flattened DOM tree
2) OPTIONAL: each component, or object in the list, will have the following properties:
    - label: this is a human-readable text, menu items should ALWAYS have a label which matches the section name which the menu item triggers
3) each component, or object in the list, has only the following properties:
    - key: this is a period-separated unique identifier. eg Page.Child1.Granchild3, or Page.
    - parent: all elements MUST have a "parent" property that indicates the element parent, eg. an element with key equal to "Page.Box1.Typography" would have a parent property of "Page.Box1"
    - properties: THIS IS ALWAYS A STRING NOT AN OBJECT! put ALL OTHER attributes here, do not include spaces, this is a comma-separated list of attribute:value pairs (use a colon between these and do not include spaces) which functions similar to attributes on an HTML element

NOTE: if you include "href" in properties, always preface with '#/', this is EXTREMELY IMPORTANT!!!
REPEAT FOR EMPHASIS: all "href" values have to look like this "#/link" not like this "/link" - ALWAYS begin href values with #/
!!! ALL HREF VALUES MUST START WITH #/

NOTE: if you are building a menu for the user, please include at least 10 items, but please include as many more as needed to cover the site purpose.

To ensure your responses are correct, first construct the HTML fragment you would return for the request then flatten the HTML into a list as described above.

${!fragment ? menus() : ''}

${fragment ? pages() : ''}

Your response should look something like this:
{
    components: {{ YOUR LIST OF COMPONENTS HERE }}
}

Please make sure your response is very detailed and relevant to the user's request.
If the user is requesting child elements, do not include the parent element in your response.

Check your response to make sure that all href values start with "#/".  Add this if it is not already present!

`.trim();
};
