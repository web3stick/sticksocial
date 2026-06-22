import { updateAuthStatus } from "./auth.svelte";
// ========================================
// top-level side-effect: kick off the wallet auth check on every page
// load. imported by +layout.svelte (same import slot as hello.ts). the
// promise is fire-and-forget; auth.isSignedIn / auth.accountId get
// updated once wallet.getAccounts() resolves and any widget reading
// auth.* reactively re-renders.
// ========================================
updateAuthStatus();