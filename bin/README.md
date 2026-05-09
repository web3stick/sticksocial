# BINS

every time we use near_social_client, we should also have a bin to test the functionality.
we can also have bins for other logic to help us debug and test.

```sh
bun run bin/main/get.ts
bun run bin/main/get.ts -- 'sleet.near/**'
bun run bin/main/get.ts -- 'sleet.near/profile/**'
bun run bin/main/get.ts -- 'mob.near/widget/Homepage'

bun run bin/main/keys.ts
bun run bin/main/keys.ts -- 'sleet.near/*'

bun run bin/main/index.ts
bun run bin/main/index.ts -- --action post --key main --limit 10
bun run bin/main/index.ts -- --action post --key main --accountId mob.near --limit 10

bun run bin/main/set.ts
bun run bin/main/set.ts -- --signerId sleet.near --data '{"sleet.near":{"test":{"key":"value"}}}'

bun run bin/main/get_profile.ts
bun run bin/main/get_profile.ts -- sleet.near
bun run bin/main/get_profile.ts -- mob.near

bun run bin/main/get_activity_feed.ts
bun run bin/main/get_activity_feed.ts -- --limit 10
bun run bin/main/get_activity_feed.ts -- --order asc --limit 5 --from 0
```

helper bins

```sh
bun run bin/helper/get_account_id_profile.ts
bun run bin/helper/get_account_id_profile.ts -- sleet.near
bun run bin/helper/get_account_id_profile.ts -- james.near
bun run bin/helper/get_account_id_profile.ts -- narkmeta.near
```

===============
<br/>
copyright 2026 by sleet.near
