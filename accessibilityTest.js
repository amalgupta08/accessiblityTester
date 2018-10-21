/*global axe*/
import 'axe-core';

export default class AccessibilityTest {

	async check(context = { include: ['html'] }, options = {}) {
		const result = await this.getResults(context, options);
		return result;
	}

	getResults(context, options) {
		const rules = this.filterDisabledRules(options.skipRules || []);
		return new Promise((resolve, reject) => {
			axe.run(context, { rules }, (error, result) => {
				resolve({ result, error });
			});
		});
	}

	filterDisabledRules(knownViolations) {
		const disabledRules = {};
		axe.getRules().forEach((rule) => {
			if (knownViolations.indexOf(rule.ruleId) !== -1) {
				disabledRules[rule.ruleId] = { enabled: false };
			}
		});
		return disabledRules;
	}

}