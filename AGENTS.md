# AGENTS.md

### Logging

- Use minimal logging to no loging. i like to consol log raw data, so for example when a function like this `get_profile()` resturns something consol log the response, other than conslol loging ner social data respnse there should be no other consol loging.

### Component Naming

- Import with UPPER_CASE: `import COMPONENT_BLANK from '...';`
- Use in template: `<COMPONENT_BLANK />`

### New Components

Copy `src/lib/components/blank.svelte` as template.

### New Routes

Copy `src/routes/blank/+page.svelte` as template.
