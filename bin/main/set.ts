import { near_social_js_set_fun } from '../../src/lib/near-social-js/main/fun_set';
// ========================================
// set --signerId <signerId> --data <json> [--deposit <deposit>] [--refundUnusedDeposit]
// ========================================
const args = process.argv.slice(2);
const getArg = (flag: string) => {
	const idx = args.indexOf(flag);
	return idx >= 0 ? args[idx + 1] : undefined;
};
const signerId = getArg('--signerId');
const dataStr = getArg('--data');
const deposit = getArg('--deposit');
const refundUnusedDeposit = args.includes('--refundUnusedDeposit');
// ========================================
if (!signerId || !dataStr) {
	console.error(
		'Usage: set --signerId <signerId> --data <json> [--deposit <deposit>] [--refundUnusedDeposit]'
	);
	process.exit(1);
}
// ========================================
let data: Record<string, Record<string, unknown>> | undefined;
try {
	data = JSON.parse(dataStr) as Record<string, Record<string, unknown>>;
} catch (e) {
	console.error('Failed to parse JSON data:', e);
	process.exit(1);
}
if (!data) {
	console.error('Failed to parse JSON data');
	process.exit(1);
}
// ========================================
// console.log({ signerId, data, deposit, refundUnusedDeposit });
await near_social_js_set_fun(signerId, data, { deposit, refundUnusedDeposit });
// ========================================
