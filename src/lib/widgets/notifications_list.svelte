<script lang="ts">
	import { AtSign, Heart, MessageCircle, Repeat2, UserPlus, Bell } from "lucide-svelte";
	import type { Notification } from "near-social-js";
	import { get_notifications } from "$lib/near-social-js/main/fun_get_notifications";
	// ============================================
	let { accountId }: { accountId: string } = $props();
	let notifications = $state<Notification[]>([]);
	let loading = $state(true);
	// ============================================
	$effect(() => {
		if (!accountId) return;
		loading = true;
		get_notifications(accountId)
			.then((result) => (notifications = result))
			.finally(() => (loading = false));
	});
	// ============================================
	function actor(n: Notification): string {
		return n.value.accountId ?? n.accountId;
	}
	function target_href(n: Notification): string | null {
		const item = n.value.item;
		if (!item) return null;
		const author = item.path.split("/")[0];
		return `/post/${author}/${item.blockHeight}`;
	}
	function message_for(n: Notification): string {
		const a = actor(n);
		switch (n.value.type) {
			case "like":
				return `${a} liked your post`;
			case "comment":
				return `${a} commented on your post`;
			case "follow":
				return `${a} followed you`;
			case "mention":
				return `${a} mentioned you`;
			case "repost":
				return `${a} reposted your post`;
			default:
				// custom / unknown notifications (e.g. neargram_message) surface the
				// raw text when present
				if ("message" in n.value && typeof n.value.message === "string") {
					return `${a}: ${n.value.message}`;
				}
				return `${a} sent a notification`;
		}
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_notifications_list -->
<!-- WIDGET_NOTIFICATIONS_LIST -->
<div class="notifications">
	{#if loading}
		<p class="empty">Loading notifications...</p>
	{:else if notifications.length === 0}
		<p class="empty">No notifications yet.</p>
	{:else}
		{#each notifications as n (n.accountId + "-" + n.blockHeight)}
			{@const href = target_href(n)}
			<div class="notification">
				<span class="icon">
					{#if n.value.type === "like"}
						<Heart color="#ff4d6d" />
					{:else if n.value.type === "comment"}
						<MessageCircle color="#4d9fff" />
					{:else if n.value.type === "follow"}
						<UserPlus color="#2e7d32" />
					{:else if n.value.type === "mention"}
						<AtSign color="#8ca2f5" />
					{:else if n.value.type === "repost"}
						<Repeat2 color="#2e7d32" />
					{:else}
						<Bell />
					{/if}
				</span>
				<div class="body">
					<a class="actor" href="/profile/{actor(n)}">{actor(n)}</a>
					<span class="msg">{message_for(n).replace(actor(n), "").trim()}</span>
					{#if href}
						<a class="target" {href}>view post</a>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.notifications {
		width: 500px;
		max-width: 90vw;
		margin: 0 auto;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.notification {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		padding: 10px 12px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 8px;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.02);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}
	@media (prefers-color-scheme: dark) {
		.notification {
			border-color: rgba(255, 255, 255, 0.08);
			background: rgba(255, 255, 255, 0.03);
		}
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		flex-shrink: 0;
	}
	.body {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: baseline;
		flex: 1;
		min-width: 0;
	}
	.actor {
		font-weight: bold;
		color: inherit;
		text-decoration: none;
	}
	.actor:hover {
		text-decoration: underline;
	}
	.msg {
		font-size: 13px;
		color: #666;
	}
	@media (prefers-color-scheme: dark) {
		.msg {
			color: #aaa;
		}
	}
	.target {
		margin-left: auto;
		font-size: 11px;
		color: #4d9fff;
		text-decoration: none;
	}
	.target:hover {
		text-decoration: underline;
	}
	.empty {
		text-align: center;
		color: #888;
		font-style: italic;
		font-size: 13px;
	}
</style>
