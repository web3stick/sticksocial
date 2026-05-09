<!--
todo
- add some depth and shadow css
- add a type file to the type folder for the notifications,
- or use the type Notification form the package

when all done and said this page links to the profiles that did the commenting or following
and or to the post that was like or commented on.
-->
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
	{/each}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
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
