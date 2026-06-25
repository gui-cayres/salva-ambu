// ─────────────────────────────────────────────────────────────
// BASE DE MEDICAMENTOS — edite aqui para adicionar, alterar ou
// remover medicamentos sem tocar no index.html
//
// Estrutura de cada entrada:
// {
//   nome        : string  — nome comercial / principal
//   generico    : string  — nome genérico / DCI
//   classe      : string  — classe farmacológica
//   vias        : [ { id, via, dose, intervalo, max, obs } ]
//   colaterais  : [ string, string, string ]   ← os 3 mais comuns
//   ci          : [ string, ... ]              ← contraindicações
// }
// ─────────────────────────────────────────────────────────────

const MEDS = [
  // Estrutura das primeiras 20 entradas dos medicamentos mais prescritos por clínicos gerais no Brasil
  // Fontes: ANVISA, RENAME 2022, PCDT Ministério da Saúde, UpToDate adaptado para prática brasileira.

  // TRAMADOL (Cloridrato de Tramadol)
  { nome:"Tramadol", generico:"Cloridrato de Tramadol", classe:"Analgésico Opioide de Ação Central",
    vias:[
      { id:"oral", via:"Oral", dose:"50 mg a 100 mg", intervalo:"6/6 h ou 8/8 h", max:"400 mg/dia", obs:"Iniciar com menor dose em idosos ou hepatopatas. Comprimido de liberação imediata." },
      { id:"oral_prolongada", via:"Oral (Liberação Prolongada)", dose:"100 mg a 200 mg", intervalo:"12/12 h ou 24/24 h", max:"400 mg/dia", obs:"Comprimido revestido. Não partir, mastigar ou esmagar." },
      { id:"intravenoso", via:"Intravenoso (IV)", dose:"50 mg a 100 mg", intervalo:"6/6 h", max:"400 mg/dia", obs:"Administrar lentamente (2-3 minutos). Diluir em SF 0,9% ou SG 5%." },
      { id:"intramuscular", via:"Intramuscular (IM)", dose:"50 mg a 100 mg", intervalo:"6/6 h", max:"400 mg/dia", obs:"Aplicação profunda. Absorção errática; via IV preferível em dor aguda." }
    ],
    colaterais:[
      "Náusea / Vômito",
      "Tontura / Sonolência",
      "Constipação intestinal",
      "Cefaleia",
      "Boca seca",
      "Sudorese",
      "Confusão mental (especialmente em idosos)",
      "Depressão respiratória (rara em doses terapêuticas, risco aumentado com doses altas ou associação com outros depressores do SNC)",
      "Convulsões (limiar reduzido, cuidado em epilepsia ou uso de ISRS/IRSN)"
    ],
    ci:[
      "Hipersensibilidade ao tramadol ou opioides",
      "Intoxicação aguda por álcool, hipnóticos, analgésicos ou psicotrópicos",
      "Uso concomitante de IMAO ou dentro de 14 dias após suspensão",
      "Epilepsia não controlada",
      "Insuficiência respiratória grave",
      "Insuficiência hepática grave (Child-Pugh C)",
      "Insuficiência renal grave (ClCr < 30 mL/min) - ajuste de dose necessário; formulações de liberação prolongada contraindicadas",
      "Gravidez e lactação (risco de síndrome de abstinência neonatal; excretado no leite materno)"
    ]
  },

  // 1. GLIFAGE XR (Metformina - Ação Prolongada)
  { nome:"Glifage XR", generico:"Cloridrato de Metformina", classe:"Antidiabético Oral (Biguanida)",
    vias:[
      { id:"oral", via:"Oral", dose:"500 mg a 2.000 mg", intervalo:"1x/dia (jantar)", max:"2.000 mg/dia XR", obs:"Comprimido de liberação prolongada. Não partir ou mastigar." },
    ],
    colaterais:["Diarreia / Náusea (transitório)","Deficiência de Vitamina B12 (uso crônico)","Acidose Lática (raro, grave se IR)"],
    ci:["TFG < 30 mL/min (Insuficiência Renal Grave)","Acidose metabólica aguda","Insuficiência Hepática Grave","Jejum cirúrgico ou uso de contraste iodado (suspensão temporária)"] },

  // 2. NEOSORO (Cloridrato de Nafazolina)
  { nome:"Neosoro", generico:"Cloridrato de Nafazolina", classe:"Descongestionante Nasal Tópico (Simpatomimético)",
    vias:[
      { id:"nasal", via:"Tópica Nasal", dose:"2-4 gotas/narina", intervalo:"6/6 h ou 8/8 h", max:"5 dias", obs:"Risco de rinite medicamentosa e taquifilaxia com uso prolongado." },
    ],
    colaterais:["Congestão rebote (efeito rebote)","Ardência / Secura nasal","Taquicardia / Hipertensão (absorção sistêmica)"],
    ci:["Glaucoma de ângulo fechado","Crianças < 6 anos (sem orientação médica)","Uso contínuo > 5 dias","HAS grave não controlada"] },

  // 3. LOSARTANA POTÁSSICA
  { nome:"Losartana Potássica", generico:"Losartana Potássica", classe:"Anti-hipertensivo (Antagonista do Receptor AT1 da Angiotensina II - ARA II)",
    vias:[
      { id:"oral", via:"Oral", dose:"50 mg", intervalo:"1x/dia", max:"100 mg/dia", obs:"Pode ser associada à Hidroclorotiazida." },
    ],
    colaterais:["Tontura / Hipotensão postural","Hipercalemia","Tosse (menos frequente que IECA)"],
    ci:["Gestação (2º e 3º trimestres - risco fetal)","Uso concomitante com Alisquireno em diabéticos","Histórico de angioedema com ARA II","Estenose bilateral de artéria renal"] },

  // 4. MAXALGINA (Associação)
  { nome:"Maxalgina", generico:"Dipirona + Cafeína + Isometepteno", classe:"Analgésico / Antiespasmódico / Vasoconstritor (Associação para Cefaleia)",
    vias:[
      { id:"oral", via:"Oral", dose:"1-2 comprimidos", intervalo:"6/6 h (ou na crise)", max:"6 comp/dia", obs:"Uso apenas em crises agudas de cefaleia tensional ou enxaqueca." },
    ],
    colaterais:["Sonolência / Tontura","Taquicardia","Náusea / Desconforto gástrico"],
    ci:["Hipertensão Arterial Grave","Glaucoma","Hipertireoidismo","Uso de Inibidores da MAO"] },

  // 5. PURAN T4 (Levotiroxina Sódica)
  { nome:"Puran T4", generico:"Levotiroxina Sódica", classe:"Hormônio Tireoidiano Sintético",
    vias:[
      { id:"oral", via:"Oral", dose:"25-200 mcg (individualizado)", intervalo:"1x/dia (em jejum)", max:"Conforme TSH", obs:"Tomar 30-60 min antes do café. Interação com Cálcio e Ferro." },
    ],
    colaterais:["Palpitações / Taquicardia (se superdosagem)","Intolerância ao calor","Insônia"],
    ci:["IAM recente","Insuficiência adrenal não tratada","Tireotoxicose não controlada"] },

  // 6. TORSILAX (Associação)
  { nome:"Torsilax", generico:"Carisoprodol + Diclofenaco + Paracetamol + Cafeína", classe:"Miorrelaxante + AINE + Analgésico",
    vias:[
      { id:"oral", via:"Oral", dose:"1 comprimido", intervalo:"8/8 h ou 12/12 h", max:"3 comp/dia", obs:"Uso de curta duração (3-5 dias) para dor musculoesquelética aguda." },
    ],
    colaterais:["Sonolência intensa (Carisoprodol)","Irritação gástrica (Diclofenaco)","Tontura"],
    ci:["Gravidez e lactação","Úlcera péptica ativa","Insuficiência renal ou hepática grave","Uso de depressores do SNC (álcool)"] },

  // 7. CIMEGRIPE (Associação Antigripal)
  { nome:"Cimegripe", generico:"Paracetamol + Clorfeniramina + Fenilefrina", classe:"Antigripal (Analgésico + Anti-histamínico + Descongestionante)",
    vias:[
      { id:"oral", via:"Oral", dose:"1-2 cápsulas", intervalo:"6/6 h", max:"8 cáps/dia", obs:"Evitar em idosos devido à Clorfeniramina (risco de sedação e retenção urinária)." },
    ],
    colaterais:["Sonolência (Clorfeniramina)","Boca seca","Aumento da Pressão Arterial (Fenilefrina)"],
    ci:["Hipertensão Grave","Hipertrofia Prostática Benigna com retenção urinária","Glaucoma de ângulo fechado"] },

  // 8. CITRATO DE SILDENAFILA
  { nome:"Citrato de Sildenafila", generico:"Sildenafila", classe:"Inibidor da Fosfodiesterase 5 (PDE5) - Vasodilatador",
    vias:[
      { id:"oral", via:"Oral", dose:"50 mg", intervalo:"30-60 min antes da relação", max:"100 mg/dia", obs:"Eficácia depende de estímulo sexual. Evitar refeições gordurosas." },
    ],
    colaterais:["Cefaleia","Rubor facial","Congestão nasal / Distúrbios visuais (cianopsia)"],
    ci:["Uso concomitante de Nitratos (ex: Isordil) - Risco de Hipotensão Grave","Retinose pigmentar","Insuficiência Hepática Grave"] },

  // 9. DIPIRONA SÓDICA (Metamizol)
  { nome:"Dipirona Sódica", generico:"Metamizol Sódico", classe:"Analgésico / Antipirético (Derivado Pirazolônico)",
    vias:[
      { id:"oral", via:"Oral", dose:"500 mg - 1 g", intervalo:"6/6 h", max:"4 g/dia", obs:"" },
      { id:"ev", via:"EV lenta", dose:"1 g", intervalo:"6/6 h", max:"4 g/dia", obs:"Diluir em 10 mL SF. Infundir em ≥5 min. RISCO DE HIPOTENSÃO EM BOLUS." },
      { id:"im", via:"IM", dose:"1 g", intervalo:"6/6 h", max:"4 g/dia", obs:"Aplicação profunda." }
    ],
    colaterais:["Hipotensão (especialmente EV rápida)","Agranulocitose (idiossincrasia, rara mas grave)","Reação anafilática"],
    ci:["Hipersensibilidade a pirazolonas","Porfiria aguda intermitente","Deficiência de G6PD","1º trimestre e últimas 6 semanas de gestação","Discrasias sanguíneas"] },

  // 10. SORIMAX (Solução Fisiológica)
  { nome:"Sorimax", generico:"Cloreto de Sódio 0,9%", classe:"Solução Fisiológica (Eletrólito/Veículo)",
    vias:[
      { id:"nasal", via:"Tópica Nasal", dose:"Jato contínuo ou gotas", intervalo:"Livre (S/N)", max:"Livre", obs:"Fluidificação de secreções e higiene nasal." }
    ],
    colaterais:["Nenhum (se estéril e uso tópico)","Irritação local se uso excessivo"],
    ci:["Hipersensibilidade ao componente (raríssimo)","Uso EV exclusivo para diluição ou reposição volêmica"] },

  // 11. ARADOIS (Losartana)
  { nome:"Aradois", generico:"Losartana Potássica", classe:"Anti-hipertensivo (ARA II)",
    vias:[ { id:"oral", via:"Oral", dose:"50 mg", intervalo:"1x/dia", max:"100 mg/dia", obs:"Similar ao item 3." } ],
    colaterais:["Tontura","Hipercalemia","Fadiga"],
    ci:["Gestação","Estenose bilateral de artéria renal","Hipercalemia refratária"] },

  // 12. DORFLEX (Associação)
  { nome:"Dorflex", generico:"Dipirona + Orfenadrina + Cafeína", classe:"Analgésico / Miorrelaxante Central / Estimulante",
    vias:[
      { id:"oral", via:"Oral", dose:"1-2 comprimidos", intervalo:"6/6 h ou 8/8 h", max:"6 comp/dia", obs:"Evitar à noite devido à Cafeína." }
    ],
    colaterais:["Boca seca (Orfenadrina - efeito anticolinérgico)","Sonolência / Tontura","Taquicardia / Insônia (Cafeína)"],
    ci:["Glaucoma","Hipertrofia prostática com retenção urinária","Miastenia Gravis","Uso de álcool"] },

  // 13. METFORMINA (Liberação Imediata)
  { nome:"Metformina", generico:"Cloridrato de Metformina", classe:"Antidiabético Oral (Biguanida)",
    vias:[
      { id:"oral", via:"Oral", dose:"500 mg - 850 mg", intervalo:"2-3x/dia (após refeições)", max:"2.550 mg/dia", obs:"Iniciar com 500 mg à noite para minimizar efeitos GI." }
    ],
    colaterais:["Diarreia / Flatulência","Náusea","Gosto metálico"],
    ci:["TFG < 30 mL/min","Acidose Lática prévia","Hepatopatia grave descompensada"] },

  // 14. CICLO 21 (Anticoncepcional Oral Combinado)
  { nome:"Ciclo 21", generico:"Levonorgestrel + Etinilestradiol", classe:"Contraceptivo Hormonal Oral (Progestágeno + Estrogênio)",
    vias:[
      { id:"oral", via:"Oral", dose:"1 comprimido/dia", intervalo:"21 dias + pausa 7 dias", max:"1 comp/dia", obs:"Rigorosamente no mesmo horário." }
    ],
    colaterais:["Cefaleia / Enxaqueca","Mastalgia","Náusea"],
    ci:["Tabagismo > 35 anos (>15 cigarros/dia)","Histórico de Trombose Venosa Profunda (TVP) ou Embolia Pulmonar","Enxaqueca com aura","Hepatopatia aguda"] },

  // 15. LORATAMED (Loratadina)
  { nome:"Loratamed", generico:"Loratadina", classe:"Anti-histamínico H1 de 2ª Geração (Não sedante)",
    vias:[
      { id:"oral", via:"Oral", dose:"10 mg", intervalo:"1x/dia", max:"10 mg/dia", obs:"Pode ser usado com segurança em condutores de veículos." }
    ],
    colaterais:["Sonolência (mínima em relação a 1ª geração)","Cefaleia","Boca seca"],
    ci:["Hipersensibilidade à Loratadina","Insuficiência Hepática Grave (ajustar dose)"] },

  // 16. HISTAMIN (Dexclorfeniramina)
  { nome:"Histamin", generico:"Maleato de Dexclorfeniramina", classe:"Anti-histamínico H1 de 1ª Geração (Sedante)",
    vias:[
      { id:"oral", via:"Oral", dose:"2 mg", intervalo:"8/8 h ou 12/12 h", max:"12 mg/dia", obs:"Alta sedação. Evitar operar máquinas." }
    ],
    colaterais:["Sonolência intensa","Ressecamento de mucosas","Retenção urinária"],
    ci:["Glaucoma de ângulo fechado","Hiperplasia prostática obstrutiva","Crianças < 2 anos (exceto orientação médica específica)"] },

  // 17. LEVOTIROXINA (Genérico)
  { nome:"Levotiroxina", generico:"Levotiroxina Sódica", classe:"Hormônio Tireoidiano",
    vias:[ { id:"oral", via:"Oral", dose:"Conforme TSH", intervalo:"1x/dia em jejum", max:"Individualizado", obs:"Similar ao Puran T4." } ],
    colaterais:["Taquicardia","Intolerância ao calor","Osteoporose (uso crônico suprafisiológico)"],
    ci:["Tireotoxicose não tratada","IAM recente"] },

  // 18. EXPEC (Acetilcisteína)
  { nome:"Expec", generico:"Acetilcisteína", classe:"Mucolítico / Expectorante",
    vias:[
      { id:"oral", via:"Oral (Xarope/Granulado)", dose:"600 mg", intervalo:"1x/dia", max:"600 mg/dia", obs:"Para adultos. Diluir em água." }
    ],
    colaterais:["Náusea / Vômito","Rinorreia (coriza)","Broncoespasmo (raro em asmáticos)"],
    ci:["Úlcera gastroduodenal ativa","Hipersensibilidade ao componente"] },

  // 19. ATENOLOL
  { nome:"Atenolol", generico:"Atenolol", classe:"Anti-hipertensivo (Betabloqueador Cardiosseletivo)",
    vias:[
      { id:"oral", via:"Oral", dose:"25-100 mg", intervalo:"1x/dia", max:"100 mg/dia", obs:"Ajustar em Insuficiência Renal." }
    ],
    colaterais:["Bradicardia","Fadiga / Extremidades frias","Disfunção erétil"],
    ci:["Asma Brônquica grave (relativa)","Bloqueio AV de 2º ou 3º grau","Bradicardia sintomática","ICC descompensada"] },

  // 20. HIDROCLOROTIAZIDA
    { nome:"Hidroclorotiazida", generico:"Hidroclorotiazida", classe:"Diurético Tiazídico / Anti-hipertensivo",
      vias:[
        { id:"oral", via:"Oral", dose:"12,5 - 25 mg", intervalo:"1x/dia (manhã)", max:"50 mg/dia", obs:"Evitar à noite devido à noctúria." }
      ],
      colaterais:["Hipocalemia","Hiperuricemia (gota)","Hiperglicemia (resistência insulínica)"],
      ci:["Anúria","Insuficiência Renal Grave (TFG < 30)","Hipocalemia / Hiponatremia refratária"] },
    
    // 21. DECONGEX PLUS
    { nome:"Decongex Plus", generico:"Paracetamol + Maleato de Dexclorfeniramina + Cloridrato de Fenilefrina", classe:"Antigripal (Analgésico + Anti-histamínico Sedante + Descongestionante)",
    vias:[
      { id:"oral", via:"Oral (cápsulas)", dose:"1 cápsula", intervalo:"6/6 h ou 8/8 h", max:"4 cápsulas/dia", obs:"Efeito sedativo intenso. Evitar dirigir." }
    ],
    colaterais:["Sonolência severa","Boca seca","Aumento da pressão arterial"],
    ci:["Hipertensão arterial grave","Glaucoma de ângulo fechado","Hiperplasia prostática benigna com retenção urinária","Uso de inibidores da MAO"] },

  // 22. NOVALGINA
  { nome:"Novalgina", generico:"Dipirona Sódica (Metamizol)", classe:"Analgésico / Antipirético",
    vias:[
      { id:"oral", via:"Oral (comprimidos/gotas)", dose:"500 mg - 1 g (20-40 gotas)", intervalo:"6/6 h", max:"4 g/dia", obs:"1 gota ≈ 25 mg." },
      { id:"ev", via:"Endovenosa", dose:"1 g", intervalo:"6/6 h", max:"4 g/dia", obs:"Diluir em SF, infundir lentamente (≥5 min). Risco de hipotensão." }
    ],
    colaterais:["Hipotensão (se EV rápida)","Agranulocitose (rara)","Reações de hipersensibilidade"],
    ci:["Hipersensibilidade a pirazolonas","Disfunção da medula óssea","Porfiria hepática","Deficiência de G6PD"] },

  // 23. IBUPRIL (Ibuprofeno)
  { nome:"Ibupril", generico:"Ibuprofeno", classe:"Anti-inflamatório Não Esteroidal (AINE - Derivado do Ácido Propiônico)",
    vias:[
      { id:"oral", via:"Oral", dose:"400-600 mg", intervalo:"6/6 h ou 8/8 h", max:"3.200 mg/dia (dose anti-inflamatória) ou 1.200 mg/dia (analgesia)", obs:"Tomar com alimentos para proteger mucosa gástrica." }
    ],
    colaterais:["Dispepsia / Azia","Náusea","Tontura"],
    ci:["Úlcera péptica ativa ou sangramento gastrointestinal","Insuficiência renal grave (TFG < 30)","Insuficiência cardíaca grave","Terceiro trimestre de gestação"] },

  // 24. VICK-VAPORUB (Pomada)
  { nome:"Vick-Vaporub", generico:"Cânfora + Eucaliptol + Mentol + Terebintina", classe:"Descongestionante Tópico / Balsâmico",
    vias:[
      { id:"topica", via:"Tópica (pele íntegra)", dose:"Camada fina", intervalo:"Até 3x/dia", max:"3 aplicações/dia", obs:"Aplicar no peito, costas ou garganta. NÃO aplicar no nariz ou ingerir." }
    ],
    colaterais:["Irritação cutânea local","Eritema","Broncoespasmo (se inalado indevidamente por asmáticos)"],
    ci:["Crianças menores de 2 anos","Pele lesionada ou queimada","Hipersensibilidade a componentes da fórmula"] },

  // 25. BUSCOPAN COMPOSTO
  { nome:"Buscopan Composto", generico:"Butilbrometo de Escopolamina + Dipirona Sódica", classe:"Antiespasmódico Anticolinérgico + Analgésico",
    vias:[
      { id:"oral", via:"Oral", dose:"1-2 comprimidos", intervalo:"6/6 h ou 8/8 h", max:"6 comprimidos/dia", obs:"Indicado para cólicas abdominais e dismenorreia." },
      { id:"ev", via:"Endovenosa/IM", dose:"1 ampola (20 mg/2,5 g)", intervalo:"6/6 h", max:"4 ampolas/dia", obs:"EV: diluir e aplicar lentamente." }
    ],
    colaterais:["Boca seca","Visão turva (midríase)","Taquicardia"],
    ci:["Glaucoma de ângulo fechado","Hipertrofia prostática obstrutiva","Megacólon","Miastenia Gravis","Alergia à Dipirona"] },

  // 26. DIPIMED (Dipirona Gotas)
  { nome:"Dipimed", generico:"Dipirona Sódica", classe:"Analgésico / Antipirético",
    vias:[
      { id:"oral", via:"Oral (Gotas)", dose:"20-40 gotas (500 mg - 1 g)", intervalo:"6/6 h", max:"4 g/dia", obs:"Apresentação em frasco gotas. 1 gota = 25 mg." }
    ],
    colaterais:["Hipotensão (se dose alta EV)","Agranulocitose (rara)","Reação anafilática"],
    ci:["Discrasias sanguíneas","Porfiria","Deficiência de G6PD","Alergia a pirazolonas"] },

  // 27. NIMESULIDA
  { nome:"Nimesulida", generico:"Nimesulida", classe:"Anti-inflamatório Não Esteroidal (AINE - Inibidor Preferencial COX-2)",
    vias:[
      { id:"oral", via:"Oral", dose:"100 mg", intervalo:"12/12 h", max:"200 mg/dia", obs:"Uso máximo de 5-7 dias para dor aguda devido ao risco hepático." }
    ],
    colaterais:["Elevação de transaminases (hepatotoxicidade)","Náusea / Diarreia","Cefaleia"],
    ci:["Hepatopatia ativa ou insuficiência hepática","Úlcera péptica ativa","Insuficiência renal grave","Crianças < 12 anos","Uso concomitante com outros hepatotóxicos"] },

  // 28. SCAFLOGIN (Nimesulida + Ciclobenzaprina)
  { nome:"Scaflogin", generico:"Nimesulida + Cloridrato de Ciclobenzaprina", classe:"AINE + Miorrelaxante de Ação Central",
    vias:[
      { id:"oral", via:"Oral", dose:"1 comprimido", intervalo:"12/12 h", max:"2 comprimidos/dia", obs:"Uso de curta duração (até 5 dias). Sedação importante." }
    ],
    colaterais:["Sonolência intensa (Ciclobenzaprina)","Boca seca","Elevação de enzimas hepáticas (Nimesulida)"],
    ci:["Insuficiência hepática","Glaucoma","Retenção urinária","Arritmias cardíacas (prolongamento QT)","Uso de IMAO"] },

  // 29. FLUCONAZOL
  { nome:"Fluconazol", generico:"Fluconazol", classe:"Antifúngico Azólico Sistêmico",
    vias:[
      { id:"oral", via:"Oral", dose:"150 mg (dose única para candidíase vaginal)", intervalo:"Dose única ou 1x/semana", max:"Conforme indicação (onicomicose: 150 mg/semana)", obs:"Tratamento de candidíase vulvovaginal: dose única." },
      { id:"ev", via:"Endovenosa", dose:"200-400 mg/dia", intervalo:"1x/dia", max:"800 mg/dia", obs:"Para infecções sistêmicas graves." }
    ],
    colaterais:["Náusea / Dor abdominal","Cefaleia","Elevação de transaminases"],
    ci:["Uso concomitante de medicamentos que prolongam QT (ex: Astemizol, Cisaprida)","Hipersensibilidade a azólicos","Gestação (dose única tópica geralmente evitada no 1º trimestre por precaução)"] },

  // 30. PANTOPRAZOL
  { nome:"Pantoprazol", generico:"Pantoprazol Sódico Sesqui-hidratado", classe:"Inibidor da Bomba de Prótons (IBP)",
    vias:[
      { id:"oral", via:"Oral", dose:"20-40 mg", intervalo:"1x/dia (em jejum, 30 min antes do café)", max:"40 mg/dia (DRGE)", obs:"Para úlcera gástrica ou esofagite erosiva." },
      { id:"ev", via:"Endovenosa", dose:"40 mg", intervalo:"1x/dia", max:"40 mg/dia", obs:"Reconstituir em SF. Infundir em 2-15 min." }
    ],
    colaterais:["Cefaleia","Diarreia","Deficiência de Vitamina B12/Magnésio (uso crônico)"],
    ci:["Hipersensibilidade a benzimidazóis","Uso concomitante de Atazanavir ou Nelfinavir (reduz absorção)"] },

  // 31. CORUS (Losartana + Hidroclorotiazida)
  { nome:"Corus", generico:"Losartana Potássica + Hidroclorotiazida", classe:"Anti-hipertensivo Combinado (ARA II + Diurético Tiazídico)",
    vias:[
      { id:"oral", via:"Oral", dose:"50/12,5 mg ou 100/25 mg", intervalo:"1x/dia (manhã)", max:"100/25 mg/dia", obs:"Monitorar potássio sérico e função renal." }
    ],
    colaterais:["Tontura / Hipotensão postural","Hipocalemia / Hipercalemia (variável)","Aumento do ácido úrico"],
    ci:["Anúria","Insuficiência renal grave (TFG < 30)","Hipocalemia / Hipercalemia refratária","Gestação"] },

  // 32. DORALGINA (Dipirona + Cafeína + Mucato de Isometepteno)
  { nome:"Doralgina", generico:"Dipirona Sódica + Cafeína + Mucato de Isometepteno", classe:"Analgésico / Antiespasmódico / Estimulante (Antienxaqueca)",
    vias:[
      { id:"oral", via:"Oral", dose:"1-2 comprimidos (na crise)", intervalo:"6/6 h", max:"6 comp/dia", obs:"Para crises de cefaleia tensional ou enxaqueca." },
      { id:"sublingual", via:"Sublingual (Gotas)", dose:"30 gotas (na crise)", intervalo:"6/6 h", max:"120 gotas/dia", obs:"Absorção mais rápida." }
    ],
    colaterais:["Taquicardia / Palpitações","Tontura","Náusea"],
    ci:["Hipertensão grave não controlada","Glaucoma","Hipertireoidismo","Alergia à Dipirona"] },

  // 33. NISTATINA + ÓXIDO DE ZINCO (Pomada)
  { nome:"Nistatina + Óxido de Zinco", generico:"Nistatina + Óxido de Zinco", classe:"Antifúngico Poliênico + Protetor Cutâneo",
    vias:[
      { id:"topica", via:"Tópica (pele)", dose:"Camada fina na área afetada", intervalo:"A cada troca de fralda ou 2-3x/dia", max:"4 aplicações/dia", obs:"Para dermatite de fralda com candidíase (assadura fúngica)." }
    ],
    colaterais:["Irritação local leve","Alergia de contato (rara)"],
    ci:["Hipersensibilidade aos componentes da fórmula"] },

  // 34. SALONPAS (Adesivo de Mentol/Salicilato)
  { nome:"Salonpas", generico:"Salicilato de Metila + Mentol + Cânfora", classe:"Analgésico Tópico (Rubefaciente / Contrairritante)",
    vias:[
      { id:"topica", via:"Transdérmica (Adesivo)", dose:"1 adesivo", intervalo:"Trocar a cada 8-12 h", max:"2 adesivos simultâneos (áreas distintas)", obs:"Não aplicar sobre pele lesionada ou irritada." }
    ],
    colaterais:["Eritema local","Prurido","Sensação de queimação"],
    ci:["Alergia a salicilatos ou AINEs","Pele ferida ou queimada","Crianças menores de 2 anos"] },

  // 35. CETOPROFENO
  { nome:"Cetoprofeno", generico:"Cetoprofeno", classe:"Anti-inflamatório Não Esteroidal (AINE - Derivado do Ácido Propiônico)",
    vias:[
      { id:"oral", via:"Oral", dose:"50-100 mg", intervalo:"12/12 h ou 8/8 h", max:"300 mg/dia", obs:"Tomar com alimentos." },
      { id:"im", via:"Intramuscular", dose:"100 mg", intervalo:"12/12 h", max:"200 mg/dia", obs:"Uso por no máximo 2-3 dias consecutivos." }
    ],
    colaterais:["Dor epigástrica / Gastrite","Tontura","Retenção hídrica / Edema"],
    ci:["Úlcera péptica ativa","Insuficiência renal moderada a grave","Insuficiência cardíaca descompensada","Terceiro trimestre de gestação"] },

  // 36. AEROLIN (Salbutamol Spray)
  { nome:"Aerolin", generico:"Sulfato de Salbutamol", classe:"Broncodilatador (Agonista Beta-2 Adrenérgico de Curta Ação - SABA)",
    vias:[
      { id:"inalatoria", via:"Inalatória (Spray/Aerossol)", dose:"100-200 mcg (1-2 jatos)", intervalo:"4/6 h (SOS)", max:"800 mcg/dia (8 jatos)", obs:"Para crise de asma ou broncoespasmo. Agitar antes de usar." }
    ],
    colaterais:["Taquicardia","Tremor fino de extremidades","Câimbras musculares"],
    ci:["Hipersensibilidade ao salbutamol","Arritmias cardíacas graves não controladas (relativa)"] },

  // 37. CIFLOGEX (Ciprofloxacino + Dexametasona Otológico)
  { nome:"Ciflogex", generico:"Cloridrato de Ciprofloxacino + Dexametasona", classe:"Antibiótico Quinolônico + Corticosteroide (Solução Otológica)",
    vias:[
      { id:"otologica", via:"Tópica Otológica", dose:"4-6 gotas no ouvido afetado", intervalo:"8/8 h ou 12/12 h", max:"3 aplicações/dia", obs:"Para otite externa ou média com perfuração timpânica (otorreia)." }
    ],
    colaterais:["Prurido local","Ardência passageira","Gosto amargo na boca (drenagem)"],
    ci:["Hipersensibilidade a quinolonas","Infecção fúngica ou viral do conduto auditivo"] },

  // 38. CIMELIDE (Nimesulida)
  { nome:"Cimelide", generico:"Nimesulida", classe:"Anti-inflamatório Não Esteroidal (AINE - Inibidor Preferencial COX-2)",
    vias:[
      { id:"oral", via:"Oral", dose:"100 mg", intervalo:"12/12 h", max:"200 mg/dia (máx. 5-7 dias)", obs:"Risco de hepatotoxicidade. Evitar uso prolongado." }
    ],
    colaterais:["Elevação de TGO/TGP","Náusea","Sonolência"],
    ci:["Doença hepática ativa","Úlcera péptica","Insuficiência renal grave","Crianças menores de 12 anos"] },

  // 39. SINVASTATINA
  { nome:"Sinvastatina", generico:"Sinvastatina", classe:"Hipolipemiante (Inibidor da HMG-CoA Redutase - Estatina)",
    vias:[
      { id:"oral", via:"Oral", dose:"10-40 mg", intervalo:"1x/dia (à noite)", max:"80 mg/dia (risco de miopatia aumentado)", obs:"Tomar à noite para melhor eficácia na síntese de colesterol hepático." }
    ],
    colaterais:["Mialgia / Miopatia","Elevação de transaminases (TGP)","Desconforto abdominal"],
    ci:["Doença hepática ativa ou elevação persistente inexplicada de transaminases","Gestação e lactação","Uso concomitante de inibidores potentes do CYP3A4 (ex: Itraconazol, Claritromicina)"] },

  // 40. NARIDRIN (Pseudoefedrina + Paracetamol)
  { nome:"Naridrin", generico:"Cloridrato de Pseudoefedrina + Paracetamol", classe:"Descongestionante Sistêmico + Analgésico/Antipirético",
    vias:[
      { id:"oral", via:"Oral", dose:"1 comprimido", intervalo:"6/6 h ou 8/8 h", max:"4 comprimidos/dia", obs:"Descongestionante para gripes e resfriados. Risco de insônia e aumento da PA." }
    ],
    colaterais:["Taquicardia / Hipertensão","Insônia","Boca seca"],
    ci:["Hipertensão arterial grave não controlada","Doença coronariana grave","Glaucoma de ângulo fechado","Uso de IMAO"] },

  // 41. SORO FISIOLÓGICO 0,9%
  { nome:"Soro Fisiológico", generico:"Cloreto de Sódio 0,9%", classe:"Solução Isotônica Estéril",
    vias:[
      { id:"nasal", via:"Tópica Nasal / Inalatória", dose:"2-5 mL por narina ou 3-5 mL para nebulização", intervalo:"S/N (conforme necessidade)", max:"Livre", obs:"Para lavagem nasal e fluidificação de secreções." },
      { id:"ev", via:"Endovenosa", dose:"Variável (reposição volêmica)", intervalo:"Contínuo ou intermitente", max:"Conforme balanço hídrico", obs:"Uso exclusivo hospitalar ou ambulatorial com prescrição médica." }
    ],
    colaterais:["Nenhum (uso tópico estéril)","Hipernatremia / Edema pulmonar (se excesso EV)"],
    ci:["Hipernatremia grave (para uso EV)","Insuficiência cardíaca congestiva descompensada (sobrecarga volêmica)"] },

  // 42. NEOLEFRIN (Fenilefrina Nasal)
  { nome:"Neolefrin", generico:"Cloridrato de Fenilefrina", classe:"Descongestionante Nasal Tópico (Agonista Alfa-1 Adrenérgico)",
    vias:[
      { id:"nasal", via:"Tópica Nasal (Gotas)", dose:"1-2 gotas em cada narina", intervalo:"6/6 h ou 8/8 h", max:"Uso máximo por 3-5 dias", obs:"Risco de rinite medicamentosa e congestão rebote." }
    ],
    colaterais:["Ardência nasal transitória","Congestão rebote (uso prolongado)","Taquicardia reflexa (rara)"],
    ci:["Glaucoma de ângulo fechado","Hipertensão arterial grave não controlada","Uso de inibidores da MAO","Rinite seca"] },

  // 43. INFRALAX (Associação Antigripal)
  { nome:"Infralax", generico:"Paracetamol + Cloridrato de Fenilefrina + Maleato de Carbinoxamina", classe:"Antigripal (Analgésico + Descongestionante + Anti-histamínico Sedante)",
    vias:[
      { id:"oral", via:"Oral (Cápsulas)", dose:"1 cápsula", intervalo:"6/6 h ou 8/8 h", max:"4 cápsulas/dia", obs:"Alto potencial sedativo (Carbinoxamina). Evitar dirigir." }
    ],
    colaterais:["Sonolência intensa","Boca seca","Aumento da pressão arterial"],
    ci:["Hipertensão Grave","Hiperplasia prostática obstrutiva","Glaucoma de ângulo fechado","Crianças menores de 12 anos"] },

  // 44. DIAD (Diosmina + Hesperidina)
  { nome:"Diad", generico:"Diosmina + Hesperidina (Fração Flavonoica Purificada)", classe:"Flebotônico / Venotrópico (Protetor Vascular)",
    vias:[
      { id:"oral", via:"Oral", dose:"450/50 mg ou 900/100 mg", intervalo:"1-2x/dia", max:"1350/150 mg/dia", obs:"Para insuficiência venosa crônica e crise hemorroidária aguda." }
    ],
    colaterais:["Distúrbios gastrointestinais leves (náusea, diarreia)","Cefaleia","Tontura"],
    ci:["Hipersensibilidade aos flavonoides"] },

  // 45. RESFENOL (Associação Antigripal)
  { nome:"Resfenol", generico:"Paracetamol + Cloridrato de Pseudoefedrina + Maleato de Clorfeniramina", classe:"Antigripal (Analgésico + Descongestionante Sistêmico + Anti-histamínico Clássico)",
    vias:[
      { id:"oral", via:"Oral", dose:"1-2 cápsulas", intervalo:"6/6 h ou 8/8 h", max:"8 cápsulas/dia (Adulto)", obs:"Combinação clássica para sintomas gripais. Sedação presente." }
    ],
    colaterais:["Sonolência (Clorfeniramina)","Boca seca","Taquicardia / Insônia (Pseudoefedrina)"],
    ci:["Hipertensão Grave","Doença Arterial Coronariana","Glaucoma","Hipertrofia Prostática","Uso de IMAO"] },

  // 46. STREPSILS (Pastilhas Antissépticas)
  { nome:"Strepsils", generico:"Amilmetacresol + Álcool 2,4-Diclorobenzílico", classe:"Antisséptico Bucofaríngeo Tópico",
    vias:[
      { id:"oral_topica", via:"Orofaringe (Pastilha)", dose:"1 pastilha", intervalo:"A cada 2-3 horas (dissolver lentamente na boca)", max:"8-12 pastilhas/dia", obs:"Alívio sintomático de dor de garganta e irritação." }
    ],
    colaterais:["Irritação leve na língua ou mucosa oral","Náusea (se ingerida em excesso)"],
    ci:["Crianças menores de 6 anos (risco de engasgo)","Hipersensibilidade aos componentes"] },

  // 47. SIMETICONA (Gotas/Comprimidos)
  { nome:"Simeticona", generico:"Simeticona (Dimeticona Ativada)", classe:"Antiflatulento / Antiespumante Gastrointestinal",
    vias:[
      { id:"oral", via:"Oral (Gotas/Comprimidos)", dose:"75-125 mg (Adulto)", intervalo:"Após as refeições e ao deitar", max:"500 mg/dia", obs:"Atua reduzindo a tensão superficial das bolhas de gás, facilitando sua eliminação." }
    ],
    colaterais:["Nenhum clinicamente significativo (não é absorvida sistemicamente)","Eructação leve"],
    ci:["Hipersensibilidade ao componente","Suspeita de obstrução intestinal"] },

  // 48. CEFALEXINA
  { nome:"Cefalexina", generico:"Cefalexina Monoidratada", classe:"Antibiótico Cefalosporina de 1ª Geração",
    vias:[
      { id:"oral", via:"Oral", dose:"500 mg", intervalo:"6/6 h ou 8/8 h", max:"4 g/dia", obs:"Para infecções de pele, partes moles e ITU não complicada. Ajustar na IR." }
    ],
    colaterais:["Diarreia / Disbiose intestinal","Náusea / Desconforto abdominal","Candidíase vaginal/oral (superinfecção)"],
    ci:["Hipersensibilidade a cefalosporinas","Histórico de reação anafilática a penicilinas (alergia cruzada em 5-10%)"] },

  // 49. MOURA BRASIL (Colírio Água Boricada)
  { nome:"Colírio Moura Brasil", generico:"Ácido Bórico + Sulfato de Zinco", classe:"Antisséptico Oftálmico / Adstringente Leve",
    vias:[
      { id:"oftalmica", via:"Tópica Oftálmica", dose:"2 gotas em cada olho", intervalo:"2-3x/dia", max:"4x/dia", obs:"Alívio de irritação ocular leve. NÃO usar com lentes de contato." }
    ],
    colaterais:["Ardência / Irritação passageira","Visão turva momentânea"],
    ci:["Lesão ou úlcera de córnea","Infecção ocular purulenta","Glaucoma"] },

  // 50. SAL DE FRUTA ENO
  { nome:"Sal de Fruta Eno", generico:"Bicarbonato de Sódio + Carbonato de Sódio + Ácido Cítrico", classe:"Antiácido Efervescente",
    vias:[
      { id:"oral", via:"Oral (Efervescência em água)", dose:"1 envelope (5g)", intervalo:"Conforme necessidade (após refeições)", max:"3 envelopes/dia", obs:"Efeito rápido para azia e má digestão." }
    ],
    colaterais:["Eructação (liberação de CO2)","Distensão abdominal","Alcalose metabólica / Sobrecarga de sódio (uso crônico em excesso)"],
    ci:["Hipertensão grave (pelo alto teor de sódio)","Insuficiência cardíaca","Insuficiência renal (risco de alcalose)","Crianças < 12 anos"] },

  // 51. DRAMIN B6 (Dimenidrinato + Piridoxina)
  { nome:"Dramin B6", generico:"Dimenidrinato + Cloridrato de Piridoxina (Vitamina B6)", classe:"Antiemético / Antivertiginoso (Anti-histamínico H1 + Vitamina)",
    vias:[
      { id:"oral", via:"Oral", dose:"1 comprimido (50 mg Dimenidrinato / 10 mg B6)", intervalo:"A cada 4-6 h (preferencialmente 30 min antes da viagem)", max:"4 comprimidos/dia", obs:"Indicado para cinetose (enjoo de movimento) e náuseas gestacionais." }
    ],
    colaterais:["Sonolência intensa (efeito anticolinérgico central)","Boca seca","Visão turva"],
    ci:["Glaucoma de ângulo fechado","Hiperplasia prostática obstrutiva","Crise asmática aguda","Uso concomitante de álcool ou sedativos"] },

  // 52. ENALAPRIL
  { nome:"Enalapril", generico:"Maleato de Enalapril", classe:"Anti-hipertensivo (Inibidor da Enzima Conversora de Angiotensina - IECA)",
    vias:[
      { id:"oral", via:"Oral", dose:"5-20 mg", intervalo:"1-2x/dia", max:"40 mg/dia", obs:"Iniciar com doses baixas. Monitorar potássio e creatinina." }
    ],
    colaterais:["Tosse seca persistente (efeito de classe)","Hipotensão postural (primeira dose)","Hipercalemia"],
    ci:["Gestação (2º e 3º trimestres)","Histórico de angioedema com IECA","Estenose bilateral de artéria renal","Uso concomitante de Alisquireno em diabéticos"] },

  // 53. RIVOTRIL (Clonazepam)
  { nome:"Rivotril", generico:"Clonazepam", classe:"Ansiolítico / Anticonvulsivante (Benzodiazepínico)",
    vias:[
      { id:"oral", via:"Oral (Comprimido ou Gotas)", dose:"0,25 - 2 mg", intervalo:"12/12 h ou 1x/dia (à noite)", max:"20 mg/dia (em epilepsia)", obs:"Gotas: 1 gota = 0,1 mg. Uso prolongado causa dependência e tolerância." },
      { id:"sublingual", via:"Sublingual (Gotas)", dose:"0,25 - 0,5 mg (SOS)", intervalo:"Crise de ansiedade", max:"Conforme orientação", obs:"Absorção rápida para crise." }
    ],
    colaterais:["Sonolência diurna / Sedação","Comprometimento da memória / Cognição","Dependência química / Síndrome de abstinência"],
    ci:["Miastenia Gravis","Insuficiência respiratória grave","Apneia do sono não tratada","Glaucoma de ângulo fechado","Gestação e lactação"] },

  // 54. AMOXICILINA
  { nome:"Amoxicilina", generico:"Amoxicilina Tri-hidratada", classe:"Antibiótico Penicilina Semissintética (Aminopenicilina)",
    vias:[
      { id:"oral", via:"Oral (Cápsulas ou Suspensão)", dose:"500 mg - 875 mg", intervalo:"8/8 h ou 12/12 h", max:"3 g/dia", obs:"Espectro para estreptococos, enterococos e H. pylori. Não cobre S. aureus produtor de penicilinase." }
    ],
    colaterais:["Diarreia (frequente)","Rash cutâneo não alérgico (especialmente em mononucleose)","Candidíase oral/vaginal"],
    ci:["Hipersensibilidade a penicilinas","Histórico de reação anafilática grave a betalactâmicos"] },

  // 55. AZITROMICINA
  { nome:"Azitromicina", generico:"Azitromicina Di-hidratada", classe:"Antibiótico Macrolídeo (Azalídeo)",
    vias:[
      { id:"oral", via:"Oral", dose:"500 mg", intervalo:"1x/dia", max:"1.500 mg (dose única) ou 500 mg/dia por 3-5 dias", obs:"Meia-vida longa (68h). Administrar 1h antes ou 2h após refeições para melhor absorção." }
    ],
    colaterais:["Diarreia / Dor abdominal","Náusea","Prolongamento do intervalo QT (risco de arritmia)"],
    ci:["Hipersensibilidade a macrolídeos","Insuficiência hepática grave","Uso concomitante de medicamentos que prolongam QT"] },

  // 56. ESCITALOPRAM
  { nome:"Escitalopram", generico:"Oxalato de Escitalopram", classe:"Antidepressivo (Inibidor Seletivo da Recaptação de Serotonina - ISRS)",
    vias:[
      { id:"oral", via:"Oral", dose:"10-20 mg", intervalo:"1x/dia (manhã ou noite)", max:"20 mg/dia (idosos: máx 10 mg/dia)", obs:"Efeito terapêutico pode levar 2-4 semanas. Não interromper abruptamente." }
    ],
    colaterais:["Náusea (transitória nas primeiras semanas)","Insônia ou sonolência","Disfunção sexual (retardo ejaculatório, anorgasmia)"],
    ci:["Uso concomitante de IMAO (Inibidores da Monoamina Oxidase)","Síndrome do QT longo congênito"] },

  // 57. ALPRAZOLAM
  { nome:"Alprazolam", generico:"Alprazolam", classe:"Ansiolítico (Benzodiazepínico de Curta Ação)",
    vias:[
      { id:"oral", via:"Oral", dose:"0,25 - 0,5 mg", intervalo:"8/8 h ou SOS (ansiedade) / 1x à noite (insônia)", max:"4 mg/dia", obs:"Alto potencial de dependência e tolerância. Retirada gradual obrigatória." }
    ],
    colaterais:["Sedação / Sonolência diurna","Amnésia anterógrada","Dependência e síndrome de abstinência grave (convulsões)"],
    ci:["Miastenia Gravis","Insuficiência respiratória grave","Glaucoma de ângulo fechado","Intoxicação alcoólica aguda"] },

  // 58. SERTRALINA
  { nome:"Sertralina", generico:"Cloridrato de Sertralina", classe:"Antidepressivo (Inibidor Seletivo da Recaptação de Serotonina - ISRS)",
    vias:[
      { id:"oral", via:"Oral", dose:"50-200 mg", intervalo:"1x/dia (manhã)", max:"200 mg/dia", obs:"Primeira linha para depressão, TOC e transtorno de pânico." }
    ],
    colaterais:["Diarreia / Fezes moles","Náusea","Disfunção sexual (principalmente retardo ejaculatório)"],
    ci:["Uso de IMAO (intervalo mínimo de 14 dias)","Uso de Pimozida ou Dissulfiram (para solução oral)"] },

  // 59. CIPROFLOXACINO
  { nome:"Ciprofloxacino", generico:"Cloridrato de Ciprofloxacino", classe:"Antibiótico Fluoroquinolona",
    vias:[
      { id:"oral", via:"Oral", dose:"500 mg", intervalo:"12/12 h", max:"1.500 mg/dia", obs:"Administrar longe de refeições lácteas ou antiácidos (quelante). Ajustar na IR." }
    ],
    colaterais:["Tendinite / Ruptura de tendão (risco aumentado em idosos e uso de corticoide)","Náusea / Diarreia","Neuropatia periférica"],
    ci:["Hipersensibilidade a quinolonas","Gravidez e lactação","Crianças e adolescentes (relativa, a menos que infecções graves)","Miastenia Gravis"] },

  // 60. ZOLPIDEM
  { nome:"Zolpidem", generico:"Hemitartarato de Zolpidem", classe:"Hipnótico Não Benzodiazepínico (Agonista GABA-A - 'Z-drug')",
    vias:[
      { id:"oral", via:"Oral (sublingual ou comprimido)", dose:"5-10 mg", intervalo:"1x/dia (imediatamente antes de deitar)", max:"10 mg/dia", obs:"Uso máximo recomendado de 4 semanas. Risco de comportamentos automáticos (sonambulismo)." }
    ],
    colaterais:["Sonolência residual diurna","Amnésia anterógrada","Parassonias (comer ou dirigir dormindo)"],
    ci:["Apneia do sono grave","Miastenia Gravis","Insuficiência respiratória grave","Crianças e adolescentes"] },

    // 61. CLONAZEPAM (Genérico)
  { nome:"Clonazepam", generico:"Clonazepam", classe:"Ansiolítico / Anticonvulsivante (Benzodiazepínico)",
    vias:[
      { id:"oral", via:"Oral (Comprimido ou Gotas)", dose:"0,5 - 2 mg", intervalo:"12/12 h ou 1x/dia (noite)", max:"20 mg/dia (epilepsia)", obs:"1 gota = 0,1 mg. Risco elevado de dependência e tolerância." }
    ],
    colaterais:["Sedação / Sonolência diurna","Comprometimento cognitivo / Amnésia","Dependência química / Síndrome de abstinência"],
    ci:["Miastenia Gravis","Insuficiência respiratória grave","Apneia do sono não tratada","Glaucoma de ângulo fechado","Gestação e lactação"] },

  // 62. CLAVULIN BD (Amoxicilina + Clavulanato)
  { nome:"Clavulin BD", generico:"Amoxicilina + Clavulanato de Potássio", classe:"Antibiótico Penicilina + Inibidor de Betalactamase",
    vias:[
      { id:"oral", via:"Oral (Comprimidos 875/125 mg ou Suspensão)", dose:"875/125 mg", intervalo:"12/12 h", max:"1.750/250 mg/dia", obs:"Tomar no início das refeições para minimizar desconforto GI e otimizar absorção." }
    ],
    colaterais:["Diarreia (muito comum)","Náusea / Vômito","Candidíase mucocutânea"],
    ci:["Hipersensibilidade a penicilinas ou cefalosporinas","Histórico de disfunção hepática/icterícia associada a amoxicilina/clavulanato","Mononucleose infecciosa (rash cutâneo severo)"] },

  // 63. QUETIAPINA
  { nome:"Quetiapina", generico:"Hemifumarato de Quetiapina", classe:"Antipsicótico Atípico / Estabilizador de Humor",
    vias:[
      { id:"oral", via:"Oral (Comprimidos)", dose:"25-300 mg (depende da indicação: insônia vs. psicose)", intervalo:"1x/dia (noite para sedação) ou 2x/dia", max:"800 mg/dia", obs:"Baixas doses (25-100 mg) são usadas off-label para insônia. Monitorar glicemia e perfil lipídico." }
    ],
    colaterais:["Sonolência intensa / Sedação","Ganho de peso significativo","Boca seca / Tontura postural (hipotensão)"],
    ci:["Uso concomitante de inibidores potentes do CYP3A4 (ex: Cetoconazol)","Demência em idosos (risco de AVC e morte)"] },

  // 64. AMOXICILINA + CLAVULANATO (Genérico)
  { nome:"Amoxicilina + Clavulanato", generico:"Amoxicilina + Clavulanato de Potássio", classe:"Antibiótico Penicilina + Inibidor de Betalactamase",
    vias:[
      { id:"oral", via:"Oral", dose:"500/125 mg ou 875/125 mg", intervalo:"8/8 h ou 12/12 h", max:"Conforme apresentação", obs:"Apresentação genérica. Vide informações do item 62." }
    ],
    colaterais:["Diarreia","Náusea","Rash cutâneo"],
    ci:["Alergia a penicilinas","Disfunção hepática prévia por clavulanato"] },

  // 65. PREGABALINA
  { nome:"Pregabalina", generico:"Pregabalina", classe:"Anticonvulsivante / Modulador da Dor Neuropática (Ligante da Subunidade alfa-2-delta dos Canais de Cálcio)",
    vias:[
      { id:"oral", via:"Oral", dose:"75-150 mg", intervalo:"12/12 h ou 1x/dia (depende da dose)", max:"600 mg/dia", obs:"Para dor neuropática (diabética, pós-herpética), fibromialgia e ansiedade generalizada. Ajustar na IR." }
    ],
    colaterais:["Tontura / Sonolência","Ganho de peso / Edema periférico","Visão turva"],
    ci:["Hipersensibilidade à Pregabalina","Gravidez (exceto se benefício superar risco)"] },

  // 66. TADALAFILA
  { nome:"Tadalafila", generico:"Tadalafila", classe:"Inibidor da Fosfodiesterase 5 (PDE5) - Vasodilatador de Longa Duração",
    vias:[
      { id:"oral", via:"Oral", dose:"5 mg (uso diário) ou 20 mg (sob demanda)", intervalo:"1x/dia (uso contínuo) ou 30 min antes da relação", max:"20 mg/dia (S/N) ou 5 mg/dia (contínuo)", obs:"Meia-vida longa (17,5h). Eficaz por até 36h." }
    ],
    colaterais:["Cefaleia","Rubor facial / Congestão nasal","Mialgia / Dor lombar (efeito de classe PDE5)"],
    ci:["Uso concomitante de Nitratos (ex: Isordil, Monocordil) - Hipotensão Grave","Retinose Pigmentar","Insuficiência Hepática Grave"] },

  // 67. ANLODIPINO (Besilato)
  { nome:"Anlodipino", generico:"Besilato de Anlodipino", classe:"Anti-hipertensivo / Antianginoso (Bloqueador dos Canais de Cálcio - Di-hidropiridínico)",
    vias:[
      { id:"oral", via:"Oral", dose:"2,5-10 mg", intervalo:"1x/dia", max:"10 mg/dia", obs:"Efeito máximo em 6-12h. Pode causar edema maleolar dose-dependente." }
    ],
    colaterais:["Edema periférico (tornozelos)","Rubor facial / Calor","Cefaleia"],
    ci:["Hipotensão grave","Choque cardiogênico","Estenose aórtica grave","Angina instável"] },

  // 68. OZEMPIC (Semaglutida)
  { nome:"Ozempic", generico:"Semaglutida", classe:"Antidiabético Injetável (Agonista do Receptor GLP-1)",
    vias:[
      { id:"sc", via:"Subcutânea", dose:"0,25 mg (inicial) a 1 mg (manutenção)", intervalo:"1x/semana", max:"1 mg/semana (Ozempic) ou 2,4 mg/semana (Wegovy - obesidade)", obs:"Caneta aplicadora. Aplicar em abdômen, coxa ou braço. Alto custo." }
    ],
    colaterais:["Náusea / Vômito (início do tratamento)","Diarreia / Constipação","Perda de peso"],
    ci:["História pessoal ou familiar de Carcinoma Medular de Tireoide","Síndrome de Neoplasia Endócrina Múltipla tipo 2 (MEN 2)","Pancreatite aguda prévia"] },

  // 69. FORXIGA (Dapagliflozina)
  { nome:"Forxiga", generico:"Dapagliflozina", classe:"Antidiabético Oral (Inibidor do Cotransportador Sódio-Glicose 2 - iSGLT2)",
    vias:[
      { id:"oral", via:"Oral", dose:"10 mg", intervalo:"1x/dia (manhã)", max:"10 mg/dia", obs:"Indicado para DM2, IC (com fração de ejeção reduzida) e DRC. Promove glicosúria." }
    ],
    colaterais:["Infecção do trato urinário (ITU)","Candidíase genital (por glicosúria)","Poliúria / Desidratação"],
    ci:["TFG < 25 mL/min (para início no DM2)","Gravidez e lactação","Cetoacidose diabética ativa"] },

  // 70. JARDIANCE (Empagliflozina)
  { nome:"Jardiance", generico:"Empagliflozina", classe:"Antidiabético Oral (Inibidor do Cotransportador Sódio-Glicose 2 - iSGLT2)",
    vias:[
      { id:"oral", via:"Oral", dose:"10-25 mg", intervalo:"1x/dia (manhã)", max:"25 mg/dia", obs:"Benefício comprovado em redução de mortalidade cardiovascular e hospitalização por IC." }
    ],
    colaterais:["ITU / Candidíase genital","Poliúria","Hipotensão (em idosos ou uso de diuréticos)"],
    ci:["TFG < 20 mL/min (para início)","Gravidez","Cetoacidose"] },

  // 71. XIGDUO XR (Dapagliflozina + Metformina XR)
  { nome:"Xigduo XR", generico:"Dapagliflozina + Cloridrato de Metformina (Liberação Prolongada)", classe:"Antidiabético Combinado (iSGLT2 + Biguanida)",
    vias:[
      { id:"oral", via:"Oral", dose:"5/1000 mg ou 10/1000 mg", intervalo:"1x/dia (jantar)", max:"10/2000 mg/dia", obs:"Combinação em comprimido único. Vide contraindicações individuais." }
    ],
    colaterais:["Diarreia / Náusea (Metformina)","Infecção genital (Dapagliflozina)","Cetoacidose euglicêmica (rara)"],
    ci:["TFG < 45 mL/min (Metformina XR) / TFG < 25 mL/min (Dapagliflozina)","Acidose metabólica","Contraste iodado (suspensão temporária)"] },

  // 72. DICLOFENACO (Sódico ou Potássico)
  { nome:"Diclofenaco", generico:"Diclofenaco Sódico ou Potássico", classe:"Anti-inflamatório Não Esteroidal (AINE - Derivado do Ácido Fenilacético)",
    vias:[
      { id:"oral", via:"Oral", dose:"50 mg (Sódico) ou 50 mg (Potássico - ação mais rápida)", intervalo:"8/8 h ou 12/12 h", max:"150 mg/dia", obs:"Tomar com alimentos. O potássico é preferível para analgesia aguda rápida." },
      { id:"topica", via:"Tópica (Gel/Pomada)", dose:"Camada fina", intervalo:"3-4x/dia", max:"3-4 aplicações/dia", obs:"Para dores musculoesqueléticas localizadas." }
    ],
    colaterais:["Dispepsia / Gastrite","Elevação de transaminases","Retenção hídrica"],
    ci:["Úlcera péptica ativa ou sangramento GI","Doença renal crônica avançada","Doença arterial coronariana grave (risco CV aumentado)","Terceiro trimestre de gestação"] },

  // 73. IBUPROFENO (Genérico)
  { nome:"Ibuprofeno", generico:"Ibuprofeno", classe:"Anti-inflamatório Não Esteroidal (AINE - Derivado do Ácido Propiônico)",
    vias:[
      { id:"oral", via:"Oral", dose:"400-600 mg", intervalo:"6/6 h ou 8/8 h", max:"3.200 mg/dia (adulto)", obs:"Efeito analgésico em doses baixas (200-400 mg), anti-inflamatório em doses altas (>1.200 mg/dia)." }
    ],
    colaterais:["Irritação gástrica","Tontura","Edema"],
    ci:["Úlcera péptica ativa","Insuficiência renal grave","Tendência a sangramento","Último trimestre da gestação (fechamento precoce do ducto arterioso)"] },

  // 74. PARACETAMOL (Genérico)
  { nome:"Paracetamol", generico:"Paracetamol (Acetaminofeno)", classe:"Analgésico / Antipirético (Não Opiáceo)",
    vias:[
      { id:"oral", via:"Oral", dose:"500 mg - 1 g", intervalo:"6/6 h", max:"4 g/dia (adulto saudável); 2 g/dia (hepatopatas/alcoolistas)", obs:"Analgésico de escolha para dor leve e febre em gestantes e crianças." },
      { id:"ev", via:"Endovenosa", dose:"1 g", intervalo:"6/6 h", max:"4 g/dia", obs:"Diluir em 100 mL SF/SG, infundir em 15 min." }
    ],
    colaterais:["Hepatotoxicidade (superdosagem)","Náusea leve","Reação alérgica cutânea rara"],
    ci:["Insuficiência hepática grave (Child-Pugh C)","Alcoolismo ativo grave (relativa)"] },

  // 75. PREDNISONA
  { nome:"Prednisona", generico:"Prednisona", classe:"Corticosteroide Sistêmico (Glicocorticoide)",
    vias:[
      { id:"oral", via:"Oral", dose:"5-60 mg (dose única matinal ou dividida)", intervalo:"1x/dia (manhã, para mimetizar ciclo circadiano)", max:"Dose de ataque conforme doença (1 mg/kg/dia)", obs:"Nunca suspender abruptamente após uso prolongado. Necessário desmame." }
    ],
    colaterais:["Aumento do apetite / Ganho de peso","Insônia / Agitação","Hiperglicemia / Imunossupressão"],
    ci:["Infecções fúngicas sistêmicas não tratadas","Herpes simples ocular","Vacinação com vírus vivo atenuado"] },

  // 76. DEXCLORFENIRAMINA (Genérico)
  { nome:"Dexclorfeniramina", generico:"Maleato de Dexclorfeniramina", classe:"Anti-histamínico H1 de 1ª Geração (Alquilamina)",
    vias:[
      { id:"oral", via:"Oral", dose:"2 mg", intervalo:"6/6 h ou 8/8 h", max:"12 mg/dia", obs:"Potente efeito sedativo e anticolinérgico. Primeira escolha em reações alérgicas agudas no PS (IM/EV)." },
      { id:"im", via:"Intramuscular", dose:"5 mg (Ampola)", intervalo:"8/12 h", max:"20 mg/dia", obs:"Para anafilaxia/reações graves (adjuvante da adrenalina)." }
    ],
    colaterais:["Sonolência intensa","Ressecamento de mucosas","Retenção urinária"],
    ci:["Glaucoma de ângulo fechado","Hiperplasia prostática obstrutiva","Crianças < 2 anos (risco de excitação paradoxal ou depressão respiratória)"] },

  // 77. LORATADINA (Genérico)
  { nome:"Loratadina", generico:"Loratadina", classe:"Anti-histamínico H1 de 2ª Geração (Não Sedante)",
    vias:[
      { id:"oral", via:"Oral", dose:"10 mg", intervalo:"1x/dia", max:"10 mg/dia", obs:"Não causa sonolência significativa na dose terapêutica." }
    ],
    colaterais:["Cefaleia","Boca seca","Sonolência (rara, em doses altas)"],
    ci:["Hipersensibilidade à Loratadina","Insuficiência hepática grave (ajustar dose)"] },

  // 78. SALBUTAMOL (Genérico - Xarope/Comprimido)
  { nome:"Salbutamol", generico:"Sulfato de Salbutamol", classe:"Broncodilatador (Agonista Beta-2 Adrenérgico de Curta Ação - SABA)",
    vias:[
      { id:"oral", via:"Oral (Xarope/Comprimido)", dose:"2-4 mg (Adulto)", intervalo:"6/6 h ou 8/8 h", max:"16 mg/dia (via oral)", obs:"Via oral tem início mais lento e mais efeitos colaterais sistêmicos que a via inalatória." }
    ],
    colaterais:["Taquicardia / Palpitações","Tremor fino de extremidades","Agitação / Insônia"],
    ci:["Arritmias cardíacas graves","Hipersensibilidade ao fármaco"] },

  // 79. CIMETIDINA
  { nome:"Cimetidina", generico:"Cimetidina", classe:"Antagonista dos Receptores H2 da Histamina (Antiácido Sistêmico)",
    vias:[
      { id:"oral", via:"Oral", dose:"200-400 mg", intervalo:"12/12 h ou 1x à noite", max:"800 mg/dia", obs:"Uso em declínio devido a interações medicamentosas (inibidor do CYP450) e disponibilidade dos IBPs." }
    ],
    colaterais:["Ginecomastia / Galactorreia (uso prolongado)","Diarreia ou constipação","Confusão mental em idosos"],
    ci:["Hipersensibilidade à Cimetidina","Uso concomitante de medicamentos de janela terapêutica estreita (ex: Varfarina, Fenitoína, Teofilina)"] },

  // 80. HIDRÓXIDO DE ALUMÍNIO (Antiácido Simples)
  { nome:"Hidróxido de Alumínio", generico:"Hidróxido de Alumínio", classe:"Antiácido Não Sistêmico (Neutralizador de Ácido Gástrico)",
    vias:[
      { id:"oral", via:"Oral (Suspensão ou Comprimido Mastigável)", dose:"5-10 mL ou 1-2 comprimidos", intervalo:"1h após refeições e ao deitar", max:"6 doses/dia", obs:"Causa constipação. Não usar cronicamente pelo risco de acúmulo de alumínio e osteomalácia." }
    ],
    colaterais:["Constipação intestinal","Hipofosfatemia (uso crônico)","Redução da absorção de tetraciclinas e ferro"],
    ci:["Insuficiência renal grave (risco de intoxicação por alumínio)","Hemorroidas ou fissura anal grave (pelo efeito constipante)","Crianças < 6 anos"] },

  // 81. HIOSCINA (Buscopan Simples)
  { nome:"Hioscina", generico:"Butilbrometo de Escopolamina", classe:"Antiespasmódico / Anticolinérgico",
    vias:[
      { id:"oral", via:"Oral", dose:"10-20 mg", intervalo:"6/6 h ou 8/8 h", max:"60 mg/dia", obs:"Para cólicas abdominais e dismenorreia." },
      { id:"ev_im", via:"EV/IM", dose:"20 mg", intervalo:"6/6 h ou 8/8 h", max:"80 mg/dia", obs:"EV: diluir e administrar lentamente." }
    ],
    colaterais:["Boca seca","Visão turva (midríase)","Taquicardia / Retenção urinária"],
    ci:["Glaucoma de ângulo fechado","Hipertrofia prostática obstrutiva","Miastenia Gravis","Megacólon"] },

  // 82. METOCLOPRAMIDA (Plasil)
  { nome:"Metoclopramida", generico:"Cloridrato de Metoclopramida", classe:"Antiemético / Procinético (Antagonista Dopaminérgico D2)",
    vias:[
      { id:"oral", via:"Oral", dose:"10 mg", intervalo:"8/8 h (30 min antes das refeições)", max:"30 mg/dia", obs:"Uso máximo de 5 dias devido ao risco de sintomas extrapiramidais." },
      { id:"ev", via:"Endovenosa", dose:"10 mg", intervalo:"8/8 h", max:"30 mg/dia", obs:"Infundir lentamente (pelo menos 3 min)." }
    ],
    colaterais:["Sonolência / Fadiga","Sintomas extrapiramidais (distonia aguda, discinesia tardia)","Galactorreia / Distúrbios menstruais"],
    ci:["Hemorragia gastrointestinal","Obstrução ou perfuração intestinal","Epilepsia (diminui limiar convulsivo)","Feocromocitoma","Crianças < 1 ano"] },

  // 83. ÓLEO MINERAL
  { nome:"Óleo Mineral", generico:"Óleo Mineral (Parafina Líquida)", classe:"Laxante Lubrificante / Emoliente Fecal",
    vias:[
      { id:"oral", via:"Oral", dose:"15-45 mL", intervalo:"1x/dia (ao deitar)", max:"45 mL/dia", obs:"Uso ocasional. Efeito em 6-8 horas. Não usar por mais de 7 dias." }
    ],
    colaterais:["Incontinência fecal / Escape anal oleoso","Deficiência de vitaminas lipossolúveis (uso crônico)","Pneumonia lipoídica (se aspirado)"],
    ci:["Abdome agudo cirúrgico","Impactação fecal","Disfagia ou risco de aspiração (idosos acamados)","Gestação"] },

  // 84. OMEPRAZOL
  { nome:"Omeprazol", generico:"Omeprazol", classe:"Inibidor da Bomba de Prótons (IBP)",
    vias:[
      { id:"oral", via:"Oral (Cápsula)", dose:"20-40 mg", intervalo:"1x/dia (em jejum)", max:"40 mg/dia", obs:"Tomar 30-60 min antes do café da manhã." }
    ],
    colaterais:["Cefaleia","Diarreia ou constipação","Deficiência de Vitamina B12 / Magnésio (uso crônico)"],
    ci:["Hipersensibilidade a benzimidazóis","Uso concomitante de Atazanavir ou Nelfinavir"] },

  // 85. RANITIDINA (Atualmente suspensa em muitos países, mas ainda presente em listas brasileiras como cloridrato)
  { nome:"Ranitidina", generico:"Cloridrato de Ranitidina", classe:"Antagonista do Receptor H2 da Histamina",
    vias:[
      { id:"oral", via:"Oral", dose:"150 mg", intervalo:"12/12 h ou 300 mg à noite", max:"300 mg/dia", obs:"Uso sintomático para azia. Efeito mais rápido que IBP, mas menos duradouro." }
    ],
    colaterais:["Cefaleia","Tontura","Constipação ou diarreia"],
    ci:["Hipersensibilidade à Ranitidina","Porfiria aguda (relativa)"] },

  // 86. ÁCIDO FÓLICO
  { nome:"Ácido Fólico", generico:"Ácido Fólico (Vitamina B9)", classe:"Vitamina Hidrossolúvel (Suplemento Nutricional)",
    vias:[
      { id:"oral", via:"Oral", dose:"5 mg", intervalo:"1x/dia", max:"5 mg/dia (profilaxia de defeitos do tubo neural) / 15 mg/dia (tratamento de anemia megaloblástica)", obs:"Iniciar pelo menos 3 meses antes da concepção." }
    ],
    colaterais:["Náusea leve (rara)","Distensão abdominal"],
    ci:["Anemia perniciosa não tratada (pode mascarar sintomas neurológicos da deficiência de B12)"] },

  // 87. COMPLEXO B
  { nome:"Complexo B", generico:"Tiamina (B1) + Riboflavina (B2) + Nicotinamida (B3) + Piridoxina (B6) + Cianocobalamina (B12) + Pantotenato de Cálcio (B5)", classe:"Suplemento Polivitamínico do Complexo B",
    vias:[
      { id:"oral", via:"Oral (Comprimido/Drágea)", dose:"1 comprimido", intervalo:"1x/dia", max:"1 comp/dia", obs:"Indicado em carências nutricionais, fadiga, polineuropatias carenciais." },
      { id:"im", via:"Intramuscular", dose:"1 ampola", intervalo:"1x/dia ou em dias alternados", max:"Conforme prescrição", obs:"Para deficiências graves ou má absorção." }
    ],
    colaterais:["Urina amarelada (Riboflavina - inócuo)","Náusea leve","Reação alérgica (rara, especialmente com Tiamina EV)"],
    ci:["Hipersensibilidade aos componentes","Doença de Parkinson em uso de Levodopa (Piridoxina pode antagonizar o efeito)"] },

  // 88. TIAMINA (Vitamina B1)
  { nome:"Tiamina", generico:"Cloridrato de Tiamina", classe:"Vitamina Hidrossolúvel (Cofator Enzimático)",
    vias:[
      { id:"oral", via:"Oral", dose:"300 mg", intervalo:"1-2x/dia", max:"600 mg/dia", obs:"Prevenção e tratamento da deficiência de B1 (Beribéri)." },
      { id:"im_ev", via:"IM ou EV lenta", dose:"100 mg", intervalo:"1x/dia", max:"300 mg/dia", obs:"Fundamental na profilaxia da Encefalopatia de Wernicke em alcoólatras." }
    ],
    colaterais:["Reação anafilactoide (rara, mais comum EV)","Diaforese (sudorese)","Náusea"],
    ci:["Hipersensibilidade à Tiamina"] },

  // 89. ACICLOVIR
  { nome:"Aciclovir", generico:"Aciclovir", classe:"Antiviral (Análogo de Nucleosídeo - Anti-herpético)",
    vias:[
      { id:"oral", via:"Oral", dose:"200-400 mg", intervalo:"4/4 h (5x/dia) - pular dose noturna", max:"4 g/dia (Herpes Zoster)", obs:"Para herpes simples e varicela-zoster. Iniciar aos primeiros sintomas." },
      { id:"topico", via:"Tópica (Creme)", dose:"Camada fina", intervalo:"5x/dia", max:"10 dias", obs:"Para herpes labial." }
    ],
    colaterais:["Náusea / Vômito","Cefaleia","Cristalúria / Nefrotoxicidade (dose alta ou desidratação)"],
    ci:["Hipersensibilidade ao Aciclovir ou Valaciclovir","Insuficiência Renal Grave sem ajuste de dose"] },

  // 90. CETOCONAZOL (Creme)
  { nome:"Cetoconazol", generico:"Cetoconazol", classe:"Antifúngico Imidazólico Tópico",
    vias:[
      { id:"topico", via:"Tópica (Creme/Loção)", dose:"Camada fina na área afetada", intervalo:"1-2x/dia", max:"4 semanas (Dermatofitoses)", obs:"Para dermatite seborreica, pitiríase versicolor e candidíase cutânea." },
      { id:"shampoo", via:"Couro Cabeludo (Shampoo)", dose:"Aplicar, deixar agir 3-5 min, enxaguar", intervalo:"2x/semana", max:"8 semanas", obs:"Para dermatite seborreica e caspa." }
    ],
    colaterais:["Irritação local / Prurido","Ardência","Dermatite de contato"],
    ci:["Hipersensibilidade ao Cetoconazol ou imidazólicos"] },

  // 91. CLORANFENICOL (Colírio)
  { nome:"Cloranfenicol", generico:"Cloranfenicol", classe:"Antibiótico Bacteriostático (Inibidor da Síntese Proteica)",
    vias:[
      { id:"oftalmico", via:"Tópica Oftálmica (Colírio)", dose:"1-2 gotas no saco conjuntival", intervalo:"3/3 h ou 4/4 h (infecções agudas)", max:"7 dias de uso", obs:"Uso restrito a infecções oculares superficiais. Evitar uso sistêmico devido à toxicidade medular." }
    ],
    colaterais:["Ardência ocular transitória","Visão turva momentânea","Síndrome do Bebê Cinzento (se absorção sistêmica em neonatos)"],
    ci:["Hipersensibilidade ao Cloranfenicol","Histórico de discrasia sanguínea ou depressão medular","Recém-nascidos (uso oftálmico com cautela)"] },

  // 92. ITRACONAZOL
  { nome:"Itraconazol", generico:"Itraconazol", classe:"Antifúngico Azólico Sistêmico",
    vias:[
      { id:"oral", via:"Oral (Cápsula)", dose:"100-200 mg", intervalo:"1-2x/dia (junto com refeição)", max:"400 mg/dia", obs:"Para onicomicoses e micoses sistêmicas. Cápsulas precisam de acidez gástrica para absorção." }
    ],
    colaterais:["Hepatotoxicidade (elevação de transaminases)","Náusea / Dor abdominal","Insuficiência Cardíaca (efeito inotrópico negativo)"],
    ci:["Insuficiência Cardíaca (FEVE reduzida) ou história de IC","Insuficiência hepática","Uso concomitante de medicamentos que prolongam QT e são metabolizados por CYP3A4 (ex: Cisaprida, Quinidina)"] },

  // 93. SULFAMETOXAZOL + TRIMETOPRIMA (Bactrim)
  { nome:"Bactrim", generico:"Sulfametoxazol + Trimetoprima", classe:"Antibiótico Bactericida (Inibidor do Folato - Sulfonamida + Diaminopirimidina)",
    vias:[
      { id:"oral", via:"Oral", dose:"400/80 mg ou 800/160 mg (Forte)", intervalo:"12/12 h", max:"800/160 mg 2x/dia", obs:"Manter hidratação adequada para prevenir cristalúria. Ajustar na IR." }
    ],
    colaterais:["Rash cutâneo / Síndrome de Stevens-Johnson (rara, grave)","Hipercalemia (especialmente em idosos e nefropatas)","Náusea / Diarreia"],
    ci:["Hipersensibilidade a sulfonamidas","Anemia megaloblástica por deficiência de folato","Insuficiência renal grave (TFG < 15)","Gestação (3º trimestre)","Deficiência de G6PD"] },

  // 94. ALOPURINOL
  { nome:"Alopurinol", generico:"Alopurinol", classe:"Inibidor da Xantina Oxidase (Hipouricemiante)",
    vias:[
      { id:"oral", via:"Oral", dose:"100-300 mg", intervalo:"1x/dia (após refeição)", max:"900 mg/dia", obs:"Não iniciar durante crise aguda de gota (aguardar resolução). Manter hidratação." }
    ],
    colaterais:["Reações de hipersensibilidade cutânea (Síndrome de DRESS / Stevens-Johnson - grave)","Náusea / Diarreia","Crise aguda de gota (paradoxal no início do tratamento)"],
    ci:["Hipersensibilidade ao Alopurinol","Uso concomitante de Azatioprina ou Mercaptopurina (aumenta toxicidade medular)"] },

  // 95. PREDNISOLONA
  { nome:"Prednisolona", generico:"Prednisolona", classe:"Corticosteroide Glicocorticoide Sistêmico",
    vias:[
      { id:"oral", via:"Oral (Comprimido ou Solução)", dose:"5-60 mg/dia", intervalo:"1x/dia (manhã) ou em dias alternados", max:"Conforme patologia (pulsoterapia até 1g/dia EV)", obs:"Desmame gradual obrigatório após uso prolongado." }
    ],
    colaterais:["Hiperglicemia / Diabetes esteroide","Gastrite / Úlcera péptica","Osteoporose / Miopatia","Insônia / Agitação"],
    ci:["Infecções fúngicas sistêmicas não tratadas","Infecções virais disseminadas (Herpes ocular)","Vacinação com vírus vivo"] },

  // 96. SAIS PARA REIDRATAÇÃO ORAL (SRO)
  { nome:"Sais para Reidratação Oral", generico:"Cloreto de Sódio + Cloreto de Potássio + Citrato de Sódio + Glicose Anidra", classe:"Solução Eletrolítica / Reidratante",
    vias:[
      { id:"oral", via:"Oral (Diluído em água)", dose:"50-100 mL/kg em 4-6 horas (fase de reparação)", intervalo:"Livre demanda / Pequenos goles", max:"Conforme desidratação", obs:"Diluir 1 envelope em 1 litro de água filtrada. Validade após preparo: 24h." }
    ],
    colaterais:["Vômitos (se ingestão rápida)","Hipernatremia / Hipercalemia (se diluição incorreta)"],
    ci:["Obstrução intestinal","Vômitos incoercíveis (necessidade de hidratação EV)","Insuficiência renal anúrica"] },

  // 97. VITAMINA D (Colecalciferol)
  { nome:"Vitamina D", generico:"Colecalciferol (Vitamina D3)", classe:"Suplemento Vitamínico (Hormônio Pró-calcificante)",
    vias:[
      { id:"oral", via:"Oral (Gotas ou Cápsulas)", dose:"400-2.000 UI", intervalo:"1x/dia", max:"50.000 UI/semana (doses de ataque)", obs:"Manutenção baseada nos níveis séricos de 25(OH)D." }
    ],
    colaterais:["Hipercalcemia / Hipercalciúria (doses excessivas)","Constipação intestinal","Nefrocalcinose (toxicidade crônica)"],
    ci:["Hipercalcemia","Sarcoidose ou Tuberculose ativa (ativação extra-renal da vitamina D)","Hipersensibilidade"] },

  // 98. SULFATO FERROSO
  { nome:"Sulfato Ferroso", generico:"Sulfato Ferroso Heptaidratado", classe:"Suplemento Mineral (Ferro)",
    vias:[
      { id:"oral", via:"Oral (Comprimido ou Solução)", dose:"60-120 mg de Ferro Elementar (300-600 mg de sal)", intervalo:"1x/dia (estômago vazio, 1h antes ou 2h após refeições)", max:"200 mg Ferro elementar/dia", obs:"Melhor absorção com Vitamina C. Evitar com leite, chá ou café." }
    ],
    colaterais:["Obstipação intestinal / Fezes escuras","Náusea / Desconforto epigástrico","Dor abdominal"],
    ci:["Hemocromatose / Hemossiderose","Anemia hemolítica (exceto carencial)","Transfusões sanguíneas repetidas"] },

  // 99. CARBONATO DE CÁLCIO
  { nome:"Carbonato de Cálcio", generico:"Carbonato de Cálcio", classe:"Suplemento Mineral / Antiácido",
    vias:[
      { id:"oral", via:"Oral (Comprimido Mastigável)", dose:"500-1.000 mg de Cálcio Elementar", intervalo:"12/12 h (com refeições)", max:"1.500 mg/dia", obs:"Para osteoporose e hipocalcemia. Como antiácido: 1-2 comprimidos após refeições." }
    ],
    colaterais:["Constipação intestinal","Flatulência","Hipercalcemia (dose excessiva)"],
    ci:["Hipercalcemia","Cálculo renal por hipercalciúria","Sarcoidose","Insuficiência renal grave com hiperfosfatemia"] },

  // 100. VITAMINA B12 (Cianocobalamina)
  { nome:"Vitamina B12", generico:"Cianocobalamina", classe:"Suplemento Vitamínico (Hidrossolúvel - Fator Extrínseco)",
    vias:[
      { id:"oral", via:"Oral (Sublingual ou Comprimido)", dose:"1.000-5.000 mcg", intervalo:"1x/dia", max:"5.000 mcg/dia", obs:"Para deficiência nutricional ou pós-bariátrica. Dose alta oral pode substituir injeções em casos leves." },
      { id:"im", via:"Intramuscular Profunda", dose:"1.000 mcg", intervalo:"1x/semana (dose de ataque) ou 1x/mês (manutenção)", max:"Conforme prescrição", obs:"Tratamento padrão para Anemia Perniciosa ou má absorção ileal." }
    ],
    colaterais:["Reação alérgica (rara, IM)","Dor no local da aplicação","Urina avermelhada (inócuo)"],
    ci:["Hipersensibilidade à Cianocobalamina ou Cobalto","Atrofia óptica de Leber (doença hereditária)"] }
    
];

// Exportar para objeto global window
window.MedicamentosDB = MEDS;