/**
 * Main.js - Lógica Principal do Prontuário IA V2
 * Gerencia fluxo de geração de prontuários e integração com Template Engine
 */

class ProntuarioApp {
    constructor() {
        this.dadosPaciente = {};
        this.templateAtual = null;
        this.medicamentosSelecionados = [];
        this.examesFisicosSelecionados = [];
        this.examesComplementaresSelecionados = [];
        this.orientacoesSelecionadas = [];
        this.cronometroAtivo = false;
        this.tempoInicio = null;
        this.intervaloCronometro = null;

        this.init();
    }

    /**
     * Inicializa a aplicação
     */
    init() {
        // Configurar event listeners
        this.setupEventListeners();

        // Inicializar cronômetro
        this.atualizarCronometro();

        // Carregar templates da especialidade padrão
        this.carregarTemplatesEspecialidade('soap');

        // Configurar modo escuro
        this.setupDarkMode();

        // Verificar perfil médico (boas-vindas ou saudação)
        this._verificarPerfilMedico();
    }

    /**
     * Configura todos os event listeners
     */
    setupEventListeners() {
        // Botão gerar prontuário
        const btnGerar = document.getElementById('btnGerarProntuario');
        if (btnGerar) {
            btnGerar.addEventListener('click', () => this.gerarProntuario());
        } else {
            console.warn('Botão btnGerarProntuario não encontrado');
        }

        // Botão limpar
        const btnLimpar = document.getElementById('btnLimpar');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => this.limparFormulario());
        } else {
            console.warn('Botão btnLimpar não encontrado');
        }

        // Botões de ferramentas
        const btnMedicamentos = document.getElementById('btnMedicamentos');
        if (btnMedicamentos) {
            btnMedicamentos.addEventListener('click', () => this.abrirModalMedicamentos());
        }

        const btnExameFisico = document.getElementById('btnExameFisico');
        if (btnExameFisico) {
            btnExameFisico.addEventListener('click', () => this.abrirModalExameFisico());
        }

        const btnExames = document.getElementById('btnExames');
        if (btnExames) {
            btnExames.addEventListener('click', () => this.abrirModalExames());
        }

        const btnOrientacoes = document.getElementById('btnOrientacoes');
        if (btnOrientacoes) {
            btnOrientacoes.addEventListener('click', () => this.abrirModalOrientacoes());
        }

        const btnCalculadoras = document.getElementById('btnCalculadoras');
        if (btnCalculadoras) {
            btnCalculadoras.addEventListener('click', () => this.abrirModalCalculadoras());
        }

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

        // Toggle Sinais Vitais
        const btnToggleSV = document.getElementById('btnToggleSinaisVitais');
        if (btnToggleSV) {
            btnToggleSV.addEventListener('click', () => this.toggleSinaisVitais());
        }

        // IMC display ao vivo
        ['svPeso', 'svAltura'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.atualizarIMCDisplay());
        });

        // Cronômetro
        const btnIniciarCrono = document.getElementById('btnIniciarCrono');
        if (btnIniciarCrono) {
            btnIniciarCrono.addEventListener('click', () => this.iniciarCronometro());
        }

        const btnPararCrono = document.getElementById('btnPararCrono');
        if (btnPararCrono) {
            btnPararCrono.addEventListener('click', () => this.pararCronometro());
        }

        // Modo escuro
        const btnDarkMode = document.getElementById('btnDarkMode');
        if (btnDarkMode) {
            btnDarkMode.addEventListener('click', () => this.toggleDarkMode());
        }

        const btnMeuPerfil = document.getElementById('btnMeuPerfil');
        if (btnMeuPerfil) {
            btnMeuPerfil.addEventListener('click', () => {
                const perfil = this._carregarPerfilMedico();
                if (perfil.nome) {
                    document.getElementById('bvNome').value = perfil.nome;
                    document.getElementById('bvCRM').value = perfil.crm || '';
                    document.getElementById('bvUF').value = perfil.uf || '';
                    document.getElementById('bvEspecialidade').value = perfil.especialidade || '';
                    document.getElementById('bvCidade').value = perfil.cidade || '';
                }
                if (window.UI) window.UI.abrirModal('modalBoasVindas');
            });
        }

        // Especialidade change
        const especialidadeSelect = document.getElementById('especialidade');
        if (especialidadeSelect) {
            especialidadeSelect.addEventListener('change', (e) => {
                this.carregarTemplatesEspecialidade(e.target.value);
            });
        }

        // Template change
        const templateSelect = document.getElementById('templateSelecionado');
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.selecionarTemplate(e.target.value);
                } else {
                    // Template deselecionado - esconder instruções
                    const instructionsContainer = document.getElementById('templateInstructions');
                    if (instructionsContainer) {
                        instructionsContainer.classList.add('hidden');
                    }
                    this.templateAtual = null;
                }
            });
        }

        // Inputs de dados do paciente (salvar automaticamente)
        const inputsPaciente = ['nomePaciente', 'idadePaciente', 'sexoPaciente',
                               'profissaoPaciente', 'naturalidadePaciente', 'queixaPrincipal'];
        inputsPaciente.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.salvarDadosPaciente());
            }
        });

        // Anamnese (salvar automaticamente)
        const anamneseInput = document.getElementById('anamnese');
        if (anamneseInput) {
            anamneseInput.addEventListener('input', () => this.salvarDadosPaciente());
        }

        // Histórico clínico (salvar automaticamente)
        ['alergiasInput', 'medicacoesUsoInput', 'antecedentesInput'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.salvarDadosPaciente());
        });

        // Copiar prontuário
        const btnCopiar = document.getElementById('btnCopiar');
        if (btnCopiar) {
            btnCopiar.addEventListener('click', () => this.copiarProntuario());
        }

        // Salvar prontuário manualmente
        const btnSalvar = document.getElementById('btnSalvar');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => this.salvarProntuario());
        }

        const btnResumoPaciente = document.getElementById('btnResumoPaciente');
        if (btnResumoPaciente) {
            btnResumoPaciente.addEventListener('click', () => this.abrirModalResumoPaciente());
        }

        // Carregar rascunho
        const btnCarregarRascunho = document.getElementById('btnCarregarRascunho');
        if (btnCarregarRascunho) {
            btnCarregarRascunho.addEventListener('click', () => this.carregarRascunho());
        }
    }

    /**
     * Copia o prontuário gerado para a área de transferência
     */
    async copiarProntuario() {
        const texto = document.getElementById('resultadoProntuario').value.trim();
        if (!texto) {
            alert('Nenhum prontuário para copiar. Gere um prontuário primeiro.');
            return;
        }
        try {
            await navigator.clipboard.writeText(texto);
            const btn = document.getElementById('btnCopiar');
            if (btn) {
                const original = btn.textContent;
                btn.textContent = '✅ Copiado!';
                setTimeout(() => { btn.textContent = original; }, 2000);
            }
        } catch (err) {
            // Fallback para navegadores sem suporte
            const textarea = document.getElementById('resultadoProntuario');
            textarea.select();
            document.execCommand('copy');
            alert('Prontuário copiado!');
        }
    }

    /**
     * Carrega templates para uma especialidade
     * @param {string} especialidade - Nome da especialidade
     */
    async carregarTemplatesEspecialidade(especialidade) {
        if (!especialidade) return;

        const selectTemplate = document.getElementById('templateSelecionado');
        selectTemplate.innerHTML = '<option value="">Carregando templates...</option>';
        selectTemplate.disabled = true;

        // Esconder instruções do template anterior
        const instructionsContainer = document.getElementById('templateInstructions');
        if (instructionsContainer) {
            instructionsContainer.classList.add('hidden');
        }

        try {
            // Usar Template Engine para carregar templates
            await window.TemplateEngine.carregarTemplates(especialidade);
            const templateNames = window.TemplateEngine.getTemplateNames(especialidade);

            // Atualizar dropdown
            selectTemplate.innerHTML = '<option value="">Selecione um template...</option>';

            templateNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                selectTemplate.appendChild(option);
            });

            selectTemplate.disabled = false;

            // Selecionar primeiro template se houver
            if (templateNames.length > 0) {
                selectTemplate.value = templateNames[0];
                this.selecionarTemplate(templateNames[0]);
            }

        } catch (error) {
            console.error('Erro ao carregar templates:', error);
            selectTemplate.innerHTML = '<option value="">Erro ao carregar templates</option>';
        }
    }

    /**
     * Seleciona um template específico
     * @param {string} templateName - Nome do template
     */
    selecionarTemplate(templateName) {
        if (!templateName) return;

        const especialidade = document.getElementById('especialidade').value;
        this.templateAtual = window.TemplateEngine.getTemplate(especialidade, templateName);

        if (this.templateAtual) {
            // Atualizar UI com informações do template (preserva estrutura interna do chip)
            const chipIA = document.getElementById('chipIA');
            if (chipIA) {
                const chipLabel = chipIA.querySelector('span:last-child');
                if (chipLabel) chipLabel.textContent = this.templateAtual.nome;
            }

            // Atualizar instruções do template
            this.atualizarInstrucoesTemplate(this.templateAtual);
        }
    }

    /**
     * Atualiza as instruções do template na interface
     * @param {Object} template - Template selecionado
     */
    atualizarInstrucoesTemplate(template) {
        const instructionsContainer = document.getElementById('templateInstructions');
        const instructionsContent = document.getElementById('templateInstructionsContent');

        if (!instructionsContainer || !instructionsContent) {
            console.warn('Contêiner de instruções do template não encontrado');
            return;
        }

        if (template && template.instrucoes) {
            // Mostrar container e atualizar conteúdo
            instructionsContainer.classList.remove('hidden');
            instructionsContent.textContent = template.instrucoes;
        } else {
            // Esconder container se não houver instruções
            instructionsContainer.classList.add('hidden');
        }
    }

    /**
     * Coleta valores dos campos de sinais vitais
     * @returns {string} String formatada com os sinais vitais
     */
    coletarSinaisVitais() {
        const leituras = [
            { id: 'svPA',     label: 'PA',          unidade: 'mmHg' },
            { id: 'svFC',     label: 'FC',          unidade: 'bpm'  },
            { id: 'svFR',     label: 'FR',          unidade: 'irpm' },
            { id: 'svTemp',   label: 'Temperatura', unidade: '°C'   },
            { id: 'svSatO2',  label: 'SatO₂',       unidade: '%'    },
            { id: 'svHGT',    label: 'HGT',         unidade: 'mg/dL'},
            { id: 'svPeso',   label: 'Peso',        unidade: 'kg'   },
            { id: 'svAltura', label: 'Altura',      unidade: 'm'    }
        ];

        const linhas = [];
        let peso = null, altura = null;

        leituras.forEach(c => {
            const el = document.getElementById(c.id);
            const val = el ? el.value.trim() : '';
            if (!val) return;
            linhas.push(`${c.label}: ${val} ${c.unidade}`);
            if (c.id === 'svPeso')   peso   = parseFloat(val);
            if (c.id === 'svAltura') altura = parseFloat(val);
        });

        // Calcular IMC quando peso e altura estão presentes
        if (peso && altura && altura > 0) {
            const imc = (peso / (altura * altura)).toFixed(1);
            const imcNum = parseFloat(imc);
            let classificacao = '';
            if      (imcNum < 18.5) classificacao = 'Baixo peso';
            else if (imcNum < 25.0) classificacao = 'Eutrófico';
            else if (imcNum < 30.0) classificacao = 'Sobrepeso';
            else if (imcNum < 35.0) classificacao = 'Obesidade grau I';
            else if (imcNum < 40.0) classificacao = 'Obesidade grau II';
            else                    classificacao = 'Obesidade grau III';
            linhas.push(`IMC: ${imc} kg/m² (${classificacao})`);
        }

        return linhas.join('\n');
    }

    /**
     * Atualiza o display de IMC em tempo real no painel de Sinais Vitais
     */
    atualizarIMCDisplay() {
        const pesoEl   = document.getElementById('svPeso');
        const alturaEl = document.getElementById('svAltura');
        const displayEl = document.getElementById('svIMCDisplay');
        if (!displayEl) return;

        const peso   = parseFloat(pesoEl?.value);
        const altura = parseFloat(alturaEl?.value);

        if (!peso || !altura || altura <= 0) {
            displayEl.textContent = '—';
            displayEl.className = 'text-xs text-gray-400';
            return;
        }

        const imc = peso / (altura * altura);
        const imcStr = imc.toFixed(1);
        let label = '', colorClass = '';
        if      (imc < 18.5) { label = 'Baixo peso';         colorClass = 'text-blue-600'; }
        else if (imc < 25.0) { label = 'Eutrófico';           colorClass = 'text-green-600'; }
        else if (imc < 30.0) { label = 'Sobrepeso';           colorClass = 'text-yellow-600'; }
        else if (imc < 35.0) { label = 'Obesidade I';         colorClass = 'text-orange-600'; }
        else if (imc < 40.0) { label = 'Obesidade II';        colorClass = 'text-red-600'; }
        else                 { label = 'Obesidade III';        colorClass = 'text-red-800'; }

        displayEl.textContent = `IMC ${imcStr} — ${label}`;
        displayEl.className = `text-xs font-medium ${colorClass}`;
    }

    /**
     * Alterna visibilidade do painel de sinais vitais
     */
    toggleSinaisVitais() {
        const painel = document.getElementById('painelSinaisVitais');
        const icone = document.getElementById('svToggleIcon');
        if (!painel || !icone) return;

        const isHidden = painel.style.display === 'none';
        painel.style.display = isHidden ? '' : 'none';
        icone.textContent = isHidden ? '▲' : '▼';
    }

    /**
     * Coleta dados do paciente do formulário
     * @returns {Object} Dados do paciente
     */
    coletarDadosPaciente() {
        return {
            nome: document.getElementById('nomePaciente').value.trim(),
            idade: document.getElementById('idadePaciente').value.trim(),
            sexo: document.getElementById('sexoPaciente').value.trim(),
            profissao: document.getElementById('profissaoPaciente').value.trim(),
            naturalidade: document.getElementById('naturalidadePaciente').value.trim(),
            queixa: document.getElementById('queixaPrincipal').value.trim(),
            anamnese: document.getElementById('anamnese').value.trim(),
            especialidade: document.getElementById('especialidade').value,
            template: document.getElementById('templateSelecionado').value,
            tempoConsulta: this.cronometroAtivo ? this.calcularTempoDecorrido() : 0,
            // Exames físicos ainda vão para a IA — o template engine precisa deles
            // para preencher {{EXAME_FISICO_CARDIOLOGICO}}, {{EXAME_FISICO_RESPIRATORIO}} etc.
            // Medicamentos, exames complementares e orientações ficam fora (bloco appended).
            exames: this.examesFisicosSelecionados,
            sinaisVitais: this.coletarSinaisVitais(),
            svPeso:   (() => { const el = document.getElementById('svPeso');   return el ? el.value.trim() : ''; })(),
            svAltura: (() => { const el = document.getElementById('svAltura'); return el ? el.value.trim() : ''; })(),
            svPA:     (() => { const el = document.getElementById('svPA');     return el ? el.value.trim() : ''; })(),
            svFC:     (() => { const el = document.getElementById('svFC');     return el ? el.value.trim() : ''; })(),
            svFR:     (() => { const el = document.getElementById('svFR');     return el ? el.value.trim() : ''; })(),
            svTemp:   (() => { const el = document.getElementById('svTemp');   return el ? el.value.trim() : ''; })(),
            svSatO2:  (() => { const el = document.getElementById('svSatO2'); return el ? el.value.trim() : ''; })(),
            svHGT:    (() => { const el = document.getElementById('svHGT');   return el ? el.value.trim() : ''; })(),
            alergias:      (() => { const el = document.getElementById('alergiasInput');      return el ? el.value.trim() : ''; })(),
            medicacoesUso: (() => { const el = document.getElementById('medicacoesUsoInput'); return el ? el.value.trim() : ''; })(),
            antecedentes:  (() => { const el = document.getElementById('antecedentesInput');  return el ? el.value.trim() : ''; })()
        };
    }

    /**
     * Salva dados do paciente temporariamente
     */
    salvarDadosPaciente() {
        this.dadosPaciente = this.coletarDadosPaciente();

        // Salvar no localStorage para recuperação
        try {
            localStorage.setItem('prontuario_draft', JSON.stringify(this.dadosPaciente));
        } catch (error) {
            console.warn('Não foi possível salvar rascunho:', error);
        }
    }

    /**
     * Se os arrays de seleção estiverem vazios (ex: após F5), recupera os
     * itens que estão no painel lateral a partir do localStorage (itensFixados).
     * Chamado no início de gerarProntuario() para garantir que os dados estejam
     * disponíveis tanto para o template engine quanto para o bloco appended.
     */
    /**
     * Se os arrays de seleção estiverem vazios (ex: após F5), recupera os
     * itens que estão no painel lateral a partir do localStorage (itensFixados).
     * Cada array é verificado e preenchido independentemente — arrays que já
     * foram populados via modal nesta sessão não são sobrescritos.
     */
    _garantirArraysCarregados() {
        try {
            const fixados = JSON.parse(localStorage.getItem('itensFixados') || '[]');
            if (!Array.isArray(fixados) || fixados.length === 0) return;

            // Agrupa itens do painel por tipo
            const porTipo = { medicamento: [], exame_fisico: [], exame: [], orientacao: [] };
            fixados.forEach(item => {
                if (item.dados && porTipo[item.tipo] !== undefined)
                    porTipo[item.tipo].push(item.dados);
            });

            // Só preenche o array se estiver vazio (preserva seleções via modal)
            if (this.medicamentosSelecionados.length === 0 && porTipo.medicamento.length > 0)
                this.medicamentosSelecionados = [...porTipo.medicamento];

            if (this.examesFisicosSelecionados.length === 0 && porTipo.exame_fisico.length > 0)
                this.examesFisicosSelecionados = [...porTipo.exame_fisico];

            if (this.examesComplementaresSelecionados.length === 0 && porTipo.exame.length > 0)
                this.examesComplementaresSelecionados = [...porTipo.exame];

            if (this.orientacoesSelecionadas.length === 0 && porTipo.orientacao.length > 0)
                this.orientacoesSelecionadas = [...porTipo.orientacao];

        } catch (e) {
            console.warn('Não foi possível recuperar itens do painel do localStorage:', e);
        }
    }

    /**
     * Gera prontuário usando IA
     */
    async gerarProntuario() {
        // Recuperar itens do painel se os arrays estiverem vazios (ex: após F5)
        this._garantirArraysCarregados();

        // Coletar dados
        const dados = this.coletarDadosPaciente();


        // Validação básica
        if (!dados.nome || !dados.queixa || !dados.anamnese) {
            alert('Preencha pelo menos: Nome, Queixa Principal e Anamnese');
            return;
        }

        if (!this.templateAtual) {
            alert('Selecione uma especialidade e um template');
            return;
        }

        // Mostrar status de geração
        this.mostrarStatusGeracao(true);

        try {
            // Gerar prompt usando Template Engine
            const prompt = window.TemplateEngine.gerarPromptIA(this.templateAtual, dados);

            // Chamar API
            const resultado = await window.API.gerarProntuario(prompt);

            // Coletar itens do painel e formatar para o prontuário
            const itensPainel = this.coletarItensDoPainel();
            const textoItens = this.formatarItensParaProntuario(itensPainel);

            // Combinar resultado da IA com itens do painel (se houver)
            let resultadoFinal = resultado;
            if (textoItens) {
                resultadoFinal = resultado + textoItens;
            }

            // Exibir resultado
            document.getElementById('resultadoProntuario').value = resultadoFinal;

            // Salvar automaticamente
            await this.salvarProntuarioGerado(resultadoFinal, dados);

            // Atualizar chip IA (preserva estrutura interna)
            const chipIA = document.getElementById('chipIA');
            if (chipIA) {
                const dot = chipIA.querySelector('span:first-child');
                const label = chipIA.querySelector('span:last-child');
                if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
                if (label) label.textContent = 'Gerado ✓';
            }

        } catch (error) {
            console.error('Erro ao gerar prontuário:', error);
            alert(`Erro: ${error.message}`);

            // Atualizar chip IA (preserva estrutura interna)
            const chipIA = document.getElementById('chipIA');
            if (chipIA) {
                const dot = chipIA.querySelector('span:first-child');
                const label = chipIA.querySelector('span:last-child');
                if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-red-400';
                if (label) label.textContent = 'Erro ✕';
            }

        } finally {
            this.mostrarStatusGeracao(false);
        }
    }

    /**
     * Mostra/oculta status de geração
     * @param {boolean} mostrar - true para mostrar, false para ocultar
     */
    mostrarStatusGeracao(mostrar) {
        const statusDiv = document.getElementById('statusGeracao');
        const barraProgresso = document.getElementById('barraProgresso');

        if (mostrar) {
            statusDiv.classList.remove('hidden');

            // Animação de progresso
            let progresso = 0;
            const intervalo = setInterval(() => {
                progresso += 5;
                if (progresso > 90) progresso = 90;
                barraProgresso.style.width = `${progresso}%`;
            }, 200);

            // Guardar intervalo para limpar depois
            this.intervaloProgresso = intervalo;

        } else {
            statusDiv.classList.add('hidden');
            if (this.intervaloProgresso) {
                clearInterval(this.intervaloProgresso);
                this.intervaloProgresso = null;
            }
            barraProgresso.style.width = '100%';
            setTimeout(() => {
                barraProgresso.style.width = '0%';
            }, 500);
        }
    }

    /**
     * Salva prontuário gerado
     * @param {string} texto - Texto do prontuário
     * @param {Object} dados - Dados do paciente
     */
    async salvarProntuarioGerado(texto, dados) {
        try {
            const prontuario = {
                ...dados,
                texto: texto,
                data: new Date().toISOString(),
                timestamp: Date.now()
            };

            await window.API.salvarProntuario(prontuario);
            console.log('Prontuário salvo com sucesso');

        } catch (error) {
            console.error('Erro ao salvar prontuário:', error);
            // Não alertar o usuário - já está salvo localmente
        }
    }

    /**
     * Salva prontuário manualmente
     */
    async salvarProntuario() {
        const texto = document.getElementById('resultadoProntuario').value.trim();
        if (!texto) {
            alert('Nenhum prontuário para salvar. Gere um prontuário primeiro.');
            return;
        }

        const dados = this.coletarDadosPaciente();
        await this.salvarProntuarioGerado(texto, dados);
        alert('Prontuário salvo com sucesso!');
    }

    /**
     * Carrega histórico de prontuários
     */
    async carregarHistorico() {
        try {
            const historico = await window.API.carregarHistorico();

            // Em uma implementação completa, abriria um modal com a lista

            if (historico.length > 0) {
                alert(`Carregado ${historico.length} prontuários do histórico.`);
            } else {
                alert('Nenhum prontuário no histórico.');
            }

        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            alert('Erro ao carregar histórico.');
        }
    }

    /**
     * Limpa formulário
     */
    limparFormulario() {
        if (!confirm('Limpar todos os dados do formulário?')) return;

        // Limpar inputs
        const inputs = document.querySelectorAll('input[type="text"], textarea, select');
        inputs.forEach(input => {
            if (input.id !== 'especialidade') { // Manter especialidade
                input.value = '';
            }
        });

        // Resetar seleções
        this.medicamentosSelecionados = [];
        this.examesFisicosSelecionados = [];
        this.examesComplementaresSelecionados = [];
        this.orientacoesSelecionadas = [];

        // Limpar sinais vitais
        ['svPA', 'svFC', 'svFR', 'svTemp', 'svSatO2', 'svHGT', 'svPeso', 'svAltura'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // Limpar histórico clínico
        ['alergiasInput', 'medicacoesUsoInput', 'antecedentesInput'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // Resetar template (preserva estrutura interna do chip)
        this.templateAtual = null;
        const chipIA = document.getElementById('chipIA');
        if (chipIA) {
            const chipLabel = chipIA.querySelector('span:last-child');
            if (chipLabel) chipLabel.textContent = 'Conectado';
        }

        // Esconder instruções do template
        const instructionsContainer = document.getElementById('templateInstructions');
        if (instructionsContainer) {
            instructionsContainer.classList.add('hidden');
        }

        // Limpar rascunho
        localStorage.removeItem('prontuario_draft');
    }

    /**
     * Configura modo escuro
     */
    setupDarkMode() {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        }
    }

    /**
     * Alterna modo escuro
     * Aplica em <html> (para Tailwind dark:) e em <body> (para CSS custom body.dark)
     */
    toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        document.body.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark.toString());
        // Atualizar ícone do botão
        const btn = document.getElementById('btnDarkMode');
        if (btn) btn.querySelector('span').textContent = isDark ? '☀️' : '🌙';
    }

    /**
     * Inicia cronômetro
     */
    iniciarCronometro() {
        if (this.cronometroAtivo) return;

        this.cronometroAtivo = true;
        this.tempoInicio = Date.now();

        this.intervaloCronometro = setInterval(() => {
            this.atualizarCronometro();
        }, 1000);

        console.log('Cronômetro iniciado');
    }

    /**
     * Para cronômetro
     */
    pararCronometro() {
        if (!this.cronometroAtivo) return;

        this.cronometroAtivo = false;
        if (this.intervaloCronometro) {
            clearInterval(this.intervaloCronometro);
            this.intervaloCronometro = null;
        }

    }

    /**
     * Calcula tempo decorrido
     * @returns {number} Tempo em segundos
     */
    calcularTempoDecorrido() {
        if (!this.tempoInicio) return 0;
        return Math.floor((Date.now() - this.tempoInicio) / 1000);
    }

    /**
     * Atualiza display do cronômetro
     */
    atualizarCronometro() {
        const segundos = this.calcularTempoDecorrido();
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;

        const display = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
        document.getElementById('cronometroDisplay').textContent = display;
    }

    /**
     * Abre modal de medicamentos
     */
    abrirModalMedicamentos() {
        // Implementação no ui.js
        if (window.UI) {
            window.UI.abrirModalMedicamentos(this.medicamentosSelecionados, (selecionados) => {
                this.medicamentosSelecionados = selecionados;
            });
        }
    }

    /**
     * Abre modal de exames
     */
    abrirModalExames() {
        // Implementação no ui.js
        if (window.UI) {
            window.UI.abrirModalExames(this.examesComplementaresSelecionados, (selecionados) => {
                this.examesComplementaresSelecionados = selecionados;
            });
        }
    }

    /**
     * Abre modal de exame físico
     */
    abrirModalExameFisico() {
        // Implementação no ui.js
        if (window.UI) {
            window.UI.abrirModalExameFisico(this.examesFisicosSelecionados, (selecionados) => {
                this.examesFisicosSelecionados = selecionados;
            });
        }
    }

    /**
     * Abre modal de orientações
     */
    abrirModalOrientacoes() {
        // Implementação no ui.js
        if (window.UI) {
            window.UI.abrirModalOrientacoes(this.orientacoesSelecionadas, (selecionados) => {
                this.orientacoesSelecionadas = selecionados;
            });
        }
    }

    /**
     * Abre modal de calculadoras
     */
    abrirModalCalculadoras() {
        // Implementação no ui.js
        if (window.UI) {
            window.UI.abrirModalCalculadoras();
        }
    }

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

    /**
     * Coleta todos os itens selecionados nas ferramentas rápidas.
     * Lê diretamente dos arrays internos (fonte única de verdade),
     * sem depender do DOM do painel lateral.
     * @returns {Object} { medicamentos, exames, orientacoes }
     */
    coletarItensDoPainel() {
        // ── Medicamentos ──────────────────────────────────────────────
        // Extrai todos os regimes de dosagem + genérico + classe.
        const medicamentos = this.medicamentosSelecionados.map(m => {
            const item = {
                nome: m.nome || String(m),
                generico: m.generico || '',
                classe: m.classe || ''
            };
            if (m.vias && m.vias.length > 0) {
                item.vias = m.vias.map(v => {
                    const partes = [];
                    if (v.via)       partes.push(v.via);
                    if (v.dose)      partes.push(`dose: ${v.dose}`);
                    if (v.intervalo) partes.push(`a cada ${v.intervalo}`);
                    if (v.max)       partes.push(`máx. ${v.max}`);
                    if (v.obs)       partes.push(`obs: ${v.obs}`);
                    return partes.join(' — ');
                });
            }
            return item;
        });

        // ── Exames complementares ─────────────────────────────────────
        // Usa as instruções de preparo do banco de dados.
        const examesCompl = this.examesComplementaresSelecionados.map(e => ({
            nome: e.nome || String(e),
            detalhe: Array.isArray(e.preparo) && e.preparo.length
                ? e.preparo.join('; ')
                : (typeof e.preparo === 'string' ? e.preparo : '')
        }));

        // ── Orientações ───────────────────────────────────────────────
        // Suporta tanto strings simples quanto objetos { condicao, orientacoes[], retorno }.
        const orientacoes = this.orientacoesSelecionadas
            .map(o => (typeof o === 'string' ? o : (o.condicao || '')))
            .filter(Boolean);

        return {
            medicamentos,
            exames: examesCompl,
            orientacoes
        };
    }

    /**
     * Formata os itens do painel para inclusão no prontuário
     * @param {Object} itens - Itens coletados do painel
     * @returns {string} Texto formatado para o prontuário
     */
    formatarItensParaProntuario(itens) {
        let texto = '';

        // Verificar se há algum item
        const totalItens = itens.medicamentos.length + itens.exames.length + itens.orientacoes.length;
        if (totalItens === 0) {
            return '';
        }

        // Adicionar cabeçalho
        texto += '\n─────────────────────────────────\n';
        texto += 'CONDUTAS REGISTRADAS\n';
        texto += '─────────────────────────────────\n';

        // Adicionar medicamentos
        if (itens.medicamentos.length > 0) {
            texto += 'Prescrição médica:\n';
            itens.medicamentos.forEach(med => {
                let linha = `  • ${med.nome}`;
                if (med.generico) linha += ` (${med.generico})`;
                if (med.classe)   linha += ` — ${med.classe}`;
                texto += linha + '\n';
                if (med.vias && med.vias.length > 0) {
                    med.vias.forEach(via => {
                        texto += `      ${via}\n`;
                    });
                }
            });
            texto += '\n';
        }

        // Adicionar exames
        if (itens.exames.length > 0) {
            texto += 'Exames solicitados:\n';
            itens.exames.forEach(exame => {
                texto += `  • ${exame.nome}\n`;
                if (exame.detalhe && exame.detalhe.trim()) {
                    texto += `      Preparo: ${exame.detalhe}\n`;
                }
            });
            texto += '\n';
        }

        // Adicionar orientações
        if (itens.orientacoes.length > 0) {
            texto += 'Orientações ao paciente:\n';
            itens.orientacoes.forEach(orientacao => {
                texto += `  • ${orientacao}\n`;
            });
            texto += '\n';
        }

        texto += '─────────────────────────────────\n';
        return texto;
    }

    /**
     * Carrega rascunho salvo
     */
    carregarRascunho() {
        try {
            const draft = localStorage.getItem('prontuario_draft');
            if (draft) {
                const dados = JSON.parse(draft);

                // Preencher formulário
                document.getElementById('nomePaciente').value = dados.nome || '';
                document.getElementById('idadePaciente').value = dados.idade || '';
                document.getElementById('sexoPaciente').value = dados.sexo || '';
                document.getElementById('profissaoPaciente').value = dados.profissao || '';
                document.getElementById('naturalidadePaciente').value = dados.naturalidade || '';
                document.getElementById('queixaPrincipal').value = dados.queixa || '';
                document.getElementById('anamnese').value = dados.anamnese || '';

                if (dados.especialidade) {
                    document.getElementById('especialidade').value = dados.especialidade;
                    this.carregarTemplatesEspecialidade(dados.especialidade).then(() => {
                        if (dados.template) {
                            document.getElementById('templateSelecionado').value = dados.template;
                            this.selecionarTemplate(dados.template);
                        }
                    });
                }

                // Restaurar sinais vitais
                const svCampos = ['svPA','svFC','svFR','svTemp','svSatO2','svHGT','svPeso','svAltura'];
                svCampos.forEach(id => {
                    const el = document.getElementById(id);
                    if (el && dados[id] !== undefined && dados[id] !== '') {
                        el.value = dados[id];
                    }
                });

                // Restaurar histórico clínico
                const elAlergias = document.getElementById('alergiasInput');
                if (elAlergias && dados.alergias !== undefined) elAlergias.value = dados.alergias;
                const elMedsUso = document.getElementById('medicacoesUsoInput');
                if (elMedsUso && dados.medicacoesUso !== undefined) elMedsUso.value = dados.medicacoesUso;
                const elAntec = document.getElementById('antecedentesInput');
                if (elAntec && dados.antecedentes !== undefined) elAntec.value = dados.antecedentes;

                console.log('Rascunho carregado');
            }
        } catch (error) {
            console.warn('Erro ao carregar rascunho:', error);
        }
    }

    // ───────────────────────────── Atestado Médico ─────────────────────────────

    abrirModalAtestado() {
        // Set today's date as default
        const dataInput = document.getElementById('atestData');
        if (dataInput) dataInput.value = new Date().toISOString().split('T')[0];

        // Load doctor profile from localStorage
        this._carregarPerfilMedicoNoModal();

        // Wire radio: show/hide conditional fields
        document.querySelectorAll('input[name="atestTipo"]').forEach(r => {
            r.onchange = () => {
                const acompDiv = document.getElementById('atestAcompDiv');
                if (acompDiv) acompDiv.classList.toggle('hidden', r.value !== 'acompanhante');
                const compareDiv = document.getElementById('atestCompareDiv');
                if (compareDiv) {
                    compareDiv.classList.toggle('hidden', r.value !== 'comparecimento');
                    if (r.value === 'comparecimento') {
                        const dataEl = document.getElementById('atestCompareData');
                        if (dataEl && !dataEl.value) dataEl.value = new Date().toISOString().split('T')[0];
                    }
                }
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
        } else if (tipo === 'comparecimento') {
            const localEl = document.getElementById('atestCompareLocal');
            const dataCompareEl = document.getElementById('atestCompareData');
            const chegadaEl = document.getElementById('atestCompareChegada');
            const saidaEl = document.getElementById('atestCompareSaida');

            const local = localEl?.value.trim() || '';
            let dataCompareISO = dataCompareEl?.value || new Date().toISOString().split('T')[0];
            const chegada = chegadaEl?.value || '';
            const saida = saidaEl?.value || '';

            const [anoC, mesC, diaC] = dataCompareISO.split('-');
            const dataCompareExtenso = `${parseInt(diaC)} de ${meses[parseInt(mesC) - 1]} de ${anoC}`;

            const localClause = local ? `em ${local}` : 'nesta instituição';

            let periodoClause = '';
            if (chegada && saida) {
                periodoClause = `no período das ${chegada} às ${saida} horas`;
            } else if (chegada) {
                const horaChegada = parseInt(chegada.split(':')[0]);
                const turno = horaChegada < 12 ? 'manhã' : 'tarde';
                periodoClause = `no período da ${turno}`;
            } else {
                periodoClause = '';
            }

            texto = `ATESTADO DE COMPARECIMENTO\n\n` +
                `Atesto para os devidos fins que o(a) paciente ${nomePaciente} esteve presente ` +
                `${localClause} no dia ${dataCompareExtenso}` +
                (periodoClause ? `, ${periodoClause},` : '') +
                ` para atendimento médico.\n\n` +
                `${medCidade}, ${dataCompareExtenso}.\n\n\n` +
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

    abrirModalReceituario() {
        this._garantirArraysCarregados();

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

    _verificarPerfilMedico() {
        const perfil = this._carregarPerfilMedico();
        if (!perfil.nome) {
            this._abrirModalBoasVindas();
        } else {
            this._aplicarSaudacao(perfil);
        }
    }

    _abrirModalBoasVindas() {
        if (window.UI) window.UI.abrirModal('modalBoasVindas');

        document.getElementById('bvBtnPular')?.addEventListener('click', () => {
            if (window.UI) window.UI.fecharModal('modalBoasVindas');
        });

        document.getElementById('bvBtnSalvar')?.addEventListener('click', () => {
            const nome = document.getElementById('bvNome')?.value.trim();
            if (!nome) {
                alert('Informe ao menos seu nome para continuar.');
                return;
            }
            const perfil = {
                nome,
                crm: document.getElementById('bvCRM')?.value.trim() || '',
                uf: document.getElementById('bvUF')?.value || '',
                especialidade: document.getElementById('bvEspecialidade')?.value.trim() || '',
                cidade: document.getElementById('bvCidade')?.value.trim() || '',
            };
            localStorage.setItem('doctor_profile', JSON.stringify(perfil));
            if (window.UI) window.UI.fecharModal('modalBoasVindas');
            this._aplicarSaudacao(perfil);
        });
    }

    _aplicarSaudacao(perfil) {
        const subtitles = document.querySelectorAll('header p, header span');
        subtitles.forEach(el => {
            if (el.textContent.includes('Prontuário') || el.textContent.includes('prontuário')) {
                el.textContent = `Olá, Dr(a). ${perfil.nome}${perfil.especialidade ? ' · ' + perfil.especialidade : ''}`;
            }
        });
    }
}

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que todos os scripts carregaram
    setTimeout(() => {
        try {
            window.ProntuarioApp = new ProntuarioApp();

            // Carregar rascunho se existir
            setTimeout(() => {
                window.ProntuarioApp.carregarRascunho();
            }, 500);
        } catch (error) {
            console.error('Erro ao inicializar ProntuarioApp:', error);
            alert('Erro ao inicializar a aplicação. Verifique o console para detalhes.');
        }
    }, 100);
});