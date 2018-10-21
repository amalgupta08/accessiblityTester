import table from 'text-table';

export default class AccessibilityReport {

	constructor(results) {
		this.results = results;
	}

	getFormattedResults() {
		let output = '\n';
		this.results.forEach((result, index) => {
			output += `${table(this.generateOutputTable(result, index + 1), { 
				align: [ 'r', 'c', 'l' ] 
			})}`;
			output += '\n\n';
		});
		return output;
	}

	generateOutputTable(result, issueNumber) {
		const description = result.description.length > 120 ? result.description.substr(0, 120) + '...' : result.description;
		const nodes = result.nodes.map((node, index) => {
			let text = '';
			const html = node.html.length > 120 ? node.html.substr(0, 120) + '...' : node.html;
			if (index === 0)
				text = 'Nodes violating the rule';
			return [
				text,
				index + 1 + '.', 
				html
			];
		});
		return [
			[`Issue ${issueNumber}.`, '', ''],
			['Rule',	'', result.id],
			['Description', '', description],
			['Help url',	'',	result.helpUrl],
			...nodes	];
	}
}