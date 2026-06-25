# SalvaAmbuDS — Feature Implementation Prompts
> All UI text and generated content must remain in **Brazilian Portuguese**.  
> All code must follow the existing patterns in the codebase (vanilla JS ES6, Tailwind CSS CDN, no build step).

---

## Table of Contents
1. [Encaminhamento por IA](#1-encaminhamento-por-ia)
2. [Atestado Médico](#2-atestado-médico)
3. [Receituário Imprimível](#3-receituário-imprimível)
4. [Interpretador de Exames](#4-interpretador-de-exames)
5. [Resumo para o Paciente](#5-resumo-para-o-paciente)

---

---

# 1. Encaminhamento por IA

## Overview
A new "Encaminhamento" button opens a modal where the physician selects the target specialty, urgency level, and optional notes. The AI generates a formal referral letter (encaminhamento médico) using all current patient data — name, age, chief complaint, history, allergies, medications, vital signs, and clinical impression from the last generated prontuário (if available).

## Files to Modify
| File | Change |
|---|---|
| `index.html` | Add button in Ferramentas Rápidas + new modal `#modalEncaminhamento` |
| `js/main.js` | Add `abrirModalEncaminhamento()` + `gerarEncaminhamento()` methods + event listener |
| `js/ui.js` | Add `abrirModalEncaminhamento()` method |
| `js/ui-modal-content.js` | Add `gerarConteudoModalEncaminhamento()` function |

---

## Step 1 — `index.html`: Add "Documentos Clínicos" subsection to Ferramentas Rápidas

Locate exactly:
```html
    <!-- Sinais Vitais - Collapsible -->
    <div class="mt-6 border-t border-gray-100 pt-4">
```

Insert **immediately before** that comment:

```html
    <!-- Documentos Clínicos -->
    <div class="mt-6 pt-4 border-t border-gray-100">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Documentos Clínicos</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">

        <button id="btnEncaminhamento"
                class="group flex flex-col items-center justify-center p-4 rounded-xl border-2 border-sky-100 bg-gradient-to-b from-sky-50 to-white hover:from-sky-100 hover:to-sky-50 hover:border-sky-300 transition-all duration-300 hover:scale-105 active:scale-95">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span class="text-xl">📨</span>
          </div>
          <span class="font-semibold text-gray-900 text-xs text-center">Encaminhamento</span>
          <span class="text-xs text-gray-500 mt-0.5">Referência</span>
        </button>

        <button id="btnAtestado"
                class="group flex flex-col items-center justify-center p-4 rounded-xl border-2 border-teal-100 bg-gradient-to-b from-teal-50 to-white hover:from-teal-100 hover:to-teal-50 hover:border-teal-300 transition-all duration-300 hover:scale-105 active:scale-95">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span class="text-xl">📄</span>
          </div>
          <span class="font-semibold text-gray-900 text-xs text-center">Atestado</span>
          <span class="text-xs text-gray-500 mt-0.5">Médico</span>
        </button>

        <button id="btnReceituario"
                class="group flex flex-col items-center justify-center p-4 rounded-xl border-2 border-purple-100 bg-gradient-to-b from-purple-50 to-white hover:from-purple-100 hover:to-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-105 active:scale-95">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span class="text-xl">💊</span>
          </div>
          <span class="font-semibold text-gray-900 text-xs text-center">Receituário</span>
          <span class="text-xs text-gray-500 mt-0.5">Imprimível</span>
        </button>

        <button id="btnInterpretador"
                class="group flex flex-col items-center justify-center p-4 rounded-xl border-2 border-orange-100 bg-gradient-to-b from-orange-50 to-white hover:from-orange-100 hover:to-orange-50 hover:border-orange-300 transition-all duration-300 hover:scale-105 active:scale-95">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span class="text-xl">🔬</span>
          </div>
          <span class="font-semibold text-gray-900 text-xs text-center">Interpretador</span>
          <span class="text-xs text-gray-500 mt-0.5">de Exames</span>
        </button>

      </div>
    </div>
```

---

## Step 2 — `index.html`: Add modal `#modalEncaminhamento`

Locate the block of existing modals (after `</main>`, around line 1398). Add **after** the last existing modal div (after `</div>` of `modalCalculadoras`):

```html
<!-- Modal: Encaminhamento -->
<div id="modalEncaminhamento" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
  <div class="modal-content bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
    <div class="flex items-center justify-between p-5 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-900">📨 Gerar Encaminhamento</h3>
      <button onclick="window.UI.fecharModal('modalEncaminhamento')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
    </div>
    <div class="flex-1 overflow-y-auto p-5 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Especialidade de destino</label>
        <select id="encEspecialidade" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
          <option value="">Selecione...</option>
          <option>Cardiologia</option>
          <option>Neurologia</option>
          <option>Ortopedia</option>
          <option>Endocrinologia</option>
          <option>Gastroenterologia</option>
          <option>Pneumologia</option>
          <option>Reumatologia</option>
          <option>Dermatologia</option>
          <option>Oftalmologia</option>
          <option>Otorrinolaringologia</option>
          <option>Urologia</option>
          <option>Nefrologia</option>
          <option>Ginecologia</option>
          <option>Oncologia</option>
          <option>Hematologia</option>
          <option>Infectologia</option>
          <option>Psiquiatria</option>
          <option>Médico de Família e Comunidade</option>
          <option>Cirurgia Geral</option>
          <option>Vascular</option>
          <option>Outra especialidade</option>
        </select>
      </div>
      <div id="encOutraEspecialidadeDiv" class="hidden">
        <label class="block text-sm font-medium text-gray-700 mb-1">Especifique a especialidade</label>
        <input id="encOutraEspecialidade" type="text" placeholder="Ex: Medicina do Trabalho"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Urgência</label>
        <div class="flex gap-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="encUrgencia" value="Eletivo" checked class="text-sky-500"/> <span class="text-sm">Eletivo</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="encUrgencia" value="Prioritário" class="text-amber-500"/> <span class="text-sm">Prioritário</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="encUrgencia" value="Urgência" class="text-red-500"/> <span class="text-sm">Urgência</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Informações adicionais <span class="text-gray-400 font-normal">(opcional)</span></label>
        <textarea id="encNotasAdicionais" rows="3" placeholder="Ex: paciente já realizou ECG há 2 semanas (normal), solicito avaliação de sopro..."
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"></textarea>
      </div>
      <!-- Status de geração -->
      <div id="encStatus" class="hidden bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-center gap-3">
        <div class="w-4 h-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin flex-shrink-0"></div>
        <span class="text-sm text-sky-700">Gerando encaminhamento...</span>
      </div>
      <!-- Resultado -->
      <div id="encResultadoDiv" class="hidden space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">Encaminhamento gerado</label>
          <button id="encBtnCopiar" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">📋 Copiar</button>
        </div>
        <textarea id="encResultado" rows="14" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"></textarea>
      </div>
    </div>
    <div class="p-5 border-t border-gray-100 flex justify-between items-center">
      <button onclick="window.UI.fecharModal('modalEncaminhamento')"
        class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-colors">Fechar</button>
      <button id="encBtnGerar"
        class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
        ✦ Gerar com IA
      </button>
    </div>
  </div>
</div>
```

---

## Step 3 — `js/ui.js`: Add `abrirModalEncaminhamento()` method

Locate the existing method `abrirModalCalculadoras` (or the last `abrirModal*` method). Add the following method **after** it:

```javascript
    /**
     * Opens the referral letter generation modal
     */
    abrirModalEncaminhamento() {
        // Reset state from previous use
        const status = document.getElementById('encStatus');
        const resultado = document.getElementById('encResultadoDiv');
        const textarea = document.getElementById('encResultado');
        const notas = document.getElementById('encNotasAdicionais');
        if (status) status.classList.add('hidden');
        if (resultado) resultado.classList.add('hidden');
        if (textarea) textarea.value = '';
        if (notas) notas.value = '';

        // Reset specialty select and radio
        const sel = document.getElementById('encEspecialidade');
        if (sel) sel.value = '';
        const outroDiv = document.getElementById('encOutraEspecialidadeDiv');
        if (outroDiv) outroDiv.classList.add('hidden');
        document.querySelectorAll('input[name="encUrgencia"]').forEach(r => {
            r.checked = r.value === 'Eletivo';
        });

        // Wire specialty "Outra" toggle (idempotent — safe to rebind every open)
        if (sel) {
            sel.onchange = () => {
                const outroDiv = document.getElementById('encOutraEspecialidadeDiv');
                if (outroDiv) {
                    outroDiv.classList.toggle('hidden', sel.value !== 'Outra especialidade');
                }
            };
        }

        this.abrirModal('modalEncaminhamento');
    }
```

---

## Step 4 — `js/main.js`: Add event listener + generation methods

### 4a — `setupEventListeners()`: wire the button

Locate the section inside `setupEventListeners()` where `btnCalculadoras` is wired (around line 79):
```javascript
        const btnCalculadoras = document.getElementById('btnCalculadoras');
        if (btnCalculadoras) {
            btnCalculadoras.addEventListener('click', () => this.abrirModalCalculadoras());
        }
```

Add immediately after:
```javascript
        // Documentos Clínicos
        const btnEncaminhamento = document.getElementById('btnEncaminhamento');
        if (btnEncaminhamento) {
            btnEncaminhamento.addEventListener('click', () => this.abrirModalEncaminhamento());
        }

        const btnAtestado = document.getElementById('btnAtestado');
        if (btnAtestado) {
            btnAtestado.addEventListener('click', () => this.abrirModalAtestado());
        }

        const btnReceituario = document.getElementById('btnReceituario');
        if (btnReceituario) {
            btnReceituario.addEventListener('click', () => this.abrirModalReceituario());
        }

        const btnInterpretador = document.getElementById('btnInterpretador');
        if (btnInterpretador) {
            btnInterpretador.addEventListener('click', () => this.abrirModalInterpretador());
        }
```

### 4b — Add `abrirModalEncaminhamento()` and `gerarEncaminhamento()` to `ProntuarioApp`

Add these two methods anywhere inside the `ProntuarioApp` class (recommended: after `abrirModalCalculadoras()`):

```javascript
    abrirModalEncaminhamento() {
        if (window.UI) window.UI.abrirModalEncaminhamento();

        // Wire the "Gerar" button — do this here (not in ui.js) so we have access to ProntuarioApp state
        setTimeout(() => {
            const btn = document.getElementById('encBtnGerar');
            if (btn) {
                // Remove any previous listener to avoid duplicates
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', () => this.gerarEncaminhamento());
            }
            const btnCopiar = document.getElementById('encBtnCopiar');
            if (btnCopiar) {
                const newBtn2 = btnCopiar.cloneNode(true);
                btnCopiar.parentNode.replaceChild(newBtn2, btnCopiar);
                newBtn2.addEventListener('click', async () => {
                    const txt = document.getElementById('encResultado')?.value;
                    if (txt) {
                        await navigator.clipboard.writeText(txt).catch(() => {});
                        newBtn2.textContent = '✅ Copiado!';
                        setTimeout(() => { newBtn2.textContent = '📋 Copiar'; }, 2000);
                    }
                });
            }
        }, 50);
    }

    async gerarEncaminhamento() {
        const especialidadeEl = document.getElementById('encEspecialidade');
        const outraEl = document.getElementById('encOutraEspecialidade');
        const urgenciaEl = document.querySelector('input[name="encUrgencia"]:checked');
        const notasEl = document.getElementById('encNotasAdicionais');
        const statusEl = document.getElementById('encStatus');
        const resultadoDiv = document.getElementById('encResultadoDiv');
        const resultadoTxt = document.getElementById('encResultado');
        const btnGerar = document.getElementById('encBtnGerar');

        const especialidade = especialidadeEl?.value === 'Outra especialidade'
            ? (outraEl?.value.trim() || 'Outra especialidade')
            : (especialidadeEl?.value || '');

        if (!especialidade) {
            alert('Selecione a especialidade de destino.');
            return;
        }

        const urgencia = urgenciaEl?.value || 'Eletivo';
        const notas = notasEl?.value.trim() || '';
        const dados = this.coletarDadosPaciente();

        // Extract diagnosis from last generated prontuário if available
        const prontuarioGerado = document.getElementById('resultadoProntuario')?.value.trim() || '';
        let impressaoClinica = '';
        if (prontuarioGerado) {
            // Try to extract the assessment/diagnosis section (works for SOAP and most templates)
            const match = prontuarioGerado.match(/(?:HIPÓTESES DIAGNÓSTICAS|DIAGNÓSTICO|IMPRESSÃO[^:]*|A \(AVALIAÇÃO\))[:\s]*\n([\s\S]{30,400}?)(?:\n\n|\nCID|\nRaciocínio|\nP \()/i);
            if (match) impressaoClinica = match[1].trim().substring(0, 400);
        }

        // Build AI prompt
        let prompt = `Gere um encaminhamento médico formal e completo em português brasileiro.\n\n`;
        prompt += `DADOS DO PACIENTE:\n`;
        prompt += `Nome: ${dados.nome || 'Não informado'}\n`;
        prompt += `Idade: ${dados.idade || 'Não informada'}\n`;
        prompt += `Sexo: ${dados.sexo || 'Não informado'}\n`;
        if (dados.profissao) prompt += `Profissão: ${dados.profissao}\n`;
        prompt += `\nEXPECIALIDADE DE DESTINO: ${especialidade}\n`;
        prompt += `URGÊNCIA: ${urgencia}\n\n`;
        prompt += `QUEIXA PRINCIPAL: ${dados.queixa || 'Não informada'}\n\n`;
        prompt += `HISTÓRIA CLÍNICA:\n${dados.anamnese || 'Não informada'}\n\n`;
        if (dados.antecedentes) prompt += `ANTECEDENTES PESSOAIS: ${dados.antecedentes}\n`;
        if (dados.medicacoesUso) prompt += `MEDICAÇÕES EM USO: ${dados.medicacoesUso}\n`;
        if (dados.alergias) prompt += `ALERGIAS: ${dados.alergias}\n`;
        if (dados.sinaisVitais) prompt += `\nSINAIS VITAIS:\n${dados.sinaisVitais}\n`;
        if (impressaoClinica) prompt += `\nIMPRESSÃO CLÍNICA / HIPÓTESES DIAGNÓSTICAS:\n${impressaoClinica}\n`;
        if (notas) prompt += `\nINFORMAÇÕES ADICIONAIS DO MÉDICO SOLICITANTE:\n${notas}\n`;
        prompt += `\nINSTRUÇÕES PARA FORMATAÇÃO DO ENCAMINHAMENTO:
- Escreva em português brasileiro formal e objetivo
- Use linguagem médica apropriada
- Estrutura obrigatória:
  1. Cabeçalho: "ENCAMINHAMENTO MÉDICO" e data atual (${new Date().toLocaleDateString('pt-BR')})
  2. Identificação do paciente (nome, idade, sexo)
  3. Motivo do encaminhamento (1 parágrafo objetivo)
  4. Resumo clínico (HDA relevante, achados pertinentes, medicações e antecedentes se relevantes)
  5. Hipótese diagnóstica principal
  6. Urgência: ${urgencia}
  7. Solicitação formal à especialidade (o que se espera da consulta)
  8. Espaço para assinatura: "Atenciosamente," seguido de linha em branco para assinatura e "CRM: _______________"
- NÃO use formatação markdown (sem ** ou *)
- Use hífens (-) para listas
- Tom formal e colegiado
- Máximo 400 palavras`;

        // UI: show loading
        if (statusEl) statusEl.classList.remove('hidden');
        if (resultadoDiv) resultadoDiv.classList.add('hidden');
        if (btnGerar) { btnGerar.disabled = true; btnGerar.textContent = 'Gerando...'; }

        try {
            const resultado = await window.API.gerarProntuario(prompt);
            if (resultadoTxt) resultadoTxt.value = resultado;
            if (resultadoDiv) resultadoDiv.classList.remove('hidden');
        } catch (err) {
            alert(`Erro ao gerar encaminhamento: ${err.message}`);
        } finally {
            if (statusEl) statusEl.classList.add('hidden');
            if (btnGerar) { btnGerar.disabled = false; btnGerar.textContent = '✦ Gerar com IA'; }
        }
    }
```

---

## Edge Cases & Safeguards

| Risk | Safeguard |
|---|---|
| Button clicked before patient data is filled | AI prompt includes fallback `'Não informado'` for every field — generation proceeds and result will reflect missing data |
| "Outra especialidade" selected but field left empty | Falls back to string `'Outra especialidade'` in the prompt |
| Copy button clicked on empty result | Only the result textarea area is shown after generation, so it will always have content |
| `gerarEncaminhamento` called twice (double-click) | `btn.disabled = true` during generation prevents double submissions |
| Modal opened a second time with stale data | `abrirModalEncaminhamento()` in `ui.js` resets all fields and hides result on every open |
| Listener accumulation (modal opened many times) | `cloneNode(true)` replaces the button element, removing all previous listeners |

---

---

# 2. Atestado Médico

## Overview
Zero AI. The physician fills a form (days, certificate type, optional CID-10, date) and clicks "Gerar Atestado". A formatted certificate is produced instantly using a string template. Doctor profile (name, CRM, UF, specialty, city) is stored in `localStorage` key `doctor_profile` and loaded automatically. A print button opens `window.print()` with `@media print` CSS that shows only the certificate.

## Files to Modify
| File | Change |
|---|---|
| `index.html` | Add modal `#modalAtestado` + `@media print` CSS block |
| `js/main.js` | Add `abrirModalAtestado()` + `gerarAtestado()` + `salvarPerfilMedico()` methods |

---

## Step 1 — `index.html`: Add `@media print` CSS

Locate the closing `</style>` tag in the `<head>` section. Insert **before** it:

```css
    /* ── Print: show only the certificate, hide everything else ── */
    @media print {
      body > *:not(#printArea) { display: none !important; }
      #printArea {
        display: block !important;
        position: fixed;
        inset: 0;
        background: white;
        z-index: 9999;
        padding: 40px 60px;
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        color: #000;
        line-height: 1.7;
      }
      #printArea h1 { font-size: 14pt; text-align: center; margin-bottom: 4px; }
      #printArea .print-center { text-align: center; }
      #printArea .print-signature { margin-top: 60px; border-top: 1px solid #000; width: 280px; }
    }
```

Also add `<div id="printArea" style="display:none"></div>` immediately after the opening `<body>` tag.

---

## Step 2 — `index.html`: Add modal `#modalAtestado`

Add after the `#modalEncaminhamento` closing `</div>`:

```html
<!-- Modal: Atestado Médico -->
<div id="modalAtestado" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
  <div class="modal-content bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
    <div class="flex items-center justify-between p-5 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-900">📄 Atestado Médico</h3>
      <button onclick="window.UI.fecharModal('modalAtestado')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
    </div>
    <div class="flex-1 overflow-y-auto p-5 space-y-4">

      <!-- Certificate type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de atestado</label>
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="atestTipo" value="proprio" checked class="text-teal-500"/>
            <span class="text-sm">Afastamento próprio (paciente)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="atestTipo" value="acompanhante" class="text-teal-500"/>
            <span class="text-sm">Acompanhante</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="atestTipo" value="restricao" class="text-teal-500"/>
            <span class="text-sm">Restrição de atividade física</span>
          </label>
        </div>
      </div>

      <!-- Acompanhante: name field -->
      <div id="atestAcompDiv" class="hidden">
        <label class="block text-sm font-medium text-gray-700 mb-1">Nome do paciente acompanhado</label>
        <input id="atestNomePacAcomp" type="text" placeholder="Nome do paciente"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dias de afastamento</label>
          <input id="atestDias" type="number" min="1" max="365" value="1"
            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">A partir de</label>
          <input id="atestData" type="date"
            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
        </div>
      </div>

      <!-- CID-10 toggle -->
      <div class="flex items-center gap-3">
        <input type="checkbox" id="atestIncluirCID" class="rounded"/>
        <label for="atestIncluirCID" class="text-sm text-gray-700 cursor-pointer">Incluir CID-10 no atestado</label>
      </div>
      <div id="atestCIDDiv" class="hidden">
        <input id="atestCID" type="text" placeholder="Ex: J06.9 — Infecção aguda das vias aéreas superiores"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"/>
      </div>

      <!-- Doctor profile -->
      <div class="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Dados do médico</span>
          <button id="atestEditarMedico" class="text-xs text-teal-600 hover:underline">Editar</button>
        </div>
        <div id="atestPerfilDisplay" class="text-sm text-gray-700"></div>
        <div id="atestPerfilForm" class="hidden space-y-2">
          <input id="atestMedNome" type="text" placeholder="Nome completo do médico"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"/>
          <div class="grid grid-cols-3 gap-2">
            <input id="atestMedCRM" type="text" placeholder="CRM"
              class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"/>
            <select id="atestMedUF" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400">
              <option value="">UF</option>
              <option>AC</option><option>AL</option><option>AP</option><option>AM</option>
              <option>BA</option><option>CE</option><option>DF</option><option>ES</option>
              <option>GO</option><option>MA</option><option>MT</option><option>MS</option>
              <option>MG</option><option>PA</option><option>PB</option><option>PR</option>
              <option>PE</option><option>PI</option><option>RJ</option><option>RN</option>
              <option>RS</option><option>RO</option><option>RR</option><option>SC</option>
              <option selected>RS</option><option>SP</option><option>SE</option><option>TO</option>
            </select>
            <input id="atestMedEspecialidade" type="text" placeholder="Especialidade"
              class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"/>
          </div>
          <input id="atestMedCidade" type="text" placeholder="Cidade"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"/>
          <button id="atestSalvarMedico" class="w-full py-2 rounded-lg bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition-colors">Salvar dados do médico</button>
        </div>
      </div>

      <!-- Result preview -->
      <div id="atestResultadoDiv" class="hidden space-y-2">
        <label class="text-sm font-medium text-gray-700">Atestado gerado</label>
        <textarea id="atestResultado" rows="10" readonly
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono bg-gray-50 resize-none"></textarea>
      </div>
    </div>
    <div class="p-5 border-t border-gray-100 flex justify-between items-center gap-3">
      <button onclick="window.UI.fecharModal('modalAtestado')"
        class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">Fechar</button>
      <div class="flex gap-2">
        <button id="atestBtnCopiar" class="hidden px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm transition-colors">📋 Copiar</button>
        <button id="atestBtnImprimir" class="hidden px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-900 text-sm transition-colors">🖨️ Imprimir</button>
        <button id="atestBtnGerar"
          class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95">
          ✦ Gerar Atestado
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## Step 3 — `js/main.js`: Add `abrirModalAtestado()` and `gerarAtestado()`

Add after `gerarEncaminhamento()`:

```javascript
    abrirModalAtestado() {
        // Set today's date as default
        const dataInput = document.getElementById('atestData');
        if (dataInput) dataInput.value = new Date().toISOString().split('T')[0];

        // Load doctor profile from localStorage
        this._carregarPerfilMedicoNoModal();

        // Wire radio: show/hide acompanhante field
        document.querySelectorAll('input[name="atestTipo"]').forEach(r => {
            r.onchange = () => {
                const acompDiv = document.getElementById('atestAcompDiv');
                if (acompDiv) acompDiv.classList.toggle('hidden', r.value !== 'acompanhante');
            };
        });

        // Wire CID-10 toggle
        const cidCheck = document.getElementById('atestIncluirCID');
        const cidDiv = document.getElementById('atestCIDDiv');
        if (cidCheck && cidDiv) {
            cidCheck.onchange = () => cidDiv.classList.toggle('hidden', !cidCheck.checked);
            cidCheck.checked = false;
            cidDiv.classList.add('hidden');
        }

        // Wire "Editar médico" toggle
        const btnEditar = document.getElementById('atestEditarMedico');
        if (btnEditar) {
            btnEditar.onclick = () => {
                const form = document.getElementById('atestPerfilForm');
                if (form) form.classList.toggle('hidden');
            };
        }

        // Wire "Salvar dados do médico"
        const btnSalvarMedico = document.getElementById('atestSalvarMedico');
        if (btnSalvarMedico) {
            btnSalvarMedico.onclick = () => this._salvarPerfilMedico();
        }

        // Wire "Gerar Atestado"
        const btnGerar = document.getElementById('atestBtnGerar');
        if (btnGerar) {
            const newBtn = btnGerar.cloneNode(true);
            btnGerar.parentNode.replaceChild(newBtn, btnGerar);
            newBtn.addEventListener('click', () => this.gerarAtestado());
        }

        // Wire copy and print
        const btnCopiar = document.getElementById('atestBtnCopiar');
        if (btnCopiar) {
            const newBtn = btnCopiar.cloneNode(true);
            btnCopiar.parentNode.replaceChild(newBtn, btnCopiar);
            newBtn.addEventListener('click', async () => {
                const txt = document.getElementById('atestResultado')?.value;
                if (txt) {
                    await navigator.clipboard.writeText(txt).catch(() => {});
                    newBtn.textContent = '✅ Copiado!';
                    setTimeout(() => { newBtn.textContent = '📋 Copiar'; }, 2000);
                }
            });
        }

        const btnImprimir = document.getElementById('atestBtnImprimir');
        if (btnImprimir) {
            const newBtn = btnImprimir.cloneNode(true);
            btnImprimir.parentNode.replaceChild(newBtn, btnImprimir);
            newBtn.addEventListener('click', () => {
                const txt = document.getElementById('atestResultado')?.value || '';
                const printArea = document.getElementById('printArea');
                if (printArea) {
                    printArea.innerHTML = `<pre style="font-family:inherit;white-space:pre-wrap;font-size:12pt">${txt}</pre>`;
                    printArea.style.display = 'block';
                    window.print();
                    printArea.style.display = 'none';
                    printArea.innerHTML = '';
                }
            });
        }

        // Hide result from previous use
        const resultDiv = document.getElementById('atestResultadoDiv');
        if (resultDiv) resultDiv.classList.add('hidden');
        const copiarBtn = document.getElementById('atestBtnCopiar');
        const imprimirBtn = document.getElementById('atestBtnImprimir');
        if (copiarBtn) copiarBtn.classList.add('hidden');
        if (imprimirBtn) imprimirBtn.classList.add('hidden');

        if (window.UI) window.UI.abrirModal('modalAtestado');
    }

    gerarAtestado() {
        const tipo = document.querySelector('input[name="atestTipo"]:checked')?.value || 'proprio';
        const diasEl = document.getElementById('atestDias');
        const dataEl = document.getElementById('atestData');
        const cidCheck = document.getElementById('atestIncluirCID');
        const cidEl = document.getElementById('atestCID');
        const nomePacAcompEl = document.getElementById('atestNomePacAcomp');

        const dias = parseInt(diasEl?.value) || 1;
        const dataISO = dataEl?.value || new Date().toISOString().split('T')[0];
        const includeCID = cidCheck?.checked || false;
        const cid = cidEl?.value.trim() || '';

        const dados = this.coletarDadosPaciente();
        const nomePaciente = dados.nome || 'Paciente';

        // Parse date for display
        const [ano, mes, dia] = dataISO.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;
        const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
        const dataExtenso = `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${ano}`;

        // Days in words (up to 30; beyond that use number)
        const diasPorExtenso = ['um','dois','três','quatro','cinco','seis','sete','oito','nove','dez',
            'onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove','vinte',
            'vinte e um','vinte e dois','vinte e três','vinte e quatro','vinte e cinco',
            'vinte e seis','vinte e sete','vinte e oito','vinte e nove','trinta'];
        const diasTexto = dias <= 30 ? diasPorExtenso[dias - 1] : String(dias);
        const diaPlural = dias === 1 ? 'dia' : 'dias';

        const perfil = this._carregarPerfilMedico();
        const medNome = perfil.nome || '______________________________';
        const medCRM = perfil.crm ? `CRM-${perfil.uf || 'XX'} ${perfil.crm}` : 'CRM-XX _______';
        const medEspec = perfil.especialidade || '';
        const medCidade = perfil.cidade || '_______________';

        let texto = '';
        if (tipo === 'proprio') {
            const cidLine = (includeCID && cid)
                ? `, com diagnóstico compatível com ${cid},`
                : '';
            texto = `ATESTADO MÉDICO\n\n` +
                `Atesto para os devidos fins que o(a) paciente ${nomePaciente}${cidLine} ` +
                `encontra-se sob meus cuidados médicos e necessita de afastamento de suas atividades ` +
                `pelo período de ${dias} (${diasTexto}) ${diaPlural}, a contar de ${dataFormatada}.\n\n` +
                `${medCidade}, ${dataExtenso}.\n\n\n` +
                `_________________________________\n` +
                `${medNome}\n` +
                `${medCRM}${medEspec ? '\n' + medEspec : ''}`;
        } else if (tipo === 'acompanhante') {
            const nomePacAcomp = nomePacAcompEl?.value.trim() || '______________________________';
            texto = `ATESTADO MÉDICO\n\n` +
                `Atesto para os devidos fins que o(a) Sr(a). ${nomePaciente} ` +
                `necessita acompanhar o(a) paciente ${nomePacAcomp}, ` +
                `o(a) qual está sob meus cuidados médicos, ` +
                `pelo período de ${dias} (${diasTexto}) ${diaPlural}, a contar de ${dataFormatada}.\n\n` +
                `${medCidade}, ${dataExtenso}.\n\n\n` +
                `_________________________________\n` +
                `${medNome}\n` +
                `${medCRM}${medEspec ? '\n' + medEspec : ''}`;
        } else if (tipo === 'restricao') {
            texto = `ATESTADO MÉDICO\n\n` +
                `Atesto para os devidos fins que o(a) paciente ${nomePaciente} ` +
                `encontra-se sob meus cuidados médicos e está contraindicado(a) à prática de ` +
                `atividades físicas pelo período de ${dias} (${diasTexto}) ${diaPlural}, a contar de ${dataFormatada}.\n\n` +
                `${medCidade}, ${dataExtenso}.\n\n\n` +
                `_________________________________\n` +
                `${medNome}\n` +
                `${medCRM}${medEspec ? '\n' + medEspec : ''}`;
        }

        const resultadoEl = document.getElementById('atestResultado');
        if (resultadoEl) resultadoEl.value = texto;

        const resultadoDiv = document.getElementById('atestResultadoDiv');
        if (resultadoDiv) resultadoDiv.classList.remove('hidden');

        // Show copy/print buttons (re-query because they may have been replaced by cloneNode)
        document.querySelectorAll('#atestBtnCopiar, #atestBtnImprimir').forEach(b => {
            if (b) b.classList.remove('hidden');
        });
    }

    _carregarPerfilMedico() {
        try {
            return JSON.parse(localStorage.getItem('doctor_profile') || '{}');
        } catch { return {}; }
    }

    _carregarPerfilMedicoNoModal() {
        const perfil = this._carregarPerfilMedico();
        const display = document.getElementById('atestPerfilDisplay');
        if (display) {
            if (perfil.nome) {
                display.textContent = `Dr(a). ${perfil.nome} — CRM-${perfil.uf || 'XX'} ${perfil.crm || ''}${perfil.especialidade ? ' — ' + perfil.especialidade : ''} — ${perfil.cidade || ''}`;
            } else {
                display.textContent = 'Dados do médico não configurados. Clique em "Editar" para preencher.';
            }
        }
        // Pre-fill form fields
        if (perfil.nome) {
            const n = document.getElementById('atestMedNome'); if (n) n.value = perfil.nome;
            const c = document.getElementById('atestMedCRM'); if (c) c.value = perfil.crm || '';
            const u = document.getElementById('atestMedUF'); if (u) u.value = perfil.uf || '';
            const e = document.getElementById('atestMedEspecialidade'); if (e) e.value = perfil.especialidade || '';
            const ci = document.getElementById('atestMedCidade'); if (ci) ci.value = perfil.cidade || '';
        }
    }

    _salvarPerfilMedico() {
        const perfil = {
            nome: document.getElementById('atestMedNome')?.value.trim() || '',
            crm: document.getElementById('atestMedCRM')?.value.trim() || '',
            uf: document.getElementById('atestMedUF')?.value || '',
            especialidade: document.getElementById('atestMedEspecialidade')?.value.trim() || '',
            cidade: document.getElementById('atestMedCidade')?.value.trim() || '',
        };
        localStorage.setItem('doctor_profile', JSON.stringify(perfil));
        this._carregarPerfilMedicoNoModal();
        const form = document.getElementById('atestPerfilForm');
        if (form) form.classList.add('hidden');
        if (window.UI) window.UI.showSuccess('Dados do médico salvos!');
    }
```

---

## Edge Cases & Safeguards

| Risk | Safeguard |
|---|---|
| Doctor profile not set | Fields display `______` placeholder lines — certificate is still valid as a template |
| Days field left blank or zero | `parseInt()` falls back to `1` |
| Date field cleared | Falls back to today via `new Date().toISOString().split('T')[0]` |
| "Acompanhante" name not filled | Falls back to `______` placeholder |
| Print called before generation | "Imprimir" button is `hidden` until after `gerarAtestado()` runs |
| `printArea` div not found | `window.print()` is not called — condition guards it |

---

---

# 3. Receituário Imprimível

## Overview
The physician clicks "Receituário" and sees a print-ready prescription pre-populated from `medicamentosSelecionados`. Doctor profile is reused from `localStorage` key `doctor_profile` (shared with Atestado). If no medications are selected, a friendly message prompts the user to open the Medicamentos tool first. Clicking "Imprimir / PDF" calls `window.print()`.

## Files to Modify
| File | Change |
|---|---|
| `index.html` | Add modal `#modalReceituario` |
| `js/main.js` | Add `abrirModalReceituario()` method |

> The `@media print` block and `#printArea` div were already added in Feature 2 (Atestado). Do not duplicate them.

---

## Step 1 — `index.html`: Add modal `#modalReceituario`

Add after the `#modalAtestado` closing `</div>`:

```html
<!-- Modal: Receituário -->
<div id="modalReceituario" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
  <div class="modal-content bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
    <div class="flex items-center justify-between p-5 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-900">💊 Receituário</h3>
      <button onclick="window.UI.fecharModal('modalReceituario')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
    </div>
    <div class="flex-1 overflow-y-auto p-5">
      <div id="recConteudo" class="text-sm text-gray-700 space-y-4"></div>
    </div>
    <div class="p-5 border-t border-gray-100 flex justify-between items-center">
      <button onclick="window.UI.fecharModal('modalReceituario')"
        class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">Fechar</button>
      <div class="flex gap-2" id="recBotoesAcao">
        <!-- populated by JS -->
      </div>
    </div>
  </div>
</div>
```

---

## Step 2 — `js/main.js`: Add `abrirModalReceituario()`

```javascript
    abrirModalReceituario() {
        const conteudoEl = document.getElementById('recConteudo');
        const botoesEl = document.getElementById('recBotoesAcao');
        if (!conteudoEl || !botoesEl) return;

        const meds = this.medicamentosSelecionados || [];

        if (meds.length === 0) {
            conteudoEl.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <p class="text-4xl mb-3">💊</p>
                    <p class="font-medium text-gray-600">Nenhum medicamento selecionado</p>
                    <p class="text-sm mt-1">Abra "Medicamentos" nas Ferramentas Rápidas, selecione os medicamentos e volte aqui.</p>
                </div>`;
            botoesEl.innerHTML = '';
            if (window.UI) window.UI.abrirModal('modalReceituario');
            return;
        }

        const perfil = this._carregarPerfilMedico();
        const dados = this.coletarDadosPaciente();
        const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

        // Build prescription text for print
        const medLinhas = meds.map((m, i) => {
            let linha = `${i + 1}. ${m.nome || 'Medicamento'}`;
            if (m.generico && m.generico !== m.nome) linha += ` (${m.generico})`;
            if (m.vias && m.vias.length > 0) {
                const via = m.vias[0]; // primary route
                const partes = [];
                if (via.via) partes.push(via.via);
                if (via.dose) partes.push(via.dose);
                if (via.intervalo) partes.push(via.intervalo);
                if (via.max) partes.push(`máx. ${via.max}`);
                if (partes.length > 0) linha += `\n   ${partes.join(' | ')}`;
                if (via.obs) linha += `\n   Obs: ${via.obs}`;
            }
            return linha;
        }).join('\n\n');

        const recTexto = [
            perfil.nome ? `Dr(a). ${perfil.nome}` : '________________________________',
            perfil.crm ? `CRM-${perfil.uf || 'XX'} ${perfil.crm}` : '',
            perfil.especialidade || '',
            '',
            '─'.repeat(48),
            '',
            'RECEITUÁRIO SIMPLES',
            '',
            `Paciente: ${dados.nome || '________________________________'}`,
            dados.idade ? `Idade: ${dados.idade}` : '',
            `Data: ${hoje}`,
            '',
            '─'.repeat(48),
            '',
            medLinhas,
            '',
            '─'.repeat(48),
            '',
            `${perfil.cidade || '_______________'}, ${hoje}`,
            '',
            '',
            '________________________________',
            'Assinatura e carimbo'
        ].filter(l => l !== null && l !== undefined).join('\n');

        // Render preview
        conteudoEl.innerHTML = `<pre class="whitespace-pre-wrap font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl p-4 leading-relaxed">${recTexto}</pre>`;

        // Buttons
        botoesEl.innerHTML = `
            <button id="recBtnCopiar" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm transition-colors">📋 Copiar</button>
            <button id="recBtnImprimir" class="px-6 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 text-sm font-semibold transition-colors">🖨️ Imprimir / PDF</button>`;

        document.getElementById('recBtnCopiar')?.addEventListener('click', async () => {
            await navigator.clipboard.writeText(recTexto).catch(() => {});
            const btn = document.getElementById('recBtnCopiar');
            if (btn) { btn.textContent = '✅ Copiado!'; setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000); }
        });

        document.getElementById('recBtnImprimir')?.addEventListener('click', () => {
            const printArea = document.getElementById('printArea');
            if (printArea) {
                printArea.innerHTML = `<pre style="font-family:'Courier New',monospace;white-space:pre-wrap;font-size:11pt;line-height:1.8">${recTexto}</pre>`;
                printArea.style.display = 'block';
                window.print();
                printArea.style.display = 'none';
                printArea.innerHTML = '';
            }
        });

        if (window.UI) window.UI.abrirModal('modalReceituario');
    }
```

---

## Edge Cases & Safeguards

| Risk | Safeguard |
|---|---|
| No medications selected | Shows an empty-state message instead of a blank prescription |
| Medication with no routes (`vias`) | Outer `if (m.vias && m.vias.length > 0)` guard skips the route block |
| Doctor profile not configured | All doctor fields render as blank signature lines |
| `printArea` not present in DOM | `window.print()` is guarded by `if (printArea)` |
| "Copiar" clicked after prescription is regenerated | Button is re-created each time `abrirModalReceituario()` runs, always referencing the freshest `recTexto` via closure |

---

---

# 4. Interpretador de Exames

## Overview
The physician pastes raw laboratory/imaging results into a textarea and clicks "Interpretar". The AI returns a structured clinical interpretation in the context of the current patient — identifying abnormal values, correlating them with the clinical picture, and suggesting follow-up. The interpretation is produced in formal medical Portuguese.

## Files to Modify
| File | Change |
|---|---|
| `index.html` | Add modal `#modalInterpretador` |
| `js/main.js` | Add `abrirModalInterpretador()` + `interpretarExames()` methods |

---

## Step 1 — `index.html`: Add modal `#modalInterpretador`

Add after `#modalReceituario`:

```html
<!-- Modal: Interpretador de Exames -->
<div id="modalInterpretador" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
  <div class="modal-content bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
    <div class="flex items-center justify-between p-5 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-900">🔬 Interpretador de Exames</h3>
      <button onclick="window.UI.fecharModal('modalInterpretador')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
    </div>
    <div class="flex-1 overflow-y-auto p-5 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Cole aqui os resultados de exames
          <span class="text-gray-400 font-normal ml-1">(laudo, hemograma, bioquímica, imagem...)</span>
        </label>
        <textarea id="interpResultados" rows="8"
          placeholder="Ex:&#10;Hemograma - Hb: 9,2 g/dL (VR: 12–16) | Htc: 28% | Leuc: 11.200 | Plaq: 180.000&#10;Glicemia jejum: 187 mg/dL&#10;TSH: 0,08 mUI/L (VR: 0,4–4,0)&#10;..."
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"></textarea>
      </div>
      <!-- Status -->
      <div id="interpStatus" class="hidden bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
        <div class="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin flex-shrink-0"></div>
        <span class="text-sm text-orange-700">Interpretando exames...</span>
      </div>
      <!-- Result -->
      <div id="interpResultadoDiv" class="hidden space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">Interpretação clínica</label>
          <button id="interpBtnCopiar" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">📋 Copiar</button>
        </div>
        <textarea id="interpResultado" rows="12"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none bg-orange-50/30"></textarea>
      </div>
    </div>
    <div class="p-5 border-t border-gray-100 flex justify-between items-center">
      <button onclick="window.UI.fecharModal('modalInterpretador')"
        class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">Fechar</button>
      <button id="interpBtnGerar"
        class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
        ✦ Interpretar
      </button>
    </div>
  </div>
</div>
```

---

## Step 2 — `js/main.js`: Add `abrirModalInterpretador()` and `interpretarExames()`

```javascript
    abrirModalInterpretador() {
        // Reset from previous use
        const statusEl = document.getElementById('interpStatus');
        const resultDiv = document.getElementById('interpResultadoDiv');
        if (statusEl) statusEl.classList.add('hidden');
        if (resultDiv) resultDiv.classList.add('hidden');

        // Wire "Interpretar" button — replace to avoid listener accumulation
        const btn = document.getElementById('interpBtnGerar');
        if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => this.interpretarExames());
        }

        // Wire copy button
        const btnCopiar = document.getElementById('interpBtnCopiar');
        if (btnCopiar) {
            const newBtn = btnCopiar.cloneNode(true);
            btnCopiar.parentNode.replaceChild(newBtn, btnCopiar);
            newBtn.addEventListener('click', async () => {
                const txt = document.getElementById('interpResultado')?.value;
                if (txt) {
                    await navigator.clipboard.writeText(txt).catch(() => {});
                    newBtn.textContent = '✅ Copiado!';
                    setTimeout(() => { newBtn.textContent = '📋 Copiar'; }, 2000);
                }
            });
        }

        if (window.UI) window.UI.abrirModal('modalInterpretador');
    }

    async interpretarExames() {
        const resultadosEl = document.getElementById('interpResultados');
        const statusEl = document.getElementById('interpStatus');
        const resultadoDiv = document.getElementById('interpResultadoDiv');
        const resultadoTxt = document.getElementById('interpResultado');
        const btnGerar = document.getElementById('interpBtnGerar');

        const resultados = resultadosEl?.value.trim() || '';
        if (!resultados) {
            alert('Cole os resultados de exames antes de interpretar.');
            return;
        }

        const dados = this.coletarDadosPaciente();

        let prompt = `Analise os resultados de exames abaixo no contexto clínico deste paciente e forneça uma interpretação clínica objetiva em português brasileiro.\n\n`;
        prompt += `DADOS DO PACIENTE:\n`;
        prompt += `Paciente: ${dados.nome || 'Não informado'}, ${dados.idade || 'idade não informada'}, ${dados.sexo || 'sexo não informado'}\n`;
        if (dados.queixa) prompt += `Queixa principal: ${dados.queixa}\n`;
        if (dados.antecedentes) prompt += `Antecedentes pessoais: ${dados.antecedentes}\n`;
        if (dados.medicacoesUso) prompt += `Medicações em uso: ${dados.medicacoesUso}\n`;
        if (dados.alergias) prompt += `Alergias: ${dados.alergias}\n`;
        prompt += `\nRESULTADOS DE EXAMES SUBMETIDOS PARA INTERPRETAÇÃO:\n${resultados}\n\n`;
        prompt += `INSTRUÇÕES PARA A INTERPRETAÇÃO:
- Escreva em português brasileiro, linguagem médica formal
- Estruture a resposta obrigatoriamente em 4 seções:
  EXAMES NORMAIS: (liste apenas os que estão dentro dos valores de referência)
  EXAMES ALTERADOS: (para cada alterado: cite o valor encontrado, valor de referência se disponível, e significado clínico em 1–2 frases)
  CORRELAÇÃO CLÍNICA: (integre os achados com o quadro clínico do paciente — conecte as alterações entre si e com os antecedentes e queixa)
  SUGESTÕES: (exames complementares pertinentes ou condutas imediatas baseadas nos achados, se aplicável)
- NÃO use markdown (sem ** ou *)
- Use hífens (-) para listas dentro de cada seção
- Se algum resultado está incompleto (sem valor de referência), interprete com base nos valores normais padrão para a faixa etária
- Se não houver exames alterados, escreva "Nenhuma alteração significativa identificada" nessa seção
- Máximo 500 palavras no total`;

        if (statusEl) statusEl.classList.remove('hidden');
        if (resultadoDiv) resultadoDiv.classList.add('hidden');
        if (btnGerar) { btnGerar.disabled = true; btnGerar.textContent = 'Interpretando...'; }

        try {
            const resultado = await window.API.gerarProntuario(prompt);
            if (resultadoTxt) resultadoTxt.value = resultado;
            if (resultadoDiv) resultadoDiv.classList.remove('hidden');
        } catch (err) {
            alert(`Erro ao interpretar exames: ${err.message}`);
        } finally {
            if (statusEl) statusEl.classList.add('hidden');
            if (btnGerar) { btnGerar.disabled = false; btnGerar.textContent = '✦ Interpretar'; }
        }
    }
```

---

## Edge Cases & Safeguards

| Risk | Safeguard |
|---|---|
| Textarea is empty on submit | Guard check + `alert()` before any API call |
| Partial/unformatted lab data | Prompt instructs AI to use standard reference values when not provided |
| Patient fields are empty | Prompt gracefully includes `'Não informado'` — AI still interprets the labs in isolation |
| API error | `try/catch` restores button state and shows `alert()` |

---

---

# 5. Resumo para o Paciente

## Overview
After a prontuário is generated, a new button "📝 Resumo p/ Paciente" appears in the result area (next to "Copiar" and "Salvar"). Clicking it opens a modal where the AI generates a patient-friendly summary: simple language, no unexplained jargon, explains what was found, what each medication is for, key warnings, and when to return. Ideal for printing and handing to the patient, or for copying into a messaging app.

## Files to Modify
| File | Change |
|---|---|
| `index.html` | Add "Resumo p/ Paciente" button in result area + modal `#modalResumoPaciente` |
| `js/main.js` | Add `abrirModalResumoPaciente()` + `gerarResumoPaciente()` methods |

---

## Step 1 — `index.html`: Add button in result area

Locate exactly:
```html
          <button id="btnSalvar" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            💾 Salvar
          </button>
```

Add immediately after it (still inside the same `<div class="flex items-center gap-2">`):
```html
          <button id="btnResumoPaciente" class="text-xs px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors">
            📝 Resumo p/ Paciente
          </button>
```

---

## Step 2 — `index.html`: Add modal `#modalResumoPaciente`

Add after `#modalInterpretador`:

```html
<!-- Modal: Resumo para o Paciente -->
<div id="modalResumoPaciente" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
  <div class="modal-content bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
    <div class="flex items-center justify-between p-5 border-b border-gray-100">
      <div>
        <h3 class="text-lg font-bold text-gray-900">📝 Resumo para o Paciente</h3>
        <p class="text-xs text-gray-400 mt-0.5">Linguagem simples — para entregar ou enviar ao paciente</p>
      </div>
      <button onclick="window.UI.fecharModal('modalResumoPaciente')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
    </div>
    <div class="flex-1 overflow-y-auto p-5 space-y-4">
      <!-- Status -->
      <div id="resumoStatus" class="hidden bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-3">
        <div class="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin flex-shrink-0"></div>
        <span class="text-sm text-indigo-700">Gerando resumo para o paciente...</span>
      </div>
      <!-- Result -->
      <div id="resumoResultadoDiv" class="space-y-2">
        <textarea id="resumoResultado" rows="16" readonly
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-indigo-50/20 resize-none leading-relaxed"></textarea>
      </div>
    </div>
    <div class="p-5 border-t border-gray-100 flex justify-between items-center">
      <button onclick="window.UI.fecharModal('modalResumoPaciente')"
        class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">Fechar</button>
      <div class="flex gap-2">
        <button id="resumoBtnCopiar" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm transition-colors">📋 Copiar</button>
        <button id="resumoBtnImprimir" class="px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-900 text-sm transition-colors">🖨️ Imprimir</button>
        <button id="resumoBtnGerar"
          class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
          ✦ Gerar Resumo
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## Step 3 — `js/main.js`: Wire button in `setupEventListeners()`

Locate the existing `btnSalvar` listener:
```javascript
        const btnSalvar = document.getElementById('btnSalvar');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => this.salvarProntuario());
        }
```

Add immediately after:
```javascript
        const btnResumoPaciente = document.getElementById('btnResumoPaciente');
        if (btnResumoPaciente) {
            btnResumoPaciente.addEventListener('click', () => this.abrirModalResumoPaciente());
        }
```

---

## Step 4 — `js/main.js`: Add `abrirModalResumoPaciente()` and `gerarResumoPaciente()`

```javascript
    abrirModalResumoPaciente() {
        const prontuario = document.getElementById('resultadoProntuario')?.value.trim() || '';
        if (!prontuario) {
            alert('Gere um prontuário primeiro antes de criar o resumo para o paciente.');
            return;
        }

        // Reset modal state
        const statusEl = document.getElementById('resumoStatus');
        const resultadoTxt = document.getElementById('resumoResultado');
        if (statusEl) statusEl.classList.add('hidden');
        if (resultadoTxt) resultadoTxt.value = '';

        // Wire buttons — cloneNode prevents listener accumulation
        const btnGerar = document.getElementById('resumoBtnGerar');
        if (btnGerar) {
            const newBtn = btnGerar.cloneNode(true);
            btnGerar.parentNode.replaceChild(newBtn, btnGerar);
            newBtn.addEventListener('click', () => this.gerarResumoPaciente());
        }

        const btnCopiar = document.getElementById('resumoBtnCopiar');
        if (btnCopiar) {
            const newBtn = btnCopiar.cloneNode(true);
            btnCopiar.parentNode.replaceChild(newBtn, btnCopiar);
            newBtn.addEventListener('click', async () => {
                const txt = document.getElementById('resumoResultado')?.value;
                if (txt) {
                    await navigator.clipboard.writeText(txt).catch(() => {});
                    newBtn.textContent = '✅ Copiado!';
                    setTimeout(() => { newBtn.textContent = '📋 Copiar'; }, 2000);
                }
            });
        }

        const btnImprimir = document.getElementById('resumoBtnImprimir');
        if (btnImprimir) {
            const newBtn = btnImprimir.cloneNode(true);
            btnImprimir.parentNode.replaceChild(newBtn, btnImprimir);
            newBtn.addEventListener('click', () => {
                const txt = document.getElementById('resumoResultado')?.value || '';
                const printArea = document.getElementById('printArea');
                if (printArea && txt) {
                    printArea.innerHTML = `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;font-size:12pt;line-height:1.8">${txt}</pre>`;
                    printArea.style.display = 'block';
                    window.print();
                    printArea.style.display = 'none';
                    printArea.innerHTML = '';
                }
            });
        }

        if (window.UI) window.UI.abrirModal('modalResumoPaciente');

        // Auto-generate on open (saves one click since the user explicitly opened the modal)
        setTimeout(() => this.gerarResumoPaciente(), 100);
    }

    async gerarResumoPaciente() {
        const prontuario = document.getElementById('resultadoProntuario')?.value.trim() || '';
        const statusEl = document.getElementById('resumoStatus');
        const resultadoTxt = document.getElementById('resumoResultado');
        const btnGerar = document.getElementById('resumoBtnGerar');
        const dados = this.coletarDadosPaciente();

        if (!prontuario) {
            alert('Prontuário não encontrado. Gere o prontuário primeiro.');
            return;
        }

        let prompt = `Com base no prontuário médico abaixo, escreva um RESUMO DA CONSULTA para o PACIENTE, em português brasileiro.\n\n`;
        prompt += `NOME DO PACIENTE: ${dados.nome || 'Paciente'}\n\n`;
        prompt += `PRONTUÁRIO MÉDICO:\n${prontuario}\n\n`;
        prompt += `INSTRUÇÕES OBRIGATÓRIAS:
- Escreva em linguagem SIMPLES, acessível a pessoas sem formação médica
- Se precisar usar um termo médico, explique imediatamente entre parênteses — ex: "hipertensão (pressão alta)"
- Tom: acolhedor, respeitoso, direto — use "Seu médico avaliou..." ou "Foi identificado..."
- NÃO use markdown (sem ** ou *)
- NÃO copie trechos do prontuário — reescreva em linguagem do paciente
- Estrutura obrigatória (sem títulos em maiúsculas, apenas parágrafos curtos):
  1. Abertura: cumprimentar pelo nome e dizer o que foi avaliado hoje (1–2 frases)
  2. O que foi encontrado: diagnóstico ou suspeita principal em linguagem simples
  3. Tratamento prescrito: para cada medicamento, citar nome + para que serve + como tomar (em linguagem simples)
  4. Orientações importantes: 2–4 pontos principais (dieta, repouso, sinais de alerta para retornar)
  5. Próximos passos: quando retornar e o que trazer (exames, etc.)
- Máximo 280 palavras
- Terminar com: "Em caso de dúvidas, entre em contato com seu médico."`;

        if (statusEl) statusEl.classList.remove('hidden');
        if (resultadoTxt) resultadoTxt.value = '';
        if (btnGerar) { btnGerar.disabled = true; btnGerar.textContent = 'Gerando...'; }

        try {
            const resultado = await window.API.gerarProntuario(prompt);
            if (resultadoTxt) resultadoTxt.value = resultado;
        } catch (err) {
            alert(`Erro ao gerar resumo: ${err.message}`);
        } finally {
            if (statusEl) statusEl.classList.add('hidden');
            if (btnGerar) { btnGerar.disabled = false; btnGerar.textContent = '✦ Gerar Resumo'; }
        }
    }
```

---

## Edge Cases & Safeguards

| Risk | Safeguard |
|---|---|
| Button clicked before prontuário is generated | Guard at top of `abrirModalResumoPaciente()` checks `resultadoProntuario` value and shows `alert()` |
| Auto-generation fails on open | `setTimeout(() => this.gerarResumoPaciente(), 100)` failure only affects the textarea; the modal still opens and the user can click "Gerar Resumo" manually |
| Prontuário is very long (>4000 chars) — token usage | Prompt is sent to the same `window.API.gerarProntuario()` with `max_tokens: 8000` — the prontuário input fits within context |
| Copy before result is generated | `navigator.clipboard.writeText('')` is a no-op; button text stays "Copiar" |
| Print before result | `if (txt)` guard prevents printing an empty `printArea` |
| User clicks "Gerar Resumo" again to regenerate | Works correctly — previous result is overwritten |

---

---

## Cross-Feature Notes

### Script load order (no change needed)
All new methods are added to existing classes (`ProntuarioApp` in `main.js`, `UIManager` in `ui.js`). No new `.js` files are created by these prompts. The existing script load order in `index.html` is preserved.

### Modal CSS (`.modal.aberto`)
All new modals use the same `class="modal fixed inset-0 ..."` pattern. The existing CSS rule that shows `.modal.aberto { display: flex; }` applies automatically — no new CSS needed.

### `window.API.gerarProntuario(prompt)` reuse
Features 1, 4, and 5 all call `window.API.gerarProntuario(prompt)` — the same method used for the main prontuário. This means all configured AI providers (DeepSeek, Anthropic, OpenAI, Groq, OpenRouter) work out of the box for all three features.

### `doctor_profile` localStorage key
Features 2 (Atestado) and 3 (Receituário) share the same `_carregarPerfilMedico()` helper and `localStorage` key `doctor_profile`. The doctor fills in their data once and both features use it.

### `cloneNode(true)` pattern
Every modal that wires button listeners uses `cloneNode(true)` on the button before attaching a new `addEventListener`. This prevents listener accumulation when the same modal is opened multiple times in a session — a common source of bugs in vanilla JS SPAs without a framework.
