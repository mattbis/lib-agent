# Concern 02: Core Syntax & Formatting (`doc/CODE_STYLE.md`)

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`02-syntax-style.agent.txt`](02-syntax-style.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## Core Syntax & Formatting Rules

- **Asymmetric Assignment Spacing (`var x= val`):**
    - Make the left-hand target of a declaration or assignment visually distinct by placing **no space before `=`** and **one space after `=`**:
    ```javascript
    var x= true
    let count= 0
    function foo(a= 1, b= null) {
        var next_state= a + 1
        return next_state
    }
    ```
- **No Semicolons:**
    - Omit semicolons everywhere (`semi: ["error", "never"]`).
- **4-Space Indentation:**
    - Strictly `4 spaces` across all `.mjs`, `.zig`, `.md`, and config files (`indent: ["error", 4]`). Never use 2 spaces or tabs.
- **Intelligent `var` vs. `const` / `let` Usage:**
    - Prefer `var` in low-level hot paths where JS engine hoisting/function-scoping avoids unnecessary block-binding overhead in pure `.mjs`.
    - Use `const` and `let` where execution semantics or immutability boundaries require explicit lexical scoping.
- **Ternary Formatting:**
    - Prefer formatted multiline or chained ternaries over verbose `if / else` blocks when the expression is non-trivial. Align `?` and `:` at a 4-space indent:
    ```javascript
    var x= (cond)
        ? .5+(Math.cos(x*pi)*.5)*.5
        : 1-(Math.cos(x*pi)*.2)*Math.sin(x*pi)*(x*.22)+.22
    ```
- **Column Alignment in Configs & Tables:**
    - When authoring `.conf` files or tabular definitions (e.g., `# item, param1, param2`), align fields into clean vertical columns.
- **Relative Markdown Links:**
    - Every Markdown link across `README.md`, `GEMINI.md`, `res/`, and `doc/` must use **relative repository paths** (e.g., `[doc/CODE_STYLE.md](doc/CODE_STYLE.md)`), never local machine `file:///` paths.
