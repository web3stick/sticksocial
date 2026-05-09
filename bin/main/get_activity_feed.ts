import { get_activity_feed } from '../../src/lib/near-social-js/main/fun_get_activity_feed';
// ========================================
// activity-feed [--order <asc|desc>] [--limit <number>] [--from <number>]
// ========================================
const args = process.argv.slice(2);
const getArg = (flag: string) => {
	const idx = args.indexOf(flag);
	return idx >= 0 ? args[idx + 1] : undefined;
};
const order = getArg('--order') as 'asc' | 'desc' | undefined;
const limit = getArg('--limit') ? parseInt(getArg('--limit')!) : undefined;
const from = getArg('--from') ? parseInt(getArg('--from')!) : undefined;
// ========================================
await get_activity_feed({ order, limit, from });
// ========================================
