/** Ambiente: true quando publicado (GitHub Pages), false em localhost ou file:// */
const _IS_HOSTED = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.protocol !== 'file:';

/**
 * API Client para Prontuário IA V2
 * Comunicação com servidor Python
 */

class APIClient {
    constructor() {
        this.baseUrl = window.location.origin;
        this.isLocal = !_IS_HOSTED;
    }

    /**
     * Retorna a chave DeepSeek salva no localStorage, ou null.
     */
    _getApiKey() {
        return localStorage.getItem('deepseek_api_key') || null;
    }

    /**
     * Exibe um <dialog> estilizado solicitando a chave da API DeepSeek.
     * @returns {Promise<string>} Resolve com a chave quando o usuário salva.
     */
    _promptApiKey() {
        return new Promise((resolve, reject) => {
            const dialog = document.createElement('dialog');
            dialog.style.cssText =
                'padding:0;border:none;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.3);font-family:system-ui,sans-serif;max-width:420px;width:90%;';
            dialog.innerHTML = `
                <form method="dialog" style="padding:1.5rem;">
                    <h2 style="margin:0 0 0.5rem;font-size:1.1rem;">Chave da API DeepSeek</h2>
                    <p style="margin:0 0 1rem;color:#555;font-size:0.9rem;">
                        Informe sua chave de API do DeepSeek.
                        Obtenha uma em
                        <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer">https://platform.deepseek.com/api_keys</a>
                    </p>
                    <input type="password" id="api-key-input" placeholder="sk-…"
                           style="width:100%;padding:0.6rem;border:1px solid #ccc;border-radius:6px;font-size:1rem;box-sizing:border-box;" />
                    <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
                        <button type="button" id="api-key-cancel"
                                style="padding:0.5rem 1rem;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;">Cancelar</button>
                        <button type="submit" id="api-key-save"
                                style="padding:0.5rem 1rem;border:none;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer;">Salvar</button>
                    </div>
                </form>
            `;
            document.body.appendChild(dialog);

            const input = dialog.querySelector('#api-key-input');
            const cancelBtn = dialog.querySelector('#api-key-cancel');

            dialog.addEventListener('submit', (e) => {
                e.preventDefault();
                const key = input.value.trim();
                if (!key) return;
                localStorage.setItem('deepseek_api_key', key);
                dialog.close();
                dialog.remove();
                resolve(key);
            });

            cancelBtn.addEventListener('click', () => {
                dialog.close();
                dialog.remove();
                reject(new Error('Usuário cancelou a entrada da chave API.'));
            });

            dialog.showModal();
            input.focus();
        });
    }

    /**
     * Gera prontuário usando IA
     * @param {string} prompt - Prompt completo para IA
     * @returns {Promise<string>} Texto gerado pela IA
     */
    async gerarProntuario(prompt) {
        try {
            // Modo GitHub Pages — chama DeepSeek API diretamente do navegador
            if (_IS_HOSTED) {
                let key = this._getApiKey();
                if (!key) {
                    await this._promptApiKey();
                    key = this._getApiKey();
                }
                const response = await fetch('https://api.deepseek.com/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 8000,
                        temperature: 0.3,
                    }),
                });

                if (response.status === 401) {
                    localStorage.removeItem('deepseek_api_key');
                    throw new Error('Chave API inválida. Recarregue a página e tente novamente.');
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erro ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                return data.choices?.[0]?.message?.content || '';
            }

            // Modo local — servidor Python
            const response = await fetch('/api/gerar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            if (data.erro) {
                throw new Error(data.erro);
            }

            return data.texto || '';

        } catch (error) {
            console.error('Erro ao gerar prontuário:', error);
            throw error;
        }
    }

    /**
     * Salva prontuário no histórico local
     * @param {Object} prontuario - Dados do prontuário
     * @returns {Promise<Object>} Prontuário salvo
     */
    async salvarProntuario(prontuario) {
        try {
            // Para V2, salva em arquivo local via servidor Python
            const response = await fetch('/api/salvar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prontuario)
            });

            if (response.ok) {
                return await response.json();
            }

            // Fallback para localStorage se o endpoint não existir
            return this.salvarLocalStorage(prontuario);

        } catch (error) {
            console.warn('Erro ao salvar no servidor, usando localStorage:', error);
            return this.salvarLocalStorage(prontuario);
        }
    }

    /**
     * Salva prontuário no localStorage (fallback)
     * @param {Object} prontuario - Dados do prontuário
     * @returns {Object} Prontuário salvo
     */
    salvarLocalStorage(prontuario) {
        try {
            const historico = JSON.parse(localStorage.getItem('historico_prontuarios') || '[]');

            const prontuarioCompleto = {
                ...prontuario,
                id: Date.now(),
                data: new Date().toISOString(),
                timestamp: Date.now()
            };

            historico.unshift(prontuarioCompleto);

            // Manter apenas os últimos 100 prontuários
            if (historico.length > 100) {
                historico.length = 100;
            }

            localStorage.setItem('historico_prontuarios', JSON.stringify(historico));

            return prontuarioCompleto;

        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            throw new Error('Não foi possível salvar o prontuário');
        }
    }

    /**
     * Carrega histórico de prontuários
     * @returns {Promise<Array>} Lista de prontuários
     */
    async carregarHistorico() {
        try {
            // Tenta carregar do servidor primeiro
            const response = await fetch('/api/historico');
            if (response.ok) {
                return await response.json();
            }

            // Fallback para localStorage
            return this.carregarHistoricoLocalStorage();

        } catch (error) {
            console.warn('Erro ao carregar do servidor, usando localStorage:', error);
            return this.carregarHistoricoLocalStorage();
        }
    }

    /**
     * Carrega histórico do localStorage
     * @returns {Array} Lista de prontuários
     */
    carregarHistoricoLocalStorage() {
        try {
            const historico = JSON.parse(localStorage.getItem('historico_prontuarios') || '[]');
            return historico;
        } catch (error) {
            console.error('Erro ao carregar histórico do localStorage:', error);
            return [];
        }
    }

    /**
     * Carrega templates do servidor
     * @param {string} especialidade - Especialidade para filtrar templates
     * @returns {Promise<Object>} Templates carregados
     */
    async carregarTemplates(especialidade = null) {
        try {
            let url = '/api/templates';
            if (especialidade) {
                url += `?especialidade=${encodeURIComponent(especialidade)}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }

            // Fallback para arquivo local
            return this.carregarTemplatesLocal(especialidade);

        } catch (error) {
            console.warn('Erro ao carregar templates do servidor:', error);
            return this.carregarTemplatesLocal(especialidade);
        }
    }

    /**
     * Filtra objetos de template por especialidade.
     * @param {Object} templates
     * @param {string|null} especialidade
     * @returns {Object}
     */
    _filtrarTemplates(templates, especialidade) {
        if (!especialidade) return templates;
        const filtrados = {};
        for (const [key, template] of Object.entries(templates)) {
            if (template.especialidade === especialidade || template.especialidade === 'geral') {
                filtrados[key] = template;
            }
        }
        return filtrados;
    }

    /**
     * Carrega templates do arquivo local
     * @param {string} especialidade - Especialidade para filtrar
     * @returns {Promise<Object>} Templates
     */
    async carregarTemplatesLocal(especialidade) {
        try {
            // Em modo hosted, verifica se os templates foram embutidos inline
            if (_IS_HOSTED && window._TEMPLATES_INLINE) {
                return this._filtrarTemplates(window._TEMPLATES_INLINE, especialidade);
            }

            const response = await fetch('data/templates.json');
            if (!response.ok) {
                throw new Error('Arquivo templates.json não encontrado');
            }

            const todosTemplates = await response.json();
            return this._filtrarTemplates(todosTemplates, especialidade);

        } catch (error) {
            console.error('Erro ao carregar templates locais:', error);
            return {};
        }
    }

    /**
     * Verifica status do servidor
     * @returns {Promise<boolean>} true se servidor está online
     */
    async verificarServidor() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        try {
            const response = await fetch('/api/status', {
                method: 'HEAD',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response.ok;
        } catch (err) {
            clearTimeout(timeoutId);
            return false;
        }
    }

    /**
     * Exporta prontuário como arquivo de texto
     * @param {Object} prontuario - Dados do prontuário
     * @param {string} formato - Formato de exportação (txt, json)
     */
    exportarProntuario(prontuario, formato = 'txt') {
        try {
            let conteudo, nomeArquivo, tipoMIME;

            if (formato === 'json') {
                conteudo = JSON.stringify(prontuario, null, 2);
                nomeArquivo = `prontuario_${prontuario.id || Date.now()}.json`;
                tipoMIME = 'application/json';
            } else {
                conteudo = prontuario.texto || '';
                nomeArquivo = `prontuario_${prontuario.id || Date.now()}.txt`;
                tipoMIME = 'text/plain';
            }

            const blob = new Blob([conteudo], { type: tipoMIME });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = nomeArquivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);


        } catch (error) {
            console.error('Erro ao exportar prontuário:', error);
            throw new Error('Falha ao exportar prontuário');
        }
    }

    /**
     * Limpa histórico local
     * @returns {Promise<boolean>} true se limpeza foi bem-sucedida
     */
    async limparHistorico() {
        try {
            // Tenta limpar no servidor
            const response = await fetch('/api/limpar', { method: 'POST' });
            if (response.ok) {
                return true;
            }
        } catch (error) {
            console.warn('Não foi possível limpar no servidor:', error);
        }

        // Limpa localStorage
        try {
            localStorage.removeItem('historico_prontuarios');
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

}

// Exportar instância global
window.API = new APIClient();