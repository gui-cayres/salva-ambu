// ─────────────────────────────────────────────────────────────
// ACHADOS NORMAIS — EXAME FÍSICO
// Edite os textos abaixo para personalizar o que aparece no
// prontuário quando cada sistema é marcado como normal.
// ─────────────────────────────────────────────────────────────

const EF = {

  cardiaco:
`Aparelho Cardiovascular: Ausculta cardíaca com bulhas normofonéticas, rítmicas, em 2 tempos, sem sopros, sem extrassístoles audíveis, sem atrito pericárdico. Precórdio sem abaulamentos, retrações ou pulsações visíveis anormais. Ictus cordis não palpável ou palpável no 5º espaço intercostal esquerdo na linha hemiclavicular, com extensão e impulso dentro dos limites normais. Pulsos radiais cheios, rítmicos e simétricos bilateralmente, com amplitude preservada. Ausência de turgência jugular patológica com o paciente posicionado a 45°. Pressão arterial e frequência cardíaca dentro dos parâmetros normais para a faixa etária.`,

  respiratorio:
`Aparelho Respiratório: Tórax simétrico, sem deformidades estruturais, com expansibilidade torácica preservada e simétrica bilateralmente à inspeção estática e dinâmica. Frêmito toracovocal (FTV) preservado e simétrico em todos os campos pulmonares à palpação. Percussão com sonoridade pulmonar normal (som claro pulmonar) mantida em todos os campos, sem macicez ou hipertimpanismo. Ausculta pulmonar com murmúrio vesicular fisiológico, presente e bem distribuído em todos os campos pulmonares — anterior, lateral e posterior —, sem ruídos adventícios (ausência de sibilos, roncos, estertores finos ou grosseiros e atrito pleural). Sem uso de musculatura acessória. Frequência respiratória dentro da normalidade.`,

  abdome:
`Abdome: Plano, simétrico, sem abaulamentos localizados, distensão, circulação colateral visível ou cicatrizes cirúrgicas relevantes. Ruídos hidroaéreos (RHA) presentes, normoativos e bem distribuídos em todos os quadrantes à ausculta. Abdome flácido, indolor à palpação superficial e profunda em todos os quadrantes, sem resistência involuntária ou defesa muscular. Ausência de massas palpáveis, hepatomegalia ou esplenomegalia. Percussão hepática com área de macicez dentro dos limites normais. Manobras especiais: sinal de Blumberg (descompressão brusca) negativo; sinal de Murphy negativo; sinal de Giordano negativo bilateralmente. Sem sinais clínicos de irritação peritoneal.`,

  neurologico:
`Exame Neurológico Sumário: Paciente consciente, cooperativo, orientado no tempo (data, período do dia), espaço (local onde se encontra) e pessoa (identidade própria). Escala de Coma de Glasgow 15 pontos: abertura ocular espontânea (AO4), resposta verbal orientada (RV5), resposta motora obedece a comandos (RM6). Pupilas isocóricas (simétricas), fotorreagentes direta e consensualmente e com reflexo de acomodação preservados bilateralmente. Nervos cranianos avaliados grosseiramente sem déficits aparentes. Força muscular grau V pela Escala MRC nos 4 membros, simétrica e sem déficits focais proximais ou distais. Sensibilidade tátil superficial e dolorosa preservadas e simétricas nos 4 membros. Reflexos tendinosos profundos (patelar e aquileu) presentes, normoativos e simétricos bilateralmente. Sinal de Babinski (extensão plantar) ausente bilateralmente. Ausência de sinais meníngeos: Kernig negativo e Brudzinski negativo.`,

  extremidades:
`Extremidades: Membros superiores e inferiores sem edema, cianose periférica ou hipocratismo digital. Pulsos periféricos — radial, braquial (MMSS), femoral, poplíteo, tibial posterior e pedioso (MMII) — presentes, palpáveis, simétricos bilateralmente e com amplitude preservada. Tempo de enchimento capilar (TEC) inferior a 2 segundos em polpas digitais de mãos e pés. Ausência de empastamento, eritema, calor local ou sinais de trombose venosa profunda nos membros inferiores. Sinal de Homans negativo bilateralmente. Ausência de varizes significativas, linfedema ou lesões tróficas.`,

  pele:
`Pele e Fâneros: Pele íntegra, normocorada, hidratada, normotérmica e com turgor e elasticidade preservados. Mucosa oral úmida, corada (sem enantema ou lesões), com dentição e gengivas sem alterações inflamatórias visíveis. Conjuntivas oculares rosadas e úmidas, sem palidez ou icterícia. Escleras anictéricas. Ausência de icterícia cutâneo-mucosa, palidez, cianose central, exantemas, petéquias, equimoses espontâneas ou lesões cutâneas suspeitas. Cabelos com brilho e distribuição preservados; unhas sem coiloníquia, leuconíquia ou alterações distróficas. Fâneros sem perda significativa ou distribuição anômala.`,

  cabeca_pescoto:
`Cabeça e Pescoço: Crânio normocefálico e indolor. Face simétrica. Olhos: órbitas sem edema, conjuntivas rosadas, escleras anictéricas, córneas transparentes, pupilas isocóricas e fotorreagentes. Orelhas: pavilhões simétricos, condutos permeáveis, membranas timpânicas translúcidas e íntegras. Nariz: pirâmide central, mucosa rósea, seios paranasais indolores. Cavidade oral: lábios úmidos, mucosa íntegra, língua centrada e sem lesões, dentição conservada, orofaringe sem hiperemia, tonsilas normais, úvula centrada. Pescoço: traqueia central e móvel, tireoide impalpável, sem sopros cervicais, jugulares colapsadas a quarenta e cinco graus, mobilidade cervical completa e indolor, linfonodos cervicais impalpáveis.`,

  linfonodos_detalhado:
`Sistema Linfático: Cadeias cervicais, supraclaviculares, axilares e epitrocleares impalpáveis. Cadeias inguinais com linfonodos fisiológicos menores que um centímetro, fibroelásticos, móveis e indolores. Baço impalpável, espaço de Traube livre.`,

  aparelho_genitourinario_masc:
`Aparelho Geniturinário Masculino: Genitália externa íntegra, sem lesões ou secreções. Testículos tópicos, superfície lisa, consistência normal e indolores. Epidídimos e cordão espermático sem nodulações ou varicosidades. Ausência de hérnias inguinais. Toque retal: esfíncter normotônico, próstata de tamanho normal, superfície lisa, sulco mediano palpável, indolor, sem nódulos ou áreas endurecidas.`,

  aparelho_genitourinario_fem:
`Aparelho Geniturinário Feminino: Exame ginecológico normal. Vulva e períneo íntegros, sem lesões. Especular: vagina sem lesões, conteúdo fisiológico, colo uterino epitelizado sem sangramentos. Toque bimanual: colo indolor e móvel, útero em anteversoflexão, tamanho normal, superfície regular, anexos impalpáveis, fundo de saco livre.`,

  coluna_vertebral:
`Coluna Vertebral: Alinhamento preservado, ombros e escápulas nivelados. Curvaturas fisiológicas normais. Teste de Adams sem gibosidade. Palpação de processos espinhosos e musculatura paravertebral indolor. Mobilidade ativa completa e sem dor. Lasègue negativo, Patrick-Fabere negativo, Valsalva sem irradiação.`,

  vascular_periferico_detalhado:
`Sistema Vascular Periférico: Pulsos radiais, braquiais, ulnares, femorais, poplíteos, tibiais posteriores e pediosos palpáveis, simétricos e amplos. Teste de Allen normal. Sem sinais de insuficiência arterial ou venosa. Tempo de enchimento capilar menor que dois segundos. Ausência de edema, varizes, dermatite ocre ou úlceras.`,

  estado_mental_completo:
`Exame do Estado Mental: Paciente vigil, orientado, atenção e concentração preservadas. Linguagem fluente e coerente, compreensão intacta. Memória de curto e longo prazo preservadas. Pensamento organizado, sem alterações de sensopercepção. Humor eutímico e juízo crítico mantido.`,

  articulacoes_e_osteomuscular:
`Sistema Osteoarticular e Muscular: Marcha normal, independente, sem claudicação. Trofismo e tônus muscular normais. Força grau cinco global. Articulações periféricas com amplitude completa, indolores, sem edema ou crepitações. Coluna sem dor à palpação. Phalen e Tinel negativos.`
};

// Exportar para objeto global window
window.ExameFisicoDB = EF;
