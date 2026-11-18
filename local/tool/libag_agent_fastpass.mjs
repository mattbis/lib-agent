#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

/**
 * canonical `.agent.txt` interpreter, bundler & repo axiom auditor (`libag_agent_fastpass.mjs`)
 * supports direct POSIX shebang execution (`#!/usr/bin/env agent-fastpass`) and CLI flags:
 *   +validate  (default) parse & verify `.agent.txt` vectors, jump targets, and axioms
 *   +bundle    resolve JUMP_VECTOR into a single token-packed stream (filter with `+slot=LIC,SYN`)
 *   +audit     verify repository compliance against `!KERNEL_AXIOMS` (GPLv3, `lhs= rhs`, 0 semi, 1p/2p/3p, rel links)
 *   +json      emit machine-readable JSON output
 */

// 1p
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// 2p
// (standalone resident tool in local/tool/ — self-contained invariant & option helpers)

// 3p
// (none - zero external npm dependencies in Free Software core)

export const FASTPASS_MODES= Object.freeze({
    validate: 'validate',
    bundle: 'bundle',
    audit: 'audit',
    help: 'help'
})

export const FASTPASS_DEFAULTS= Object.freeze({
    entry_rel: 'res/agent/current/rules-fastpass.agent.txt',
    license_rel: 'LICENSE',
    spdx_tag: 'SPDX-License-Identifier: GPL-3.0-or-later'
})

export function fastpass_invariant(cond, msg) {
    if (!cond) {
        throw new Error('fastpass_invariant_halt: ' + msg)
    }
}

export function fastpass_get_opt(opts, key, fallback) {
    var safe_opts= opts && typeof opts === 'object'
        ? opts
        : Object.create(null)
    return Object.hasOwn(safe_opts, key) && safe_opts[key] !== undefined
        ? safe_opts[key]
        : fallback
}

export function fastpass_resolve_root() {
    var self_path= fileURLToPath(import.meta.url)
    var tool_dir= path.dirname(self_path)
    return path.resolve(tool_dir, '..', '..')
}

export function fastpass_init_ctx(options= Object.create(null)) {
    var root_dir= fastpass_get_opt(options, 'root_dir', fastpass_resolve_root())
    var mode= fastpass_get_opt(options, 'mode', FASTPASS_MODES.validate)
    var target_file= fastpass_get_opt(options, 'target_file', FASTPASS_DEFAULTS.entry_rel)
    var json_out= fastpass_get_opt(options, 'json_out', false)
    var slots= fastpass_get_opt(options, 'slots', [])

    var ctx= Object.create(null)
    ctx.root_dir= root_dir
    ctx.mode= mode
    ctx.target_file= target_file
    ctx.json_out= json_out
    ctx.slots= slots
    ctx.cache= Object.create(null)
    return ctx
}

export function fastpass_ctx_mode(ctx, val) {
    fastpass_invariant(ctx && typeof ctx === 'object', 'fastpass_ctx_mode: valid ctx required')
    if (val !== undefined) {
        ctx.mode= val
        return val
    }
    return ctx.mode
}

export function fastpass_parse_argv(argv= []) {
    var opts= Object.create(null)
    opts.mode= FASTPASS_MODES.validate
    opts.target_file= null
    opts.json_out= false
    opts.slots= []

    var idx= 0
    var len= argv.length
    while (idx < len) {
        var arg= argv[idx]
        if (arg === '+bundle' || arg === '--bundle' || arg === '-b') {
            opts.mode= FASTPASS_MODES.bundle
        } else if (arg === '+audit' || arg === '--audit' || arg === '-a') {
            opts.mode= FASTPASS_MODES.audit
        } else if (arg === '+validate' || arg === '--validate' || arg === '-v') {
            opts.mode= FASTPASS_MODES.validate
        } else if (arg === '+help' || arg === '--help' || arg === '-h') {
            opts.mode= FASTPASS_MODES.help
        } else if (arg === '+json' || arg === '--json' || arg === '-j') {
            opts.json_out= true
        } else if (arg.startsWith('+slot=') || arg.startsWith('--slot=')) {
            var eq_idx= arg.indexOf('=')
            var raw_slots= arg.slice(eq_idx + 1)
            opts.slots= raw_slots
                .split(',')
                .map((s) => s.trim().toUpperCase())
                .filter((s) => s.length > 0)
        } else if (arg === '+slot' || arg === '--slot') {
            var next_arg= argv[idx + 1]
            if (next_arg !== undefined) {
                opts.slots= next_arg
                    .split(',')
                    .map((s) => s.trim().toUpperCase())
                    .filter((s) => s.length > 0)
                idx= idx + 1
            }
        } else if (!arg.startsWith('-') && !arg.startsWith('+')) {
            if (opts.target_file === null) {
                opts.target_file= arg
            }
        }
        idx= idx + 1
    }

    if (opts.target_file === null) {
        opts.target_file= FASTPASS_DEFAULTS.entry_rel
    }
    return opts
}

export function fastpass_parse_vector_tag(line) {
    var open_idx= line.indexOf('{')
    var close_idx= line.lastIndexOf('}')
    if (open_idx === -1 || close_idx === -1 || close_idx < open_idx) {
        return null
    }
    var tag_name= line.slice(1, open_idx).trim()
    var body= line.slice(open_idx + 1, close_idx)
    var pairs= body.split(',')
    var map= Object.create(null)

    var p_idx= 0
    while (p_idx < pairs.length) {
        var pair= pairs[p_idx].trim()
        var colon_idx= pair.indexOf(':')
        if (colon_idx !== -1) {
            var k= pair.slice(0, colon_idx).trim()
            var v= pair.slice(colon_idx + 1).trim()
            map[k]= v
        }
        p_idx= p_idx + 1
    }

    var res= Object.create(null)
    res.tag= tag_name
    res.data= map
    return res
}

export function fastpass_parse_dsl(source_text, file_label= 'unknown.agent.txt') {
    fastpass_invariant(typeof source_text === 'string', 'fastpass_parse_dsl: source_text must be string')
    var lines= source_text.replace(/\r\n/g, '\n').split('\n')
    var ast= Object.create(null)
    ast.file= file_label
    ast.has_shebang= false
    ast.headers= []
    ast.vectors= Object.create(null)
    ast.jump_table= []
    ast.axioms= []
    ast.sections= []

    var current_sec= null
    var in_code_fence= false
    var l_idx= 0
    while (l_idx < lines.length) {
        var raw_line= lines[l_idx]
        var line= raw_line.trim()

        if (l_idx === 0 && line.startsWith('#!/usr/bin/env agent-fastpass')) {
            ast.has_shebang= true
        } else if (line.startsWith('```')) {
            in_code_fence= !in_code_fence
        } else if (!in_code_fence && line.length > 0) {
            if (line.startsWith('#::')) {
                ast.headers.push(line.slice(3).trim())
            } else if (line.startsWith('@') && line.includes('{')) {
                var vec= fastpass_parse_vector_tag(line)
                if (vec !== null) {
                    ast.vectors[vec.tag]= vec.data
                }
            } else if (line.startsWith('[') && line.endsWith(']')) {
                current_sec= Object.create(null)
                current_sec.name= line.slice(1, -1).trim()
                current_sec.entries= []
                ast.sections.push(current_sec)
            } else if (line.startsWith('!')) {
                var sep_idx= line.indexOf('::')
                var ax= Object.create(null)
                ax.id= sep_idx !== -1
                    ? line.slice(1, sep_idx).trim()
                    : line.slice(1).trim()
                ax.expr= sep_idx !== -1
                    ? line.slice(sep_idx + 2).trim()
                    : ''
                ast.axioms.push(ax)
            } else if (line.includes('|') && /^\d{2}\s*\|/.test(line)) {
                var cols= line.split('|').map((c) => c.trim())
                if (cols.length >= 5) {
                    var row= Object.create(null)
                    row.id= cols[0]
                    row.slot= cols[1]
                    row.agent_spec= cols[2]
                    row.human_spec= cols[3]
                    row.target_doc= cols[4]
                    ast.jump_table.push(row)
                }
            } else if (current_sec !== null && !line.startsWith('#')) {
                current_sec.entries.push(line)
            }
        }
        l_idx= l_idx + 1
    }

    return ast
}

export async function fastpass_file_exists(abs_path) {
    try {
        var st= await fs.stat(abs_path)
        return st.isFile()
    } catch (_err) {
        return false
    }
}

export async function fastpass_validate_spec(ctx) {
    fastpass_invariant(ctx && typeof ctx === 'object', 'fastpass_validate_spec: valid ctx required')
    var target_abs= path.isAbsolute(ctx.target_file)
        ? ctx.target_file
        : path.resolve(ctx.root_dir, ctx.target_file)
    var rel_label= path.relative(ctx.root_dir, target_abs).replace(/\\/g, '/')

    var exists= await fastpass_file_exists(target_abs)
    fastpass_invariant(exists, 'target spec file not found: ' + rel_label)

    var raw= await fs.readFile(target_abs, 'utf8')
    var ast= fastpass_parse_dsl(raw, rel_label)
    var missing_files= []
    var verified_files= []
    var planned_docs= []

    var j_idx= 0
    while (j_idx < ast.jump_table.length) {
        var row= ast.jump_table[j_idx]
        var agent_abs= path.resolve(ctx.root_dir, row.agent_spec)
        var human_abs= path.resolve(ctx.root_dir, row.human_spec)
        var doc_abs= path.resolve(ctx.root_dir, row.target_doc)

        var ok_agent= await fastpass_file_exists(agent_abs)
        var ok_human= await fastpass_file_exists(human_abs)
        var ok_doc= await fastpass_file_exists(doc_abs)

        if (ok_agent) {
            verified_files.push(row.agent_spec)
        } else {
            missing_files.push(row.agent_spec)
        }

        if (ok_human) {
            verified_files.push(row.human_spec)
        } else {
            missing_files.push(row.human_spec)
        }

        if (ok_doc) {
            verified_files.push(row.target_doc)
        } else {
            planned_docs.push(row.target_doc)
        }
        j_idx= j_idx + 1
    }

    var report= Object.create(null)
    report.ok= missing_files.length === 0 && ast.has_shebang
    report.file= rel_label
    report.has_shebang= ast.has_shebang
    report.header_count= ast.headers.length
    report.jump_count= ast.jump_table.length
    report.axiom_count= ast.axioms.length
    report.section_count= ast.sections.length
    report.verified_files= verified_files
    report.planned_docs= planned_docs
    report.missing_files= missing_files
    report.ast= ast
    return report
}

export async function fastpass_bundle_context(ctx) {
    var val_report= await fastpass_validate_spec(ctx)
    var ast= val_report.ast
    var active_slots= ctx.slots

    var chunks= []
    var root_abs= path.isAbsolute(ctx.target_file)
        ? ctx.target_file
        : path.resolve(ctx.root_dir, ctx.target_file)
    var root_raw= await fs.readFile(root_abs, 'utf8')
    chunks.push(root_raw.trim())

    var rows= ast.jump_table
    var r_idx= 0
    while (r_idx < rows.length) {
        var row= rows[r_idx]
        var slot_upper= row.slot.toUpperCase()
        var id_upper= row.id.toUpperCase()
        var include_row= active_slots.length === 0
            ? true
            : active_slots.includes(slot_upper) || active_slots.includes(id_upper)

        if (include_row) {
            var child_abs= path.resolve(ctx.root_dir, row.agent_spec)
            var child_exists= await fastpass_file_exists(child_abs)
            if (child_exists) {
                var child_raw= await fs.readFile(child_abs, 'utf8')
                var child_lines= child_raw
                    .replace(/\r\n/g, '\n')
                    .split('\n')
                    .filter((line, idx) => !(idx === 0 && line.startsWith('#!/')))
                chunks.push(child_lines.join('\n').trim())
            }
        }
        r_idx= r_idx + 1
    }

    var bundle_text= chunks.join('\n\n')
    var res= Object.create(null)
    res.ok= true
    res.slot_filter= active_slots.length === 0 ? 'ALL' : active_slots.join(',')
    res.char_length= bundle_text.length
    res.est_tokens= Math.ceil(bundle_text.length / 4)
    res.bundle= bundle_text
    return res
}

export async function fastpass_walk_repo(dir_abs, root_abs, acc= []) {
    var entries= await fs.readdir(dir_abs, { withFileTypes: true })
    var e_idx= 0
    while (e_idx < entries.length) {
        var entry= entries[e_idx]
        var name= entry.name
        if (name !== '.git' && name !== 'node_modules' && name !== 'var') {
            var full_path= path.join(dir_abs, name)
            if (entry.isDirectory()) {
                await fastpass_walk_repo(full_path, root_abs, acc)
            } else if (entry.isFile()) {
                var rel= path.relative(root_abs, full_path).replace(/\\/g, '/')
                acc.push(rel)
            }
        }
        e_idx= e_idx + 1
    }
    return acc
}

export function fastpass_audit_mjs_source(rel_path, content) {
    var violations= []
    var lines= content.replace(/\r\n/g, '\n').split('\n')
    var base_name= path.basename(rel_path)

    if (base_name !== 'eslint.config.mjs' && !base_name.startsWith('libag_') && !base_name.startsWith('libag-')) {
        violations.push(rel_path + ': !03.API file missing `libag_` prefix')
    }

    if (!content.includes(FASTPASS_DEFAULTS.spdx_tag)) {
        violations.push(rel_path + ': !01.LIC missing `' + FASTPASS_DEFAULTS.spdx_tag + '` header')
    }

    var idx_1p= content.indexOf('// 1p')
    var idx_2p= content.indexOf('// 2p')
    var idx_3p= content.indexOf('// 3p')
    if (idx_1p === -1 || idx_2p === -1 || idx_3p === -1 || !(idx_1p < idx_2p && idx_2p < idx_3p)) {
        violations.push(rel_path + ': !04.DEP missing or out-of-order `// 1p` -> `// 2p` -> `// 3p` headers')
    }

    var in_block_comment= false
    var l_idx= 0
    while (l_idx < lines.length) {
        var raw_line= lines[l_idx]
        var trimmed= raw_line.trim()
        var line_no= l_idx + 1

        if (raw_line.includes('\t')) {
            violations.push(rel_path + ':' + line_no + ': !02.SYN tab character forbidden (use 4 spaces)')
        }

        if (trimmed.startsWith('/*')) {
            in_block_comment= true
        }
        var is_comment= in_block_comment || trimmed.startsWith('//') || trimmed.startsWith('*')
        if (trimmed.endsWith('*/')) {
            in_block_comment= false
        }

        if (!is_comment && trimmed.length > 0) {
            if (trimmed.endsWith(';')) {
                violations.push(rel_path + ':' + line_no + ': !02.SYN trailing semicolon forbidden')
            }
            var decl_match= /^\s*(?:export\s+)?(?:var|let|const)\s+[A-Za-z0-9_$]+\s+=/.test(raw_line)
            if (decl_match) {
                violations.push(rel_path + ':' + line_no + ': !02.SYN space before `=` in declaration (`lhs= rhs` required)')
            }
            var tight_rhs= /^\s*(?:export\s+)?(?:var|let|const)\s+[A-Za-z0-9_$]+=[^\s=]/.test(raw_line)
            if (tight_rhs) {
                violations.push(rel_path + ':' + line_no + ': !02.SYN missing space after `=` in declaration (`lhs= rhs` required)')
            }
        }
        l_idx= l_idx + 1
    }

    return violations
}

export async function fastpass_audit_repo(ctx) {
    fastpass_invariant(ctx && typeof ctx === 'object', 'fastpass_audit_repo: valid ctx required')
    var violations= []
    var checked_counts= Object.create(null)
    checked_counts.mjs= 0
    checked_counts.md= 0
    checked_counts.agent_txt= 0
    checked_counts.scripts= 0

    var lic_abs= path.resolve(ctx.root_dir, FASTPASS_DEFAULTS.license_rel)
    var lic_exists= await fastpass_file_exists(lic_abs)
    if (!lic_exists) {
        violations.push('LICENSE: !01.LIC root LICENSE file missing')
    } else {
        var lic_text= await fs.readFile(lic_abs, 'utf8')
        if (!lic_text.includes('Version 3')) {
            violations.push('LICENSE: !01.LIC root LICENSE must be GNU GPL Version 3')
        }
    }

    var all_files= await fastpass_walk_repo(ctx.root_dir, ctx.root_dir, [])
    var f_idx= 0
    while (f_idx < all_files.length) {
        var rel= all_files[f_idx]
        var abs= path.resolve(ctx.root_dir, rel)

        if (rel.endsWith('.mjs')) {
            checked_counts.mjs= checked_counts.mjs + 1
            var mjs_src= await fs.readFile(abs, 'utf8')
            var mjs_errs= fastpass_audit_mjs_source(rel, mjs_src)
            var m_idx= 0
            while (m_idx < mjs_errs.length) {
                violations.push(mjs_errs[m_idx])
                m_idx= m_idx + 1
            }
        } else if (rel.endsWith('.md')) {
            checked_counts.md= checked_counts.md + 1
            var md_src= await fs.readFile(abs, 'utf8')
            var md_lines= md_src.replace(/\r\n/g, '\n').split('\n')
            var in_fence= false
            var ml_idx= 0
            while (ml_idx < md_lines.length) {
                var mline= md_lines[ml_idx]
                if (mline.trim().startsWith('```')) {
                    in_fence= !in_fence
                } else if (!in_fence && mline.includes('](file://')) {
                    violations.push(rel + ':' + (ml_idx + 1) + ': !02.SYN forbidden `file://` Markdown link (use relative repo path)')
                }
                ml_idx= ml_idx + 1
            }
        } else if (rel.endsWith('.agent.txt')) {
            checked_counts.agent_txt= checked_counts.agent_txt + 1
            var ag_src= await fs.readFile(abs, 'utf8')
            if (!ag_src.startsWith('#!/usr/bin/env agent-fastpass')) {
                violations.push(rel + ':1: missing `#!/usr/bin/env agent-fastpass` shebang')
            }
        } else if (rel.startsWith('local/sh/')) {
            checked_counts.scripts= checked_counts.scripts + 1
            if (!rel.endsWith('.sh') && !rel.endsWith('.cmd')) {
                violations.push(rel + ': !05.TOP script under `local/sh/` must have explicit `.sh` or `.cmd` extension')
            }
            var sh_src= await fs.readFile(abs, 'utf8')
            if (!sh_src.includes(FASTPASS_DEFAULTS.spdx_tag)) {
                violations.push(rel + ': !01.LIC script missing `' + FASTPASS_DEFAULTS.spdx_tag + '` header')
            }
        }
        f_idx= f_idx + 1
    }

    var result= Object.create(null)
    result.ok= violations.length === 0
    result.checked= checked_counts
    result.violations= violations
    return result
}

export function fastpass_format_banner() {
    return [
        '#:: AGENT-FASTPASS v2.1 :: LIB-AGENT (`libag_`) INTERPRETER [GPLv3 FREE SOFTWARE]',
        'usage: agent-fastpass [spec.agent.txt] [+validate | +bundle | +audit] [+slot=LIC,SYN] [+json]',
        '',
        'modes:',
        '    +validate   parse `.agent.txt` DSL, verify shebang, @vectors, JUMP_VECTOR, and !axioms (default)',
        '    +bundle     expand JUMP_VECTOR into a single token-packed stream (`+slot=LIC,SYN` to filter)',
        '    +audit      audit repository files against !KERNEL_AXIOMS (GPLv3, `lhs= rhs`, 0 semi, 1p/2p/3p)',
        '    +json       emit structured JSON output'
    ].join('\n')
}

export async function fastpass_run_cli(raw_argv= process.argv.slice(2)) {
    var parsed= fastpass_parse_argv(raw_argv)
    var ctx= fastpass_init_ctx(parsed)

    if (ctx.mode === FASTPASS_MODES.help) {
        process.stdout.write(fastpass_format_banner() + '\n')
        return 0
    }

    if (ctx.mode === FASTPASS_MODES.bundle) {
        var bundle_res= await fastpass_bundle_context(ctx)
        if (ctx.json_out) {
            process.stdout.write(JSON.stringify(bundle_res, null, 4) + '\n')
        } else {
            process.stdout.write(bundle_res.bundle + '\n')
        }
        return 0
    }

    if (ctx.mode === FASTPASS_MODES.audit) {
        var audit_res= await fastpass_audit_repo(ctx)
        if (ctx.json_out) {
            process.stdout.write(JSON.stringify(audit_res, null, 4) + '\n')
        } else {
            var status_tag= audit_res.ok ? 'PASS (0 VIOLATIONS)' : 'FAIL (' + audit_res.violations.length + ' VIOLATIONS)'
            process.stdout.write('#:: LIBAG_AUDIT :: ' + status_tag + '\n')
            process.stdout.write(
                '@checked{mjs:' + audit_res.checked.mjs +
                ', md:' + audit_res.checked.md +
                ', agent_txt:' + audit_res.checked.agent_txt +
                ', scripts:' + audit_res.checked.scripts + '}\n'
            )
            var v_idx= 0
            while (v_idx < audit_res.violations.length) {
                process.stdout.write('!violation :: ' + audit_res.violations[v_idx] + '\n')
                v_idx= v_idx + 1
            }
        }
        return audit_res.ok ? 0 : 1
    }

    var val_res= await fastpass_validate_spec(ctx)
    if (ctx.json_out) {
        process.stdout.write(JSON.stringify(val_res, null, 4) + '\n')
    } else {
        var v_tag= val_res.ok ? 'VALID' : 'INVALID'
        process.stdout.write('#:: LIBAG_FASTPASS :: ' + v_tag + ' [' + val_res.file + ']\n')
        process.stdout.write(
            '@stats{shebang:' + val_res.has_shebang +
            ', jump_rows:' + val_res.jump_count +
            ', axioms:' + val_res.axiom_count +
            ', sections:' + val_res.section_count +
            ', verified_paths:' + val_res.verified_files.length +
            ', planned_docs:' + val_res.planned_docs.length +
            ', missing_paths:' + val_res.missing_files.length + '}\n'
        )
        var m_idx= 0
        while (m_idx < val_res.missing_files.length) {
            process.stdout.write('!missing :: ' + val_res.missing_files[m_idx] + '\n')
            m_idx= m_idx + 1
        }
    }
    return val_res.ok ? 0 : 1
}

export class libag_AgentFastpass {
    #ctx

    constructor(options= Object.create(null)) {
        this.#ctx= fastpass_init_ctx(options)
    }

    mode(val) {
        return fastpass_ctx_mode(this.#ctx, val)
    }

    async validate() {
        return fastpass_validate_spec(this.#ctx)
    }

    async bundle() {
        return fastpass_bundle_context(this.#ctx)
    }

    async audit() {
        return fastpass_audit_repo(this.#ctx)
    }
}

var is_main_entry= process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
if (is_main_entry) {
    fastpass_run_cli(process.argv.slice(2)).then((code) => {
        process.exitCode= code
    })
}
