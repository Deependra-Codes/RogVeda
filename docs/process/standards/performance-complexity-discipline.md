# Performance And Complexity Discipline

Status: active
Date: 2026-04-22

## One-Line Policy

Time, space, query count, and client overhead are release criteria for user-visible or scale-sensitive work.

## Rules

1. Start with workload, not a favorite abstraction.
2. Name the dominant operation when performance matters.
3. Avoid avoidable quadratic behavior and repeated boundary work.
4. Measure hot paths when claiming a win.
5. State what was measured vs inferred.
6. Simpler slower code is allowed only when the path is genuinely cold and the tradeoff is explicit.

## App-Specific Expectations

- keep initial client JS low
- avoid N+1 queries
- avoid duplicate data copies across server and client
- keep booking mutation transactional
- keep dashboard read paths bounded and predictable
