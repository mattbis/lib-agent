# Concern 09: Reference Templates & Custom ESLint Rules

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`09-templates.agent.txt`](09-templates.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## A. Canonical Module Template (`doc/template/libag_module_template.mjs`)

```javascript
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

/**
 * canonical module template (`libag_module_template.mjs`)
 * demonstrates strict project coding conventions, GPLv3 Free Software header,
 * resident process prototype pollution defenses, zero-GC mechanical sympathy,
 * Go-style accessors, and the Dual Surface API (`1p/2p` pure).
 */

// 1p
import { timingSafeEqual } from 'node:crypto'

// 2p
import { invariant } from '../internal/libag_invariant.mjs'
import { arg_get_opt } from '../arg/libag_arg.mjs'

// 3p
// (none - zero external npm dependencies in resident core)

export const MODULE_TEMPLATE_FLAGS= Object.freeze({
    cold: 0x01,
    active: 0x02,
    dirty: 0x04,
    resident: 0x08
})

export function template_init_registry(options= {}) {
    var opts= options || {}
    var max_entries= arg_get_opt(opts, 'max_entries', 1024)
    var profile= arg_get_opt(opts, 'profile', '+bg')

    return {
        cache: Object.create(null),
        registry: new Map(),
        state_flags: MODULE_TEMPLATE_FLAGS.cold,
        max_entries: max_entries,
        profile: profile
    }
}

export function template_state_flags(ctx, val) {
    invariant(ctx && typeof ctx === 'object', 'template_state_flags: valid ctx required')
    if (val !== undefined) {
        ctx.state_flags= val
        return val
    }
    return ctx.state_flags
}

export class libag_ModuleTemplate {
    #ctx

    constructor(options= {}) {
        this.#ctx= template_init_registry(options)
    }

    state_flags(val) {
        return template_state_flags(this.#ctx, val)
    }
}
```

---

## B. Custom ESLint Style Rule (`libag-custom_eslint.mjs`)

```javascript
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

const no_space_before_assignment_rule= {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        messages: {
            noSpaceBefore: "Expected no space before '{{operator}}'.",
            spaceAfter: "Expected space after '{{operator}}'."
        }
    },
    create(context) {
        var source_code= context.sourceCode
        function check(node, left, operator= '=') {
            var token= source_code.getTokenAfter(left, (t) => t.value === operator)
            if (!token) return

            var prev_token= source_code.getTokenBefore(token)
            var next_token= source_code.getTokenAfter(token)

            var text_before= source_code.text.slice(prev_token.range[1], token.range[0])
            if (text_before.length > 0) {
                context.report({
                    node: token,
                    data: { operator },
                    messageId: 'noSpaceBefore',
                    fix(fixer) {
                        return fixer.removeRange([prev_token.range[1], token.range[0]])
                    }
                })
            }

            var text_after= source_code.text.slice(token.range[1], next_token.range[0])
            if (next_token && !text_after.includes('\n') && text_after.length === 0) {
                context.report({
                    node: token,
                    data: { operator },
                    messageId: 'spaceAfter',
                    fix(fixer) {
                        return fixer.insertTextAfter(token, ' ')
                    }
                })
            }
        }
        return {
            VariableDeclarator(node) {
                if (node.init) check(node, node.id)
            },
            AssignmentExpression(node) {
                check(node, node.left, node.operator)
            }
        }
    }
}

export default [
    {
        files: ['**/*.mjs'],
        plugins: {
            local: {
                rules: {
                    'no-space-before-assignment': no_space_before_assignment_rule
                }
            }
        },
        rules: {
            'indent': ['error', 4],
            'semi': ['error', 'never'],
            'camelcase': 'off',
            'no-multi-spaces': 'error',
            'local/no-space-before-assignment': 'error'
        }
    }
]
```
