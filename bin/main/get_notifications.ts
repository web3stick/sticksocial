import { get_notifications } from "../../src/lib/near-social-js/main/fun_get_notifications";
// ========================================
// get-notifications <accountId> [--order <asc|desc>] [--limit <number>] [--from <number>]
// ========================================
const args = process.argv.slice(2);
const accountId = args[0];
if (!accountId) {
	console.error("Usage: bun run bin/main/get_notifications.ts <accountId> [--order <asc|desc>] [--limit <number>] [--from <number>]");
	process.exit(1);
}
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