import { Social } from "near-social-js";
// import { Near } from "near-kit";
// leave as any for now cause of  ersion differnt but that should be Near
// ============================================
export function near_social_client(near: any) {
	const social = new Social({ near });
	return social;
}
// ============================================
