#!/usr/bin/env sh
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
exec node "$SCRIPT_DIR/../tool/libag_agent_fastpass.mjs" "$@"
