# SOP-03: Fluxo do Aluno, Avaliações e Certificado com QR Code

## 1. Objetivo
Reger a jornada determinística ponta a ponta do aluno da **APH Treinamentos**:
`Acessa a Landing Page` → `Faz a Inscrição` → `Realiza o Pagamento` → `Acessa o Portal do Aluno` → `Estuda o Conteúdo` → `Realiza as Avaliações` → `Conclui e Emite o Certificado`.

## 2. Regras de Negócio para Aprovação e Certificação
1. **Progresso de Estudos:** Cada aula assistida e atividade concluída atualiza `progresso_percentual` em tempo real.
2. **Critério de Avaliação:** Nota mínima de aprovação padrão = `7.0` (`70%` de acerto nas questões teóricas/práticas de APH).
3. **Emissão Automática do Certificado:**
   - Quando `avaliacoes_concluidas` atingir o requisito e `nota_final >= 7.0` (ou liberação por instrutor em turma presencial), o sistema gera:
     - `codigo_validacao`: Hash alfanumérico único no padrão `APH-YYYY-XXXXXX`.
     - `qr_code_url`: URL pública de verificação (`{VITE_APP_URL}/?validar={codigo_validacao}`).
     - `data_emissao`: Timestamp ISO-8601.
4. **Validação Pública:** Qualquer hospital, corporação ou empresa que escanear o QR Code confirma instantaneamente a autenticidade, carga horária e validade do certificado emitido pela **APH Treinamentos**.
