import * as math from 'mathjs';

export const evaluateScore = (param: number | null, expression: string | any) => {
	let result = 0;

	if (typeof param !== 'number' || param === 0) return 0;

	if (typeof expression === 'object') {
		for (const threshold in expression) {
			if (param > parseFloat(threshold)) {
				result = typeof expression[threshold] === 'string' ? math.evaluate(expression[threshold], { param }) : expression[threshold];
			}
		}
	} else {
		result = math.evaluate(expression, { param });
	}

	if (result === Infinity || isNaN(result)) return 0;

	return result;
};
