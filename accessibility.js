import AccessibilityTest from './accessibilityTest';
import AccessibilityReport from './accessibilityReport';
import { assert } from 'chai';

class AccessibilityHelper {
	/**
	 * 
	 * Visit https://confluence.oraclecorp.com/confluence/display/BPM/Accessibility+Automation+Tests for details
	 *
	 * @param {string} title - title for the unit test
	 * @param {function} func - callback function that will be run before running the unit test.
	 *							It can be used to go to the screen where the test have to be run.
	 *							This function if returns undefined then the test will be performed 
	 *							on the complete document. Else it can return an object or a promise
	 *							that resolve to dom node(s) to test or the dom node to exclude.
	 *							(https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#include-exclude-object)
	 * @param {object} options - (optional) configurable options for axe-core. 
	 *							 eg. {
	 *									skipRules: ['image-redundant-alt', 'meta-viewport'],
	 *									knownViolations: 10
	 *								}
	 *							 skiprules: list of rules to skip for testing.
	 *							 knownViolations: number of allowed violations.
	 *
	 */
	test (title, func, options) {
		assert.equal(typeof title, 'string', 'Title for the test required.');
		assert.equal(typeof func, 'function', 'A callback function expected as second parameter.');
		test(title, this.runAccessibilityTests.bind(this, func, options));
	}

	only (title, func, options) {
		assert.equal(typeof title, 'string', 'Title for the test required.');
		assert.equal(typeof func, 'function', 'A callback function expected as second parameter.');
		test.only(title, this.runAccessibilityTests.bind(this, func, options));
	}

	/* istanbul ignore next */
	async runAccessibilityTests(func, options = {}) {
		const context = await func();
		const testRunner = new AccessibilityTest();
		const result = await testRunner.check(context, options);
		assert.equal(result.error, null, `Error while running test: ${JSON.stringify(result.error, null, 3)}`);
		const accessibilityReport = new AccessibilityReport(result.result.violations);
		const output = accessibilityReport.getFormattedResults();
		assert.isAtMost(result.result.violations.length, options.knownViolations || 0, `Accessibility issues found: ${output}`);
	}
}

class AccessibilityUtil {
	constructor() {
		const util = new AccessibilityHelper();
		this.test = util.test.bind(util);
		this.test.only = util.only.bind(util);
	}
}

const accessibility = new AccessibilityUtil();

export { accessibility };
