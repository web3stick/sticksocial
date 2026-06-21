import { z } from "zod";
// ============================================
export const FEED_OPTIONS_SCHEMA = z.object({
	order: z.enum(["asc", "desc"]),
	limit: z.number().int().min(1).max(100)
});
// ============================================
export type FEED_OPTIONS_TYPE = z.infer<typeof FEED_OPTIONS_SCHEMA>;
// ============================================
export const DEFAULT_FEED_OPTIONS: FEED_OPTIONS_TYPE = {
	order: "desc",
	limit: 50
};
// ============================================
