<script lang="ts">
	import { get_notifications } from "$lib/near-social-js/main/fun_get_notifications";
	import type { Notification } from "near-social-js";
	// ============================================
	let { accountId } = $props<{ accountId: string }>();
	let notifications = $state<Notification[]>([]);
	// ============================================
	$effect(() => {
		if (accountId) {
			get_notifications(accountId).then((result) => {
				notifications = result;
			});
		}
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->
<!-- widget_notifications_list -->
<!-- WIDGET_NOTIFICATIONS_LIST -->
<div class="notifications">
	{#each notifications as notification}
		<div class="notification">
			<p>{JSON.stringify(notification)}</p>
		</div>
	{:else}
		<p>No notifications</p>
	{/each}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
    /*
    todo
    - add some depth and shadow
    */
	.notifications {
		width: 500px;
		max-width: 90vw;
		margin: 0 auto;
		text-align: left;
	}

	.notification {
		padding: 12px;
		margin: 3px;
		border-radius: 5px;
		box-sizing: border-box;
		border: 1px solid #eee;
		line-break: anywhere;
	}
</style>