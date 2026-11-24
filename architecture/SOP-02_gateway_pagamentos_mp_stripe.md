# SOP-02: Gateway de Pagamentos (Adapter Pattern: Mercado Pago & Stripe)

## 1. Objetivo
Deixar o sistema com "meio caminho andado" para processar pagamentos via **Mercado Pago** ou **Stripe** (Pix, Cartão de Crédito e Boleto Recorrente), permitindo operação imediata em modo simulação (`SIMULATION`) até que o cliente (**Cleve**) defina o provedor definitivo.

## 2. Entradas
- `provider`: `"MERCADO_PAGO" | "STRIPE"`
- `mode`: `"SIMULATION" | "PRODUCTION"`
- `method`: `"PIX" | "CARTAO" | "BOLETO"`
- `payload`: Dados do aluno, `curso_id`, `turma_id` e `valor_centavos`.

## 3. Lógica Determinística do Adapter
1. **Seleção de Provedor:** O adaptador lê `VITE_PAYMENT_PROVIDER` (ou a configuração ativa no Painel Administrativo do Cleve).
2. **Geração de Cobrança:**
   - **PIX:** Gera payload Pix Copia-e-Cola + QR Code dinâmico e monitora status de pagamento.
   - **CARTÃO:** Processa parcelamento em até 12x e valida tokenização (Mercado Pago Brick / Stripe Elements).
   - **BOLETO:** Gera linha digitável e vencimento configurado.
3. **Confirmação / Webhook:**
   - Quando o status muda para `APROVADO`:
     - Cria/ativa o registro em `matriculas`.
     - Incrementa `vagas_ocupadas` na `turma`.
     - Calcula a comissão do instrutor da turma e atualiza o Faturamento e Lucro Líquido no Painel Administrativo.
     - Libera o acesso imediato no **Portal do Aluno (`/aluno`)**.
