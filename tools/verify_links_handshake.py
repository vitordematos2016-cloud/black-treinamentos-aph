#!/usr/bin/env python3
"""
Camada 3 (tools/) — Handshake & Verificação de Links (Fase 2: L - Link)
Protocolo V.L.A.E.G. — APH Treinamentos (Cliente: Cleve)

Verifica:
1. Existência e integridade dos arquivos de memória e Constituição (gemini.MD, task_plan.md, findings.md, progress.md).
2. Existência dos POPs na Camada 1 (architecture/) e do Schema SQL do Supabase (supabase_schema.sql).
3. Configuração de conectividade (.env ou .env.example) para Supabase, Mercado Pago e Stripe.
4. Gera relatório determinístico em .tmp/handshake_report.json.
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
TMP_DIR = ROOT_DIR / ".tmp"


def parse_env_file(filepath: Path) -> dict:
    env_vars = {}
    if not filepath.exists():
        return env_vars
    for line in filepath.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        env_vars[key.strip()] = val.strip().strip('"').strip("'")
    return env_vars


def run_handshake() -> dict:
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    required_files = [
        "gemini.MD",
        "task_plan.md",
        "findings.md",
        "progress.md",
        ".env.example",
        "supabase_schema.sql",
        "architecture/SOP-01_ecossistema_dados_supabase.md",
        "architecture/SOP-02_gateway_pagamentos_mp_stripe.md",
        "architecture/SOP-03_fluxo_aluno_certificado_qrcode.md",
    ]

    file_checks = {}
    all_files_ok = True
    for rel_path in required_files:
        exists = (ROOT_DIR / rel_path).exists()
        file_checks[rel_path] = "OK" if exists else "MISSING"
        if not exists:
            all_files_ok = False

    env_path = ROOT_DIR / ".env" if (ROOT_DIR / ".env").exists() else ROOT_DIR / ".env.example"
    env_data = parse_env_file(env_path)

    supabase_configured = bool(env_data.get("VITE_SUPABASE_URL") and env_data.get("VITE_SUPABASE_ANON_KEY"))
    mp_configured = bool(env_data.get("VITE_MERCADO_PAGO_PUBLIC_KEY") and env_data.get("MERCADO_PAGO_ACCESS_TOKEN"))
    stripe_configured = bool(env_data.get("VITE_STRIPE_PUBLISHABLE_KEY") and env_data.get("STRIPE_SECRET_KEY"))

    report = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "project": "APH Treinamentos (Cleve)",
        "protocol_phase": "FASE 2 — LINK (HANDSHAKE)",
        "architecture_files_ok": all_files_ok,
        "file_checks": file_checks,
        "integrations": {
            "supabase": {
                "status": "CONNECTED_PRODUCTION" if supabase_configured else "LOCAL_SYNC_FALLBACK_READY",
                "schema_sql_ready": (ROOT_DIR / "supabase_schema.sql").exists(),
            },
            "payment_gateway": {
                "active_provider": env_data.get("VITE_PAYMENT_PROVIDER", "MERCADO_PAGO"),
                "mode": env_data.get("VITE_PAYMENT_MODE", "SIMULATION"),
                "mercado_pago_adapter": "PRODUCTION_KEYS_SET" if mp_configured else "ADAPTER_READY_SIMULATION",
                "stripe_adapter": "PRODUCTION_KEYS_SET" if stripe_configured else "ADAPTER_READY_SIMULATION",
            },
            "deployment_target": {
                "host": "Hostinger VPS 2",
                "delivery_mode": "Web Responsive + PWA Mobile",
            },
        },
        "ready_for_project_1_landing_page": all_files_ok,
    }

    report_path = TMP_DIR / "handshake_report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    return report


if __name__ == "__main__":
    result = run_handshake()
    print(json.dumps(result, indent=2, ensure_ascii=False))
