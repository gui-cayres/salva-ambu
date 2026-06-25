/**
 * UI Manager V2 - Gerenciador de Interface para Prontuário IA V2
 * Gerencia modais, notificações e interações de UI
 */

class UIManager {
    constructor() {
        this.init();
    }

    /**
     * Inicializa o UI Manager
     */
    init() {
        this.setupModals();
        this.setupKeyboardShortcuts();
        this.setupPainelFerramentas();
    }

    /**
     * Configura modais
     */
    setupModals() {
        // Fechar modal ao clicar fora (no overlay)
        document.addEventListener('click', (e) => {
            // Verificar se o elemento clicado é exatamente o overlay do modal
            // (tem a classe 'modal' e é provavelmente o elemento mais externo)
            if (e.target.classList && e.target.classList.contains('modal')) {
                this.fecharModal(e.target.id);
                return;
            }

            // Debug: log quando clica em um input dentro de um modal
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // Verificar se está dentro de um modal
                let parent = e.target.parentElement;
                let inModal = false;
                while (parent) {
                    if (parent.classList && parent.classList.contains('modal')) {
                        inModal = true;
                        break;
                    }
                    parent = parent.parentElement;
                }
                if (inModal) {
                    // Input clicado dentro de modal
                }
            }
        });

        // Fechar com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharTodosModais();
            }
        });
    }

    /**
     * Configura atalhos de teclado
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S: Salvar prontuário
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (window.ProntuarioApp) {
                    window.ProntuarioApp.salvarProntuario();
                }
            }

            // Ctrl/Cmd + N: Limpar formulário
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                if (window.ProntuarioApp) {
                    window.ProntuarioApp.limparFormulario();
                }
            }
        });
    }

    /**
     * Abre modal de medicamentos
     * @param {Array} selecionados - Medicamentos já selecionados
     * @param {Function} callback - Função chamada ao confirmar seleção
     */
    abrirModalMedicamentos(selecionados = [], callback = null) {
        this.criarModalMedicamentos(selecionados, callback);
        this.abrirModal('modalMedicamentos');
    }

    /**
     * Abre modal de exames
     * @param {Array} selecionados - Exames já selecionados
     * @param {Function} callback - Função chamada ao confirmar seleção
     */
    abrirModalExames(selecionados = [], callback = null) {
        this.criarModalExames(selecionados, callback);
        this.abrirModal('modalExames');
    }

    /**
     * Abre modal de exame físico
     * @param {Array} selecionados - Exames físicos já selecionados
     * @param {Function} callback - Função chamada ao confirmar seleção
     */
    abrirModalExameFisico(selecionados = [], callback = null) {
        this.criarModalExameFisico(selecionados, callback);
        this.abrirModal('modalExameFisico'); // Usa modal específico para exame físico
    }

    /**
     * Abre modal de orientações
     * @param {Array} selecionados - Orientações já selecionadas
     * @param {Function} callback - Função chamada ao confirmar seleção
     */
    abrirModalOrientacoes(selecionados = [], callback = null) {
        this.criarModalOrientacoes(selecionados, callback);
        this.abrirModal('modalOrientacoes');
    }

    /**
     * Abre modal de calculadoras
     */
    abrirModalCalculadoras() {
        this.criarModalCalculadoras();
        this.abrirModal('modalCalculadoras');
    }

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

    /**
     * Cria conteúdo do modal de medicamentos
     */
    criarModalMedicamentos(selecionados, callback) {
        const modal = document.getElementById('modalMedicamentos');
        if (!modal) return;

        // Carregar medicamentos do arquivo externo
        let medicamentosObjs = [];
        if (window.MedicamentosDB && Array.isArray(window.MedicamentosDB)) {
            medicamentosObjs = window.MedicamentosDB;
        } else {
            // Fallback para lista básica
            medicamentosObjs = [
                { nome: 'Dipirona 500mg - 1cp 6/6h' },
                { nome: 'Paracetamol 750mg - 1cp 8/8h' },
                { nome: 'Ibuprofeno 600mg - 1cp 8/8h' },
                { nome: 'Amoxicilina 500mg - 1cp 8/8h' },
                { nome: 'Losartana 50mg - 1cp/dia' },
                { nome: 'Hidroclorotiazida 25mg - 1cp/dia' },
                { nome: 'Omeprazol 20mg - 1cp/dia' },
                { nome: 'Simvastatina 20mg - 1cp à noite' }
            ];
        }

        modal.querySelector('.bg-white').innerHTML = gerarConteudoModalMedicamentos(medicamentosObjs, selecionados);

        // Adicionar event listeners para botões "Adicionar" de medicamentos
        modal.querySelector('.bg-white').addEventListener('click', (e) => {
            if (e.target.classList.contains('adicionar-medicamento-btn')) {
                const index = parseInt(e.target.dataset.medicamentoIndex);
                if (!isNaN(index)) {
                    this.adicionarMedicamento(index);
                }
            }
        });

        // Guardar callback e dados dos medicamentos
        if (callback) {
            modal.dataset.callback = 'medicamentos';
            modal.dataset.selecionados = JSON.stringify(selecionados);
            modal.dataset.callbackFunc = callback.toString();
            modal.dataset.medicamentosObjs = JSON.stringify(medicamentosObjs);
        }

        // Configurar busca
        const buscaInput = document.getElementById('buscaMedicamentos');
        if (buscaInput) {
            buscaInput.addEventListener('input', (e) => {
                const termo = e.target.value.toLowerCase();
                const itens = modal.querySelectorAll('.accordion-item');
                itens.forEach(function(item) {
                    var busca = (item.getAttribute('data-busca') || item.textContent.toLowerCase());
                    item.style.display = busca.includes(termo) ? '' : 'none';
                });
            });
        }

        // Accordion: toggle expansion on row click (single-open)
        modal.querySelector('.bg-white').addEventListener('click', function(e) {
            var trigger = e.target.closest('.accordion-trigger');
            if (!trigger) return;
            // Don't toggle if clicking checkbox or button
            if (e.target.type === 'checkbox' || e.target.closest('button')) return;
            var item = trigger.closest('.accordion-item');
            if (!item) return;
            var body = item.querySelector('.accordion-body');
            var arrow = item.querySelector('.accordion-arrow');
            var isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
            // Close all others
            item.closest('#listaMedicamentos').querySelectorAll('.accordion-body').forEach(function(b) {
                b.style.maxHeight = '0px';
            });
            item.closest('#listaMedicamentos').querySelectorAll('.accordion-arrow').forEach(function(a) {
                a.style.transform = 'rotate(0deg)';
            });
            if (!isOpen) {
                body.style.maxHeight = body.scrollHeight + 'px';
                if (arrow) arrow.style.transform = 'rotate(90deg)';
            }
        });

    }

    /**
     * Cria conteúdo do modal de exames
     */
    criarModalExames(selecionados, callback) {
        const modal = document.getElementById('modalExames');
        if (!modal) {
            return;
        }

        // Carregar exames do arquivo externo
        let examesObjs = [];
        if (window.ExamesComplementaresDB && Array.isArray(window.ExamesComplementaresDB)) {
            examesObjs = window.ExamesComplementaresDB.map(exame => {
                // Converter arrays para strings formatadas
                const formatarArray = (arr) => {
                    if (!arr) return '';
                    if (Array.isArray(arr)) {
                        return arr.map(item => `• ${item}`).join('\n');
                    }
                    return arr;
                };

                return {
                    ...exame,
                    indicacoes: formatarArray(exame.indicacoes),
                    preparo: formatarArray(exame.preparo),
                    contraindicacoes: formatarArray(exame.contraindicacoes)
                };
            });
        }

        // Adicionar exames físicos separadamente, preservando sua estrutura original
        if (window.ExameFisicoDB) {
            const examesFisicos = Object.entries(window.ExameFisicoDB).map(([sistema, descricao]) => ({
                nome: `Exame Físico: ${sistema}`,
                sistema: sistema,
                descricao: descricao,
                tipo: 'fisico',
                grupo: 'Exame Físico',
                indicacoes: 'Avaliação do sistema',
                preparo: 'Nenhum preparo necessário',
                contraindicacoes: 'Nenhuma contraindicação específica',
                tempo: 'Durante a consulta',
                obs: descricao.substring(0, 100) + '...'
            }));
            examesObjs = examesObjs.concat(examesFisicos);
        }

        if (examesObjs.length === 0) {
            // Fallback para lista básica
            examesObjs = [
                { nome: 'Hemograma completo', grupo: 'Hematologia', indicacoes: 'Avaliação geral, anemia, infecções', preparo: 'Jejum não obrigatório', contraindicacoes: 'Nenhuma', tempo: '24h', obs: '' },
                { nome: 'Glicemia de jejum', grupo: 'Bioquímica', indicacoes: 'Rastreio de diabetes, controle glicêmico', preparo: 'Jejum de 8-12 horas', contraindicacoes: 'Nenhuma', tempo: '24h', obs: '' },
                { nome: 'Colesterol total e frações', grupo: 'Lipídios', indicacoes: 'Avaliação de risco cardiovascular', preparo: 'Jejum de 12 horas', contraindicacoes: 'Nenhuma', tempo: '24h', obs: '' },
                { nome: 'TSH e T4 livre', grupo: 'Hormônios', indicacoes: 'Avaliação tireoidiana', preparo: 'Jejum não obrigatório', contraindicacoes: 'Nenhuma', tempo: '48h', obs: '' },
                { nome: 'EAS + Urinocultura', grupo: 'Urina', indicacoes: 'Infecção urinária, hematúria', preparo: 'Primeira urina da manhã', contraindicacoes: 'Nenhuma', tempo: '48-72h', obs: '' },
                { nome: 'Raio-X de tórax', grupo: 'Imagem', indicacoes: 'Tosse persistente, dor torácica', preparo: 'Remover objetos metálicos', contraindicacoes: 'Gestação', tempo: 'Imediato', obs: '' },
                { nome: 'Ultrassom abdominal', grupo: 'Imagem', indicacoes: 'Dor abdominal, avaliação de órgãos', preparo: 'Jejum de 6-8 horas', contraindicacoes: 'Nenhuma', tempo: 'Imediato', obs: '' },
                { nome: 'ECG', grupo: 'Cardiologia', indicacoes: 'Arritmias, dor torácica', preparo: 'Repouso prévio', contraindicacoes: 'Nenhuma', tempo: 'Imediato', obs: '' },
                { nome: 'Endoscopia digestiva alta', grupo: 'Endoscopia', indicacoes: 'Dispepsia, pirose, anemia', preparo: 'Jejum de 8 horas', contraindicacoes: 'Instabilidade hemodinâmica', tempo: '7 dias', obs: '' },
                { nome: 'Colonoscopia', grupo: 'Endoscopia', indicacoes: 'Rastreio de câncer, sangramento', preparo: 'Dieta e laxantes prévios', contraindicacoes: 'Perfuração intestinal suspeita', tempo: '7-14 dias', obs: '' }
            ];
        }

        modal.querySelector('.bg-white').innerHTML = gerarConteudoModalExames(examesObjs, selecionados);

        // Adicionar event listeners para botões "Adicionar"
        modal.querySelector('.bg-white').addEventListener('click', function(e) {
            if (e.target.classList.contains('adicionar-exame-btn')) {
                var index = parseInt(e.target.dataset.exameIndex);
                if (!isNaN(index)) {
                    window.UI.adicionarExame(index);
                }
            }
        });

        // Guardar callback e dados dos exames
        if (callback) {
            modal.dataset.callback = 'exames';
            modal.dataset.selecionados = JSON.stringify(selecionados);
            modal.dataset.callbackFunc = callback.toString();
            modal.dataset.examesObjs = JSON.stringify(examesObjs);
        }

        // Configurar busca
        var buscaInput = document.getElementById('buscaExames');
        if (buscaInput) {
            buscaInput.addEventListener('input', function(e) {
                var termo = e.target.value.toLowerCase();
                var items = document.getElementById('listaExames').querySelectorAll('.accordion-item');
                items.forEach(function(item) {
                    var busca = (item.getAttribute('data-busca') || '').toLowerCase();
                    item.style.display = busca.includes(termo) ? '' : 'none';
                });
            });
        }

        // Configurar accordion com event delegation
        var listaExames = document.getElementById('listaExames');
        if (listaExames) {
            listaExames.addEventListener('click', function(e) {
                var trigger = e.target.closest('.accordion-trigger');
                if (!trigger) return;
                // Ignorar clique no checkbox ou botao
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                var item = trigger.closest('.accordion-item');
                if (!item) return;
                var body = item.querySelector('.accordion-body');
                var arrow = item.querySelector('.accordion-arrow');
                if (!body) return;
                var isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
                // Close all others
                item.closest('#listaExames').querySelectorAll('.accordion-body').forEach(function(b) {
                    b.style.maxHeight = '0px';
                });
                item.closest('#listaExames').querySelectorAll('.accordion-arrow').forEach(function(a) {
                    a.style.transform = 'rotate(0deg)';
                });
                if (!isOpen) {
                    body.style.maxHeight = body.scrollHeight + 'px';
                    if (arrow) arrow.style.transform = 'rotate(90deg)';
                }
            });
        }

    }

    /**
     * Cria conteúdo do modal de exame físico
     */
    criarModalExameFisico(selecionados, callback) {
        const modal = document.getElementById('modalExameFisico');
        if (!modal) return;

        // Carregar exames físicos do arquivo externo
        let examesFisicos = [];
        if (window.ExameFisicoDB) {
            examesFisicos = Object.entries(window.ExameFisicoDB).map(([sistema, descricao]) => ({
                nome: `Exame Físico: ${sistema}`,
                sistema: sistema,
                descricao: descricao,
                tipo: 'fisico',
                grupo: 'Exame Físico',
                indicacoes: 'Avaliação do sistema',
                preparo: 'Nenhum preparo necessário',
                contraindicacoes: 'Nenhuma contraindicação específica',
                tempo: 'Durante a consulta',
                obs: descricao.substring(0, 100) + '...'
            }));
        }

        if (examesFisicos.length === 0) {
            // Fallback para lista básica de exames físicos
            examesFisicos = [
                { nome: 'Exame Físico: cardiaco', sistema: 'cardiaco', descricao: 'Aparelho Cardiovascular: ritmo cardíaco regular, bulhas normofonéticas, sem sopros. FC: 80 bpm. PA: 120/80 mmHg.', tipo: 'fisico', grupo: 'Exame Físico', indicacoes: 'Avaliação cardiovascular', preparo: 'Nenhum', contraindicacoes: 'Nenhuma', tempo: 'Durante a consulta', obs: 'Exame cardiovascular normal...' },
                { nome: 'Exame Físico: respiratorio', sistema: 'respiratorio', descricao: 'Aparelho Respiratório: MV presente e simétrico, sem ruídos adventícios. FR: 16 irpm. SatO2: 98% em ar ambiente.', tipo: 'fisico', grupo: 'Exame Físico', indicacoes: 'Avaliação respiratória', preparo: 'Nenhum', contraindicacoes: 'Nenhuma', tempo: 'Durante a consulta', obs: 'Exame respiratório normal...' },
                { nome: 'Exame Físico: abdome', sistema: 'abdome', descricao: 'Abdome: plano, flácido, indolor à palpação superficial e profunda. RHA presentes. Fígado e baço não palpáveis. Sem massas ou visceromegalias.', tipo: 'fisico', grupo: 'Exame Físico', indicacoes: 'Avaliação abdominal', preparo: 'Nenhum', contraindicacoes: 'Nenhuma', tempo: 'Durante a consulta', obs: 'Exame abdominal normal...' },
                { nome: 'Exame Físico: neurologico', sistema: 'neurologico', descricao: 'Exame Neurológico: consciente, orientado, pupilas isocóricas e fotorreagentes. Força muscular 5/5 em membros. Reflexos presentes e simétricos. Marcha normal.', tipo: 'fisico', grupo: 'Exame Físico', indicacoes: 'Avaliação neurológica', preparo: 'Nenhum', contraindicacoes: 'Nenhuma', tempo: 'Durante a consulta', obs: 'Exame neurológico normal...' },
                { nome: 'Exame Físico: extremidades', sistema: 'extremidades', descricao: 'Extremidades: sem edema, cianose ou deformidades. Pulso periférico presente e simétrico. Turgor cutâneo normal. Unhas sem alterações.', tipo: 'fisico', grupo: 'Exame Físico', indicacoes: 'Avaliação de extremidades', preparo: 'Nenhum', contraindicacoes: 'Nenhuma', tempo: 'Durante a consulta', obs: 'Extremidades normais...' },
                { nome: 'Exame Físico: pele', sistema: 'pele', descricao: 'Pele e Faneros: cor normal, hidratada, temperatura adequada. Sem lesões, eritema ou descamação. Mucosas coradas e hidratadas.', tipo: 'fisico', grupo: 'Exame Físico', indicacoes: 'Avaliação dermatológica', preparo: 'Nenhum', contraindicacoes: 'Nenhuma', tempo: 'Durante a consulta', obs: 'Pele e faneros normais...' }
            ];
        }

        modal.querySelector('.bg-white').innerHTML = gerarConteudoModalExameFisico(examesFisicos, selecionados);

        // Guardar callback e dados dos exames físicos
        if (callback) {
            modal.dataset.callback = 'exame-fisico';
            modal.dataset.selecionados = JSON.stringify(selecionados);
            modal.dataset.callbackFunc = callback.toString();
            modal.dataset.examesFisicos = JSON.stringify(examesFisicos);
        }

        // Configurar busca
        var buscaInput = document.getElementById('buscaExameFisico');
        if (buscaInput) {
            buscaInput.addEventListener('input', function(e) {
                var termo = e.target.value.toLowerCase();
                var items = document.getElementById('listaExameFisico').querySelectorAll('.accordion-item');
                items.forEach(function(item) {
                    var busca = (item.getAttribute('data-busca') || '').toLowerCase();
                    item.style.display = busca.includes(termo) ? '' : 'none';
                });
            });
        }

        // Configurar accordion com event delegation
        var listaEF = document.getElementById('listaExameFisico');
        if (listaEF) {
            listaEF.addEventListener('click', function(e) {
                var trigger = e.target.closest('.accordion-trigger');
                if (!trigger) return;
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                var item = trigger.closest('.accordion-item');
                if (!item) return;
                var body = item.querySelector('.accordion-body');
                var arrow = item.querySelector('.accordion-arrow');
                if (!body) return;
                var isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
                item.closest('#listaExameFisico').querySelectorAll('.accordion-body').forEach(function(b) {
                    b.style.maxHeight = '0px';
                });
                item.closest('#listaExameFisico').querySelectorAll('.accordion-arrow').forEach(function(a) {
                    a.style.transform = 'rotate(0deg)';
                });
                if (!isOpen) {
                    body.style.maxHeight = body.scrollHeight + 'px';
                    if (arrow) arrow.style.transform = 'rotate(90deg)';
                }
            });
        }

        // Adicionar event listeners para botões "Adicionar" de exame físico
        modal.querySelector('.bg-white').addEventListener('click', function(e) {
            // Botão "Adicionar" — abre editor inline
            if (e.target.classList.contains('adicionar-exame-fisico-btn')) {
                var index = parseInt(e.target.dataset.exameFisicoIndex);
                if (!isNaN(index)) {
                    window.UI.abrirEditorAchadoEF(index, modal);
                }
                return;
            }
            // Botão "Confirmar" do editor inline
            if (e.target.classList.contains('confirmar-achado-ef-btn')) {
                var index = parseInt(e.target.dataset.exameFisicoIndex);
                if (!isNaN(index)) {
                    window.UI.confirmarAchadoEF(index, modal);
                }
                return;
            }
            // Botão "Cancelar" do editor inline
            if (e.target.classList.contains('cancelar-achado-ef-btn')) {
                var index = parseInt(e.target.dataset.exameFisicoIndex);
                if (!isNaN(index)) {
                    window.UI.cancelarEditorEF(index, modal);
                }
                return;
            }
        });
    }

    /**
     * Cria conteúdo do modal de orientações
     */
    criarModalOrientacoes(selecionados, callback) {
        const modal = document.getElementById('modalOrientacoes');
        if (!modal) return;

        // Carregar orientações do arquivo externo
        let orientacoesObjs = [];
        if (window.OrientacoesDB && Array.isArray(window.OrientacoesDB)) {
            orientacoesObjs = window.OrientacoesDB;
        } else {
            // Fallback para lista básica
            orientacoesObjs = [
                {
                    condicao: 'Retorno Geral',
                    orientacoes: [
                        'Retornar em 7 dias para reavaliação',
                        'Manter repouso relativo por 48h',
                        'Ingerir líquidos abundantemente',
                        'Evitar esforços físicos',
                        'Dieta leve e de fácil digestão',
                        'Suspender atividade física por 1 semana',
                        'Retornar em caso de febre ou piora',
                        'Continuar medicação conforme prescrição'
                    ],
                    retorno: 'Retorno em 7 dias'
                }
            ];
        }

        modal.querySelector('.bg-white').innerHTML = gerarConteudoModalOrientacoes(orientacoesObjs, selecionados);

        // Guardar callback e dados das orientações
        if (callback) {
            modal.dataset.callback = 'orientacoes';
            modal.dataset.selecionados = JSON.stringify(selecionados);
            modal.dataset.callbackFunc = callback.toString();
            modal.dataset.orientacoesObjs = JSON.stringify(orientacoesObjs);
        }

        // Configurar busca
        var buscaInput = document.getElementById('buscaOrientacoes');
        if (buscaInput) {
            buscaInput.addEventListener('input', function(e) {
                var termo = e.target.value.toLowerCase();
                var items = document.getElementById('listaOrientacoes').querySelectorAll('.accordion-item');
                items.forEach(function(item) {
                    var busca = (item.getAttribute('data-busca') || '').toLowerCase();
                    item.style.display = busca.includes(termo) ? '' : 'none';
                });
            });
        }

        // Configurar accordion com event delegation
        var listaOrient = document.getElementById('listaOrientacoes');
        if (listaOrient) {
            listaOrient.addEventListener('click', function(e) {
                var trigger = e.target.closest('.accordion-trigger');
                if (!trigger) return;
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                var item = trigger.closest('.accordion-item');
                if (!item) return;
                var body = item.querySelector('.accordion-body');
                var arrow = item.querySelector('.accordion-arrow');
                if (!body) return;
                var isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
                item.closest('#listaOrientacoes').querySelectorAll('.accordion-body').forEach(function(b) {
                    b.style.maxHeight = '0px';
                });
                item.closest('#listaOrientacoes').querySelectorAll('.accordion-arrow').forEach(function(a) {
                    a.style.transform = 'rotate(0deg)';
                });
                if (!isOpen) {
                    body.style.maxHeight = body.scrollHeight + 'px';
                    if (arrow) arrow.style.transform = 'rotate(90deg)';
                }
            });
        }

        // Adicionar event listeners para botões "Adicionar" de orientações
        modal.querySelector('.bg-white').addEventListener('click', function(e) {
            if (e.target.classList.contains('adicionar-orientacao-btn')) {
                var index = parseInt(e.target.dataset.orientacaoIndex);
                if (!isNaN(index)) {
                    window.UI.adicionarOrientacaoPorCondicao(index);
                }
            }
        });
    }

    /**
     * Cria conteúdo do modal de calculadoras
     */
    criarModalCalculadoras() {
        const modal = document.getElementById('modalCalculadoras');
        if (!modal) return;

        // Dados das calculadoras disponíveis
        const calculadoras = [
            {
                nome: "IMC (Índice de Massa Corporal)",
                categoria: "Antropometria",
                descricao: "Calcula o Índice de Massa Corporal",
                formula: "peso / (altura * altura)",
                inputs: [
                    { id: "calcPeso", label: "Peso (kg)", type: "number", placeholder: "Ex: 70" },
                    { id: "calcAltura", label: "Altura (m)", type: "number", placeholder: "Ex: 1.75" }
                ],
                calcular: "calcularIMC",
                cor: "amber"
            },
            {
                nome: "Creatinina Clearance",
                categoria: "Nefrologia",
                descricao: "Estimativa da taxa de filtração glomerular",
                formula: "((140 - idade) * peso) / (72 * creatinina) * (0.85 se feminino)",
                inputs: [
                    { id: "calcIdade", label: "Idade", type: "number", placeholder: "Ex: 45" },
                    { id: "calcPesoCr", label: "Peso (kg)", type: "number", placeholder: "Ex: 70" },
                    { id: "calcCreatinina", label: "Creatinina (mg/dL)", type: "number", placeholder: "Ex: 1.2" },
                    { id: "calcSexo", label: "Sexo", type: "select", options: ["M", "F"] }
                ],
                calcular: "calcularClearance",
                cor: "blue"
            },
            {
                nome: "Glasgow",
                categoria: "Neurologia",
                descricao: "Escala de Coma de Glasgow",
                formula: "Abertura ocular + Resposta verbal + Resposta motora",
                inputs: [
                    { id: "calcGlasgowOcular", label: "Abertura ocular (1-4)", type: "number", placeholder: "Ex: 3", min: 1, max: 4 },
                    { id: "calcGlasgowVerbal", label: "Resposta verbal (1-5)", type: "number", placeholder: "Ex: 4", min: 1, max: 5 },
                    { id: "calcGlasgowMotor", label: "Resposta motora (1-6)", type: "number", placeholder: "Ex: 5", min: 1, max: 6 }
                ],
                calcular: "calcularGlasgow",
                cor: "purple"
            },
            {
                nome: "Escala de Dor",
                categoria: "Dor",
                descricao: "Avaliação subjetiva da intensidade da dor",
                formula: "Escala visual de 0 a 10",
                inputs: [
                    { id: "calcDor", label: "Intensidade da dor (0-10)", type: "range", min: 0, max: 10 }
                ],
                calcular: "calcularDor",
                cor: "red"
            },
            {
                nome: "Pressão Arterial Média",
                categoria: "Cardiologia",
                descricao: "Pressão arterial média estimada",
                formula: "PAM = PAD + (PAS - PAD)/3",
                inputs: [
                    { id: "calcPAS", label: "PAS (mmHg)", type: "number", placeholder: "Ex: 120" },
                    { id: "calcPAD", label: "PAD (mmHg)", type: "number", placeholder: "Ex: 80" }
                ],
                calcular: "calcularPAM",
                cor: "green"
            },
            {
                nome: "Dose Pediátrica",
                categoria: "Pediatria",
                descricao: "Ajuste de dose por peso em crianças",
                formula: "Dose = Dose adulto * (peso criança / 70)",
                inputs: [
                    { id: "calcDoseAdulto", label: "Dose adulto (mg)", type: "number", placeholder: "Ex: 500" },
                    { id: "calcPesoCrianca", label: "Peso criança (kg)", type: "number", placeholder: "Ex: 20" }
                ],
                calcular: "calcularDosePediatrica",
                cor: "pink"
            }
        ];

        // Salvar dados no modal para busca
        modal.dataset.calculadoras = JSON.stringify(calculadoras);

        // Mapa estático de cores — necessário porque Tailwind CDN não detecta classes geradas por interpolação JS
        const coresMap = {
            amber:  { bg50: 'bg-amber-50',  border100: 'border-amber-100', text800: 'text-amber-800', bg100: 'bg-amber-100',  text700: 'text-amber-700', bg600: 'bg-amber-600',  hoverBg700: 'hover:bg-amber-700'  },
            blue:   { bg50: 'bg-blue-50',   border100: 'border-blue-100',  text800: 'text-blue-800',  bg100: 'bg-blue-100',   text700: 'text-blue-700',  bg600: 'bg-blue-600',   hoverBg700: 'hover:bg-blue-700'   },
            purple: { bg50: 'bg-purple-50', border100: 'border-purple-100',text800: 'text-purple-800',bg100: 'bg-purple-100', text700: 'text-purple-700',bg600: 'bg-purple-600', hoverBg700: 'hover:bg-purple-700' },
            red:    { bg50: 'bg-red-50',    border100: 'border-red-100',   text800: 'text-red-800',   bg100: 'bg-red-100',    text700: 'text-red-700',   bg600: 'bg-red-600',    hoverBg700: 'hover:bg-red-700'    },
            green:  { bg50: 'bg-green-50',  border100: 'border-green-100', text800: 'text-green-800', bg100: 'bg-green-100',  text700: 'text-green-700', bg600: 'bg-green-600',  hoverBg700: 'hover:bg-green-700'  },
            pink:   { bg50: 'bg-pink-50',   border100: 'border-pink-100',  text800: 'text-pink-800',  bg100: 'bg-pink-100',   text700: 'text-pink-700',  bg600: 'bg-pink-600',   hoverBg700: 'hover:bg-pink-700'   },
        };

        const html = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-amber-900">🧮 Calculadoras Médicas</h3>
                    <button onclick="window.UI.fecharModal('modalCalculadoras')" class="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div class="mb-4">
                    <input type="text" id="buscaCalculadoras" placeholder="Buscar calculadora (ex: IMC, Glasgow, Pressão...)"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        oninput="window.UI.filtrarCalculadoras(this.value)">
                </div>

                <div id="listaCalculadoras" class="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
                    ${calculadoras.map((calc, index) => {
                        const c = coresMap[calc.cor] || coresMap.amber;
                        return `
                        <div class="${c.bg50} p-5 rounded-lg border ${c.border100}" data-calc-index="${index}">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-medium ${c.text800}">${calc.nome}</h4>
                                <span class="text-xs px-2 py-1 rounded ${c.bg100} ${c.text700}">${calc.categoria}</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">${calc.descricao}</p>
                            <div class="space-y-2">
                                ${calc.inputs.map(input => {
                                    if (input.type === 'select') {
                                        return `
                                            <select id="${input.id}" class="w-full border rounded px-2 py-1 text-sm">
                                                ${input.options.map(opt => `<option value="${opt}">${opt === 'M' ? 'Masculino' : 'Feminino'}</option>`).join('')}
                                            </select>
                                        `;
                                    } else if (input.type === 'range') {
                                        return `
                                            <div>
                                                <label class="text-xs text-gray-500">${input.label}</label>
                                                <input type="range" id="${input.id}" min="${input.min}" max="${input.max}" value="5"
                                                    class="w-full" oninput="document.getElementById('${input.id}-value').textContent = this.value">
                                                <div class="flex justify-between text-xs">
                                                    <span>0</span>
                                                    <span id="${input.id}-value">5</span>
                                                    <span>10</span>
                                                </div>
                                            </div>
                                        `;
                                    } else {
                                        const minAttr = input.min !== undefined ? ` min="${input.min}"` : '';
                                        const maxAttr = input.max !== undefined ? ` max="${input.max}"` : '';
                                        return `
                                            <input type="${input.type}" id="${input.id}" placeholder="${input.placeholder}"${minAttr}${maxAttr}
                                                class="w-full border rounded px-2 py-1 text-sm">
                                        `;
                                    }
                                }).join('')}
                                <button onclick="window.UI.${calc.calcular}()"
                                    class="w-full ${c.bg600} ${c.hoverBg700} text-white py-1 rounded text-sm mt-2">
                                    Calcular ${calc.nome.split(' ')[0]}
                                </button>
                                <div id="resultado${calc.calcular.replace('calcular', '')}" class="text-sm ${c.text700} mt-2"></div>
                            </div>
                            <div class="mt-2 text-xs text-gray-500">
                                <p><strong>Fórmula:</strong> ${calc.formula}</p>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>

                <div class="mt-6 text-xs text-gray-500">
                    <p>As calculadoras são para referência. Sempre confirme com métodos oficiais.</p>
                </div>
            </div>
        `;

        modal.querySelector('.bg-white').innerHTML = html;
    }

    /**
     * Filtra calculadoras por busca
     */
    filtrarCalculadoras(termo) {
        const modal = document.getElementById('modalCalculadoras');
        if (!modal || !modal.dataset.calculadoras) return;

        const calculadoras = JSON.parse(modal.dataset.calculadoras);
        const lista = document.getElementById('listaCalculadoras');
        if (!lista) return;

        const termoLower = termo.toLowerCase().trim();

        if (!termoLower) {
            // Mostrar todas
            lista.querySelectorAll('[data-calc-index]').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        // Filtrar calculadoras
        calculadoras.forEach((calc, index) => {
            const card = lista.querySelector(`[data-calc-index="${index}"]`);
            if (!card) return;

            const buscaTexto = `${calc.nome} ${calc.categoria} ${calc.descricao} ${calc.formula}`.toLowerCase();
            const corresponde = buscaTexto.includes(termoLower);
            card.style.display = corresponde ? 'block' : 'none';
        });
    }

    /**
     * Confirma seleção de medicamentos
     */
    confirmarMedicamentos() {
        const modal = document.getElementById('modalMedicamentos');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');

        // Se nenhum checkbox estiver marcado, apenas fecha o modal
        if (checkboxes.length === 0) {
            this.fecharModal('modalMedicamentos');
            return;
        }

        // Extrair índices dos IDs dos checkboxes (med-0, med-1, etc.)
        const indicesSelecionados = Array.from(checkboxes).map(cb => {
            const id = cb.id;
            if (id.startsWith('med-')) {
                return parseInt(id.substring(4));
            }
            return parseInt(cb.value);
        });

        // Obter objetos completos dos medicamentos selecionados
        let selecionados = [];
        if (modal.dataset.medicamentosObjs) {
            const medicamentosObjs = JSON.parse(modal.dataset.medicamentosObjs);
            selecionados = indicesSelecionados.map(index => medicamentosObjs[index]);
        } else {
            // Fallback: usar apenas os índices
            selecionados = indicesSelecionados;
        }

        // Adicionar cada medicamento selecionado ao painel lateral
        selecionados.forEach(medicamento => {
            this.fixarMedicamento(medicamento);
        });

        // Executar callback se existir
        if (modal.dataset.callbackFunc) {
            try {
                const callback = eval(`(${modal.dataset.callbackFunc})`);
                callback(selecionados);
            } catch (error) {
                console.error('Erro ao executar callback:', error);
            }
        }

        this.fecharModal('modalMedicamentos');
        this.showSuccess(`${selecionados.length} medicamento(s) adicionado(s) ao painel`);
    }

    /**
     * Confirma seleção de exames
     */
    confirmarExames() {
        const modal = document.getElementById('modalExames');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');

        // Se nenhum checkbox estiver marcado, apenas fecha o modal
        if (checkboxes.length === 0) {
            this.fecharModal('modalExames');
            return;
        }

        // Extrair índices dos IDs dos checkboxes (exame-0, exame-1, etc.) ou exame-fisico-0
        const indicesSelecionados = Array.from(checkboxes).map(cb => {
            const id = cb.id;
            if (id.startsWith('exame-fisico-')) {
                return { index: parseInt(id.substring(13)), tipo: 'fisico' };
            }
            if (id.startsWith('exame-')) {
                return { index: parseInt(id.substring(6)), tipo: 'complementar' };
            }
            return { index: parseInt(cb.value), tipo: 'complementar' };
        });

        // Obter objetos completos dos exames selecionados
        let selecionados = [];
        if (modal.dataset.examesObjs) {
            const examesObjs = JSON.parse(modal.dataset.examesObjs);
            selecionados = indicesSelecionados.map(item => {
                if (item.tipo === 'fisico') {
                    // Fetch from ExameFisicoDB using the index
                    const ef = window.ExameFisicoDB && window.ExameFisicoDB[item.index];
                    return ef ? { ...ef, tipo: 'fisico' } : null;
                }
                return examesObjs[item.index] || null;
            }).filter(Boolean);
        } else {
            // Fallback: usar apenas os índices
            selecionados = indicesSelecionados;
        }

        // Adicionar cada exame selecionado ao painel lateral
        selecionados.forEach(exame => {
            if (exame && exame.tipo === 'fisico') {
                this.fixarExameFisico(exame);
            } else if (exame) {
                this.fixarExame(exame);
            }
        });

        // Executar callback se existir
        if (modal.dataset.callbackFunc) {
            try {
                const callback = eval(`(${modal.dataset.callbackFunc})`);
                callback(selecionados);
            } catch (error) {
                console.error('Erro ao executar callback:', error);
            }
        }

        this.fecharModal('modalExames');
        this.showSuccess(`${selecionados.length} exame(s) adicionado(s) ao painel`);
    }

    /**
     * Confirma seleção de exames físicos
     */
    confirmarExameFisico() {
        const modal = document.getElementById('modalExameFisico');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');

        // Se nenhum checkbox estiver marcado, apenas fecha o modal
        if (checkboxes.length === 0) {
            this.fecharModal('modalExameFisico');
            return;
        }

        // Extrair índices dos IDs dos checkboxes (exame-fisico-0, exame-fisico-1, etc.)
        const indicesSelecionados = Array.from(checkboxes).map(cb => {
            const id = cb.id;
            if (id.startsWith('exame-fisico-')) {
                return parseInt(id.substring(13));
            }
            return parseInt(cb.value);
        });

        // Obter objetos completos dos exames físicos selecionados
        let selecionados = [];
        if (modal.dataset.examesFisicos) {
            const examesFisicos = JSON.parse(modal.dataset.examesFisicos);
            selecionados = indicesSelecionados.map(index => examesFisicos[index]);
        } else {
            // Fallback: usar apenas os índices
            selecionados = indicesSelecionados;
        }

        // Adicionar cada exame físico selecionado ao painel lateral
        selecionados.forEach(exame => {
            this.fixarExameFisico(exame);
        });

        // Executar callback se existir
        if (modal.dataset.callbackFunc) {
            try {
                const callback = eval(`(${modal.dataset.callbackFunc})`);
                callback(selecionados);
            } catch (error) {
                console.error('Erro ao executar callback:', error);
            }
        }

        this.fecharModal('modalExameFisico');
        this.showSuccess(`${selecionados.length} exame(s) físico(s) adicionado(s) ao painel`);
    }

    /**
     * Confirma seleção de orientações
     */
    confirmarOrientacoes() {
        const modal = document.getElementById('modalOrientacoes');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');

        // Se nenhum checkbox estiver marcado, apenas fecha o modal
        if (checkboxes.length === 0) {
            this.fecharModal('modalOrientacoes');
            return;
        }

        const indicesSelecionados = Array.from(checkboxes).map(cb => parseInt(cb.value));

        // Obter objetos das condições selecionadas
        let selecionados = [];
        if (modal.dataset.orientacoesObjs) {
            const orientacoesObjs = JSON.parse(modal.dataset.orientacoesObjs);
            selecionados = indicesSelecionados.map(index => orientacoesObjs[index]);
        } else {
            // Fallback: usar apenas os índices
            selecionados = indicesSelecionados;
        }

        // Adicionar cada orientação selecionada ao painel lateral
        selecionados.forEach(orientacao => {
            this.fixarOrientacao(orientacao);
        });

        // Executar callback se existir
        if (modal.dataset.callbackFunc) {
            try {
                const callback = eval(`(${modal.dataset.callbackFunc})`);
                callback(selecionados);
            } catch (error) {
                console.error('Erro ao executar callback:', error);
            }
        }

        this.fecharModal('modalOrientacoes');
        this.showSuccess(`${selecionados.length} condição(ões) adicionada(s) ao painel`);
    }

    /**
     * Calcula IMC
     */
    calcularIMC() {
        const peso = parseFloat(document.getElementById('calcPeso').value);
        const altura = parseFloat(document.getElementById('calcAltura').value);

        if (!peso || !altura || altura <= 0) {
            this.showError('Preencha peso e altura corretamente');
            return;
        }

        const imc = peso / (altura * altura);
        const resultado = document.getElementById('resultadoIMC');

        let classificacao = '';
        if (imc < 18.5) classificacao = 'Abaixo do peso';
        else if (imc < 25) classificacao = 'Peso normal';
        else if (imc < 30) classificacao = 'Sobrepeso';
        else if (imc < 35) classificacao = 'Obesidade grau I';
        else if (imc < 40) classificacao = 'Obesidade grau II';
        else classificacao = 'Obesidade grau III';

        resultado.innerHTML = `<strong>IMC: ${imc.toFixed(1)}</strong><br>${classificacao}`;
    }

    /**
     * Calcula Clearance de Creatinina
     */
    calcularClearance() {
        const idade = parseInt(document.getElementById('calcIdade').value);
        const peso = parseFloat(document.getElementById('calcPesoCr').value);
        const creatinina = parseFloat(document.getElementById('calcCreatinina').value);
        const sexo = document.getElementById('calcSexo').value;

        if (!idade || !peso || !creatinina || creatinina <= 0) {
            this.showError('Preencha todos os campos corretamente');
            return;
        }
        if (idade <= 0 || idade > 130) {
            this.showError('Idade inválida (deve ser entre 1 e 130 anos)');
            return;
        }
        if (peso <= 0 || peso > 350) {
            this.showError('Peso inválido (deve ser entre 1 e 350 kg)');
            return;
        }
        if (creatinina <= 0 || creatinina > 50) {
            this.showError('Creatinina inválida (deve ser entre 0,1 e 50 mg/dL)');
            return;
        }

        let clearance = ((140 - idade) * peso) / (72 * creatinina);
        if (sexo === 'F') clearance *= 0.85;

        const resultado = document.getElementById('resultadoClearance');
        resultado.innerHTML = `<strong>Clearance: ${clearance.toFixed(1)} mL/min</strong>`;

        if (clearance < 15) resultado.innerHTML += '<br>Insuficiência renal grave';
        else if (clearance < 30) resultado.innerHTML += '<br>Insuficiência renal grave';
        else if (clearance < 60) resultado.innerHTML += '<br>Insuficiência renal moderada';
        else if (clearance < 90) resultado.innerHTML += '<br>Leve redução da função renal';
        else resultado.innerHTML += '<br>Função renal normal';
    }

    /**
     * Calcula Escala de Glasgow
     */
    calcularGlasgow() {
        const ocular = parseInt(document.getElementById('calcGlasgowOcular').value);
        const verbal = parseInt(document.getElementById('calcGlasgowVerbal').value);
        const motor = parseInt(document.getElementById('calcGlasgowMotor').value);

        if (!ocular || !verbal || !motor) {
            this.showError('Preencha todos os campos corretamente');
            return;
        }
        if (ocular < 1 || ocular > 4 || verbal < 1 || verbal > 5 || motor < 1 || motor > 6) {
            this.showError('Valores fora do intervalo (Ocular: 1–4, Verbal: 1–5, Motor: 1–6)');
            return;
        }

        const total = ocular + verbal + motor;
        const resultado = document.getElementById('resultadoGlasgow');

        let classificacao = '';
        if (total <= 8) classificacao = 'Coma profundo';
        else if (total <= 12) classificacao = 'Coma moderado';
        else if (total <= 14) classificacao = 'Coma leve';
        else classificacao = 'Consciente';

        resultado.innerHTML = `<strong>Glasgow: ${total}/15</strong><br>${classificacao}`;
    }

    /**
     * Calcula Escala de Dor
     */
    calcularDor() {
        const intensidade = parseInt(document.getElementById('calcDor').value);
        const resultado = document.getElementById('resultadoDor');

        let classificacao = '';
        if (intensidade === 0) classificacao = 'Sem dor';
        else if (intensidade <= 3) classificacao = 'Dor leve';
        else if (intensidade <= 6) classificacao = 'Dor moderada';
        else if (intensidade <= 8) classificacao = 'Dor intensa';
        else classificacao = 'Dor excruciante';

        resultado.innerHTML = `<strong>Dor: ${intensidade}/10</strong><br>${classificacao}`;
    }

    /**
     * Calcula Pressão Arterial Média
     */
    calcularPAM() {
        const pas = parseFloat(document.getElementById('calcPAS').value);
        const pad = parseFloat(document.getElementById('calcPAD').value);

        if (!pas || !pad) {
            this.showError('Preencha PAS e PAD corretamente');
            return;
        }

        const pam = pad + (pas - pad) / 3;
        const resultado = document.getElementById('resultadoPAM');

        let classificacao = '';
        if (pam < 60) classificacao = 'Hipotensão';
        else if (pam <= 100) classificacao = 'Normal';
        else classificacao = 'Hipertensão';

        resultado.innerHTML = `<strong>PAM: ${pam.toFixed(1)} mmHg</strong><br>${classificacao}`;
    }

    /**
     * Calcula Dose Pediátrica
     */
    calcularDosePediatrica() {
        const doseAdulto = parseFloat(document.getElementById('calcDoseAdulto').value);
        const pesoCrianca = parseFloat(document.getElementById('calcPesoCrianca').value);

        if (!doseAdulto || !pesoCrianca || pesoCrianca <= 0) {
            this.showError('Preencha dose adulto e peso criança corretamente');
            return;
        }

        const doseCrianca = doseAdulto * (pesoCrianca / 70);
        const resultado = document.getElementById('resultadoDosePediatrica');

        resultado.innerHTML = `<strong>Dose pediátrica: ${doseCrianca.toFixed(1)} mg</strong><br>Baseada em peso de ${pesoCrianca} kg`;
    }

    /**
     * Abre um modal
     * @param {string} modalId - ID do modal
     */
    abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('aberto');
        }
    }

    /**
     * Fecha um modal
     * @param {string} modalId - ID do modal
     */
    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('aberto');
        }
    }

    /**
     * Fecha todos os modais
     */
    fecharTodosModais() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('aberto');
        });
    }

    /**
     * Exibe mensagem de sucesso
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em milissegundos
     */
    showSuccess(message, duration = 3000) {
        this.showNotification(message, 'success', duration);
    }

    /**
     * Exibe mensagem de erro
     * @param {string} message - Mensagem a ser exibida
     * @param {number} duration - Duração em milissegundos
     */
    showError(message, duration = 5000) {
        this.showNotification(message, 'error', duration);
    }

    /**
     * Exibe notificação
     * @param {string} message - Mensagem
     * @param {string} type - Tipo (success, error, info)
     * @param {number} duration - Duração
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Remover notificações anteriores
        const existing = document.querySelectorAll('.ui-notification');
        existing.forEach(el => el.remove());

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `ui-notification fixed top-4 right-4 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Exibe loading
     * @param {boolean} show - Mostrar ou ocultar
     * @param {string} message - Mensagem opcional
     */
    showLoading(show, message = 'Processando...') {
        let loading = document.getElementById('ui-loading');

        if (show) {
            if (!loading) {
                loading = document.createElement('div');
                loading.id = 'ui-loading';
                loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                loading.innerHTML = `
                    <div class="bg-white rounded-lg p-6 flex flex-col items-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                        <p class="text-gray-700">${message}</p>
                    </div>
                `;
                document.body.appendChild(loading);
            }
        } else {
            if (loading) {
                loading.remove();
            }
        }
    }

    /**
     * Copia texto para clipboard
     * @param {string} text - Texto a copiar
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess('Texto copiado para a área de transferência');
        } catch (error) {
            console.error('Erro ao copiar:', error);
            this.showError('Não foi possível copiar o texto');
        }
    }

    /**
     * Adiciona medicamento individualmente
     * @param {number} index - Índice do medicamento
     */
    adicionarMedicamento(index) {
        const modal = document.getElementById('modalMedicamentos');
        if (!modal || !modal.dataset.medicamentosObjs) return;

        try {
            const medicamentosObjs = JSON.parse(modal.dataset.medicamentosObjs);
            const medicamento = medicamentosObjs[index];

            if (!medicamento) return;

            // Obter selecionados atuais
            let selecionados = [];
            if (modal.dataset.selecionados) {
                selecionados = JSON.parse(modal.dataset.selecionados);
            }

            // Verificar se já está selecionado
            if (!selecionados.some(s => s.nome === medicamento.nome)) {
                selecionados.push(medicamento);
                modal.dataset.selecionados = JSON.stringify(selecionados);

                // Atualizar checkbox
                const checkbox = document.getElementById(`med-${index}`);
                if (checkbox) {
                    checkbox.checked = true;
                }

                // Atualizar contador
                const contador = modal.querySelector('.text-sm.text-gray-600');
                if (contador) {
                    contador.textContent = `${selecionados.length} medicamento(s) selecionado(s)`;
                }

                // Atualizar estilo do card
                const card = checkbox?.closest('.border.rounded-lg');
                if (card) {
                    card.classList.add('border-blue-500', 'bg-blue-50');
                    card.classList.remove('border-gray-200');
                }

                // Fixar no painel lateral
                this.fixarMedicamento(medicamento);

                this.showSuccess(`"${medicamento.nome}" adicionado`);
            }
        } catch (error) {
            console.error('Erro ao adicionar medicamento:', error);
        }
    }

    /**
     * Adiciona exame complementar individualmente
     * @param {number} index - Índice do exame
     */
    adicionarExame(index) {
        const modal = document.getElementById('modalExames');
        if (!modal) {
            return;
        }
        if (!modal.dataset.examesObjs) {
            return;
        }

        try {
            const examesObjs = JSON.parse(modal.dataset.examesObjs);
            const exame = examesObjs[index];

            if (!exame) {
                return;
            }

            // Obter selecionados atuais
            let selecionados = [];
            if (modal.dataset.selecionados) {
                selecionados = JSON.parse(modal.dataset.selecionados);
            }

            // Verificar se já está selecionado
            if (!selecionados.some(s => s.nome === exame.nome)) {
                selecionados.push(exame);
                modal.dataset.selecionados = JSON.stringify(selecionados);

                // Atualizar checkbox
                const checkbox = document.getElementById(`exame-${index}`);
                if (checkbox) {
                    checkbox.checked = true;
                }

                // Atualizar contador
                const contador = modal.querySelector('.text-sm.text-gray-600');
                if (contador) {
                    contador.textContent = `${selecionados.length} exame(s) selecionado(s)`;
                }

                // Atualizar estilo do card
                const card = checkbox?.closest('.border.rounded-lg');
                if (card) {
                    card.classList.add('border-violet-500', 'bg-violet-50');
                    card.classList.remove('border-gray-200');
                }

                // Fixar no painel lateral
                this.fixarExame(exame);

                this.showSuccess(`"${exame.nome}" adicionado`);
            }
        } catch (error) {
            console.error('Erro ao adicionar exame:', error);
        }
    }

        /**
     * Abre editor inline de achado para um sistema de exame físico
     * @param {number} index - Índice do exame na lista
     * @param {HTMLElement} modal - Elemento do modal
     */
    abrirEditorAchadoEF(index, modal) {
        const modal_ = modal || document.getElementById('modalExameFisico');
        if (!modal_ || !modal_.dataset.examesFisicos) return;

        try {
            const examesFisicos = JSON.parse(modal_.dataset.examesFisicos);
            const exame = examesFisicos[index];
            if (!exame) return;

            // Buscar achado normal pré-definido
            const achadoNormal = (window.ExameFisicoDB && window.ExameFisicoDB[exame.sistema])
                ? window.ExameFisicoDB[exame.sistema]
                : (exame.descricao || exame.nome);

            // Encontrar o card do exame e substituir botão por editor
            const btn = modal_.querySelector(`[data-exame-fisico-index="${index}"].adicionar-exame-fisico-btn`);
            if (!btn) return;

            const card = btn.closest('.border.rounded-lg, .border.border-gray-200, [class*="border"]');
            if (!card) return;

            // Evitar abrir duplo editor
            if (card.querySelector('.editor-achado-ef')) return;

            // Esconder botão original
            btn.style.display = 'none';

            // Inserir editor inline
            const editorDiv = document.createElement('div');
            editorDiv.className = 'editor-achado-ef mt-2';
            editorDiv.innerHTML = `
                <textarea
                    id="textarea-ef-${index}"
                    rows="4"
                    class="w-full text-xs border border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
                >${achadoNormal}</textarea>
                <div class="flex gap-2 mt-1.5 justify-end">
                    <button
                        class="cancelar-achado-ef-btn text-xs px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                        data-exame-fisico-index="${index}"
                    >✗ Cancelar</button>
                    <button
                        class="confirmar-achado-ef-btn text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
                        data-exame-fisico-index="${index}"
                    >✓ Confirmar achado</button>
                </div>
            `;

            btn.parentElement.appendChild(editorDiv);

            // Focar no textarea e posicionar cursor no início
            const textarea = editorDiv.querySelector('textarea');
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(0, 0);
            }
        } catch (error) {
            console.error('Erro ao abrir editor de achado EF:', error);
        }
    }

    /**
     * Confirma o achado editado e adiciona o exame com o texto customizado
     * @param {number} index - Índice do exame
     * @param {HTMLElement} modal - Elemento do modal
     */
    confirmarAchadoEF(index, modal) {
        const modal_ = modal || document.getElementById('modalExameFisico');
        if (!modal_ || !modal_.dataset.examesFisicos) return;

        try {
            const examesFisicos = JSON.parse(modal_.dataset.examesFisicos);
            const exame = examesFisicos[index];
            if (!exame) return;

            // Ler texto do textarea
            const textarea = modal_.querySelector(`#textarea-ef-${index}`);
            const achadoCustomizado = textarea ? textarea.value.trim() : '';
            if (!achadoCustomizado) {
                this.showError('O achado não pode estar vazio.');
                return;
            }

            // Obter selecionados atuais
            let selecionados = [];
            if (modal_.dataset.selecionados) {
                selecionados = JSON.parse(modal_.dataset.selecionados);
            }

            // Verificar se já está selecionado (por sistema, não por nome)
            if (selecionados.some(s => s.sistema === exame.sistema)) {
                this.showError(`"${exame.nome}" já foi adicionado.`);
                this.cancelarEditorEF(index, modal_);
                return;
            }

            // Adicionar com achado customizado
            const exameComAchado = { ...exame, descricao: achadoCustomizado };
            selecionados.push(exameComAchado);
            modal_.dataset.selecionados = JSON.stringify(selecionados);

            // Atualizar checkbox
            const checkbox = modal_.querySelector(`#exame-fisico-${index}`);
            if (checkbox) checkbox.checked = true;

            // Atualizar contador
            const contador = modal_.querySelector('.text-sm.text-gray-600');
            if (contador) contador.textContent = `${selecionados.length} exame(s) físico(s) selecionado(s)`;

            // Atualizar estilo do card — remover editor e mostrar confirmado
            const editorDiv = modal_.querySelector(`#textarea-ef-${index}`)?.closest('.editor-achado-ef');
            const btn = modal_.querySelector(`[data-exame-fisico-index="${index}"].adicionar-exame-fisico-btn`);
            if (editorDiv) editorDiv.remove();

            // Substituir botão por badge "Adicionado ✓"
            if (btn) {
                btn.textContent = 'Adicionado ✓';
                btn.disabled = true;
                btn.className = 'text-xs px-3 py-1 rounded-lg bg-green-100 text-green-700 font-medium cursor-default';
                btn.style.display = '';
            }

            // Atualizar visual do card
            const card = btn?.closest('.border.rounded-lg, .border.border-gray-200, [class*="border"]');
            if (card) {
                card.classList.add('border-indigo-500', 'bg-indigo-50');
                card.classList.remove('border-gray-200');
            }

            // Fixar no painel lateral
            this.fixarExameFisico(exameComAchado);

            this.showSuccess(`"${exame.nome}" adicionado com achado personalizado`);

        } catch (error) {
            console.error('Erro ao confirmar achado EF:', error);
        }
    }

    /**
     * Cancela o editor inline sem adicionar
     * @param {number} index - Índice do exame
     * @param {HTMLElement} modal - Elemento do modal
     */
    cancelarEditorEF(index, modal) {
        const modal_ = modal || document.getElementById('modalExameFisico');
        if (!modal_) return;

        const editorDiv = modal_.querySelector(`#textarea-ef-${index}`)?.closest('.editor-achado-ef');
        if (editorDiv) editorDiv.remove();

        const btn = modal_.querySelector(`[data-exame-fisico-index="${index}"].adicionar-exame-fisico-btn`);
        if (btn) btn.style.display = '';
    }

    adicionarExameFisico(index) {
        const modal = document.getElementById('modalExameFisico');
        if (!modal || !modal.dataset.examesFisicos) return;

        try {
            const examesFisicos = JSON.parse(modal.dataset.examesFisicos);
            const exame = examesFisicos[index];

            if (!exame) return;

            // Obter selecionados atuais
            let selecionados = [];
            if (modal.dataset.selecionados) {
                selecionados = JSON.parse(modal.dataset.selecionados);
            }

            // Verificar se já está selecionado
            if (!selecionados.some(s => s.nome === exame.nome)) {
                selecionados.push(exame);
                modal.dataset.selecionados = JSON.stringify(selecionados);

                // Atualizar checkbox
                const checkbox = document.getElementById(`exame-fisico-${index}`);
                if (checkbox) {
                    checkbox.checked = true;
                }

                // Atualizar contador
                const contador = modal.querySelector('.text-sm.text-gray-600');
                if (contador) {
                    contador.textContent = `${selecionados.length} exame(s) físico(s) selecionado(s)`;
                }

                // Atualizar estilo do card
                const card = checkbox?.closest('.border.rounded-lg');
                if (card) {
                    card.classList.add('border-indigo-500', 'bg-indigo-50');
                    card.classList.remove('border-gray-200');
                }

                // Fixar no painel lateral
                this.fixarExameFisico(exame);

                this.showSuccess(`"${exame.nome}" adicionado`);
            }
        } catch (error) {
            console.error('Erro ao adicionar exame físico:', error);
        }
    }

    /**
     * Adiciona orientação por condição
     * @param {number} index - Índice da condição
     */
    adicionarOrientacaoPorCondicao(index) {
        const modal = document.getElementById('modalOrientacoes');
        if (!modal || !modal.dataset.orientacoesObjs) return;

        try {
            const orientacoesObjs = JSON.parse(modal.dataset.orientacoesObjs);
            const condicaoObj = orientacoesObjs[index];

            if (!condicaoObj) return;

            // Obter selecionados atuais
            let selecionados = [];
            if (modal.dataset.selecionados) {
                selecionados = JSON.parse(modal.dataset.selecionados);
            }

            // Verificar se já está selecionada
            if (!selecionados.some(s => s.condicao === condicaoObj.condicao)) {
                selecionados.push(condicaoObj);
                modal.dataset.selecionados = JSON.stringify(selecionados);

                // Atualizar checkbox
                const checkbox = modal.querySelector(`input[type="checkbox"][value="${index}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }

                // Atualizar contador
                const confirmarBtn = modal.querySelector('button.bg-green-600');
                if (confirmarBtn) {
                    confirmarBtn.textContent = `Confirmar (${selecionados.length})`;
                }

                // Atualizar estilo do card
                const card = checkbox?.closest('.border.rounded-lg');
                if (card) {
                    card.classList.add('border-green-500', 'bg-green-50');
                    card.classList.remove('border-green-200');
                }

                // Fixar no painel lateral
                this.fixarOrientacao(condicaoObj);

                this.showSuccess(`"${condicaoObj.condicao}" adicionada`);
            }
        } catch (error) {
            console.error('Erro ao adicionar orientação por condição:', error);
        }
    }

    /**
     * Adiciona orientação individualmente (mantido para compatibilidade)
     * @param {number} index - Índice da orientação
     */
    adicionarOrientacao(index) {
        // Redirecionar para o novo método
        this.adicionarOrientacaoPorCondicao(index);
    }

    /**
     * Configura o painel de ferramentas
     */
    setupPainelFerramentas() {
        // Configurar botão de fechar painel
        const btnFecharPainel = document.getElementById('btnFecharPainel');
        if (btnFecharPainel) {
            btnFecharPainel.addEventListener('click', () => this.fecharPainelFerramentas());
        }

        // Carregar itens fixados do localStorage
        this.carregarItensFixados();
    }

    /**
     * Abre o painel de ferramentas
     */
    abrirPainelFerramentas() {
        const painel = document.getElementById('painelFerramentas');
        if (painel) {
            painel.classList.remove('translate-x-full');
        }
    }

    /**
     * Fecha o painel de ferramentas
     */
    fecharPainelFerramentas() {
        const painel = document.getElementById('painelFerramentas');
        if (painel) {
            painel.classList.add('translate-x-full');
        }
    }

    /**
     * Carrega itens fixados do localStorage
     */
    carregarItensFixados() {
        try {
            const itensFixados = JSON.parse(localStorage.getItem('itensFixados') || '[]');
            const conteudoPainel = document.getElementById('conteudoPainel');

            if (!conteudoPainel) return;

            // Validar que itensFixados é um array
            if (!Array.isArray(itensFixados)) {
                console.warn('Dados inválidos em localStorage, limpando...');
                localStorage.removeItem('itensFixados');
                return;
            }

            // Purge entries whose vias contain corrupted object strings
            const itensSaos = itensFixados.filter(item => {
                if (item.tipo !== 'medicamento') return true;
                const vias = item.dados?.vias;
                if (!Array.isArray(vias)) return true; // keep non-array (let renderer handle it)
                return !JSON.stringify(vias).includes('[object Object]');
            });
            if (itensSaos.length !== itensFixados.length) {
                localStorage.setItem('itensFixados', JSON.stringify(itensSaos));
            }

            // Limitar número de itens para evitar abuso de localStorage
            const itensLimitados = itensSaos.slice(0, 50);

            // Limpar conteúdo padrão se houver itens fixados
            if (itensLimitados.length > 0) {
                conteudoPainel.innerHTML = '';
            }

            // Adicionar cada item fixado
            itensLimitados.forEach((item, index) => {
                // Validar estrutura básica do item
                if (item && typeof item === 'object' && item.tipo && item.dados) {
                    this.adicionarItemAoPainel(item, index);
                }
            });
        } catch (error) {
            console.error('Erro ao carregar itens fixados:', error);
            // Em caso de erro, limpar dados corrompidos
            localStorage.removeItem('itensFixados');
        }
    }

    /**
     * Sanitiza texto para prevenir XSS
     * @param {string} text - Texto a ser sanitizado
     * @returns {string} Texto sanitizado
     */
    sanitizarTexto(text) {
        if (typeof text !== 'string') return text;

        // Substituir caracteres HTML perigosos por entidades
        const mapaEntidades = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        return text.replace(/[&<>"'`=\/]/g, char => mapaEntidades[char]);
    }

    /**
     * Sanitiza objeto recursivamente para prevenir XSS
     * @param {Object} obj - Objeto a ser sanitizado
     * @returns {Object} Objeto sanitizado
     */
    sanitizarObjeto(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizarObjeto(item));
        }

        const sanitizado = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                sanitizado[key] = this.sanitizarTexto(value);
            } else if (typeof value === 'object' && value !== null) {
                sanitizado[key] = this.sanitizarObjeto(value);
            } else {
                sanitizado[key] = value;
            }
        }
        return sanitizado;
    }

    /**
     * Salva itens fixados no localStorage
     */
    salvarItensFixados() {
        try {
            const conteudoPainel = document.getElementById('conteudoPainel');
            if (!conteudoPainel) return;

            const itens = [];
            const cards = conteudoPainel.querySelectorAll('.item-fixado-card');

            cards.forEach(card => {
                const tipo = card.dataset.tipo;
                const dados = card.dataset.dados;

                if (tipo && dados) {
                    // Sanitizar dados antes de armazenar
                    const dadosParsed = JSON.parse(dados);
                    const dadosSanitizados = this.sanitizarObjeto(dadosParsed);

                    itens.push({
                        tipo: tipo,
                        dados: dadosSanitizados,
                        timestamp: new Date().toISOString()
                    });
                }
            });

            // Limitar tamanho total dos dados (aproximadamente 5MB)
            const dadosJSON = JSON.stringify(itens);
            if (new Blob([dadosJSON]).size > 5 * 1024 * 1024) {
                console.warn('Dados excedem limite de 5MB, removendo itens mais antigos...');
                // Manter apenas os 25 itens mais recentes
                const itensRecentes = itens.slice(-25);
                localStorage.setItem('itensFixados', JSON.stringify(itensRecentes));
            } else {
                localStorage.setItem('itensFixados', JSON.stringify(itens));
            }
        } catch (error) {
            console.error('Erro ao salvar itens fixados:', error);
        }
    }

    /**
     * Adiciona um item ao painel de ferramentas
     * @param {Object} item - Item a ser adicionado
     * @param {number} index - Índice do item
     */
    adicionarItemAoPainel(item, index) {
        const conteudoPainel = document.getElementById('conteudoPainel');
        if (!conteudoPainel) return;

        // Verificar se é o primeiro item a ser adicionado
        // Se sim, limpar o conteúdo padrão (placeholder)
        const cardsExistentes = conteudoPainel.querySelectorAll('.item-fixado-card');
        if (cardsExistentes.length === 0) {
            // Verificar se há conteúdo padrão (placeholder)
            const placeholder = conteudoPainel.querySelector('.text-center.py-8.text-gray-400');
            if (placeholder) {
                placeholder.remove();
            }
        }

        let html = '';

        switch (item.tipo) {
            case 'medicamento':
                html = this.criarCardMedicamento(item.dados, index);
                break;
            case 'exame':
                html = this.criarCardExame(item.dados, index);
                break;
            case 'exame_fisico':
                html = this.criarCardExameFisico(item.dados, index);
                break;
            case 'orientacao':
                html = this.criarCardOrientacao(item.dados, index);
                break;
            default:
                return;
        }

        // Adicionar ao painel
        const div = document.createElement('div');
        div.innerHTML = html;
        const card = div.firstElementChild;

        // Adicionar evento de clique para expandir/recolher
        const titulo = card.querySelector('.item-titulo');
        if (titulo) {
            titulo.addEventListener('click', () => {
                const detalhes = card.querySelector('.item-detalhes');
                if (detalhes) {
                    detalhes.classList.toggle('hidden');

                    // Alternar ícone
                    const icone = titulo.querySelector('.toggle-icon');
                    if (icone) {
                        if (detalhes.classList.contains('hidden')) {
                            icone.textContent = '▶';
                        } else {
                            icone.textContent = '▼';
                        }
                    }
                }
            });
        }

        // Adicionar evento para remover item
        const btnRemover = card.querySelector('.btn-remover-item');
        if (btnRemover) {
            btnRemover.addEventListener('click', (e) => {
                e.stopPropagation();
                card.remove();
                this.salvarItensFixados();
                this.showSuccess('Item removido do painel');

                // Se não houver mais itens, mostrar placeholder
                const conteudoPainel = document.getElementById('conteudoPainel');
                if (conteudoPainel && conteudoPainel.querySelectorAll('.item-fixado-card').length === 0) {
                    this.mostrarPlaceholderPainel();
                }
            });
        }

        conteudoPainel.appendChild(card);

        // Abrir painel se estiver fechado
        this.abrirPainelFerramentas();
    }


    /**
     * Mostra o placeholder no painel quando não há itens
     */
    mostrarPlaceholderPainel() {
        const conteudoPainel = document.getElementById('conteudoPainel');
        if (!conteudoPainel) return;

        // Verificar se já existe placeholder
        const placeholderExistente = conteudoPainel.querySelector('.text-center.py-8.text-gray-400');
        if (placeholderExistente) return;

        const placeholderHTML = `
            <div class="text-center py-8 text-gray-400">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <p class="text-sm">Clique em qualquer ferramenta para ver os detalhes aqui</p>
            </div>
        `;

        conteudoPainel.innerHTML = placeholderHTML;
    }

    /**
     * Formata posologia de medicamento a partir do banco de dados
     * @param {Object} medicamento - Dados do medicamento
     * @returns {string} Posologia formatada ou string vazia
     */
    formatarPosologiaMedicamento(medicamento) {
        if (!window.MedicamentosDB || !Array.isArray(window.MedicamentosDB)) {
            return '';
        }

        const medicamentoDB = window.MedicamentosDB.find(m =>
            m.nome === medicamento.nome || m.generico === medicamento.nome
        );

        if (!medicamentoDB || !medicamentoDB.vias || !Array.isArray(medicamentoDB.vias)) {
            return '';
        }

        // Formatar cada via: "<via>: <dose> a cada <intervalo>"
        return medicamentoDB.vias.map(via => {
            return `${via.via}: ${via.dose} a cada ${via.intervalo}`;
        }).join('\n');
    }

    /**
     * Formata preparo de exame a partir do banco de dados
     * @param {Object} exame - Dados do exame
     * @returns {string} Preparo formatado ou string vazia
     */
    formatarPreparoExame(exame) {
        if (!window.ExamesComplementaresDB || !Array.isArray(window.ExamesComplementaresDB)) {
            return '';
        }

        const exameDB = window.ExamesComplementaresDB.find(e => e.nome === exame.nome);

        if (!exameDB || !exameDB.preparo) {
            return '';
        }

        if (Array.isArray(exameDB.preparo)) {
            return exameDB.preparo.join(' / ');
        }

        return exameDB.preparo.toString();
    }

    /**
     * Cria card para medicamento
     */
    criarCardMedicamento(medicamento, index) {
        // Sanitizar dados para exibição
        const medSanitizado = this.sanitizarObjeto(medicamento);

        // Obter posologia do banco de dados
        const posologia = this.formatarPosologiaMedicamento(medicamento);

        // Look up fresh vias data directly from DB — never trust medSanitizado.vias
        const medDB = (window.MedicamentosDB || []).find(
            m => m.nome === medicamento.nome || m.generico === medicamento.nome
        );
        const viasTexto = (medDB?.vias && medDB.vias.length > 0)
            ? medDB.vias.map(v => v.via).join(', ')
            : 'Não informadas';
        const dosesTexto = (medDB?.vias && medDB.vias.length > 0)
            ? medDB.vias.slice(0, 2).map(v => `${v.dose} (${v.intervalo})`).join('; ')
            : 'Não informadas';

        return `
            <div class="item-fixado-card border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm" data-tipo="medicamento" data-item-nome="${medSanitizado.nome.replace(/"/g, '&quot;')}" data-item-detalhe="${posologia.replace(/"/g, '&quot;')}" data-dados='${JSON.stringify(medSanitizado).replace(/'/g, "&#x27;")}'>
                <div class="flex items-center justify-between mb-2 cursor-pointer item-titulo">
                    <div class="flex items-center gap-2">
                        <span class="toggle-icon text-xs text-gray-500">▼</span>
                        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span class="text-blue-600">💊</span>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">${medSanitizado.nome}</h4>
                            <p class="text-xs text-gray-500">${medSanitizado.generico || ''}</p>
                        </div>
                    </div>
                    <button class="btn-remover-item w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-700">
                        🗑️
                    </button>
                </div>
                <div class="item-detalhes pl-10">
                    <div class="text-sm text-gray-700 space-y-1">
                        <p><span class="font-medium">Classe:</span> ${medSanitizado.classe || 'Não informada'}</p>
                        <p><span class="font-medium">Vias:</span> ${viasTexto}</p>
                        <p><span class="font-medium">Efeitos colaterais:</span> ${medSanitizado.colaterais ? medSanitizado.colaterais.slice(0, 3).join(', ') : 'Nenhum informado'}</p>
                        <p><span class="font-medium">Contraindicações:</span> ${medSanitizado.ci ? medSanitizado.ci.slice(0, 3).join(', ') : 'Nenhuma informada'}</p>
                        <p><span class="font-medium">Doses:</span> ${dosesTexto}</p>
                        ${medSanitizado.obs ? `<p><span class="font-medium">Observações:</span> ${medSanitizado.obs}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Cria card para exame complementar
     */
    criarCardExame(exame, index) {
        // Sanitizar dados para exibição
        const exameSanitizado = this.sanitizarObjeto(exame);

        // Obter preparo do banco de dados
        const preparo = this.formatarPreparoExame(exame);

        return `
            <div class="item-fixado-card border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm" data-tipo="exame" data-item-nome="${exameSanitizado.nome.replace(/"/g, '&quot;')}" data-item-detalhe="${preparo.replace(/"/g, '&quot;')}" data-dados='${JSON.stringify(exameSanitizado).replace(/'/g, "&#x27;")}'>
                <div class="flex items-center justify-between mb-2 cursor-pointer item-titulo">
                    <div class="flex items-center gap-2">
                        <span class="toggle-icon text-xs text-gray-500">▼</span>
                        <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <span class="text-green-600">🔬</span>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">${exameSanitizado.nome}</h4>
                            <p class="text-xs text-gray-500">${exameSanitizado.grupo || ''}</p>
                        </div>
                    </div>
                    <button class="btn-remover-item w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-700">
                        🗑️
                    </button>
                </div>
                <div class="item-detalhes pl-10">
                    <div class="text-sm text-gray-700 space-y-1">
                        <p><span class="font-medium">Indicações:</span> ${exameSanitizado.indicacoes ? (Array.isArray(exameSanitizado.indicacoes) ? exameSanitizado.indicacoes.slice(0, 3).join(', ') : exameSanitizado.indicacoes) : 'Não informadas'}</p>
                        <p><span class="font-medium">Preparo:</span> ${exameSanitizado.preparo ? (Array.isArray(exameSanitizado.preparo) ? exameSanitizado.preparo.slice(0, 2).join('; ') : exameSanitizado.preparo) : 'Não necessário'}</p>
                        <p><span class="font-medium">Contraindicações:</span> ${exameSanitizado.contraindicacoes ? (Array.isArray(exameSanitizado.contraindicacoes) ? exameSanitizado.contraindicacoes.slice(0, 2).join(', ') : exameSanitizado.contraindicacoes) : 'Nenhuma'}</p>
                        <p><span class="font-medium">Tempo:</span> ${exameSanitizado.tempo || 'Não informado'}</p>
                        ${exameSanitizado.obs ? `<p><span class="font-medium">Observações:</span> ${exameSanitizado.obs}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Cria card para exame físico
     */
    criarCardExameFisico(exameFisico, index) {
        const sistema = exameFisico.sistema || exameFisico.nome || 'Exame Físico';
        return `
            <div class="item-fixado-card border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm" data-tipo="exame_fisico" data-item-nome="${sistema.replace(/"/g, '&quot;')}" data-dados="${JSON.stringify(exameFisico).replace(/"/g, '&quot;')}">
                <div class="flex items-center justify-between mb-2 cursor-pointer item-titulo">
                    <div class="flex items-center gap-2">
                        <span class="toggle-icon text-xs text-gray-500">▼</span>
                        <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <span class="text-purple-600">👁️</span>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">${sistema}</h4>
                            <p class="text-xs text-gray-500">Exame Físico</p>
                        </div>
                    </div>
                    <button class="btn-remover-item w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-700">
                        🗑️
                    </button>
                </div>
                <div class="item-detalhes pl-10 hidden">
                    <div class="text-sm text-gray-700">
                        <p>${exameFisico.descricao || 'Descrição não disponível'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Cria card para orientação
     */
    criarCardOrientacao(orientacao, index) {
        return `
            <div class="item-fixado-card border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm" data-tipo="orientacao" data-item-nome="${orientacao.condicao.replace(/"/g, '&quot;')}" data-dados="${JSON.stringify(orientacao).replace(/"/g, '&quot;')}">
                <div class="flex items-center justify-between mb-2 cursor-pointer item-titulo">
                    <div class="flex items-center gap-2">
                        <span class="toggle-icon text-xs text-gray-500">▼</span>
                        <div class="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <span class="text-yellow-600">📋</span>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">${orientacao.condicao}</h4>
                            <p class="text-xs text-gray-500">Orientações de Alta</p>
                        </div>
                    </div>
                    <button class="btn-remover-item w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-700">
                        🗑️
                    </button>
                </div>
                <div class="item-detalhes pl-10 hidden">
                    <div class="text-sm text-gray-700 space-y-2">
                        <div>
                            <p class="font-medium">Orientações:</p>
                            <ul class="list-disc pl-5 text-gray-600">
                                ${orientacao.orientacoes ? orientacao.orientacoes.map(o => `<li>${o}</li>`).join('') : '<li>Nenhuma orientação disponível</li>'}
                            </ul>
                        </div>
                        <p><span class="font-medium">Retorno:</span> ${orientacao.retorno || 'Não especificado'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Fixa um medicamento no painel
     */
    fixarMedicamento(medicamento) {
        if (!medicamento || this.itemJaAdicionado(medicamento.nome)) return;

        const item = {
            tipo: 'medicamento',
            dados: medicamento,
            timestamp: new Date().toISOString()
        };

        this.adicionarItemAoPainel(item, -1);
        this.salvarItensFixados();
        this.showSuccess(`"${medicamento.nome}" fixado no painel`);
    }

    /**
     * Fixa um exame no painel
     */
    fixarExame(exame) {
        if (!exame || this.itemJaAdicionado(exame.nome)) return;

        const item = {
            tipo: 'exame',
            dados: exame,
            timestamp: new Date().toISOString()
        };

        this.adicionarItemAoPainel(item, -1);
        this.salvarItensFixados();
        this.showSuccess(`"${exame.nome}" fixado no painel`);
    }

    /**
     * Fixa um exame físico no painel
     */
    fixarExameFisico(exameFisico) {
        if (!exameFisico || this.itemJaAdicionado(exameFisico.sistema)) return;

        const item = {
            tipo: 'exame_fisico',
            dados: exameFisico,
            timestamp: new Date().toISOString()
        };

        this.adicionarItemAoPainel(item, -1);
        this.salvarItensFixados();
        this.showSuccess(`Exame físico "${exameFisico.sistema}" fixado no painel`);
    }

    /**
     * Fixa uma orientação no painel
     */
    fixarOrientacao(orientacao) {
        if (!orientacao || this.itemJaAdicionado(orientacao.condicao)) return;

        const item = {
            tipo: 'orientacao',
            dados: orientacao,
            timestamp: new Date().toISOString()
        };

        this.adicionarItemAoPainel(item, -1);
        this.salvarItensFixados();
        this.showSuccess(`Orientações "${orientacao.condicao}" fixadas no painel`);
    }

    /**
     * Verifica se um item já está adicionado ao painel lateral
     * @param {string} nomeItem - Nome do item a verificar
     * @returns {boolean} True se o item já estiver no painel
     */
    itemJaAdicionado(nomeItem) {
        const conteudoPainel = document.getElementById('conteudoPainel');
        if (!conteudoPainel) return false;

        const cards = conteudoPainel.querySelectorAll('.item-fixado-card[data-item-nome]');
        for (const card of cards) {
            if (card.dataset.itemNome === nomeItem) {
                return true;
            }
        }
        return false;
    }
}

// Exportar instância global
window.UI = new UIManager();
