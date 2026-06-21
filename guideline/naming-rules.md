# Naming Rules

## Goal

Keep file and folder names predictable across the React codebase.

## File Naming

- React components use `PascalCase.tsx`.
- Custom hooks use `camelCase.ts` with a `use` prefix.
- Context files use `PascalCase.tsx` and should usually end with `Context`.
- Redux slice files use `camelCase.ts` and should usually end with `Slice`.
- Shared helpers, config, and utility files use `camelCase.ts`.
- CSS files use `kebab-case.css`.
- Type-only files use `camelCase.ts`.

## Folder Naming

- Folders use `camelCase`.
- Do not mix naming styles for the same kind of folder.

## React-Specific Rules

- Exported React components use the same name as the file.
- One primary component per file.
- If a file contains only supporting types or helpers for a component, name it after its purpose instead of reusing the component name.

## What To Avoid

- Do not use lowercase component filenames like `nav.tsx` or `room.tsx`.
- Do not use kebab-case for component filenames.
- Do not mix `auth-slice.ts` and `userSlice.ts` patterns in the same repo.
- Do not create ambiguous names like `index.tsx` inside many unrelated folders unless the team explicitly adopts that pattern.
