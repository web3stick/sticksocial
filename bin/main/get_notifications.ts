import { get_notifications } from "../../src/lib/near-social-js/main/fun_get_notifications";
// ========================================
// get-notifications <accountId> [--order <asc|desc>] [--limit <number>] [--from <number>]
// ========================================
const accountId = process.argv[2] || "sleet.near";
const args = process.argv.slice(3);
const getArg = (flag: string) => {
	const idx = args.indexOf(flag);
	return idx >= 0 ? args[idx + 1] : undefined;
};
const order = getArg("--order") as "asc" | "desc" | undefined;
const limit = getArg("--limit") ? parseInt(getArg("--limit")!) : undefined;
const from = getArg("--from") ? parseInt(getArg("--from")!) : undefined;
// ========================================
await get_notifications(accountId, { order, limit, from });
// ========================================