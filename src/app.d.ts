// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "$app/state" {
	import type { Page } from "@sveltejs/kit";
	export const page: Page;
}

declare module "$app/navigation" {
	export function goto(url: string): Promise<void>;
	export function afterNavigate(callback: () => void): void;
	export function beforeNavigate(callback: () => void): void;
}

declare module "$lib/near-social-js/fun_get_profile" {
	import type { Profile } from "near-social-js";
	export function get_profile(account_id: string): Promise<Profile | null>;
}

declare module "$lib/assets/favicon.svg" {
	const content: string;
	export default content;
}

declare module "$lib/css/main.css";

export {};
