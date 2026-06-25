/**
 * Template Engine V2 - Motor de templates para prontuários médicos
 * Carrega templates JSON por especialidade e aplica variáveis
 */

// ─────────────────────────────────────────────────────────────
// INSTRUÇÕES PARA A IA — edite aqui para personalizar como
// o prontuário SOAP é gerado. Uma instrução por linha.
// ─────────────────────────────────────────────────────────────
const INSTRUCOES_IA = `
- Write in Brazilian Portuguese
- Você diagramará um prontuário médico conforme as instruções.
- Subjetivo deve ser escrito em ordem cronológica, da forma mais detalhada possível conforme os dados apresentados
- As comorbidades prévias e medicações em uso devem ser escritas logo no início do S (Subjetivo), antes de descrever os sintomas atuais
- Ao final do S (Subjetivo), adicionar um parágrafo com o que o paciente negou (ex: "nega febre, dispneia ou trauma.")
- Usar linguagem médica formal e objetiva
- No P (Plano), separar em tópicos: 1. Conduta imediata  2. Prescrição  3. Orientações  4. Retorno/encaminhamento
- NÃO use formatação markdown (** para negrito ou * para itálico)
- Use apenas hífens (-) para listas e tópicos, EXCETO nas hipóteses diagnósticas que devem ser numeradas (1. / 2. / 3.)
- NÃO adicione "⚠ Gerado com IA — revisar antes de assinar." ou qualquer aviso similar
- Preencha TODOS os campos do template fornecido
- Se um campo do template não tiver informação, escreva "Não informado" ou deixe em branco
- NÃO repita seções do template
- Use exatamente a estrutura do template fornecido, apenas preenchendo os campos
- Para campos de HIPÓTESES DIAGNÓSTICAS, DIAGNÓSTICO, IMPRESSÃO/DIAGNÓSTICO ou equivalentes: escreva SEMPRE exatamente 3 hipóteses numeradas (1. / 2. / 3.) em ordem decrescente de probabilidade clínica. Para cada hipótese: nome da condição, seguido de 1-2 frases de justificativa objetiva baseada nos dados do paciente. Não escreva "Aguardando avaliação" nem deixe em branco.
- Exemplo de formato correto: "1. Pneumonia adquirida na comunidade — presença de febre, tosse produtiva e crepitações à ausculta. 2. Bronquite aguda — quadro mais leve sem consolidação aparente. 3. Derrame pleural parapneumônico — como complicação a ser descartada."
- Após preencher o campo de diagnóstico/hipóteses, adicione imediatamente abaixo uma linha com exatamente este formato: "CID-10 sugeridos: X.XX, X.XX, X.XX, X.XX, X.XX" — liste 5 códigos CID-10 em ordem decrescente de probabilidade, separados por vírgula, sem descrições, sem parênteses, apenas os códigos alfanuméricos padrão.
`.trim();

window.InstrucoesIA = INSTRUCOES_IA;

class TemplateEngine {
    constructor() {
        this.templates = {};
        this.especialidades = {};
        this.currentTemplate = null;
    }

    /**
     * Carrega templates para uma especialidade
     * @param {string} especialidade - Nome da especialidade
     * @returns {Promise<Object>} Templates carregados
     */
    async carregarTemplates(especialidade) {
        try {
            // Usar API do servidor para carregar templates
            const response = await fetch(`/api/templates?especialidade=${encodeURIComponent(especialidade)}`);
            if (!response.ok) {
                throw new Error(`Erro ao carregar templates: ${response.status}`);
            }

            const templates = await response.json();
            this.templates[especialidade] = templates;
            this.especialidades[especialidade] = Object.keys(templates);

            return templates;
        } catch (error) {
            console.error(`Erro ao carregar templates para ${especialidade}:`, error);

            // Fallback: tentar carregar arquivo local
            try {
                const response = await fetch(`templates/${especialidade}.json`);
                if (response.ok) {
                    const templates = await response.json();
                    this.templates[especialidade] = templates;
                    this.especialidades[especialidade] = Object.keys(templates);
                    return templates;
                }
            } catch (fallbackError) {
                console.error('Erro no fallback de templates:', fallbackError);
            }

            return {};
        }
    }

    /**
     * Obtém lista de templates disponíveis para uma especialidade
     * @param {string} especialidade - Nome da especialidade
     * @returns {Array<string>} Nomes dos templates
     */
    getTemplateNames(especialidade) {
        return this.especialidades[especialidade] || [];
    }

    /**
     * Obtém um template específico
     * @param {string} especialidade - Nome da especialidade
     * @param {string} templateName - Nome do template
     * @returns {Object|null} Template ou null se não encontrado
     */
    getTemplate(especialidade, templateName) {
        if (!this.templates[especialidade] || !this.templates[especialidade][templateName]) {
            return null;
        }

        this.currentTemplate = {
            ...this.templates[especialidade][templateName],
            nome: templateName,
            especialidade: especialidade
        };

        return this.currentTemplate;
    }

    /**
     * Aplica variáveis a um template
     * @param {Object} template - Template com estrutura e variáveis
     * @param {Object} dados - Dados do paciente e anamnese
     * @returns {string} Template com variáveis substituídas
     */
    aplicarTemplate(template, dados) {
        if (!template || !template.estrutura) {
            return 'Template inválido ou sem estrutura definida.';
        }

        let resultado = template.estrutura;

        // Substituir variáveis básicas
        const variaveis = {
            nome: dados.nome || '[NÃO INFORMADO]',
            idade: dados.idade || '[NÃO INFORMADO]',
            sexo: dados.sexo || '[NÃO INFORMADO]',
            profissao: dados.profissao || '[NÃO INFORMADO]',
            naturalidade: dados.naturalidade || '[NÃO INFORMADO]',
            queixa: dados.queixa || '[NÃO INFORMADO]',
            anamnese: dados.anamnese || '[NÃO INFORMADO]',
            data: this.getDataAtual(),
            hora: this.getHoraAtual(),
            sinaisVitais: dados.sinaisVitais || 'Não aferidos.',
            peso:        dados.svPeso   ? `${dados.svPeso} kg`    : '',
            altura:      dados.svAltura ? `${dados.svAltura} m`   : '',
            pa:          dados.svPA     ? `${dados.svPA} mmHg`    : '',
            fc:          dados.svFC     ? `${dados.svFC} bpm`     : '',
            fr:          dados.svFR     ? `${dados.svFR} irpm`    : '',
            temperatura: dados.svTemp   ? `${dados.svTemp} °C`    : '',
            satO2:       dados.svSatO2  ? `${dados.svSatO2}%`     : '',
            hgt:         dados.svHGT    ? `${dados.svHGT} mg/dL`  : ''
        };

        // Substituir variáveis no template (incluindo versões com acentos)
        const substituicoes = [
            { placeholder: '{{NOME}}', value: variaveis.nome },
            { placeholder: '{{IDADE}}', value: variaveis.idade },
            { placeholder: '{{SEXO}}', value: variaveis.sexo },
            { placeholder: '{{PROFISSÃO}}', value: variaveis.profissao },
            { placeholder: '{{PROFISSAO}}', value: variaveis.profissao },
            { placeholder: '{{RESIDÊNCIA}}', value: variaveis.naturalidade },
            { placeholder: '{{RESIDENCIA}}', value: variaveis.naturalidade },
            { placeholder: '{{QUEIXA}}', value: variaveis.queixa },
            { placeholder: '{{ANAMNESE}}', value: variaveis.anamnese },
            { placeholder: '{{DATA}}', value: variaveis.data },
            { placeholder: '{{HORA}}', value: variaveis.hora },
            { placeholder: '{{SINAIS_VITAIS}}', value: variaveis.sinaisVitais },
            { placeholder: '{{PESO}}',        value: variaveis.peso        || 'Não informado.' },
            { placeholder: '{{ALTURA}}',      value: variaveis.altura      || 'Não informado.' },
            { placeholder: '{{PA}}',          value: variaveis.pa          || 'Não aferida.'   },
            { placeholder: '{{FC}}',          value: variaveis.fc          || 'Não aferida.'   },
            { placeholder: '{{FR}}',          value: variaveis.fr          || 'Não aferida.'   },
            { placeholder: '{{TEMPERATURA}}', value: variaveis.temperatura || 'Não aferida.'   },
            { placeholder: '{{SATO2}}',       value: variaveis.satO2       || 'Não aferida.'   },
            { placeholder: '{{HGT}}',                    value: variaveis.hgt         || 'Não aferido.'             },
            { placeholder: '{{ALERGIAS}}',               value: dados.alergias        || 'Nenhuma alergia conhecida.' },
            { placeholder: '{{MEDICAMENTOS_ATUAIS}}',    value: dados.medicacoesUso   || 'Não informado.'            },
            { placeholder: '{{ANTECEDENTES}}',           value: dados.antecedentes    || 'Não informado.'            },
            { placeholder: '{{ANTECEDENTES_CARDIOLOGICOS}}', value: dados.antecedentes || 'Não informado.'           },
            { placeholder: '{{ANTECEDENTES_PEDIATRICOS}}',   value: dados.antecedentes || 'Não informado.'           }
        ];

        for (const sub of substituicoes) {
            resultado = resultado.replace(new RegExp(sub.placeholder, 'g'), sub.value);
        }

        // Adicionar seções específicas do template
        if (template.secoes) {
            for (const [sectionName, sectionContent] of Object.entries(template.secoes)) {
                const placeholder = `{{${sectionName.toUpperCase()}}}`;
                resultado = resultado.replace(new RegExp(placeholder, 'g'), sectionContent);
            }
        }

        // Adicionar medicamentos se fornecidos
        if (dados.medicamentos && dados.medicamentos.length > 0) {
            const medsText = dados.medicamentos.map(m => {
                if (typeof m === 'string') return `- ${m}`;

                let text = `- ${m.nome || 'Medicamento'}`;
                if (m.classe) text += ` (${m.classe})`;
                if (m.generico) text += ` - Genérico: ${m.generico}`;

                // Adicionar posologia (vias)
                if (m.vias && m.vias.length > 0) {
                    text += '\n  Posologia:';
                    m.vias.forEach(via => {
                        text += `\n  • Via: ${via.via || 'Não especificada'}`;
                        if (via.dose) text += ` | Dose: ${via.dose}`;
                        if (via.intervalo) text += ` | Intervalo: ${via.intervalo}`;
                        if (via.max) text += ` | Máximo: ${via.max}`;
                        if (via.obs) text += ` | Observação: ${via.obs}`;
                    });
                }

                // Adicionar contraindicações
                if (m.ci && m.ci.length > 0) {
                    text += `\n  Contraindicações: ${m.ci.join('; ')}`;
                }

                // Adicionar efeitos colaterais comuns
                if (m.colaterais && m.colaterais.length > 0) {
                    text += `\n  Efeitos colaterais comuns: ${m.colaterais.join('; ')}`;
                }

                return text;
            }).join('\n\n');
            resultado = resultado.replace('{{MEDICAMENTOS}}', medsText);
        } else {
            resultado = resultado.replace('{{MEDICAMENTOS}}', 'Nenhum medicamento prescrito.');
        }

        // Adicionar exames se fornecidos
        if (dados.exames && dados.exames.length > 0) {
            // Separar exames físicos e complementares
            const examesFisicos = [];
            const examesComplementares = [];

            dados.exames.forEach(e => {
                if (typeof e === 'string') {
                    examesComplementares.push(e);
                } else if (e.tipo === 'fisico') {
                    examesFisicos.push(e);
                } else {
                    examesComplementares.push(e);
                }
            });

            // Adicionar exames complementares na seção geral
            if (examesComplementares.length > 0) {
                const examesText = examesComplementares.map(e => {
                    if (typeof e === 'string') return `- ${e}`;
                    let text = `- ${e.nome || 'Exame'}`;
                    if (e.grupo) text += ` (${e.grupo})`;
                    if (e.indicacoes) text += ` - Indicações: ${e.indicacoes}`;
                    return text;
                }).join('\n');
                resultado = resultado.replace('{{EXAMES}}', examesText);
            } else {
                resultado = resultado.replace('{{EXAMES}}', 'Nenhum exame complementar solicitado.');
            }

            // Adicionar exames físicos em suas seções correspondentes
            const mapeamentoSistemas = {
                'cardiaco': 'CARDIOLOGICO',
                'respiratorio': 'RESPIRATORIO',
                'abdome': 'ABDOMINAL',
                'neurologico': 'NEUROLOGICO',
                'extremidades': 'EXTREMIDADES',
                'pele': 'PELE_FANEROS',
                'cabeca_pescoto': 'CABECA_PESCOCO',
                'linfonodos_detalhado': 'LINFONODOS',
                'aparelho_genitourinario_masc': 'GENITURINARIO',
                'aparelho_genitourinario_fem': 'GENITURINARIO',
                'coluna_vertebral': 'COLUNA',
                'vascular_periferico_detalhado': 'VASCULAR',
                'estado_mental_completo': 'ESTADO_MENTAL',
                'articulacoes_e_osteomuscular': 'OSTEOMUSCULAR'
            };

            // Build combined text for EXAME_FISICO_GERAL (templates that use a single slot)
            const linhasGeral = [];
            let algumEspecificoFoi = false;

            examesFisicos.forEach(exame => {
                const sistema = exame.sistema;
                const placeholder = mapeamentoSistemas[sistema];

                if (placeholder && exame.descricao) {
                    // Fill the system-specific placeholder
                    const regex = new RegExp(`{{EXAME_FISICO_${placeholder}}}`, 'g');
                    resultado = resultado.replace(regex, '- ' + exame.descricao);
                    algumEspecificoFoi = true;

                    // Collect for GERAL slot
                    linhasGeral.push('- ' + exame.descricao);
                }
            });

            // Fill EXAME_FISICO_GERAL only for templates that do NOT have individual system slots
            // (e.g. consulta_geral). In nota_soap, specific slots are already filled — GERAL
            // would duplicate them, so it stays unfilled and gets removed by the cleanup below.
            if (linhasGeral.length > 0 && !algumEspecificoFoi && resultado.includes('{{EXAME_FISICO_GERAL}}')) {
                resultado = resultado.replace(/\{\{EXAME_FISICO_GERAL\}\}/g, linhasGeral.join('\n'));
            }

            // Fill specialty-specific exam placeholders (non-SOAP templates)
            // Each receives the full list of selected physical exams.
            const specialtyExamPlaceholders = [
                'EXAME_CARDIOVASCULAR',
                'EXAME_PEDIATRICO',
                'EXAME_ORTOPEDICO',
                'EXAME_GINECOLOGICO',
                'EXAME_FISICO_FOCADO'
            ];

            if (linhasGeral.length > 0) {
                const textoExamesCombinado = linhasGeral.join('\n');
                specialtyExamPlaceholders.forEach(ph => {
                    if (resultado.includes(`{{${ph}}}`)) {
                        resultado = resultado.replace(new RegExp(`\\{\\{${ph}\\}\\}`, 'g'), textoExamesCombinado);
                    }
                });
            }

            // Remove lines whose only content is an unfilled {{...}} placeholder
            resultado = resultado.replace(
                /^[^\S\n]*\{\{(?:EXAME_FISICO_[A-Z_]+|EXAME_CARDIOVASCULAR|EXAME_PEDIATRICO|EXAME_ORTOPEDICO|EXAME_GINECOLOGICO|EXAME_FISICO_FOCADO)\}\}[^\S\n]*\n?/gm,
                ''
            );
            // Collapse triple+ blank lines that may result from removal
            resultado = resultado.replace(/\n{3,}/g, '\n\n');

        } else {
            // Remove unfilled physical exam placeholder lines even when no exam data
            resultado = resultado.replace(
                /^[^\S\n]*\{\{(?:EXAME_FISICO_[A-Z_]+|EXAME_CARDIOVASCULAR|EXAME_PEDIATRICO|EXAME_ORTOPEDICO|EXAME_GINECOLOGICO|EXAME_FISICO_FOCADO)\}\}[^\S\n]*\n?/gm,
                ''
            );
            resultado = resultado.replace(/\n{3,}/g, '\n\n');
            resultado = resultado.replace('{{EXAMES}}', 'Nenhum exame solicitado.');
        }

        // Adicionar orientações se fornecidas
        if (dados.orientacoes && dados.orientacoes.length > 0) {
            const orientacoesText = dados.orientacoes.map(o => {
                if (typeof o === 'string') return `- ${o}`;

                // Se for um objeto de condição
                let text = `- ${o.condicao || 'Condição não especificada'}`;
                if (o.orientacoes && Array.isArray(o.orientacoes)) {
                    text += '\n  Recomendações:';
                    o.orientacoes.forEach(orient => {
                        text += `\n    • ${orient}`;
                    });
                }
                if (o.retorno) {
                    text += `\n  Retorno: ${o.retorno}`;
                }
                return text;
            }).join('\n\n');
            resultado = resultado.replace('{{ORIENTACOES}}', orientacoesText);
        } else {
            resultado = resultado.replace('{{ORIENTACOES}}', 'Nenhuma orientação específica.');
        }

        // Substituir outros placeholders comuns com valores padrão
        const outrosPlaceholders = {
            'ANTECEDENTES': 'Não informado.',
            'EXAME_FISICO_EMERGENCIA': 'Não realizado.',
            'EVOLUCAO': 'Não informado.',
            'AVALIACAO_RISCO': 'Não avaliado.',
            'ANTECEDENTES_CARDIOLOGICOS': 'Não informado.',
            'ANTECEDENTES_PEDIATRICOS': 'Não informado.',
            'CONTROLE_PRESSORICO': 'Não monitorado.',
            'DESENVOLVIMENTO': 'Adequado para idade.',
            'VACINACAO': 'Em dia.',
            'ALIMENTACAO': 'Adequada.',
            'RECOMENDACOES_PRE_OPERATORIAS': 'Não aplicável.',
            'MEDICAMENTOS_ATUAIS': 'Não informado.',
            'ALERGIAS': 'Nenhuma alergia conhecida.',
            'RACIOCINIO_CLINICO': 'Não documentado.',
            'ACOMPANHAMENTO': 'Não agendado.',
            'ENCAMINHAMENTOS': 'Nenhum encaminhamento necessário.',
            'CID_SUGERIDOS': '',
            'DIAGNOSTICOS': 'Aguardando avaliação completa.',
            'AVALIACAO_TRATAMENTO': 'Não avaliado.',
            'CRITERIOS_RETORNO': 'Não especificado.',
            'FATORES_RISCO': 'Não informados.',
            'HISTORIA_PERINATAL': 'Não informada.',
            'MECANISMO_TRAUMA': 'Não especificado.',
            'ESTADO_CIVIL': 'Não informado.',
            'HISTORIA_MENSTRUAL': 'Não informada.',
            'HISTORIA_OBSTETRICA': 'Não informada.',
            'METODOS_CONTRACEPTIVOS': 'Não informados.'
        };

        for (const [placeholder, defaultValue] of Object.entries(outrosPlaceholders)) {
            const regex = new RegExp(`{{${placeholder}}}`, 'g');
            resultado = resultado.replace(regex, defaultValue);
        }

        return resultado;
    }

    /**
     * Gera prompt para IA baseado no template
     * @param {Object} template - Template selecionado
     * @param {Object} dados - Dados do paciente
     * @returns {string} Prompt formatado para IA
     */
    gerarPromptIA(template, dados) {
        const templateAplicado = this.aplicarTemplate(template, dados);

        let prompt = `Com base nas informações abaixo, preencha o template de prontuário médico:\n\n`;
        prompt += `PACIENTE: ${dados.nome || '[NOME]'}, ${dados.idade || '[IDADE]'}, ${dados.sexo || '[SEXO]'}\n`;
        prompt += `QUEIXA PRINCIPAL: ${dados.queixa || '[QUEIXA PRINCIPAL]'}\n`;
        prompt += `ANAMNESE (use esta informação para preencher o Subjetivo/História da Doença Atual):\n${dados.anamnese || '[ANAMNESE]'}\n\n`;

        // Injetar dados clínicos estruturados no contexto (a IA usa para construir a narrativa)
        if (dados.alergias) {
            prompt += `ALERGIAS DO PACIENTE: ${dados.alergias}\n`;
        }
        if (dados.medicacoesUso) {
            prompt += `MEDICAÇÕES EM USO: ${dados.medicacoesUso}\n`;
        }
        if (dados.antecedentes) {
            prompt += `ANTECEDENTES PESSOAIS: ${dados.antecedentes}\n`;
        }
        if (dados.alergias || dados.medicacoesUso || dados.antecedentes) {
            prompt += `\n`;
        }

        // Adicionar instruções gerais da IA
        if (window.InstrucoesIA) {
            prompt += `INSTRUÇÕES GERAIS:\n${window.InstrucoesIA}\n\n`;
        }

        if (template.instrucoes) {
            prompt += `INSTRUÇÕES ESPECÍFICAS PARA ${template.nome.toUpperCase()}:\n${template.instrucoes}\n\n`;
        }

        prompt += `TEMPLATE A SER PREENCHIDO (NÃO altere a estrutura, apenas preencha os campos {{...}}):\n${templateAplicado}\n\n`;
        prompt += `REGRAS IMPORTANTES:\n`;
        prompt += `1. PREENCHA todos os campos {{...}} do template acima\n`;
        prompt += `2. Use a anamnese fornecida para preencher o Subjetivo/História da Doença Atual\n`;
        prompt += `3. NÃO use formatação markdown (** ou *)\n`;
        prompt += `4. Use apenas hífens (-) para listas — exceto hipóteses diagnósticas, que devem ser numeradas\n`;
        prompt += `5. NÃO adicione "⚠ Gerado com IA" ou qualquer aviso\n`;
        prompt += `6. NÃO repita seções ou adicione estrutura extra\n`;
        prompt += `7. Se um campo não tiver informação, escreva "Não informado"\n`;
        prompt += `8. Mantenha exatamente a mesma estrutura do template\n`;
        prompt += `9. Para HIPÓTESES DIAGNÓSTICAS / DIAGNÓSTICO / IMPRESSÃO: liste SEMPRE 3 hipóteses numeradas, da mais para a menos provável, com justificativa clínica breve em cada uma\n`;
prompt += `10. Após cada campo de diagnóstico, adicione "CID-10 sugeridos: " seguido de 5 códigos CID-10 em ordem decrescente de probabilidade, separados por vírgula — somente os códigos, sem descrições\n`;

        return prompt;
    }

    /**
     * Retorna data atual formatada
     * @returns {string} Data no formato DD/MM/AAAA
     */
    getDataAtual() {
        const now = new Date();
        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    /**
     * Retorna hora atual formatada
     * @returns {string} Hora no formato HH:MM
     */
    getHoraAtual() {
        const now = new Date();
        const hora = String(now.getHours()).padStart(2, '0');
        const minuto = String(now.getMinutes()).padStart(2, '0');
        return `${hora}:${minuto}`;
    }

    /**
     * Salva template personalizado
     * @param {string} especialidade - Especialidade do template
     * @param {string} nome - Nome do template
     * @param {Object} template - Estrutura do template
     */
    salvarTemplatePersonalizado(especialidade, nome, template) {
        if (!this.templates[especialidade]) {
            this.templates[especialidade] = {};
        }

        this.templates[especialidade][nome] = {
            ...template,
            personalizado: true,
            dataCriacao: new Date().toISOString()
        };

        this.especialidades[especialidade] = Object.keys(this.templates[especialidade]);

        // Em uma implementação real, salvaria no localStorage ou servidor
    }
}

// Exportar instância global
window.TemplateEngine = new TemplateEngine();