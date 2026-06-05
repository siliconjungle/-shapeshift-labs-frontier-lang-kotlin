# @shapeshift-labs/frontier-lang-kotlin Agent Notes

This package is a source-language adapter for Frontier Lang. Keep it small: package-level metadata, typed helper APIs, tests, fuzz, and benchmarks belong here; Kotlin PSI normalization stays in `@shapeshift-labs/frontier-lang-compiler`.

Release credentials for npm publish work live in `/Users/james/Documents/json-diff/.env` as `NPM_TOKEN` / `NODE_AUTH_TOKEN`. Never print token values, commit them, or write them into this repo. Load that env file into a shell and use a temporary npm userconfig for publish checks, then delete it.

Use `main` as the default GitHub branch. This package should publish as `@shapeshift-labs/frontier-lang-kotlin` and push to `git@github.com:siliconjungle/-shapeshift-labs-frontier-lang-kotlin.git`.

Kotlin PSI imports are syntax/declaration evidence, not Kotlin compiler correctness evidence. Analysis API, FIR/K2, compiler-plugin, KSP/KAPT, multiplatform, script, and build-variant semantics must arrive as caller-owned evidence sidecars.
