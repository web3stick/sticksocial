import { near_connect_client } from "@near-kit-tool-box/web";
// ========================================
export const auth = $state({
	isSignedIn: false,
	accountId: null as string | null
});
// ========================================
export async function updateAuthStatus() {
	try {
		const wallet = await near_connect_client().wallet();
		const accounts = await wallet.getAccounts();
		auth.isSignedIn = accounts?.length > 0;
		auth.accountId = accounts?.[0]?.accountId ?? null;
	} catch (e) {
		auth.isSignedIn = false;
		auth.accountId = null;
	}
}
// ========================================
export async function login() {
	await near_connect_client().connect();
	await updateAuthStatus();
}
// ========================================
export async function logout() {
	const wallet = await near_connect_client().wallet();
	wallet.signOut();
	await updateAuthStatus();
}
// ========================================
