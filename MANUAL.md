# 🏥 MANUAL DO SISTEMA - Prontuário Médico IA
## 📋 Documentação Completa para Inteligência Artificial

**Última Atualização:** 2026-04-15  
**Versão do Sistema:** 2.0  
**Propósito:** Sistema para geração automatizada de prontuários médicos com IA  
**Público-alvo:** Desenvolvedores, mantenedores, IAs assistentes  

---

## 📑 ÍNDICE ESTRUTURADO PARA IA

### 🏗️ ARQUITETURA DO SISTEMA
1. [📁 ESTRUTURA COMPLETA DE ARQUIVOS](#-estrutura-completa-de-arquivos)
2. [🎯 VISÃO GERAL DO SISTEMA](#-visão-geral-do-sistema)
3. [🔧 TECNOLOGIAS E DEPENDÊNCIAS](#-tecnologias-e-dependências)

### 📄 ANÁLISE DETALHADA POR ARQUIVO
4. [📄 index.html - Interface Principal](#-indexhtml---interface-principal)
5. [🐍 server.py - Servidor Backend](#-serverpy---servidor-backend)
6. [📊 data/templates.json - Templates Médicos](#-datatemplatesjson---templates-médicos)

### 🧠 MÓDULOS JAVASCRIPT
7. [⚙️ js/main.js - Núcleo da Aplicação](#️-jsmainjs---núcleo-da-aplicação)
8. [🔧 js/template_engine.js - Motor de Templates](#-jstemplate_enginejs---motor-de-templates)
9. [🤖 js/instrucoes_ia.js - Regras para IA](#-jsinstrucoes_iajs---regras-para-ia)
10. [🔄 js/api.js - Comunicação com API](#-jsapijs---comunicação-com-api)
11. [💊 js/medicamentos.js - Gerenciamento de Medicamentos](#-jsmedicamentosjs---gerenciamento-de-medicamentos)
12. [🩺 js/exame_fisico.js - Exame Físico](#-jsexame_fisicojs---exame-físico)
13. [🔬 js/exames_complementares.js - Exames Complementares](#-jsexames_complementaresjs---exames-complementares)
14. [📋 js/orientacoes_alta.js - Orientações de Alta](#-jsorientacoes_altajs---orientações-de-alta)
15. [🎨 js/ui.js - Componentes de Interface](#-jsuijs---componentes-de-interface)
16. [🔐 js/auth.js - Autenticação (Futuro)](#-jsauthjs---autenticação-futuro)

### 🛠️ UTILITÁRIOS E CONFIGURAÇÕES
17. [⚙️ api_config.txt - Configuração da API](#️-api_configtxt---configuração-da-api)
18. [🚀 start.bat / start.sh - Scripts de Inicialização](#-startbat--startsh---scripts-de-inicialização)
19. [📁 historico_prontuarios/ - Armazenamento Local](#-historico_prontuarios---armazenamento-local)

### 🧪 ARQUIVOS DE TESTE
20. [🧪 Arquivos de Teste](#-arquivos-de-teste)

### 📚 GUIAS DE MANUTENÇÃO
21. [🔍 COMO ADICIONAR NOVA FUNCIONALIDADE](#-como-adicionar-nova-funcionalidade)
22. [🐛 SOLUÇÃO DE PROBLEMAS](#-solução-de-problemas)
23. [📈 OTIMIZAÇÃO E PERFORMANCE](#-otimização-e-performance)
24. [🔒 SEGURANÇA E PRIVACIDADE](#-segurança-e-privacidade)
25. [📋 CONVENÇÕES DE CÓDIGO](#-convenções-de-código)

---

## 📁 ESTRUTURA COMPLETA DE ARQUIVOS

### 📍 RAÍZ DO PROJETO
```
SalvaAmbuDS/
├── 📄 index.html                    # Interface principal do usuário (47.2KB)
├── 🐍 server.py                     # Servidor Python http.server (12.9KB)
├── 📚 MANUAL.md                    # Este manual de documentação
├── ⚙️ api_config.txt               # Configuração da API DeepSeek
├── 🚀 start.bat                    # Script de inicialização Windows
├── 🚀 start.sh                     # Script de inicialização Linux/Mac
├── 📝 FIX_SUMMARY.md               # Resumo de correções anteriores
└── 📁 .claude/                     # Configurações do Claude Code
    └── settings.local.json
```

### 📁 data/ - DADOS E CONFIGURAÇÕES
```
data/
└── 📊 templates.json              # Templates médicos em JSON (9 templates)
```

### 📁 js/ - MÓDULOS JAVASCRIPT
```
js/
├── ⚙️ main.js                     # Lógica principal da aplicação
├── 🔧 template_engine.js          # Motor de processamento de templates
├── 🤖 instrucoes_ia.js           # Regras e instruções para IA
├── 🔄 api.js                      # Comunicação com API backend
├── 💊 medicamentos.js             # Gerenciamento de medicamentos
├── 🩺 exame_fisico.js             # Componente de exame físico
├── 🔬 exames_complementares.js    # Gerenciamento de exames
├── 📋 orientacoes_alta.js         # Orientações de alta médica
├── 🎨 ui.js                       # Componentes de interface
└── 🔐 auth.js                     # Autenticação (implementação futura)
```

### 📁 historico_prontuarios/ - ARMAZENAMENTO
```
historico_prontuarios/
├── 📄 prontuario_1776127152.txt   # Prontuários salvos (timestamp)
├── 📄 prontuario_1776127286.txt
├── 📄 prontuario_1776129553.txt
└── 📄 prontuario_1776134679.txt
```

### 🧪 test/ - ARQUIVOS DE TESTE
```
test_exames_fix.html              # Teste de correção de exames
test_modal.html                   # Teste de modais
test_modal_fix.html              # Teste de correção de modais
test_modal_structure.html        # Teste de estrutura de modais
test_template_instructions.html  # Teste da nova funcionalidade
```

---

## 🎯 VISÃO GERAL DO SISTEMA

### 🎯 PROPÓSITO PRINCIPAL
Sistema web para geração automatizada de prontuários médicos utilizando inteligência artificial, com foco em:
- **Eficiência:** Redução do tempo de documentação médica
- **Padronização:** Templates estruturados por especialidade
- **Qualidade:** Instruções específicas para IA gerar conteúdo médico preciso
- **Armazenamento:** Histórico local de prontuários gerados

### 🔄 FLUXO DE TRABALHO
1. **Entrada de Dados:** Médico preenche formulário com dados do paciente
2. **Seleção de Template:** Escolha de especialidade e template específico
3. **Processamento IA:** Geração do prontuário usando DeepSeek API
4. **Revisão e Ajuste:** Médico revisa e edita o prontuário gerado
5. **Armazenamento:** Salva localmente no histórico

### 👥 PERSONAS DO SISTEMA
- **Médico Usuário:** Preenche formulário, seleciona templates, revisa prontuários
- **Administrador:** Configura templates, gerencia histórico, atualiza sistema
- **IA Assistente:** Processa dados e gera conteúdo estruturado

---

## 🔧 TECNOLOGIAS E DEPENDÊNCIAS

### 🎨 FRONTEND
- **HTML5:** Estrutura semântica da interface
- **CSS3 (Tailwind CSS):** Estilização utility-first responsiva
- **JavaScript ES6+:** Lógica de interação do cliente
- **Fontes:** Inter (sistema), monospace para código

### ⚙️ BACKEND
- **Python 3.8+:** Linguagem do servidor
- **http.server:** Servidor HTTP Python padrão
- **Requests:** Comunicação HTTP com APIs externas

### 🔌 APIs EXTERNAS
- **DeepSeek API:** Geração de conteúdo com IA
- **Modelo padrão:** `deepseek-chat`
- **Autenticação:** Chave API em `api_config.txt`

### 📦 DEPENDÊNCIAS PYTHON
```python
# Bibliotecas padrão do Python 3.8+
# Nenhuma instalação adicional necessária

# Para uso com alguns provedores de IA pode ser necessário:
# pip install requests
```

### 🛠️ FERRAMENTAS DE DESENVOLVIMENTO
- **Editor:** Qualquer editor de texto/IDE
- **Terminal:** Bash (Linux/Mac) ou PowerShell (Windows)
- **Navegador:** Chrome/Firefox/Edge modernos
- **Git:** Controle de versão (opcional)

---

## 📄 index.html - INTERFACE PRINCIPAL

### 📏 ESTATÍSTICAS
- **Tamanho:** 47.2KB
- **Linhas:** ~1200 linhas (estimado)
- **Elementos:** ~150 elementos HTML
- **Scripts:** 9 arquivos JavaScript
- **Estilos:** Tailwind CSS inline

### 🏗️ ESTRUTURA DA PÁGINA

#### 1. 🎪 CABEÇALHO (Header)
- **Logo:** "SalvaAmbuDS" com ícone de cruz médica
- **Subtítulo:** "Prontuário IA • Gerador Automático de Documentação Médica"
- **Modo Escuro:** Botão toggle com ícone de lua/sol

#### 2. 📋 FORMULÁRIO PRINCIPAL
**Seção A: Dados do Paciente**
```html
<!-- IDs dos elementos principais -->
nomePaciente, idadePaciente, sexoPaciente, profissaoPaciente, naturalidadePaciente
queixaPrincipal, anamnesePaciente
```

**Seção B: Seleção de Template**
```html
<!-- Dropdowns interativos -->
especialidade (select) → Carrega templates dinamicamente
templateSelecionado (select) → Mostra instruções do template
chipIA (span) → Indicador visual do template selecionado
```

**Seção C: Anamnese e Instruções** ⭐ **NOVA FUNCIONALIDADE**
```html
<!-- Container de instruções dinâmicas (implementado 2026-04-14) -->
<div id="templateInstructions" class="hidden">
  <div id="templateInstructionsContent">
    <!-- Instruções do template carregadas dinamicamente -->
  </div>
</div>
```

#### 3. 🛠️ BARRA DE FERRAMENTAS
**Botões de Modal:**
- `btnMedicamentos` → `modalMedicamentos`
- `btnExameFisico` → `modalExameFisico`
- `btnExames` → `modalExames`
- `btnOrientacoes` → `modalOrientacoes`
- `btnCalculadoras` → `modalCalculadoras`

**Cronômetro:**
- `btnIniciarCrono`, `btnPararCrono`, `displayCronometro`

#### 4. ⚡ GERADOR DE PRONTUÁRIO
**Controles:**
- `btnGerarProntuario` → Inicia geração
- `statusGeracao` → Container de status
- `barraProgresso` → Barra de progresso animada

**Resultado:**
- `resultadoProntuario` → Textarea com prontuário gerado
- `btnCopiar` → Copia para clipboard
- `btnSalvar` → Salva no histórico
- `btnLimpar` → Limpa formulário completo

#### 5. 🎨 MODAIS (Overlays)
Cada modal segue estrutura similar:
```html
<div id="modalNOME" class="modal hidden">
  <div class="modal-content">...</div>
</div>
```

### 🎯 COMPORTAMENTOS CHAVE
1. **Auto-save:** Dados salvos automaticamente em `localStorage`
2. **Validação:** Verificação de campos obrigatórios
3. **Feedback visual:** Estados loading, success, error
4. **Responsividade:** Layout adaptável a diferentes telas

### 🔗 DEPENDÊNCIAS DE SCRIPT
```html
<!-- Ordem de carregamento CRÍTICA -->
<script src="js/template_engine.js"></script>
<script src="js/instrucoes_ia.js"></script>
<script src="js/api.js"></script>
<script src="js/medicamentos.js"></script>
<script src="js/exame_fisico.js"></script>
<script src="js/exames_complementares.js"></script>
<script src="js/orientacoes_alta.js"></script>
<script src="js/ui.js"></script>
<script src="js/main.js"></script>
```

---

## 🐍 server.py - SERVIDOR BACKEND

### 📊 ESTATÍSTICAS
- **Tamanho:** 12.9KB
- **Linhas:** ~300 linhas
- **Endpoints:** 7 rotas principais
- **Porta:** 8080
- **Host:** 0.0.0.0 (acessível em rede local)

### 🏗️ ARQUITETURA HTTP.SERVER

#### CONFIGURAÇÃO INICIAL
```python
import http.server
import socketserver

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class ProntuarioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    # Métodos HTTP implementados
    def do_GET(self):    # GET: status, histórico, templates
    def do_POST(self):   # POST: gerar, salvar, limpar
```

#### 📁 ESTRUTURA DE DIRETÓRIOS SERVIDA
- `/` → `index.html`
- `/js/*` → Arquivos JavaScript
- `/data/*` → Arquivos de dados
- `/historico_prontuarios/*` → Prontuários salvos

### 🔌 ENDPOINTS DA API

#### 1. 🏠 ROTA PRINCIPAL
- **URL:** `/` ou `/index.html`
- **Método:** GET
- **Resposta:** Serve o arquivo `index.html` estático

#### 2. 🤖 GERAÇÃO DE PRONTUÁRIO (POST `/api/gerar-prontuario`)
**Parâmetros:**
- `prompt` (string): Prompt formatado para IA
- `model` (string, opcional): Modelo de IA (padrão: 'deepseek-chat')

**Processamento:**
1. Validação do prompt
2. Chamada à DeepSeek API
3. Processamento da resposta
4. Retorno formatado

**Resposta:**
```json
{
  "sucesso": true,
  "texto": "Prontuário gerado...",
  "erro": null
}
```

#### 3. 📋 CARREGAMENTO DE TEMPLATES (GET `/api/templates`)
**Parâmetros:**
- `especialidade` (string): Nome da especialidade

**Comportamento:**
1. Tenta carregar `templates/{especialidade}.json`
2. Fallback para `data/templates.json`
3. Filtra templates por especialidade

#### 4. 💾 SALVAR PRONTUÁRIO (POST `/api/salvar-prontuario`)
**Parâmetros:**
- `texto` (string): Conteúdo do prontuário
- `dados` (JSON): Metadados do paciente

**Armazenamento:**
- Gera timestamp: `prontuario_{timestamp}.txt`
- Salva em `historico_prontuarios/`
- Inclui metadados como comentário JSON

#### 5. js/exame_fisico.js - BANCO DE DADOS DE ACHADOS NORMAIS DO EXAME FÍSICO

### 📏 ESTATÍSTICAS
- **Tamanho:** ~4KB
- **Sistemas:** 14 sistemas do corpo humano
- **Linhas:** 54 linhas de código
- **Formato:** Objeto JavaScript com propriedades nomeadas
- **Localização:** `js/exame_fisico.js`

### 🏗️ ESTRUTURA DO OBJETO
```javascript
const EF = {
  cardiaco: "Texto detalhado do exame cardiovascular normal...",
  respiratorio: "Texto detalhado do exame respiratório normal...",
  // ... outros sistemas
};
window.ExameFisicoDB = EF;
```

### 🩺 SISTEMAS DISPONÍVEIS
1. **cardiaco** - Aparelho Cardiovascular
2. **respiratorio** - Aparelho Respiratório
3. **abdome** - Abdome
4. **neurologico** - Exame Neurológico Sumário
5. **extremidades** - Extremidades
6. **pele** - Pele e Fâneros
7. **cabeca_pescoto** - Cabeça e Pescoço
8. **linfonodos_detalhado** - Sistema Linfático
9. **aparelho_genitourinario_masc** - Aparelho Geniturinário Masculino
10. **aparelho_genitourinario_fem** - Aparelho Geniturinário Feminino
11. **coluna_vertebral** - Coluna Vertebral
12. **vascular_periferico_detalhado** - Sistema Vascular Periférico
13. **estado_mental_completo** - Exame do Estado Mental
14. **articulacoes_e_osteomuscular** - Sistema Osteoarticular e Muscular

### 📝 CARACTERÍSTICAS DOS TEXTOS
- **Linguagem:** Português médico formal brasileiro
- **Detalhamento:** Descrições completas de achados normais
- **Estrutura:** Cada sistema tem 5-15 linhas de texto
- **Consistência:** Terminologia médica padronizada
- **Uso:** Inserido automaticamente quando sistema é marcado como "normal"

### 🔧 INTEGRAÇÃO COM A INTERFACE
1. **Modal Exame Físico:** Interface permite marcar sistemas como "normal" ou "alterado"
2. **Seleção Normal:** Quando usuário marca sistema como normal, texto correspondente é inserido
3. **Seleção Alterado:** Quando marcado como alterado, campo de texto livre é habilitado
4. **Exportação:** Textos são incluídos no prontuário final gerado pela IA

#### 6. js/exames_complementares.js - BANCO DE DADOS DE EXAMES COMPLEMENTARES

### 📏 ESTATÍSTICAS
- **Tamanho:** ~70KB
- **Exames:** 100+ exames organizados por categoria
- **Linhas:** 1400+ linhas de código
- **Formato:** Array JavaScript de objetos
- **Localização:** `js/exames_complementares.js`

### 🏗️ ESTRUTURA DE UM EXAME
```javascript
{
  nome: "Nome Completo do Exame",
  grupo: "Categoria do Exame",
  indicacoes: ["Indicação 1", "Indicação 2", ...],
  preparo: ["Preparo 1", "Preparo 2", ...],
  contraindicacoes: ["Contraindicação 1", ...],
  tempo: "Tempo para resultado",
  obs: "Observações adicionais"
}
```

### 🏥 CATEGORIAS DE EXAMES
1. **Hematologia** - Hemograma, Coagulograma, etc.
2. **Bioquímica** - Glicemia, Ureia, Creatinina, etc.
3. **Função Hepática** - TGO, TGP, Bilirrubinas, etc.
4. **Inflamatórios e Infecciosos** - PCR, VHS, Sorologias
5. **Cardíaco** - Troponina, CK-MB, BNP
6. **Endócrino** - TSH, T4 Livre, Cortisol
7. **Marcadores Tumorais** - PSA, CEA, CA 19-9
8. **Imagem** - RX, US, TC, RM, PET-CT
9. **Endoscopia** - EDA, Colonoscopia, CPRE
10. **Eletrofisiologia** - ECG, Holter, EEG, EMG

### 📋 CAMPOS DETALHADOS
- **nome:** Nome completo do exame (ex: "Hemograma Completo")
- **grupo:** Categoria para agrupamento na interface
- **indicacoes[]:** Array de indicações clínicas para solicitação
- **preparo[]:** Array de instruções de preparo para o paciente
- **contraindicacoes[]:** Array de contraindicações absolutas/relativas
- **tempo:** Tempo estimado para resultado (ex: "4-6 horas", "24-48 horas")
- **obs:** Observações importantes sobre coleta, interpretação, etc.

### 🔧 INTEGRAÇÃO COM A INTERFACE
1. **Modal Exames:** Interface de busca com filtro por categoria
2. **Busca:** Campo de busca por nome do exame
3. **Seleção:** Usuário seleciona exames para incluir no prontuário
4. **Detalhes:** Modal mostra informações completas do exame selecionado
5. **Exportação:** Nomes dos exames são incluídos no prontuário final

#### 7. js/orientacoes_alta.js - BANCO DE DADOS DE ORIENTAÇÕES DE ALTA

### 📏 ESTATÍSTICAS
- **Tamanho:** ~5KB
- **Condições:** 9 condições médicas com orientações
- **Linhas:** ~150 linhas de código
- **Formato:** Array JavaScript de objetos
- **Localização:** `js/orientacoes_alta.js`

### 🏗️ ESTRUTURA DE UMA CONDIÇÃO
```javascript
{
  condicao: "Nome da Condição",
  orientacoes: ["Orientações 1", "Orientações 2", ...],
  retorno: "Período recomendado para retorno"
}
```

### 🏥 CONDIÇÕES DISPONÍVEIS
1. **Hipertensão Arterial** - Controle pressórico e medicamentos
2. **Diabetes Mellitus** - Controle glicêmico e cuidados
3. **Gastrite/DRGE** - Dieta e medicamentos para refluxo
4. **ITU** - Infecção do Trato Urinário
5. **Pneumonia** - Tratamento e acompanhamento
6. **Asma/DPOC** - Controle de doença respiratória
7. **Dor Lombar** - Manejo de dor e reabilitação
8. **Ansiedade/Depressão** - Saúde mental e acompanhamento
9. **Pós-Operatório Geral** - Cuidados pós-cirúrgicos

### 📋 CAMPOS DETALHADOS
- **condicao:** Nome da condição médica
- **orientacoes[]:** Array de orientações específicas para a condição
- **retorno:** Recomendação de quando retornar (ex: "7-10 dias", "1 mês")

### 🔧 INTEGRAÇÃO COM A INTERFACE
1. **Modal Orientações:** Interface de seleção por condição
2. **Seleção:** Usuário seleciona condição para ver orientações
3. **Personalização:** Orientações podem ser editadas antes de incluir
4. **Exportação:** Orientações são incluídas no prontuário final

#### 8. js/ui.js - GERENCIADOR DE INTERFACE DO USUÁRIO

### 📏 ESTATÍSTICAS
- **Tamanho:** ~80KB
- **Linhas:** 1640+ linhas de código
- **Classe:** UIManager com métodos organizados
- **Localização:** `js/ui.js`

### 🏗️ ESTRUTURA DA CLASSE
```javascript
class UIManager {
  constructor() { ... }
  
  // Métodos de modal
  abrirModalMedicamentos() { ... }
  abrirModalExames() { ... }
  abrirModalExameFisico() { ... }
  abrirModalOrientacoes() { ... }
  abrirModalCalculadoras() { ... }
  
  // Métodos de busca
  buscarMedicamentos(termo) { ... }
  buscarExames(termo) { ... }
  
  // Métodos de calculadora
  calcularIMC() { ... }
  calcularClearanceCreatinina() { ... }
  calcularEscalaGlasgow() { ... }
  calcularEscalaDor() { ... }
  
  // Métodos de notificação
  mostrarNotificacao(mensagem, tipo) { ... }
  mostrarErro(mensagem) { ... }
  mostrarSucesso(mensagem) { ... }
}
window.UI = new UIManager();
```

### 🎯 FUNCIONALIDADES PRINCIPAIS

#### 📦 MODAIS
1. **Modal Medicamentos:** Busca e seleção de 100 medicamentos
2. **Modal Exames:** Busca e seleção de 100+ exames complementares
3. **Modal Exame Físico:** Interface para marcar sistemas como normal/alterado
4. **Modal Orientações:** Seleção de orientações por condição médica
5. **Modal Calculadoras:** 5 calculadoras médicas

#### 🔍 SISTEMA DE BUSCA
- **Busca em tempo real** em todos os bancos de dados
- **Filtro por categoria** para exames
- **Highlight** dos termos encontrados
- **Resultados paginados** para melhor performance

#### 🧮 CALCULADORAS MÉDICAS
1. **IMC** - Índice de Massa Corporal
2. **Clearance de Creatinina** - Fórmula de Cockcroft-Gault
3. **Escala de Coma de Glasgow** - Neurologia
4. **Escala de Dor** - Visual (0-10)
5. **Conversor de Unidades** - mg/dL ↔ mmol/L

#### 🔔 SISTEMA DE NOTIFICAÇÕES
- **Toast notifications** temporárias
- **Tipos:** Sucesso (verde), Erro (vermelho), Info (azul)
- **Posição:** Canto superior direito
- **Duração:** 3 segundos (configurável)

### 🔧 INTEGRAÇÃO COM O SISTEMA
1. **Inicialização:** Instanciada em `main.js` durante carregamento
2. **Eventos:** Controla todos os modais e interações complexas
3. **Estado:** Mantém estado dos modais abertos/fechados
4. **Comunicação:** Integra com `ProntuarioApp` para atualizar dados

#### 9. js/auth.js - GERENCIADOR DE AUTENTICAÇÃO

### 📏 ESTATÍSTICAS
- **Tamanho:** ~2KB
- **Linhas:** ~50 linhas de código
- **Classe:** AuthManager com métodos simples
- **Localização:** `js/auth.js`

### 🏗️ ESTRUTURA DA CLASSE
```javascript
class AuthManager {
  constructor() { ... }
  
  // Métodos de autenticação
  login(username, password) { ... }
  logout() { ... }
  isAuthenticated() { ... }
  getUser() { ... }
  
  // Métodos de permissão
  hasPermission(permission) { ... }
  getPermissions() { ... }
}
window.Auth = new AuthManager();
```

### 🔐 SISTEMA DE AUTENTICAÇÃO
- **Armazenamento:** localStorage para simplicidade
- **Usuários:** Username/password básico
- **Sessão:** Mantém login entre recarregamentos
- **Proteção:** Roteamento básico para páginas protegidas

### 🛡️ PERMISSÕES
- **Níveis:** Básico (usuário) e Admin
- **Controle:** Algumas funcionalidades podem ser restritas
- **Extensível:** Sistema pode ser expandido para mais níveis

### 🔧 INTEGRAÇÃO COM O SISTEMA
1. **Inicialização:** Verifica sessão ao carregar a página
2. **Proteção:** Bloqueia acesso a funcionalidades sem login
3. **UI:** Mostra/esconde elementos baseado em autenticação
4. **API:** Futura integração com backend para autenticação real

---

## 📊 data/templates.json - TEMPLATES MÉDICOS

### 📏 ESTATÍSTICAS
- **Tamanho:** ~5KB
- **Templates:** 9 templates organizados por especialidade
- **Formato:** JSON com estrutura padronizada
- **Localização:** `data/templates.json`

### 🏗️ ESTRUTURA DE UM TEMPLATE
```json
"nome_do_template": {
  "nome": "Nome Amigável para Exibição",
  "especialidade": "soap | clinica_geral | cardiologia | pediatria | ortopedia | ginecologia",
  "descricao": "Descrição breve do propósito do template",
  "instrucoes": "Instruções detalhadas para preenchimento (exibidas dinamicamente)",
  "estrutura": "Texto com placeholders {{NOME}}, {{IDADE}}, {{SEXO}}, etc."
}
```

### 🎯 ESPECIALIDADES DISPONÍVEIS
1. **soap** - Nota SOAP (Subjective, Objective, Assessment, Plan)
2. **clinica_geral** - Clínica Geral
3. **cardiologia** - Cardiologia
4. **pediatria** - Pediatria
5. **ortopedia** - Ortopedia
6. **ginecologia** - Ginecologia

### 🔤 PLACEHOLDERS SUPORTADOS

#### 📋 DADOS BÁSICOS DO PACIENTE
- `{{NOME}}` - Nome completo do paciente
- `{{IDADE}}` - Idade (ex: "45 anos")
- `{{SEXO}}` - Sexo (Masculino/Feminino)
- `{{PROFISSÃO}}` / `{{PROFISSAO}}` - Profissão do paciente
- `{{RESIDÊNCIA}}` / `{{RESIDENCIA}}` - Naturalidade/Residência
- `{{QUEIXA}}` - Queixa principal
- `{{ANAMNESE}}` - História da doença atual (HDA)

#### 📅 DATA E HORA
- `{{DATA}}` - Data atual no formato DD/MM/AAAA
- `{{HORA}}` - Hora atual no formato HH:MM

#### 🩺 SEÇÕES ESPECÍFICAS
- `{{MEDICAMENTOS}}` - Lista de medicamentos prescritos (do modal Medicamentos)
- `{{EXAMES}}` - Exames complementares solicitados (do modal Exames)
- `{{ORIENTACOES}}` - Orientações ao paciente (do modal Orientações)

#### 10. js/main.js - APLICAÇÃO PRINCIPAL

### 📏 ESTATÍSTICAS
- **Tamanho:** ~30KB
- **Linhas:** ~800 linhas de código
- **Classe:** ProntuarioApp com fluxo completo
- **Localização:** `js/main.js`

### 🏗️ ESTRUTURA DA CLASSE
```javascript
class ProntuarioApp {
  constructor() {
    // Inicialização de componentes
    this.api = window.API;           // APIClient
    this.templateEngine = new TemplateEngine();  // TemplateEngine
    this.ui = window.UI;             // UIManager
    this.auth = window.Auth;         // AuthManager
    
    // Estado da aplicação
    this.especialidadeSelecionada = null;
    this.templateSelecionado = null;
    this.dadosPaciente = {};
    this.prontuarioGerado = null;
  }
  
  // Métodos principais
  init() { ... }                     // Inicialização
  carregarTemplatesEspecialidade() { ... }  // Carregar templates
  selecionarTemplate() { ... }       // Selecionar template
  atualizarInstrucoesTemplate() { ... }  // Atualizar instruções
  gerarProntuario() { ... }          // Gerar prontuário com IA
  limparFormulario() { ... }         // Limpar formulário
  salvarProntuario() { ... }         // Salvar no histórico
  exportarProntuario() { ... }       // Exportar como arquivo
}
```

### 🔄 FLUXO PRINCIPAL DA APLICAÇÃO

#### 1. INICIALIZAÇÃO
```javascript
// index.html
document.addEventListener('DOMContentLoaded', () => {
  const app = new ProntuarioApp();
  app.init();
  window.app = app;  // Expor globalmente para debug
});
```

#### 2. SELEÇÃO DE ESPECIALIDADE
1. Usuário seleciona especialidade no dropdown
2. `carregarTemplatesEspecialidade()` é chamado
3. Templates filtrados são carregados no dropdown de templates
4. Instruções são escondidas (container hidden)

#### 3. SELEÇÃO DE TEMPLATE
1. Usuário seleciona template no dropdown
2. `selecionarTemplate()` é chamado
3. `atualizarInstrucoesTemplate()` mostra instruções do template
4. Placeholders são configurados para preenchimento

#### 4. PREENCHIMENTO DO FORMULÁRIO
1. Usuário preenche dados do paciente
2. Usuário abre modais para adicionar: Medicamentos, Exames, Exame Físico, Orientações
3. Dados são acumulados no objeto `dadosPaciente`

#### 5. GERAÇÃO DO PRONTUÁRIO
1. Usuário clica em "Gerar Prontuário"
2. `gerarProntuario()` é chamado
3. TemplateEngine gera prompt completo com instruções da IA
4. APIClient envia para servidor/IA
5. Resultado é exibido na área de texto

#### 6. PÓS-GERAÇÃO
1. Usuário pode editar o prontuário gerado
2. Usuário pode salvar no histórico
3. Usuário pode exportar como TXT ou JSON
4. Usuário pode limpar formulário para novo prontuário

### 🎯 MÉTODOS IMPORTANTES

#### `atualizarInstrucoesTemplate(template)`
- **Propósito:** Mostrar/esconder instruções do template selecionado
- **Localização:** Linhas 222-239
- **Comportamento:**
  - Se template tem `instrucoes`: mostra container com texto
  - Se template não tem `instrucoes`: esconde container
  - Chamado por `selecionarTemplate()` e `limparFormulario()`

#### `limparFormulario()`
- **Propósito:** Limpar todos os campos e resetar estado
- **Localização:** Linhas após 470
- **Ações:**
  - Limpa todos os campos de entrada
  - Reseta dropdowns de especialidade e template
  - Esconde container de instruções
  - Limpa dados acumulados dos modais

#### `selecionarTemplate(nomeTemplate)`
- **Propósito:** Configurar template selecionado
- **Localização:** Linha 214
- **Integração:** Chama `atualizarInstrucoesTemplate()`

### 🔧 INTEGRAÇÃO COM OUTROS MÓDULOS
1. **APIClient:** Comunicação com servidor/IA
2. **TemplateEngine:** Processamento de templates e prompts
3. **UIManager:** Controle de modais e notificações
4. **AuthManager:** Controle de autenticação
5. **Bancos de Dados:** Medicamentos, Exames, Exame Físico, Orientações

#### 11. js/template_engine.js - MOTOR DE PROCESSAMENTO DE TEMPLATES

### 📏 ESTATÍSTICAS
- **Tamanho:** ~5KB
- **Linhas:** ~100 linhas de código
- **Classe:** TemplateEngine com métodos especializados
- **Localização:** `js/template_engine.js`

### 🏗️ ESTRUTURA DA CLASSE
```javascript
class TemplateEngine {
  constructor() {
    this.templates = {};  // Templates carregados
  }
  
  // Métodos principais
  async carregarTemplates(especialidade) { ... }
  getTemplate(nome) { ... }
  aplicarTemplate(template, dados) { ... }
  gerarPromptIA(template, dadosPaciente, conteudoAdicional) { ... }
}
```

### 🔧 MÉTODOS PRINCIPAIS

#### `gerarPromptIA(template, dadosPaciente, conteudoAdicional)`
- **Propósito:** Gerar prompt completo para a IA
- **Localização:** Linhas 301-330
- **Estrutura do Prompt:**
  1. Instruções da IA (de `js/instrucoes_ia.js`)
  2. Instruções específicas do template (`template.instrucoes`)
  3. Dados do paciente (nome, idade, sexo, etc.)
  4. Conteúdo adicional (medicamentos, exames, etc.)
  5. Estrutura do template com placeholders substituídos

#### `aplicarTemplate(template, dados)`
- **Propósito:** Substituir placeholders no template
- **Algoritmo:** Busca por `{{NOME_VARIAVEL}}` e substitui
- **Placeholders suportados:** Todos listados em `data/templates.json`

### 🔗 INTEGRAÇÃO
1. **Chamado por:** `ProntuarioApp.gerarProntuario()`
2. **Usa:** Templates de `data/templates.json`
3. **Inclui:** Instruções de `js/instrucoes_ia.js`
4. **Produz:** Prompt estruturado para a IA

#### 12. js/instrucoes_ia.js - INSTRUÇÕES PARA A IA

### 📏 ESTATÍSTICAS
- **Tamanho:** ~3KB
- **Regras:** 22 regras detalhadas
- **Linhas:** ~80 linhas de código
- **Formato:** Constante JavaScript
- **Localização:** `js/instrucoes_ia.js`

### 🎯 PROPÓSITO
Fornecer instruções específicas para a IA gerar prontuários médicos de alta qualidade, seguindo padrões brasileiros e estrutura SOAP.

### 📋 REGRAS PRINCIPAIS
1. **Idioma:** Português brasileiro formal
2. **Estrutura:** Formato SOAP (Subjetivo, Objetivo, Avaliação, Plano)
3. **Medicamentos:** Incluir posologia completa
4. **Exames:** Listar com indicação clínica
5. **Formatação:** Usar markdown com headers
6. **Siglas:** Explicar na primeira menção
7. **Confidencialidade:** Não inventar dados

### 🔗 INTEGRAÇÃO
- **Incluído em:** Todos os prompts gerados pela IA
- **Posição:** Primeira parte do prompt
- **Combinação:** Junto com instruções específicas do template

#### 13. js/api.js - CLIENTE DE API COM FALLBACK

### 📏 ESTATÍSTICAS
- **Tamanho:** ~10KB
- **Linhas:** ~380 linhas de código
- **Classe:** APIClient com fallback robusto
- **Localização:** `js/api.js`

### 🏗️ ESTRUTURA DA CLASSE
```javascript
class APIClient {
  constructor() {
    this.baseUrl = window.location.origin;
    this.isLocal = window.location.hostname === 'localhost';
  }
  
  // Métodos principais
  async gerarProntuario(prompt) { ... }
  async salvarProntuario(prontuario) { ... }
  async carregarHistorico() { ... }
  async carregarTemplates(especialidade) { ... }
  async verificarServidor() { ... }
  exportarProntuario(prontuario, formato) { ... }
  async limparHistorico() { ... }
  
  // Métodos de fallback
  gerarProntuarioMock(prompt) { ... }
  salvarLocalStorage(prontuario) { ... }
  carregarHistoricoLocalStorage() { ... }
  carregarTemplatesLocal(especialidade) { ... }
}
window.API = new APIClient();
```

### 🔄 SISTEMA DE FALLBACK
A aplicação funciona completamente offline graças ao sistema de fallback:

#### 1. GERAÇÃO DE PRONTUÁRIO
- **Primário:** Servidor Python com DeepSeek/outras IAs
- **Fallback:** `gerarProntuarioMock()` - gera prontuário realista

#### 2. ARMAZENAMENTO
- **Primário:** Servidor Python (arquivo JSON)
- **Fallback:** `localStorage` do navegador

#### 3. CARREGAMENTO DE TEMPLATES
- **Primário:** Endpoint `/api/templates`
- **Fallback:** Arquivo local `data/templates.json`

### 🎯 MÉTODO `gerarProntuarioMock(prompt)`
- **Localização:** Linhas 291-377
- **Funcionalidade:** Analisa prompt e gera prontuário realista
- **Características:**
  - Extrai dados do paciente do prompt
  - Gera prontuário completo com todas as seções
  - Inclui dados mock realistas (medicações, exames, etc.)
  - Identifica claramente como "MOCK (API offline)"

### 🔗 INTEGRAÇÃO
1. **Chamado por:** `ProntuarioApp.gerarProntuario()`
2. **Tenta:** Servidor primeiro
3. **Fallback:** Automaticamente se servidor indisponível
4. **Transparente:** Usuário não percebe a diferença

---

## 🐍 server.py - SERVIDOR BACKEND PYTHON

### 📏 ESTATÍSTICAS
- **Tamanho:** ~12KB
- **Linhas:** 324 linhas de código
- **Porta:** 8080
- **Tecnologia:** Python 3.x com http.server
- **Localização:** `server.py`

### 🏗️ ARQUITETURA DO SERVIDOR
```python
# Estrutura principal
class ProntuarioHandler(http.server.SimpleHTTPRequestHandler):
    # Métodos HTTP
    def do_GET(self):    # GET: status, histórico, templates
    def do_POST(self):   # POST: gerar, salvar, limpar
    
    # Handlers específicos
    def _handle_gerar(self):      # Geração com IA
    def _handle_salvar(self):     # Salvar prontuário
    def _handle_historico(self):  # Listar histórico
    def _handle_templates(self):  # Carregar templates
    def _handle_limpar(self):     # Limpar histórico
    
    # Integração com APIs de IA
    def _chamar_anthropic(self):      # Anthropic Claude
    def _chamar_deepseek(self):       # DeepSeek
    def _chamar_openai_compat(self):  # OpenAI, Groq, OpenRouter
```

### 🌐 ENDPOINTS DA API

#### GET `/api/status`
- **Propósito:** Verificar se servidor está online
- **Resposta:** `{"status": "online", "timestamp": 1234567890}`

#### GET `/api/historico`
- **Propósito:** Listar prontuários salvos
- **Resposta:** Array de objetos com `id`, `filename`, `size`, `modified`
- **Armazenamento:** Pasta `historico_prontuarios/` com arquivos `.txt`

#### GET `/api/templates`
- **Propósito:** Carregar templates médicos
- **Parâmetro:** `?especialidade=soap` (opcional)
- **Resposta:** Templates filtrados por especialidade
- **Fonte:** `data/templates.json`

#### POST `/api/gerar`
- **Propósito:** Gerar prontuário usando IA
- **Body:** `{"prompt": "prompt completo para IA"}`
- **Resposta:** `{"texto": "prontuário gerado"}`
- **Integração:** Configurado via `api_config.txt`

#### POST `/api/salvar`
- **Propósito:** Salvar prontuário no histórico
- **Body:** `{"texto": "conteúdo do prontuário", ...}`
- **Resposta:** `{"id": timestamp, "filename": "prontuario_1234567890.txt"}`
- **Armazenamento:** Arquivo `.txt` na pasta `historico_prontuarios/`

#### POST `/api/limpar`
- **Propósito:** Limpar histórico de prontuários
- **Resposta:** `{"message": "Histórico limpo com sucesso"}`
- **Ação:** Remove todos os arquivos `.txt` da pasta

### 🔌 PROVEDORES DE IA SUPORTADOS
1. **Anthropic** - Claude (Haiku, Sonnet, Opus)
2. **OpenAI** - GPT-4o, GPT-4o-mini
3. **Groq** - Llama 3.3 70B, Mixtral
4. **OpenRouter** - Multi-provedor
5. **DeepSeek** - DeepSeek Chat

### ⚙️ CONFIGURAÇÃO (`api_config.txt`)
```ini
# Exemplo de configuração
provider=deepseek
key=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
model=deepseek-chat

# Outros exemplos:
# provider=anthropic
# key=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# model=claude-haiku-4-5-20251001

# provider=openai
# key=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# model=gpt-4o-mini
```

### 🔄 COMPATIBILIDADE
- **Arquivo antigo:** `api_key.txt` (somente Anthropic)
- **Arquivo novo:** `api_config.txt` (todos provedores)
- **Fallback:** Se `api_config.txt` não existe, tenta `api_key.txt`

### 🚀 INICIALIZAÇÃO
```bash
# Windows
start.bat

# Linux/Mac
python server.py
# ou
./start.sh
```

**Comportamento:**
1. Lê configuração de `api_config.txt`
2. Inicia servidor na porta 8080
3. Abre navegador automaticamente em `http://localhost:8080`
4. Mostra provedor e modelo configurados no console

### 🔧 MÉTODOS DE INTEGRAÇÃO COM IA

#### `_chamar_anthropic(key, model, url, prompt)`
- **Formato:** API Anthropic Messages
- **Headers:** `anthropic-version`, `x-api-key`
- **Extração:** `response['content'][0]['text']`

#### `_chamar_deepseek(key, model, url, prompt)`
- **Formato:** OpenAI-compatible
- **Headers:** `Authorization: Bearer {key}`
- **Extração:** `response['choices'][0]['message']['content']`

#### `_chamar_openai_compat(key, model, url, prompt)`
- **Formato:** OpenAI Chat Completion
- **Headers:** `Authorization: Bearer {key}`
- **Provedores:** OpenAI, Groq, OpenRouter
- **Extração:** `response['choices'][0]['message']['content']`

### 🛡️ TRATAMENTO DE ERROS
- **Timeout:** 60 segundos para chamadas de API
- **HTTP Errors:** Retorna código e mensagem da API
- **Network Errors:** "Sem conexão com a API"
- **Config Errors:** "Configure sua chave no arquivo api_config.txt"

---

## ⚙️ ARQUIVOS DE CONFIGURAÇÃO E SCRIPTS

### 📁 api_config.txt - CONFIGURAÇÃO DA API DE IA
- **Localização:** Raiz do projeto
- **Formato:** Chave=valor simples
- **Campos obrigatórios:** `provider`, `key`
- **Campo opcional:** `model` (usa padrão do provedor se vazio)

### 🦇 start.bat - INICIADOR WINDOWS
- **Localização:** Raiz do projeto
- **Propósito:** Iniciar servidor no Windows
- **Comportamento:**
  1. Verifica se Python está instalado
  2. Executa `python server.py`
  3. Mantém console aberto para logs

### 🐚 start.sh - INICIADOR LINUX/MAC
- **Localização:** Raiz do projeto
- **Propósito:** Iniciar servidor no Linux/Mac
- **Permissões:** `chmod +x start.sh`
- **Comportamento:** Executa `python3 server.py`

### 📁 historico_prontuarios/ - ARMAZENAMENTO LOCAL
- **Localização:** Pasta na raiz do projeto
- **Formato:** Arquivos `.txt` com timestamp
- **Nomeação:** `prontuario_{timestamp}.txt`
- **Gerenciamento:** Endpoints `/api/salvar`, `/api/historico`, `/api/limpar`

---

## 🧪 ARQUIVOS DE TESTE

### 📄 test_template_instructions.html
- **Localização:** Raiz do projeto
- **Propósito:** Testar implementação de instruções dinâmicas
- **Testes:**
  1. Verificar estrutura HTML do container
  2. Simular seleção de template SOAP
  3. Simular limpeza de formulário
  4. Verificar implementação real nos arquivos

### 📋 RESUMO DA IMPLEMENTAÇÃO (do teste)
1. **Container HTML:** Adicionado em index.html com ID "templateInstructions"
2. **Método atualizarInstrucoesTemplate():** Adicionado em js/main.js
3. **Integração com seleção de template:** `selecionarTemplate()` chama `atualizarInstrucoesTemplate()`
4. **Limpeza de formulário:** `limparFormulario()` modificado para esconder instruções
5. **Evento de mudança de template:** Configurado para esconder instruções quando template é deselecionado
6. **Carregamento de templates:** `carregarTemplatesEspecialidade()` já esconde instruções

---

## 🔄 FLUXO COMPLETO DO SISTEMA

### 1. INICIALIZAÇÃO
```
Usuário → start.bat/start.sh → server.py (porta 8080) → Navegador abre index.html
```

### 2. CONFIGURAÇÃO INICIAL
```
index.html carrega → main.js → ProntuarioApp.init() → Carrega templates padrão
```

### 3. SELEÇÃO DE ESPECIALIDADE
```
Usuário seleciona especialidade → carregarTemplatesEspecialidade() → 
Filtra templates → Atualiza dropdown → Esconde instruções
```

### 4. SELEÇÃO DE TEMPLATE
```
Usuário seleciona template → selecionarTemplate() → 
atualizarInstrucoesTemplate() → Mostra instruções do template
```

### 5. PREENCHIMENTO DO FORMULÁRIO
```
Usuário preenche dados → Abre modais (Medicamentos, Exames, etc.) → 
Dados acumulados em dadosPaciente
```

### 6. GERAÇÃO DO PRONTUÁRIO
```
Usuário clica "Gerar Prontuário" → gerarProntuario() → 
TemplateEngine.gerarPromptIA() → APIClient.gerarProntuario() → 
Servidor Python → API de IA → Retorna prontuário → Exibe na interface
```

### 7. PÓS-GERAÇÃO
```
Usuário pode: Editar, Salvar (local/servidor), Exportar (TXT/JSON), Limpar
```

---

## 🛠️ MANUTENÇÃO E TROUBLESHOOTING

### PROBLEMAS COMUNS E SOLUÇÕES

#### 1. Servidor não inicia (Porta 8080 em uso)
```bash
# Verificar processo usando a porta
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux/Mac

# Alternativa: matar processo
taskkill /PID <PID> /F        # Windows
kill <PID>                    # Linux/Mac
```

#### 2. API de IA não responde
- Verificar `api_config.txt` (chave válida, provedor correto)
- Testar conexão com internet
- Verificar limite de uso/quotas da API
- Usar modo offline (fallback automático)

#### 3. Templates não carregam
- Verificar arquivo `data/templates.json` (formato JSON válido)
- Verificar console do navegador para erros
- Testar endpoint diretamente: `http://localhost:8080/api/templates`

#### 4. Instruções não aparecem
- Verificar se template selecionado tem campo `instrucoes`
- Verificar console JavaScript para erros
- Testar com `test_template_instructions.html`

#### 5. Modais não abrem
- Verificar se `js/ui.js` carregou corretamente
- Verificar console para erros de JavaScript
- Testar cliques nos botões com console aberto

### 🔧 ATUALIZAÇÃO DO SISTEMA

#### Adicionar novo template
1. Editar `data/templates.json`
2. Adicionar novo objeto com estrutura completa
3. Incluir campo `instrucoes` se necessário
4. Testar seleção na interface

#### Adicionar novo medicamento
1. Editar `js/medicamentos.js`
2. Adicionar novo objeto ao array `MEDS`
3. Manter estrutura: `nome`, `generico`, `classe`, `vias`, `colaterais`, `ci`
4. Testar busca no modal

#### Adicionar novo exame
1. Editar `js/exames_complementares.js`
2. Adicionar novo objeto ao array `EXAMES_SOLICITADOS`
3. Manter estrutura completa
4. Testar busca e filtro por categoria

#### Mudar provedor de IA
1. Editar `api_config.txt`
2. Atualizar `provider` e `key`
3. Opcional: especificar `model`
4. Reiniciar servidor

---

## 📈 ESTRUTURA DE DADOS COMPLETA

### 📋 PRONTUÁRIO GERADO
```javascript
{
  id: timestamp,           // ID único
  data: "DD/MM/AAAA",      // Data de geração
  paciente: {              // Dados do paciente
    nome: "Nome Completo",
    idade: "45 anos",
    sexo: "Masculino",
    queixa: "Dor abdominal",
    // ... outros campos
  },
  template: {              // Template usado
    nome: "Nota SOAP",
    especialidade: "soap"
  },
  conteudo: {              // Conteúdo dos modais
    medicamentos: [...],   // Array de medicamentos
    exames: [...],         // Array de exames
    exameFisico: {...},    // Objeto com sistemas
    orientacoes: [...]     // Array de orientações
  },
  texto: "Prontuário completo gerado pela IA...",  // Texto final
  metadata: {              // Metadados
    geradoPor: "IA (DeepSeek)",
    timestamp: 1234567890,
    versao: "2.0"
  }
}
```

### 📊 ESTATÍSTICAS DO SISTEMA
- **Templates:** 9 templates em 6 especialidades
- **Medicamentos:** 100 medicamentos no banco de dados
- **Exames:** 100+ exames em 10 categorias
- **Sistemas de exame físico:** 14 sistemas com descrições detalhadas
- **Orientações:** 9 condições médicas com orientações
- **Calculadoras:** 5 calculadoras médicas
- **Linhas de código total:** ~2500 linhas

---

## 🎯 MELHORES PRÁTICAS PARA MANUTENÇÃO

### 1. ESTRUTURA DE ARQUIVOS
```
ProntuarioIA/
├── index.html              # Interface principal
├── server.py              # Servidor backend
├── api_config.txt         # Configuração da API
├── start.bat              # Iniciador Windows
├── start.sh               # Iniciador Linux/Mac
├── data/
│   └── templates.json     # Templates médicos
├── js/
│   ├── main.js           # Aplicação principal
│   ├── template_engine.js # Motor de templates
│   ├── instrucoes_ia.js   # Instruções para IA
│   ├── api.js            # Cliente API com fallback
│   ├── medicamentos.js    # Banco de dados de medicamentos
│   ├── exame_fisico.js    # Achados normais do exame físico
│   ├── exames_complementares.js # Banco de exames
│   ├── orientacoes_alta.js # Orientações de alta
│   ├── ui.js             # Gerenciador de interface
│   └── auth.js           # Gerenciador de autenticação
├── historico_prontuarios/ # Armazenamento local
│   └── prontuario_*.txt  # Prontuários salvos
└── test_template_instructions.html # Arquivo de teste
```

### 2. CONVENÇÕES DE CÓDIGO
- **JavaScript:** ES6+ com classes e módulos
- **Python:** PEP 8 com docstrings
- **JSON:** Formatação consistente com 2 espaços
- **Comentários:** Em português, explicativos
- **Variáveis:** Nomes descritivos em português

### 3. CONTROLE DE VERSÃO
- **Commits:** Descritivos em português
- **Branching:** `main` para produção, `develop` para desenvolvimento
- **Tags:** Versões semânticas (v2.0.0)

### 4. TESTES
- **Testes manuais:** Usar `test_template_instructions.html`
- **Console:** Sempre verificar console do navegador
- **Logs:** Monitorar logs do servidor Python
- **Fallback:** Testar modo offline (desconectar internet)

### 5. DOCUMENTAÇÃO
- **Este manual:** Atualizar com mudanças significativas
- **Comentários:** Manter código bem comentado
- **Exemplos:** Incluir exemplos de uso nas seções relevantes

---

## 🔮 ROADMAP E MELHORIAS FUTURAS

### MELHORIAS PRIORITÁRIAS
1. **Exportação em PDF** - Adicionar geração de PDF formatado
2. **Integração com PACS** - Conexão com sistemas de imagem médica
3. **Assinatura digital** - Suporte a assinaturas eletrônicas
4. **API REST completa** - Para integração com outros sistemas
5. **Banco de dados real** - Substituir localStorage por SQLite/PostgreSQL
6. **Multi-usuário** - Suporte a múltiplos médicos com perfis
7. **Sincronização em nuvem** - Backup e acesso remoto
8. **App mobile** - Versão para iOS e Android

### MELHORIAS DE USABILIDADE
1. **Autocomplete inteligente** - Sugestões ao digitar sintomas/doenças
2. **Modelos personalizáveis** - Médicos criam seus próprios templates
3. **Integração com CID-10** - Códigos de doenças automáticos
4. **Prescrição eletrônica** - Integração com farmácias
5. **Alertas interativos** - Lembretes de retorno e exames
6. **Dashboard analítico** - Estatísticas de atendimentos
7. **Suporte a múltiplos idiomas** - Inglês, Espanhol, etc.

### MELHORIAS TÉCNICAS
1. **Testes automatizados** - Jest para frontend, pytest para backend
2. **Dockerização** - Container para fácil deploy
3. **CI/CD** - Pipeline automatizado de deploy
4. **Monitoramento** - Logs estruturados e métricas
5. **Cache inteligente** - Cache de templates e dados frequentes
6. **WebSockets** - Atualizações em tempo real
7. **PWA** - Funcionamento offline completo

---

## 🏁 CONCLUSÃO

### ✅ SISTEMA COMPLETO E FUNCIONAL
O **Prontuário IA V2** é um sistema completo para geração de prontuários médicos com as seguintes características:

#### 🎯 PRINCIPAIS VANTAGENS
1. **Geração com IA** - Prontuários de alta qualidade usando DeepSeek/outras IAs
2. **Funcionamento offline** - Sistema de fallback robusto
3. **Interface intuitiva** - Modais organizados e busca eficiente
4. **Bancos de dados ricos** - 100 medicamentos, 100+ exames, 14 sistemas de exame
5. **Templates especializados** - 6 especialidades médicas com templates específicos
6. **Instruções dinâmicas** - Guias contextuais para cada template
7. **Calculadoras médicas** - 5 ferramentas úteis integradas
8. **Histórico local** - Armazenamento seguro de prontuários

#### 🔧 FÁCIL MANUTENÇÃO
- **Documentação completa** - Este manual cobre todos os aspectos
- **Código organizado** - Separação clara de responsabilidades
- **Configuração simples** - Arquivo `api_config.txt` único
- **Testes incluídos** - Arquivo de teste para verificar funcionalidades

#### 🚀 FÁCIL IMPLANTAÇÃO
1. **Requisitos mínimos:** Python 3.x e navegador moderno
2. **Configuração:** Editar um arquivo de texto (`api_config.txt`)
3. **Execução:** Clicar em `start.bat` (Windows) ou `./start.sh` (Linux/Mac)
4. **Uso:** Navegador abre automaticamente

### 📞 SUPORTE E CONTATO
- **Documentação:** Este arquivo `MANUAL.md`
- **Problemas:** Verificar seção "Manutenção e Troubleshooting"
- **Melhorias:** Verificar seção "Roadmap e Melhorias Futuras"
- **Contribuições:** Estrutura modular facilita adição de funcionalidades

### 📄 LICENÇA E USO
- **Uso:** Livre para uso médico e educacional
- **Modificações:** Permitidas com atribuição
- **Comercial:** Consultar termos específicos
- **Responsabilidade:** Sistema auxiliar, não substitui julgamento médico

---

## 🔍 ÍNDICE RÁPIDO PARA IA

### ESTRUTURA DO SISTEMA (PARA ANÁLISE DE IA)
```
SISTEMA: Prontuário IA V2 - Geração de prontuários médicos com IA
OBJETIVO: Assistir médicos na criação de prontuários estruturados
TECNOLOGIAS: HTML/CSS/JS (frontend), Python (backend), APIs de IA
ARQUITETURA: Cliente-servidor com fallback offline

COMPONENTES PRINCIPAIS:
1. Frontend (index.html + JS modules) - Interface do usuário
2. Backend (server.py) - Servidor Python com API
3. Bancos de dados (JS modules) - Medicamentos, exames, templates
4. Sistema de templates (template_engine.js) - Processamento de modelos
5. Cliente API (api.js) - Comunicação com fallback

FLUXO DE DADOS:
Usuário → Interface → TemplateEngine → APIClient → Server → IA → Prontuário

CARACTERÍSTICAS-CHAVE:
- Instruções dinâmicas por template
- 9 templates em 6 especialidades
- 100 medicamentos, 100+ exames, 14 sistemas de exame
- 5 calculadoras médicas integradas
- Funcionamento offline completo
- Armazenamento local seguro
```

### PONTOS DE EXTENSÃO (PARA DESENVOLVIMENTO FUTURO)
1. **Novos templates:** Adicionar em `data/templates.json`
2. **Novos medicamentos:** Adicionar em `js/medicamentos.js`
3. **Novos exames:** Adicionar em `js/exames_complementares.js`
4. **Novas calculadoras:** Adicionar métodos em `js/ui.js`
5. **Novos provedores de IA:** Adicionar handler em `server.py`
6. **Novos modais:** Seguir padrão em `js/ui.js`

### ANÁLISE DE IMPACTO (PARA MODIFICAÇÕES)
- **Alterar estrutura de template:** Afeta `template_engine.js` e `data/templates.json`
- **Adicionar novo campo no formulário:** Afeta `index.html` e `main.js`
- **Mudar provedor de IA:** Afeta `server.py` e `api_config.txt`
- **Adicionar novo banco de dados:** Criar novo módulo JS e integrar em `ui.js`

---

**FIM DO MANUAL** - Documentação completa do sistema Prontuário IA V2
- `{{DIAGNOSTICOS}}` - Hipóteses diagnósticas

#### 🏥 EXAMES FÍSICOS (POR SISTEMA)
- `{{EXAME_FISICO_CARDIOLOGICO}}` - Sistema cardiovascular
- `{{EXAME_FISICO_RESPIRATORIO}}` - Sistema respiratório
- `{{EXAME_FISICO_ABDOMINAL}}` - Abdome
- `{{EXAME_FISICO_NEUROLOGICO}}` - Sistema neurológico
- `{{EXAME_FISICO_EXTREMIDADES}}` - Extremidades
- `{{EXAME_FISICO_PELE_FANEROS}}` - Pele e faneros

#### ⚡ PLACEHOLDERS COM VALORES PADRÃO
(Substituídos automaticamente se não preenchidos no formulário)
- `{{ANTECEDENTES}}` → "Não informado."
- `{{SINAIS_VITAIS}}` → "Não aferidos."
- `{{ALERGIAS}}` → "Nenhuma alergia conhecida."
- `{{VACINACAO}}` → "Em dia."
- `{{HISTORICO_FAMILIAR}}` → "Não informado."
- `{{HISTORICO_SOCIAL}}` → "Não informado."
- `{{EXAME_FISICO_GERAL}}` → "Não realizado."

**Referência:** Ver `template_engine.js` linhas 257-285 para lista completa

### 📝 EXEMPLO DE TEMPLATE COMPLETO
```json
"nota_soap": {
  "nome": "Nota SOAP",
  "especialidade": "soap",
  "descricao": "Nota SOAP padrão para consultas gerais",
  "instrucoes": "Preencher a nota SOAP seguindo a estrutura padrão: Subjetivo (história do paciente), Objetivo (achados do exame físico e exames), Avaliação (diagnóstico/impressão) e Plano (tratamento e acompanhamento).",
  "estrutura": "PRONTUÁRIO MÉDICO - NOTA SOAP\n\nDATA: {{DATA}} | HORA: {{HORA}}\n\nIDENTIFICAÇÃO:\n- Paciente: {{NOME}}\n- Idade: {{IDADE}}\n- Sexo: {{SEXO}}\n- Profissão: {{PROFISSÃO}}\n- Residência: {{RESIDÊNCIA}}\n\nQUEIXA PRINCIPAL:\n{{QUEIXA}}\n\nHISTÓRIA DA DOENÇA ATUAL:\n{{ANAMNESE}}\n\nANTECEDENTES PESSOAIS:\n{{ANTECEDENTES}}\n\nEXAME FÍSICO:\n{{EXAME_FISICO_GERAL}}\n\nEXAMES COMPLEMENTARES:\n{{EXAMES}}\n\nHIPÓTESE DIAGNÓSTICA:\n{{DIAGNOSTICOS}}\n\nPLANO:\n{{MEDICAMENTOS}}\n\nORIENTAÇÕES:\n{{ORIENTACOES}}\n\nASSINATURA:\nDr. [Nome do Médico]\nCRM: [Número do CRM]"
}
```

---

## ⚙️ js/main.js - NÚCLEO DA APLICAÇÃO

### 📏 ESTATÍSTICAS
- **Tamanho:** ~50KB
- **Linhas:** ~1000 linhas
- **Classe Principal:** `ProntuarioApp`
- **Responsabilidade:** Coordenação geral da aplicação

### 🏗️ CLASSE PRINCIPAL: `ProntuarioApp`
```javascript
class ProntuarioApp {
    constructor() {
        this.dadosPaciente = {};                    // Dados do paciente atual
        this.templateAtual = null;                  // Template selecionado
        this.medicamentosSelecionados = [];         // Lista de medicamentos
        this.examesFisicosSelecionados = [];        // Lista de exames físicos
        this.examesComplementaresSelecionados = []; // Lista de exames complementares
        this.orientacoesSelecionadas = [];          // Lista de orientações
        this.cronometroAtivo = false;               // Estado do cronômetro
        this.tempoInicio = null;                    // Timestamp de início
        this.intervaloCronometro = null;            // Intervalo do cronômetro
    }
}
```

### 🔧 MÉTODOS PRINCIPAIS

#### 1. 🚀 INICIALIZAÇÃO
- `init()` - Inicializa aplicação, carrega templates padrão, configura eventos
- `setupEventListeners()` - Configura todos os event listeners da interface
- `setupDarkMode()` - Configura sistema de modo escuro/claro

#### 2. 📋 GERENCIAMENTO DE TEMPLATES
- `carregarTemplatesEspecialidade(especialidade)` - Carrega templates para especialidade selecionada
- `selecionarTemplate(templateName)` - Seleciona template específico
- `atualizarInstrucoesTemplate(template)` - **NOVA FUNCIONALIDADE**: Mostra/esconde instruções do template

#### 3. 🤖 GERAÇÃO DE PRONTUÁRIO
- `gerarProntuario()` - Fluxo principal de geração com IA
- `coletarDadosPaciente()` - Coleta dados do formulário
- `validarDados()` - Valida dados antes de enviar para IA
- `montarPromptIA()` - Monta prompt completo para IA

#### 4. 🗂️ GERENCIAMENTO DE ESTADO
- `limparFormulario()` - Limpa todos os dados (inclui esconder instruções)
- `salvarRascunho()` - Salva rascunho em localStorage
- `carregarRascunho()` - Carrega rascunho salvo
- `salvarHistorico(prontuario)` - Salva prontuário no histórico

#### 5. 🎨 MODAIS E FERRAMENTAS
- `abrirModalMedicamentos()` - Abre modal de medicamentos
- `abrirModalExameFisico()` - Abre modal de exame físico
- `abrirModalExames()` - Abre modal de exames complementares
- `abrirModalOrientacoes()` - Abre modal de orientações
- `abrirModalCalculadoras()` - Abre modal de calculadoras médicas

#### 6. ⏱️ CRONÔMETRO
- `iniciarCronometro()` - Inicia contagem de tempo
- `pararCronometro()` - Para contagem de tempo
- `atualizarCronometro()` - Atualiza display do cronômetro
- `formatarTempo(ms)` - Formata milissegundos para MM:SS

#### 7. 🌙 MODO ESCURO
- `toggleDarkMode()` - Alterna entre modo escuro e claro
- `aplicarDarkMode()` - Aplica tema escuro ao documento
- `removerDarkMode()` - Remove tema escuro

### 🔗 INTEGRAÇÃO COM OUTROS MÓDULOS
- **TemplateEngine:** Para processamento de templates
- **APIClient:** Para comunicação com servidor/IA
- **UIManager:** Para gerenciamento de modais e UI
- **AuthManager:** Para autenticação (futuro)

---

## 🔧 js/template_engine.js - MOTOR DE TEMPLATES

### 📏 ESTATÍSTICAS
- **Tamanho:** ~15KB
- **Linhas:** ~350 linhas
- **Classe Principal:** `TemplateEngine`
- **Responsabilidade:** Processamento e aplicação de templates

### 🏗️ CLASSE PRINCIPAL: `TemplateEngine`
```javascript
class TemplateEngine {
    constructor() {
        this.templates = {};        // Cache de templates carregados
        this.especialidades = {};   // Mapeamento especialidade → templates
        this.currentTemplate = null; // Template atualmente selecionado
    }
}
```

### 🔧 MÉTODOS PRINCIPAIS

#### 1. 📥 CARREGAMENTO DE TEMPLATES
- `carregarTemplates(especialidade)` - Carrega templates do servidor/arquivo local
- `getTemplateNames(especialidade)` - Retorna nomes dos templates disponíveis
- `getTemplate(especialidade, templateName)` - Obtém template específico

#### 2. 🔄 APLICAÇÃO DE TEMPLATES
- `aplicarTemplate(template, dados)` - Substitui placeholders com dados do paciente
- `substituirPlaceholders(texto, dados)` - Substituição direta de placeholders
- `processarExameFisico(dados)` - Processa dados de exame físico
- `processarMedicamentos(dados)` - Processa lista de medicamentos

#### 3. 🤖 GERAÇÃO DE PROMPT PARA IA
- `gerarPromptIA(template, dados)` - Gera prompt completo para IA
- `combinarInstrucoes(template)` - Combina instruções do template com regras gerais da IA
- `formatarDadosParaIA(dados)` - Formata dados para inclusão no prompt

#### 4. ⚙️ UTILITÁRIOS
- `getDataAtual()` - Retorna data atual formatada (DD/MM/AAAA)
- `getHoraAtual()` - Retorna hora atual formatada (HH:MM)
- `normalizarTexto(texto)` - Normaliza texto para processamento

### 🎯 PLACEHOLDERS SUPORTADOS
O motor suporta dois tipos de placeholders:

#### 1. 📋 PLACEHOLDERS DIRETOS
Substituição simples baseada em chaves do objeto `dados`:
```javascript
// Exemplo: {{NOME}} → dados.nome
// Exemplo: {{IDADE}} → dados.idade
```

#### 2. ⚡ PLACEHOLDERS ESPECIAIS
Processamento customizado:
- `{{MEDICAMENTOS}}` → Processa lista de medicamentos selecionados
- `{{EXAMES}}` → Processa lista de exames complementares
- `{{ORIENTACOES}}` → Processa lista de orientações
- `{{EXAME_FISICO_*}}` → Processa achados de exame físico por sistema

#### 3. 📝 PLACEHOLDERS COM VALORES PADRÃO
Definidos em `outrosPlaceholders` (linhas 257-285):
```javascript
const outrosPlaceholders = {
    'ANTECEDENTES': 'Não informado.',
    'SINAIS_VITAIS': 'Não aferidos.',
    'ALERGIAS': 'Nenhuma alergia conhecida.',
    'VACINACAO': 'Em dia.',
    // ... mais 20+ placeholders
};
```

### 🔄 FLUXO DE PROCESSAMENTO
1. **Carregar Template:** `carregarTemplates()` → JSON do servidor/arquivo
2. **Selecionar Template:** `getTemplate()` → Template específico
3. **Coletar Dados:** Dados do formulário + seleções de modais
4. **Aplicar Template:** `aplicarTemplate()` → Substitui placeholders
5. **Gerar Prompt:** `gerarPromptIA()` → Prompt para IA
6. **Enviar para IA:** Via `APIClient.gerarProntuario()`

---

## 🤖 js/instrucoes_ia.js - REGRAS PARA IA

### 📏 ESTATÍSTICAS
- **Tamanho:** ~3KB
- **Linhas:** ~100 linhas
- **Variável Global:** `window.InstrucoesIA`
- **Regras:** 22 regras detalhadas para geração de prontuários

### 🎯 PROPÓSITO
Definir regras específicas para a IA gerar prontuários médicos com:
- **Padronização:** Estrutura consistente entre prontuários
- **Qualidade:** Conteúdo médico preciso e relevante
- **Formatação:** Estilo uniforme e profissional
- **Idioma:** Português brasileiro correto

### 📋 REGRAS PRINCIPAIS

#### 1. 🇧🇷 IDIOMA E LOCALIZAÇÃO
- **Regra 1:** "Use sempre português brasileiro."
- **Regra 2:** "Use termos médicos em português do Brasil."
- **Regra 3:** "Use siglas médicas brasileiras (ex: HAS, DM, IAM)."

#### 2. 🏥 ESTRUTURA SOAP
- **Regra 4:** "Siga a estrutura SOAP: Subjetivo, Objetivo, Avaliação, Plano."
- **Regra 5:** "No Subjetivo: comece com comorbidades e medicações em uso."
- **Regra 6:** "No Subjetivo: coloque as negativas no final."
- **Regra 7:** "No Subjetivo: use ordem cronológica, detalhada."

#### 3. 💊 PRESCRIÇÃO E MEDICAMENTOS
- **Regra 8:** "No Plano: separe em tópicos: Conduta imediata, Prescrição, Orientações, Retorno/encaminhamento."
- **Regra 9:** "Coloque medicamentos no Plano, não no Subjetivo."
- **Regra 10:** "Formate medicamentos como: - [Nome] [dose] [via] [frequência] [duração]."

#### 4. 📝 FORMATTAÇÃO E ESTILO
- **Regra 11:** "NÃO use markdown (** ou *)."
- **Regra 12:** "Use apenas hífens (-) para listas."
- **Regra 13:** "NÃO inclua avisos como 'Gerado com IA'."
- **Regra 14:** "Use parágrafos curtos e claros."

#### 5. 🩺 CONTEÚDO MÉDICO
- **Regra 15:** "Se campo estiver vazio, deixe em branco ou use 'Não informado'."
- **Regra 16:** "Inclua achados normais do exame físico quando aplicável."
- **Regra 17:** "Seja específico em diagnósticos e condutas."
- **Regra 18:** "Use linguagem clínica apropriada."

#### 6. ⚠️ RESTRIÇÕES
- **Regra 19:** "NÃO invente dados não fornecidos."
- **Regra 20:** "NÃO faça recomendações além do escopo."
- **Regra 21:** "Mantenha confidencialidade de dados."
- **Regra 22:** "Siga guidelines médicas brasileiras."

### 🔗 USO NO SISTEMA
As instruções são injetadas automaticamente em todos os prompts enviados para a IA:

```javascript
// Em template_engine.js, método gerarPromptIA():
const promptCompleto = `
${InstrucoesIA}

${template.instrucoes ? `INSTRUÇÕES ESPECÍFICAS DO TEMPLATE:\n${template.instrucoes}\n\n` : ''}

DADOS DO PACIENTE:
${dadosFormatados}

GERE O PRONTUÁRIO SEGUINDO AS INSTRUÇÕES ACIMA:
`;
```

### 🔧 PERSONALIZAÇÃO
Para modificar as regras da IA:
1. Editar arquivo `js/instrucoes_ia.js`
2. Modificar constante `INSTRUCOES_IA`
3. Manter formato: uma regra por linha no array
4. As alterações são aplicadas imediatamente na próxima geração

---

## 🔄 js/api.js - COMUNICAÇÃO COM API

### 📏 ESTATÍSTICAS
- **Tamanho:** ~12KB
- **Linhas:** ~380 linhas
- **Classe Principal:** `APIClient`
- **Responsabilidade:** Comunicação com servidor backend e APIs externas

### 🏗️ CLASSE PRINCIPAL: `APIClient`
```javascript
class APIClient {
    constructor() {
        this.baseUrl = window.location.origin;  // URL base do servidor
        this.isLocal = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    }
}
```

### 🔧 MÉTODOS PRINCIPAIS

#### 1. 🤖 GERAÇÃO DE PRONTUÁRIO COM IA
- `gerarProntuario(prompt)` - Envia prompt para IA e retorna prontuário gerado
- `gerarProntuarioMock(prompt)` - **Fallback:** Gera prontuário mock quando API offline
- Processo:
  1. Envia POST para `/api/gerar` com prompt
  2. Aguarda resposta da DeepSeek API
  3. Retorna texto gerado ou fallback mock

#### 2. 💾 SALVAMENTO DE PRONTUÁRIOS
- `salvarProntuario(prontuario)` - Salva prontuário no servidor
- `salvarLocalStorage(prontuario)` - **Fallback:** Salva no localStorage
- Processo:
  1. Tenta POST para `/api/salvar`
  2. Se falhar, salva em `localStorage`
  3. Mantém histórico dos últimos 100 prontuários

#### 3. 📥 CARREGAMENTO DE DADOS
- `carregarTemplates(especialidade)` - Carrega templates do servidor
- `carregarTemplatesLocal(especialidade)` - **Fallback:** Carrega do arquivo local
- `carregarHistorico()` - Carrega histórico de prontuários
- `carregarHistoricoLocalStorage()` - **Fallback:** Carrega do localStorage

#### 4. 🔧 UTILITÁRIOS
- `verificarServidor()` - Verifica se servidor está online
- `exportarProntuario(prontuario, formato)` - Exporta prontuário como arquivo (TXT/JSON)
- `limparHistorico()` - Limpa histórico local

### 🔄 SISTEMA DE FALLBACK
O APIClient implementa fallback robusto para operação offline:

#### 1. 🚫 API OFFLINE → MOCK
```javascript
async gerarProntuario(prompt) {
    try {
        // Tenta API real
        const response = await fetch('/api/gerar', { ... });
        return await response.json();
    } catch (error) {
        // Fallback para mock
        console.warn('API não disponível, usando fallback mock...');
        return this.gerarProntuarioMock(prompt);
    }
}
```

#### 2. 💾 SERVIDOR OFFLINE → LOCALSTORAGE
```javascript
async salvarProntuario(prontuario) {
    try {
        // Tenta servidor
        const response = await fetch('/api/salvar', { ... });
        return await response.json();
    } catch (error) {
        // Fallback para localStorage
        console.warn('Erro ao salvar no servidor, usando localStorage:', error);
        return this.salvarLocalStorage(prontuario);
    }
}
```

### 🤖 GERADOR MOCK (OFFLINE)
O método `gerarProntuarioMock()` gera prontuários realistas quando a API está offline:

#### 📋 CARACTERÍSTICAS DO MOCK
1. **Extrai dados do prompt:** Nome, idade, sexo, queixa, HDA
2. **Gera conteúdo estruturado:** Segue formato SOAP
3. **Inclui seções completas:** Identificação, exame físico, exames, conduta
4. **Marca como mock:** Indica claramente que é prontuário gerado offline

#### 📝 EXEMPLO DE SAÍDA MOCK
```
PRONTUÁRIO MÉDICO - MOCK (API offline)

DATA: 14/04/2026 | HORA: 15:30

IDENTIFICAÇÃO:
- Paciente: João Silva
- Idade: 45 anos
- Sexo: Masculino
- Data de nascimento: 15/03/1981
- Prontuário: MOCK-123456

QUEIXA PRINCIPAL:
Dor abdominal

HISTÓRIA DA DOENÇA ATUAL:
Há 3 dias com dor em hipocôndrio direito

ANTECEDENTES PESSOAIS:
- Hipertensão arterial: em uso de Losartana 50mg/dia
- Diabetes mellitus tipo 2: em uso de Metformina 850mg 2x/dia
- Tabagismo: 10 anos-maço, cessou há 5 anos
- Etilismo: social

EXAME FÍSICO:
- Estado geral: regular, consciente, orientado
- PA: 140/90 mmHg | FC: 88 bpm | FR: 18 irpm | T: 36.8°C
- Peso: 78 kg | Altura: 1.72 m | IMC: 26.4 (sobrepeso)
- Cabeça e pescoço: normocefálico, sem adenomegalias
- Tórax: murmúrio vesicular presente bilateralmente, sem ruídos adventícios
- Cardiovascular: ritmo cardíaco regular, 2T, sem sopros
- Abdome: doloroso à palpação em hipocôndrio direito, sem defesa ou rigidez
- Extremidades: sem edema, pulsos presentes e simétricos

EXAMES SOLICITADOS:
1. Hemograma completo
2. Bioquímica (TGO, TGP, bilirrubinas, fosfatase alcalina)
3. Ultrassonografia de abdome total
4. Amilase e lipase

HIPÓTESE DIAGNÓSTICA:
- Colecistite aguda
- Pancreatite aguda (a descartar)
- Hepatite aguda (a descartar)

CONDUTA:
1. Internação para observação
2. Dieta zero
3. Hidratação venosa: SF 0.9% 100ml/h
4. Analgesia: Dipirona 1g IV 6/6h
5. Antibioticoterapia: Ceftriaxona 1g IV 24/24h
6. Solicitar exames acima

ORIENTAÇÕES:
- Manter repouso relativo
- Não ingerir alimentos ou líquidos até nova avaliação
- Retornar imediatamente se piora da dor, febre ou vômitos
- Comparecer ao retorno em 7 dias com resultados dos exames

ASSINATURA:
Dr. Mock Silva
CRM: MOCK-12345

OBS: Este é um prontuário gerado automaticamente (modo offline).
Para prontuário completo com IA, verifique a conexão com o servidor.
```

### 🔌 ENDPOINTS DA API
O APIClient se comunica com os seguintes endpoints:

#### 🐍 SERVIDOR PYTHON (`server.py`)
- `POST /api/gerar` - Geração de prontuário com IA
- `POST /api/salvar` - Salvamento de prontuário
- `GET /api/historico` - Carregamento de histórico
- `GET /api/templates` - Carregamento de templates
- `POST /api/limpar` - Limpeza de histórico
- `HEAD /api/status` - Verificação de status do servidor

#### 📁 ARQUIVOS LOCAIS
- `GET data/templates.json` - Fallback para templates
- `localStorage` - Fallback para histórico e rascunhos

### 🔒 SEGURANÇA E TRATAMENTO DE ERROS
- **Timeout:** 3 segundos para verificação de servidor
- **Retry:** Fallback automático para operação offline
- **Validação:** Verificação de respostas HTTP
- **Logging:** Log detalhado de erros no console
- **Cleanup:** Limpeza de objetos URL criados para exportação

---

## 💊 js/medicamentos.js - GERENCIAMENTO DE MEDICAMENTOS

### 📏 ESTATÍSTICAS
- **Tamanho:** ~15KB
- **Linhas:** ~500 linhas
- **Banco de Dados:** 100 medicamentos detalhados
- **Variável Global:** `window.MedicamentosDB`
- **Exportação:** Array `MEDS`

### 🎯 PROPÓSITO
Fornecer banco de dados completo de medicamentos para:
- **Seleção rápida:** Busca e filtro de medicamentos
- **Prescrição precisa:** Doses, vias, frequências padronizadas
- **Segurança:** Contraindicações e efeitos colaterais
- **Integração:** Inclusão automática em prontuários

### 🏗️ ESTRUTURA DE UM MEDICAMENTO
```javascript
{
  nome: "AAS (Ácido Acetilsalicílico) 100mg",
  generico: "Ácido acetilsalicílico",
  classe: "Antiagregante plaquetário / AINE",
  vias: ["VO"],
  colaterais: [
    "Dispepsia",
    "Gastrite",
    "Sangramento gastrointestinal",
    "Zumbido (em altas doses)",
    "Reação alérgica (raramente anafilaxia)"
  ],
  ci: [
    "Hipersensibilidade a AINEs ou salicilatos",
    "Úlcera péptica ativa",
    "Hemorragia ativa",
    "Insuficiência hepática grave",
    "Insuficiência renal grave",
    "Asma induzida por AINEs",
    "Crianças com viroses (risco de Síndrome de Reye)",
    "Gravidez (3º trimestre)"
  ],
  doses: [
    "Antiagregação: 100mg VO 1x/dia",
    "Analgesia: 500mg VO 6/6h (máx 4g/dia)"
  ],
  obs: "Evitar uso concomitante com outros AINEs ou anticoagulantes. Suspender 5-7 dias antes de cirurgias."
}
```

### 📋 CAMPOS COMPLETOS
1. **nome:** Nome comercial + dose
2. **generico:** Nome genérico/princípio ativo
3. **classe:** Classe terapêutica
4. **vias:** Array de vias de administração (VO, IV, IM, SC, etc.)
5. **colaterais:** Array de efeitos colaterais comuns
6. **ci:** Array de contraindicações
7. **doses:** Array de posologias padrão
8. **obs:** Observações importantes

### 🏥 CATEGORIAS DE MEDICAMENTOS
O banco inclui medicamentos de diversas classes:

#### 1. 💊 ANALGÉSICOS E ANTI-INFLAMATÓRIOS
- AAS, Dipirona, Paracetamol, Ibuprofeno, Cetoprofeno, Naproxeno
- Tramadol, Codeína, Morfina

#### 2. 🩺 ANTIBIÓTICOS
- Amoxicilina, Amoxicilina+Clavulanato, Azitromicina, Claritromicina
- Ceftriaxona, Ciprofloxacino, Doxiciclina, Metronidazol

#### 3. ❤️ CARDIOVASCULARES
- Losartana, Enalapril, Captopril, Atenolol, Propranolol
- Furosemida, Hidroclorotiazida, Espironolactona
- AAS, Clopidogrel, Varfarina

#### 4. 🧠 NEUROLÓGICOS E PSIQUIÁTRICOS
- Diazepam, Lorazepam, Clonazepam
- Fluoxetina, Sertralina, Amitriptilina
- Carbamazepina, Fenitoína, Ácido Valproico

#### 5. 🌡️ ENDÓCRINOS E METABÓLICOS
- Metformina, Glibenclamida, Insulina NPH, Insulina Regular
- Levotiroxina, Prednisona

#### 6. 🫁 RESPIRATÓRIOS
- Salbutamol, Budesonida, Teofilina
- Dexametasona, Prednisona

#### 7. 🩸 GASTROINTESTINAIS
- Omeprazol, Ranitidina, Metoclopramida, Domperidona
- Ondansetrona, Loperamida

### 🔍 SISTEMA DE BUSCA
Integrado com `UIManager` para busca em tempo real:

#### 📝 CRITÉRIOS DE BUSCA
1. **Nome comercial:** "AAS", "Losartana"
2. **Genérico:** "Ácido acetilsalicílico", "Losartana potássica"
3. **Classe:** "Antiagregante", "IECA", "Beta-bloqueador"
4. **Via:** "VO", "IV", "IM"

#### 🎯 FUNCIONALIDADES DE BUSCA
- **Busca parcial:** "asa" encontra "AAS"
- **Busca por classe:** "antibiótico" encontra todos antibióticos
- **Filtro por via:** Mostra apenas medicamentos com via específica
- **Ordenação:** Alfabética por nome

### 🔗 INTEGRAÇÃO COM O SISTEMA

#### 1. 🎨 MODAL DE MEDICAMENTOS
- **Acesso:** Botão "💊 Medicamentos" na barra de ferramentas
- **Interface:** Modal com busca, lista e detalhes
- **Seleção:** Checkboxes para selecionar múltiplos medicamentos
- **Detalhes:** Modal expandível com informações completas

#### 2. 📋 INCLUSÃO NO PRONTUÁRIO
```javascript
// Processamento no TemplateEngine
function processarMedicamentos(dados) {
    if (!dados.medicamentosSelecionados || dados.medicamentosSelecionados.length === 0) {
        return "Nenhum medicamento prescrito.";
    }
    
    return dados.medicamentosSelecionados.map(med => 
        `- ${med.nome} ${med.dose || ''}`).join('\n');
}
```

#### 3. 💾 ARMAZENAMENTO
- **Sessão atual:** Array `medicamentosSelecionados` em `ProntuarioApp`
- **Persistência:** Incluído em rascunhos salvos no localStorage
- **Histórico:** Parte dos prontuários salvos no histórico

### 🔒 CONSIDERAÇÕES DE SEGURANÇA

#### 1. ⚠️ INFORMAÇÕES CRÍTICAS
- **Contraindicações:** Listadas para cada medicamento
- **Efeitos colaterais:** Alertas para monitoramento
- **Interações:** Observações sobre uso concomitante
- **Doses máximas:** Especificadas nas posologias

#### 2. 🩺 USO CLÍNICO
- **Referência:** Baseado em bulários e guidelines brasileiros
- **Atualização:** Banco estático - requer atualização manual
- **Limitações:** Não substitui consulta a farmacêutico ou médico
- **Contexto:** Apenas para referência em prescrição

### 🔧 MANUTENÇÃO DO BANCO DE DADOS

#### 1. 📝 ADICIONAR NOVO MEDICAMENTO
```javascript
// Adicionar ao array MEDS em js/medicamentos.js
{
  nome: "Novo Medicamento 500mg",
  generico: "Novo princípio ativo",
  classe: "Nova classe terapêutica",
  vias: ["VO", "IV"],
  colaterais: ["Efeito colateral 1", "Efeito colateral 2"],
  ci: ["Contraindicação 1", "Contraindicação 2"],
  doses: [
    "Manutenção: 500mg VO 1x/dia",
    "Carga: 1g IV em 30min, depois 500mg VO 12/12h"
  ],
  obs: "Observações importantes sobre o medicamento."
}
```

#### 2. 🔄 ATUALIZAR MEDICAMENTO EXISTENTE
- Localizar no array `MEDS` pelo nome
- Modificar campos necessários
- Manter estrutura consistente

#### 3. 🗑️ REMOVER MEDICAMENTO
- Remover objeto do array `MEDS`
- Verificar referências no código
- Atualizar documentação se necessário

---

## 🩺 js/exame_fisico.js - EXAME FÍSICO

### 📏 ESTATÍSTICAS
- **Tamanho:** ~5KB
- **Linhas:** ~50 linhas
- **Banco de Dados:** 14 sistemas do exame físico
- **Variável Global:** `window.ExameFisicoDB`
- **Exportação:** Objeto `EF` com 14 propriedades

### 🎯 PROPÓSITO
Fornecer descrições padronizadas de achados normais do exame físico para:
- **Inclusão automática:** Em prontuários quando sistemas são marcados como "normal"
- **Padronização:** Linguagem médica consistente e profissional
- **Eficiência:** Evitar digitação repetitiva de achados normais
- **Completude:** Cobertura de todos os sistemas principais

### 🏗️ ESTRUTURA DOS ACHADOS NORMAIS
Cada sistema é uma propriedade do objeto `EF` com descrição detalhada:

```javascript
const EF = {
  cardiaco: `Aparelho Cardiovascular: Ausculta cardíaca com bulhas normofonéticas...`,
  respiratorio: `Aparelho Respiratório: Tórax simétrico, sem deformidades estruturais...`,
  abdome: `Abdome: Plano, simétrico, sem abaulamentos localizados...`,
  // ... mais 11 sistemas
};
```

### 📋 SISTEMAS DISPONÍVEIS

#### 1. ❤️ SISTEMA CARDIOVASCULAR (`cardiaco`)
- **Descrição:** Ausculta cardíaca, bulhas, sopros, pulsos, pressão arterial
- **Palavras-chave:** normofonéticas, rítmicas, sem sopros, pulsos cheios

#### 2. 🫁 SISTEMA RESPIRATÓRIO (`respiratorio`)
- **Descrição:** Tórax, expansibilidade, percussão, ausculta pulmonar
- **Palavras-chave:** simétrico, murmúrio vesicular, sem ruídos adventícios

#### 3. 🩺 ABDOME (`abdome`)
- **Descrição:** Inspeção, ausculta, palpação, percussão, manobras especiais
- **Palavras-chave:** plano, RHA normoativos, indolor, manobras negativas

#### 4. 🧠 SISTEMA NEUROLÓGICO (`neurologico`)
- **Descrição:** Consciência, orientação, Glasgow, nervos cranianos, força, reflexos
- **Palavras-chave:** consciente, Glasgow 15, força grau V, Babinski negativo

#### 5. 🦵 EXTREMIDADES (`extremidades`)
- **Descrição:** Edema, cianose, pulsos periféricos, tempo de enchimento capilar
- **Palavras-chave:** sem edema, pulsos presentes, TEC < 2s, Homans negativo

#### 6. 🧴 PELE E FÂNEROS (`pele`)
- **Descrição:** Pele, mucosas, conjuntivas, escleras, cabelos, unhas
- **Palavras-chave:** íntegra, normocorada, anictérica, sem lesões

#### 7. 👤 CABEÇA E PESCOÇO (`cabeca_pescoto`)
- **Descrição:** Crânio, face, olhos, orelhas, nariz, cavidade oral, pescoço
- **Palavras-chave:** normocefálico, simétrico, impalpável, central

#### 8. 🦴 SISTEMA LINFÁTICO (`linfonodos_detalhado`)
- **Descrição:** Linfonodos cervicais, axilares, inguinais, baço
- **Palavras-chave:** impalpáveis, fisiológicos, móveis, indolores

#### 9. 👨 APARELHO GENITOURINÁRIO MASCULINO (`aparelho_genitourinario_masc`)
- **Descrição:** Genitália externa, testículos, epidídimos, toque retal
- **Palavras-chave:** íntegra, tópicos, indolores, tamanho normal

#### 10. 👩 APARELHO GENITOURINÁRIO FEMININO (`aparelho_genitourinario_fem`)
- **Descrição:** Exame ginecológico, vulva, especular, toque bimanual
- **Palavras-chave:** normal, íntegros, indolor, tamanho normal

#### 11. 🦴 COLUNA VERTEBRAL (`coluna_vertebral`)
- **Descrição:** Alinhamento, curvaturas, mobilidade, testes especiais
- **Palavras-chave:** alinhamento preservado, indolor, mobilidade completa

#### 12. 🩸 SISTEMA VASCULAR PERIFÉRICO (`vascular_periferico_detalhado`)
- **Descrição:** Pulsos, teste de Allen, insuficiência arterial/venosa
- **Palavras-chave:** palpáveis, simétricos, TEC < 2s, sem edema

#### 13. 🧠 ESTADO MENTAL (`estado_mental_completo`)
- **Descrição:** Vigilância, orientação, linguagem, memória, pensamento
- **Palavras-chave:** vigil, orientado, linguagem fluente, memória preservada

#### 14. 🦴 ARTICULAÇÕES E SISTEMA OSTEOMUSCULAR (`articulacoes_e_osteomuscular`)
- **Descrição:** Marcha, trofismo, força, articulações, coluna
- **Palavras-chave:** marcha normal, força grau V, amplitude completa

### 🔗 INTEGRAÇÃO COM O SISTEMA

#### 1. 🎨 MODAL DE EXAME FÍSICO
- **Acesso:** Botão "🩺 Exame Físico" na barra de ferramentas
- **Interface:** Modal com checkboxes para cada sistema
- **Seleção:** Sistemas marcados como "normal" recebem descrição automática
- **Customização:** Campo de texto para observações adicionais

#### 2. 📋 INCLUSÃO NO PRONTUÁRIO
```javascript
// Processamento no TemplateEngine
function processarExameFisico(dados) {
    const achados = [];
    
    if (dados.exameFisicoSelecionados) {
        dados.exameFisicoSelecionados.forEach(sistema => {
            if (ExameFisicoDB[sistema]) {
                achados.push(ExameFisicoDB[sistema]);
            }
        });
    }
    
    return achados.join('\n\n') || "Exame físico não realizado.";
}
```

#### 3. 🔤 PLACEHOLDERS ESPECÍFICOS
O TemplateEngine suporta placeholders individuais por sistema:
- `{{EXAME_FISICO_CARDIOLOGICO}}` → Sistema cardiovascular
- `{{EXAME_FISICO_RESPIRATORIO}}` → Sistema respiratório
- `{{EXAME_FISICO_ABDOMINAL}}` → Abdome
- `{{EXAME_FISICO_NEUROLOGICO}}` → Sistema neurológico
- `{{EXAME_FISICO_EXTREMIDADES}}` → Extremidades
- `{{EXAME_FISICO_PELE_FANEROS}}` → Pele e fâneros

#### 4. 💾 ARMAZENAMENTO
- **Sessão atual:** Array `examesFisicosSelecionados` em `ProntuarioApp`
- **Persistência:** Incluído em rascunhos salvos no localStorage
- **Histórico:** Parte dos prontuários salvos no histórico

### 🔧 PERSONALIZAÇÃO DOS ACHADOS

#### 1. 📝 MODIFICAR DESCRIÇÃO EXISTENTE
```javascript
// Em js/exame_fisico.js, modificar propriedade do objeto EF
EF.cardiaco = `Nova descrição do sistema cardiovascular...`;
```

#### 2. ➕ ADICIONAR NOVO SISTEMA
```javascript
// Adicionar nova propriedade ao objeto EF
EF.novo_sistema = `Descrição detalhada do novo sistema...`;

// Atualizar interface no modal de exame físico
// (requer modificação em js/ui.js e index.html)
```

#### 3. 🗑️ REMOVER SISTEMA
- Remover propriedade do objeto `EF`
- Atualizar interface no modal de exame físico
- Verificar referências no TemplateEngine

### 🩺 CONSIDERAÇÕES CLÍNICAS

#### 1. 📋 PADRONIZAÇÃO
- **Linguagem:** Português médico brasileiro formal
- **Estrutura:** Segue ordem lógica de exame (inspeção, palpação, percussão, ausculta)
- **Completude:** Inclui achados negativos relevantes
- **Clareza:** Terminologia precisa e não ambígua

#### 2. ⚠️ LIMITAÇÕES
- **Genérico:** Descrições são para achados normais padrão
- **Contexto:** Pode não cobrir todas as variações normais
- **Personalização:** Não substitui descrição específica do caso
- **Atualização:** Requer revisão periódica conforme guidelines

#### 3. 🔍 USO ADEQUADO
- **Para:** Achados normais em pacientes sem alterações
- **Não para:** Achados patológicos ou alterados
- **Complemento:** Deve ser combinado com observações específicas
- **Validação:** Sempre revisar adequação ao paciente específico

### 🔄 FLUXO DE USO NO SISTEMA
1. **Médico** clica em "🩺 Exame Físico"
2. **Modal** abre com lista de sistemas
3. **Médico** marca checkboxes para sistemas normais
4. **Sistema** armazena seleções no estado da aplicação
5. **TemplateEngine** processa seleções durante geração
6. **IA** recebe descrições padronizadas no prompt
7. **Prontuário** final inclui descrições dos sistemas normais

---
