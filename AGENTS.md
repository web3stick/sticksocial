# AGENTS.md

SvelteKit 2 + Svelte 5 (runes) UI for NEAR Social. Data flows through `near-social-js` wrappers, rendered by widgets, mounted from pages. Wrappers are prototyped and tested against live mainnet data via [`near-social-js-toolbox`](https://github.com/sleet-js/near-social-tool-box) bins before landing here.

---

## Stack

- SvelteKit 2, Svelte 5 (runes mode forced), Vite 8, TypeScript 6 strict
- `@sveltejs/adapter-static`, Netlify deploy
- Runtime: `near-social-js@^2.0.4`, `@near-kit-tool-box/web@^0.0.6`, `zod@^4.4.3`, `bootstrap-icons`, `lucide-svelte`, `marked`

```bash
bun i
bun run dev
bun run check
bun run tsc --noEmit
bun run format
bun run build && bun run preview
```

---

## Architecture

- `src/lib/near-social-js/new.ts` — `near_social_client(near)` factory wrapping `new Social({ near })`.
- `src/lib/near-social-js/main/fun_*.ts` — one wrapper per `near-social-js` method, each with inline `NEAR_SOCIAL_JS_<METHOD>_OPTIONS` interface.
- `src/lib/near-social-js/helper/get_account_id_*.ts` — composite helpers resolving a specific post/comment/profile by `(accountId, blockHeight?)`.
- `src/lib/widgets/*.svelte` — Svelte 5 widgets. `widgets/fun/` for helpers, `widgets/components/` for subcomponents.
- `src/lib/components/` — app-level components (`nav.svelte`, `home_nav.svelte`, `profile_nav.svelte`, `button_auth.svelte`).
- `src/lib/ts/auth.svelte.ts` — `$state`-based auth (`auth.isSignedIn`, `auth.accountId`) using `near_connect_client().wallet()`.
- `src/lib/ts/routes.ts` — `ROUTES` const consumed by nav.
- `src/routes/` — SvelteKit pages: `feed/` (with `options/`), `profile/[accountId]/`, `profile/auth/`, `profile/router/`, `settings/`, `discover/`, `notifications/`, `blank/`. Not every route goes in the nav.

---

## Conventions (non-negotiable)

- **One wrapper per near-social-js method.** Filename `fun_<method>.ts` in `src/lib/near-social-js/main/`. Each exports a single async function.
- **Inline options interface** named `NEAR_SOCIAL_JS_<METHOD>_OPTIONS` mirroring upstream 1:1 (including `bigint` for `blockHeight`).
- **Section dividers.** `// ============================================` between interface, function, and inline log blocks. Match spacing exactly.
- **Pretty `console.log`** of inputs + raw result framed by `=================` lines (see `fun_get_activity_feed.ts`).
- **Auth-aware wrappers.** Browser wrappers call `near_social_client(near_kit_client())` directly (no `near` arg).
- **Widgets import from `$lib/near-social-js/main/fun_*`** — never call `near_social_client(...)` from a `.svelte` file.
- **Svelte 5 runes only.** `$state`, `$derived`, `$effect`, `$props`. No `let` reactivity, no stores. Props: `{ ... }: { foo: string } = $props()`.
- **One thing at a time.** No bundling unrelated fixes into a single change.
- **Follow existing file format** — small details (spacing, comments, naming) matter.

---

## Workflow

Work on wrappers happens in a directory with both `near-social-js-toolbox` and `sticksocial` checked out. Prototype and test in the toolbox first, then land the browser-side version here (wrappers here may differ slightly from toolbox test ones — browser env has no `near` arg).

1. **Research first.** Look at the equivalent widget on the old NEAR Social UI (bos-loader) for reference. Use `bun run bin-env/main/<method>.ts` from the `near-social-js-toolbox` repo to explore live data shapes on mainnet before writing any code.
2. Find the upstream method in `near-social-js` (`Social` class) and write/browse the wrapper in `src/lib/near-social-js/main/fun_<method>.ts` with inline options interface, section dividers, pretty `console.log`.
3. Build the widget in `src/lib/widgets/<name>.svelte`. Use `Post`, `Profile`, `Notification`, `IndexEntry` types; load data via `$effect`; expose props for `limit`/`order`/`from` where useful. Copy IntersectionObserver + `hasMore` from `infinite_post_feed.svelte` for infinite scroll.
4. Mount from `src/routes/<page>/+page.svelte`. Add a route entry to `src/lib/ts/routes.ts` if it's a new top-level nav destination.
5. Run `bun run check && bun run tsc --noEmit` before considering the feature done.

Every change must be researched and clean — no guessing, no half-baked implementations.

---

## Commit & push

After completing a task (and passing `bun run check && bun run tsc --noEmit && bun run format`):

```bash
git status                                          # review changes
git add <files>                                     # stage only intended files
git commit -m "short imperative summary of change"
git push
```

- One focused commit per task. Don't squash unrelated changes.
- Commit message style: short, imperative, lowercase, no trailing period (e.g. `add fun_get_activity_feed wrapper`).
- Never commit secrets, `.env`, or `node_modules/`.
- If the push is rejected (diverged branch), stop and ask before force-pulling or rebasing.

---

## Sanity checklist before committing
- [ ] Widget uses `$state`/`$effect`/`$props` only; imports wrappers from `$lib/near-social-js/main/`.
- [ ] New top-level route added to `src/lib/ts/routes.ts` and picked up by nav if applicable.
- [ ] `bun run check && bun run tsc --noEmit` passes.
- [ ] `bun run format` has been run.
- [ ] No unrelated drive-by edits.

==============================================
<br/>
copyright 2026 by sleet.near
