// =============================================================================
// Funções geradoras de conteúdo HTML para modais
// Extraídas de UIManager em ui.js para reduzir tamanho do arquivo principal
// =============================================================================

/**
 * Gera o HTML do modal de Medicamentos
 * @param {Array} medicamentosObjs - Lista de objetos de medicamentos
 * @param {Array} selecionados - Lista de itens já selecionados
 * @returns {string} HTML do conteúdo do modal
 */
function gerarConteudoModalMedicamentos(medicamentosObjs, selecionados) {
    return `
        <div class="p-4 h-full flex flex-col">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold text-blue-900">Medicamentos</h3>
                <button onclick="window.UI.fecharModal('modalMedicamentos')" class="text-gray-500 hover:text-gray-700 text-xl leading-none">&times;</button>
            </div>

            <div class="mb-3">
                <input type="text" id="buscaMedicamentos" placeholder="Buscar medicamento (nome, generico, classe)..."
                       class="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
            </div>

            <div id="listaMedicamentos" class="flex-1 overflow-y-auto max-h-[65vh] border border-gray-200 rounded bg-white">
                ${medicamentosObjs.map((med, index) => {
                    const isSelecionado = selecionados.some(s => s.nome === med.nome);
                    const jaAdicionado = window.UI.itemJaAdicionado(med.nome);
                    const displayNome = med.nome || 'Medicamento';
                    const displaySub = med.generico || med.classe || '';
                    const corDestaque = isSelecionado ? 'blue' : (jaAdicionado ? 'green' : '');
                    const corMap = {blue: 'border-l-blue-500 bg-blue-50', green: 'border-l-green-500 bg-green-50'};
                    const rowBorder = corMap[corDestaque] || '';

                    const viasHtml = med.vias && med.vias.length > 0 ?
                        med.vias.map(function(via) {
                            var text = '<div class="mb-2"><span class="font-medium">' + via.via + '</span>';
                            text += '<div class="text-sm text-gray-600 ml-2">';
                            if (via.dose) text += 'Dose: ' + via.dose + ' | ';
                            if (via.intervalo) text += 'Intervalo: ' + via.intervalo + ' | ';
                            if (via.max) text += 'Maximo: ' + via.max + ' | ';
                            if (via.obs) text += 'Obs: ' + via.obs;
                            text += '</div></div>';
                            return text;
                        }).join('') : '<div class="text-gray-500 text-sm">Sem informacoes de posologia</div>';

                    const colateraisHtml = med.colaterais && med.colaterais.length > 0 ?
                        '<ul class="list-disc pl-5 space-y-0.5 text-sm text-gray-600">' + med.colaterais.map(function(col) { return '<li>' + col + '</li>'; }).join('') + '</ul>' :
                        '<div class="text-sm text-gray-500">Sem informacoes de efeitos colaterais</div>';

                    const ciHtml = med.ci && med.ci.length > 0 ?
                        '<ul class="list-disc pl-5 space-y-0.5 text-sm text-gray-600">' + med.ci.map(function(ci) { return '<li>' + ci + '</li>'; }).join('') + '</ul>' :
                        '<div class="text-sm text-gray-500">Sem informacoes de contraindicacoes</div>';

                    return '<div class="accordion-item border-b border-gray-100 last:border-b-0" data-busca="' + (med.nome || '').toLowerCase() + ' ' + (med.generico || '').toLowerCase() + ' ' + (med.classe || '').toLowerCase() + '">'
                        + '<div class="accordion-trigger flex items-center gap-2 px-3 py-2 min-h-[38px] cursor-pointer hover:bg-gray-50 select-none ' + rowBorder + '">'
                        + '<input type="checkbox" value="' + index + '" '
                        + (isSelecionado ? 'checked ' : '')
                        + (jaAdicionado ? 'disabled ' : '')
                        + 'class="flex-shrink-0" id="med-' + index + '">'
                        + '<span class="w-2 h-2 rounded-full flex-shrink-0 ' + (corDestaque ? 'bg-' + corDestaque + '-500' : 'bg-gray-300') + '"></span>'
                        + '<span class="flex-1 text-sm truncate">' + displayNome + '</span>'
                        + (displaySub ? '<span class="text-xs text-gray-400 truncate max-w-[120px] hidden sm:inline">' + displaySub + '</span>' : '')
                        + '<span class="accordion-arrow text-xs text-gray-400 transition-transform duration-200 flex-shrink-0 mr-1">&#9654;</span>'
                        + (jaAdicionado
                            ? '<button disabled class="flex-shrink-0 px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded cursor-not-allowed opacity-50">Adicionado</button>'
                            : '<button data-medicamento-index="' + index + '" class="flex-shrink-0 px-2 py-0.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors adicionar-medicamento-btn">+ Adicionar</button>')
                        + '</div>'
                        + '<div class="accordion-body overflow-hidden transition-all duration-200 max-h-0" style="max-height: 0;">'
                        + '<div class="px-3 pb-3 pt-1 text-sm text-gray-700 border-t border-gray-100 space-y-2">'
                        + '<div><span class="font-medium text-gray-700">Posologia:</span> ' + viasHtml + '</div>'
                        + '<div><span class="font-medium text-gray-700">Efeitos Colaterais:</span> ' + colateraisHtml + '</div>'
                        + '<div><span class="font-medium text-gray-700">Contraindicacoes:</span> ' + ciHtml + '</div>'
                        + '</div></div></div>';
                }).join('')}
            </div>

            <div class="mt-3 pt-3 border-t flex justify-between items-center">
                <div class="text-sm text-gray-600">
                    ${selecionados.length} medicamento(s) selecionado(s)
                </div>
                <div class="flex gap-2">
                    <button onclick="window.UI.fecharModal('modalMedicamentos')"
                            class="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button onclick="window.UI.confirmarMedicamentos()"
                            class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Confirmar (${selecionados.length})
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Gera o HTML do modal de Exames Complementares
 * @param {Array} examesObjs - Lista de objetos de exames
 * @param {Array} selecionados - Lista de itens já selecionados
 * @returns {string} HTML do conteúdo do modal
 */
function gerarConteudoModalExames(examesObjs, selecionados) {
    return ''
        + '<div class="p-4 h-full flex flex-col">'
        + '<div class="flex justify-between items-center mb-4">'
        + '<h3 class="text-lg font-semibold text-violet-900">Exames Complementares</h3>'
        + '<button onclick="window.UI.fecharModal(\'modalExames\')" class="text-gray-500 hover:text-gray-700 text-lg leading-none">&times;</button>'
        + '</div>'
        + '<div class="mb-3">'
        + '<input type="text" id="buscaExames" placeholder="Buscar exame..."'
        + ' class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">'
        + '</div>'
        + '<div class="flex-1 overflow-y-auto max-h-[60vh] border border-gray-200 rounded bg-white" id="listaExames">'
        + examesObjs.map(function(exame, index) {
            var isSelecionado = selecionados.some(function(s) { return s.nome === exame.nome; });
            var jaAdicionado = window.UI.itemJaAdicionado(exame.nome);
            var nomeBusca = (exame.nome || '') + ' ' + (exame.grupo || '') + ' ' + (exame.indicacoes || '');
            var cor = 'violet';
            var grupo = exame.grupo || '';
            return '<div class="accordion-item border-b border-gray-100 last:border-b-0" data-busca="' + nomeBusca.replace(/"/g, '&quot;') + '">'
                + '<div class="accordion-trigger flex items-center gap-2 px-3 py-2 min-h-[38px] cursor-pointer hover:bg-violet-50 select-none transition-colors">'
                + '<input type="checkbox" value="' + index + '"'
                + (isSelecionado ? ' checked' : '')
                + (jaAdicionado ? ' disabled' : '')
                + ' class="flex-shrink-0">'
                + '<span class="flex-1 text-sm truncate">' + (exame.nome || 'Exame') + '</span>'
                + (grupo ? '<span class="text-xs text-gray-400 truncate max-w-[120px] hidden sm:inline">' + grupo + '</span>' : '')
                + '<span class="accordion-arrow text-xs text-gray-400 transition-transform duration-200 flex-shrink-0 mr-1">&#9654;</span>'
                + (jaAdicionado
                    ? '<button disabled class="flex-shrink-0 px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded cursor-not-allowed opacity-50">Adicionado</button>'
                    : '<button data-exame-index="' + index + '" class="flex-shrink-0 px-2 py-0.5 text-xs bg-violet-100 hover:bg-violet-200 text-violet-800 rounded transition-colors adicionar-exame-btn">+ Adicionar</button>')
                + '</div>'
                + '<div class="accordion-body overflow-hidden transition-all duration-200 max-h-0" style="max-height: 0;">'
                + '<div class="px-3 pb-3 pt-1 text-sm text-gray-700 border-t border-gray-100 space-y-2">'
                + (exame.indicacoes ? '<div><span class="font-medium text-gray-700">Indicacoes:</span> ' + exame.indicacoes + '</div>' : '')
                + (exame.preparo ? '<div><span class="font-medium text-gray-700">Preparo:</span> ' + exame.preparo + '</div>' : '')
                + ((exame.contraindicacoes && exame.contraindicacoes !== 'Nenhuma') ? '<div><span class="font-medium text-gray-700">Contraindicacoes:</span> ' + exame.contraindicacoes + '</div>' : '')
                + (exame.tempo ? '<div><span class="font-medium text-gray-700">Tempo para resultado:</span> ' + exame.tempo + '</div>' : '')
                + (exame.obs ? '<div><span class="font-medium text-gray-700">Observacoes:</span> ' + exame.obs + '</div>' : '')
                + '</div></div></div>';
        }).join('')
        + '</div>'
        + '<div class="mt-3 pt-3 border-t flex justify-between items-center">'
        + '<div class="text-sm text-gray-600">'
        + selecionados.length + ' exame(s) selecionado(s)'
        + '</div>'
        + '<div class="flex gap-2">'
        + '<button onclick="window.UI.fecharModal(\'modalExames\')"'
        + ' class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancelar</button>'
        + '<button onclick="window.UI.confirmarExames()"'
        + ' class="px-3 py-1.5 text-sm bg-violet-600 text-white rounded hover:bg-violet-700">Confirmar (' + selecionados.length + ')</button>'
        + '</div></div></div>';
}

/**
 * Gera o HTML do modal de Exame Físico
 * @param {Array} examesFisicos - Lista de objetos de exames físicos
 * @param {Array} selecionados - Lista de itens já selecionados
 * @returns {string} HTML do conteúdo do modal
 */
function gerarConteudoModalExameFisico(examesFisicos, selecionados) {
    var html = ''
        + '<div class="p-4 h-full flex flex-col">'
        + '<div class="flex justify-between items-center mb-4">'
        + '<h3 class="text-lg font-semibold text-indigo-900">Exame Fisico</h3>'
        + '<button onclick="window.UI.fecharModal(\'modalExameFisico\')" class="text-gray-500 hover:text-gray-700 text-lg leading-none">&times;</button>'
        + '</div>'
        + '<div class="mb-3">'
        + '<input type="text" id="buscaExameFisico" placeholder="Buscar sistema..."'
        + ' class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">'
        + '</div>'
        + '<div class="flex-1 overflow-y-auto max-h-[60vh] border border-gray-200 rounded bg-white" id="listaExameFisico">'
        + examesFisicos.map(function(exame, index) {
            var isSelecionado = selecionados.some(function(s) { return s.nome === exame.nome; });
            var jaAdicionado = window.UI.itemJaAdicionado(exame.sistema);
            var nomeBusca = (exame.nome || '') + ' ' + (exame.sistema || '');
            return '<div class="accordion-item border-b border-gray-100 last:border-b-0" data-busca="' + nomeBusca.replace(/"/g, '&quot;') + '">'
                + '<div class="accordion-trigger flex items-center gap-2 px-3 py-2 min-h-[38px] cursor-pointer hover:bg-indigo-50 select-none transition-colors">'
                + '<input type="checkbox" id="exame-fisico-' + index + '" value="' + index + '"'
                + (isSelecionado ? ' checked' : '')
                + (jaAdicionado ? ' disabled' : '')
                + ' class="flex-shrink-0">'
                + '<span class="w-2 h-2 rounded-full flex-shrink-0 bg-indigo-400"></span>'
                + '<span class="flex-1 text-sm truncate">' + (exame.nome || 'Exame Fisico') + '</span>'
                + '<span class="accordion-arrow text-xs text-gray-400 transition-transform duration-200 flex-shrink-0 mr-1">&#9654;</span>'
                + (jaAdicionado
                    ? '<button disabled class="flex-shrink-0 px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded cursor-not-allowed opacity-50">Adicionado</button>'
                    : '<button data-exame-fisico-index="' + index + '" class="flex-shrink-0 px-2 py-0.5 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded transition-colors adicionar-exame-fisico-btn">+ Adicionar</button>')
                + '</div>'
                + '<div class="accordion-body overflow-hidden transition-all duration-200 max-h-0" style="max-height: 0;">'
                + '<div class="px-3 pb-3 pt-1 text-sm text-gray-700 border-t border-gray-100 space-y-2">'
                + '<div><span class="font-medium text-gray-700">Descricao:</span><br>' + exame.descricao + '</div>'
                + (exame.indicacoes ? '<div><span class="font-medium text-gray-700">Indicacoes:</span> ' + exame.indicacoes + '</div>' : '')
                + (exame.obs ? '<div><span class="font-medium text-gray-700">Observacoes:</span> ' + exame.obs + '</div>' : '')
                + '</div></div></div>';
        }).join('')
        + '</div>'
        + '<div class="mt-3 pt-3 border-t flex justify-between items-center">'
        + '<div class="text-sm text-gray-600">'
        + selecionados.length + ' exame(s) fisico(s) selecionado(s)'
        + '</div>'
        + '<div class="flex gap-2">'
        + '<button onclick="window.UI.fecharModal(\'modalExameFisico\')"'
        + ' class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancelar</button>'
        + '<button onclick="window.UI.confirmarExameFisico()"'
        + ' class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Confirmar (' + selecionados.length + ')</button>'
        + '</div></div></div>';
    return html;
}

/**
 * Gera o HTML do modal de Orientações por Condição
 * @param {Array} orientacoesObjs - Lista de objetos de orientações
 * @param {Array} selecionados - Lista de itens já selecionados
 * @returns {string} HTML do conteúdo do modal
 */
function gerarConteudoModalOrientacoes(orientacoesObjs, selecionados) {
    var html = ''
        + '<div class="p-4 h-full flex flex-col">'
        + '<div class="flex justify-between items-center mb-4">'
        + '<h3 class="text-lg font-semibold text-green-900">Orientacoes por Condicao</h3>'
        + '<button onclick="window.UI.fecharModal(\'modalOrientacoes\')" class="text-gray-500 hover:text-gray-700 text-lg leading-none">&times;</button>'
        + '</div>'
        + '<div class="mb-3">'
        + '<input type="text" id="buscaOrientacoes" placeholder="Buscar condicao..."'
        + ' class="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">'
        + '</div>'
        + '<div class="flex-1 overflow-y-auto max-h-[60vh] border border-gray-200 rounded bg-white" id="listaOrientacoes">'
        + orientacoesObjs.map(function(condicaoObj, index) {
            var isSelected = selecionados.some(function(s) { return s.condicao === condicaoObj.condicao; });
            var jaAdicionado = window.UI.itemJaAdicionado(condicaoObj.condicao);
            var nomeBusca = condicaoObj.condicao || '';
            return '<div class="accordion-item border-b border-gray-100 last:border-b-0" data-busca="' + nomeBusca.replace(/"/g, '&quot;') + '">'
                + '<div class="accordion-trigger flex items-center gap-2 px-3 py-2 min-h-[38px] cursor-pointer hover:bg-green-50 select-none transition-colors">'
                + '<input type="checkbox" value="' + index + '"'
                + (isSelected ? ' checked' : '')
                + (jaAdicionado ? ' disabled' : '')
                + ' class="flex-shrink-0">'
                + '<span class="w-2 h-2 rounded-full flex-shrink-0 bg-green-400"></span>'
                + '<span class="flex-1 text-sm truncate">' + (condicaoObj.condicao || 'Condicao') + '</span>'
                + '<span class="accordion-arrow text-xs text-gray-400 transition-transform duration-200 flex-shrink-0 mr-1">&#9654;</span>'
                + (jaAdicionado
                    ? '<button disabled class="flex-shrink-0 px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded cursor-not-allowed opacity-50">Adicionado</button>'
                    : '<button data-orientacao-index="' + index + '" class="flex-shrink-0 px-2 py-0.5 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded transition-colors adicionar-orientacao-btn">+ Adicionar</button>')
                + '</div>'
                + '<div class="accordion-body overflow-hidden transition-all duration-200 max-h-0" style="max-height: 0;">'
                + '<div class="px-3 pb-3 pt-1 text-sm text-gray-700 border-t border-gray-100 space-y-2">'
                + '<div><span class="font-medium text-gray-700">Recomendacoes:</span></div>'
                + '<ul class="list-disc pl-5 space-y-1">'
                + condicaoObj.orientacoes.map(function(orient) { return '<li>' + orient + '</li>'; }).join('')
                + '</ul>'
                + (condicaoObj.retorno ? '<div class="mt-2"><span class="font-medium text-gray-700">Retorno:</span> ' + condicaoObj.retorno + '</div>' : '')
                + '</div></div></div>';
        }).join('')
        + '</div>'
        + '<div class="mt-3 pt-3 border-t flex justify-end gap-2">'
        + '<button onclick="window.UI.fecharModal(\'modalOrientacoes\')"'
        + ' class="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancelar</button>'
        + '<button onclick="window.UI.confirmarOrientacoes()"'
        + ' class="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700">Confirmar (' + selecionados.length + ')</button>'
        + '</div></div>';
    return html;
}
