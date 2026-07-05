// Mock paper database. Each paper has enough shape to drive every flow:
// card view, arXiv full page, translated explainer, credibility subscores.

function score(currency, journal, author, accuracy, relevance) {
  const base = { currency, journal, author, accuracy };
  const parts = [currency, journal, author, accuracy];
  if (relevance != null) parts.push(relevance);
  const final = +(parts.reduce((a, b) => a + b, 0) / parts.length).toFixed(1);
  return { ...base, relevance, final };
}

function explainer(overrides = {}) {
  // Per-section text keyed by reading level. We store one canonical text per
  // section and let mockAI "re-level" it; here we ship the four levels inline
  // so the UI is instant.
  const mk = (hs, ca, de, fe) => ({
    'High School': hs,
    'Curious Adult': ca,
    'Domain Expert': de,
    'Field Expert': fe,
  });
  const d = {
    Background: mk(
      'Scientists wanted to understand a problem that had puzzled researchers for a while. This section sets up why the question matters.',
      'The authors situate their work in a body of prior research, explaining the open question and why existing approaches fall short.',
      'The introduction reviews the relevant literature, identifies the specific gap the study targets, and motivates the chosen approach against established baselines.',
      'The background surveys the theoretical lineage and prior empirical results, framing the contribution relative to competing formalisms and the current state of the art.'
    ),
    Hypothesis: mk(
      'The researchers had a specific guess about what they would find, and they set out to test it.',
      'The central hypothesis predicts a measurable relationship, which the study is designed to confirm or reject.',
      'The stated hypothesis operationalizes the research question into a testable prediction with defined variables and expected effect direction.',
      'The hypothesis is formalized with explicit null and alternative statements and pre-registered effect-size expectations where applicable.'
    ),
    Methodology: mk(
      'They ran a careful experiment, collecting data in a controlled way so the results could be trusted.',
      'The team describes their study design, the data they gathered, and the controls they used to keep the comparison fair.',
      'The methods detail sample selection, instrumentation, statistical models, and controls for known confounds, enabling replication.',
      'The methodology specifies the estimator, identification strategy, power analysis, and sensitivity checks against alternative specifications.'
    ),
    Results: mk(
      'The experiment produced clear findings that supported most of what the researchers expected.',
      'The results show the main effects the authors predicted, reported with measures of uncertainty.',
      'Primary outcomes are reported with effect sizes and confidence intervals; secondary analyses probe robustness.',
      'Point estimates, standard errors, and multiple-comparison corrections are presented alongside pre-specified robustness batteries.'
    ),
    Discussion: mk(
      'The authors explain what their findings mean and how they fit with what other scientists already knew.',
      'The discussion interprets the results, connects them to prior work, and considers alternative explanations.',
      'The authors reconcile findings with prior literature, discuss mechanisms, and delimit the scope of valid inference.',
      'Interpretation is weighed against competing theoretical accounts, with attention to external validity and boundary conditions.'
    ),
    Limitations: mk(
      'No study is perfect. Here the authors are honest about what their work could not show.',
      'The authors note constraints — sample size, scope, or design choices — that temper the conclusions.',
      'Limitations include potential confounds, generalizability constraints, and unmodeled sources of variance.',
      'Threats to validity are enumerated: residual confounding, measurement error, and limits on the identifying assumptions.'
    ),
    Implications: mk(
      'If the findings hold up, they could change how people think about or solve this problem.',
      'The work suggests practical and theoretical next steps, and where future research should focus.',
      'Implications span theory refinement and applied directions, with concrete proposals for follow-up studies.',
      'The contribution repositions the debate and motivates a research program spanning replication, extension, and mechanism.'
    ),
  };
  return { ...d, ...overrides };
}

export const PAPERS = [
  {
    id: 'attention-2017',
    inDB: true,
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
    authorIds: ['a-vaswani', 'a-shazeer', 'a-parmar', 'a-uszkoreit'],
    year: 2017,
    journal: 'NeurIPS',
    field: 'Machine Learning',
    citations: 118432,
    doi: '10.48550/arXiv.1706.03762',
    arxivId: '1706.03762',
    link: 'https://arxiv.org/abs/1706.03762',
    accessType: 'arXiv',
    abstract:
      'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.',
    evidenceStrength: 4,
    scores: score(9.4, 9.8, 9.6, 9.2),
    explainer: explainer(),
  },
  {
    id: 'crispr-2012',
    inDB: true,
    title: 'A Programmable Dual-RNA–Guided DNA Endonuclease in Adaptive Bacterial Immunity',
    authors: ['Martin Jinek', 'Krzysztof Chylinski', 'Emmanuelle Charpentier', 'Jennifer Doudna'],
    authorIds: ['a-jinek', 'a-chylinski', 'a-charpentier', 'a-doudna'],
    year: 2012,
    journal: 'Science',
    field: 'Genomics',
    citations: 15320,
    doi: '10.1126/science.1225829',
    arxivId: null,
    link: 'https://www.science.org/doi/10.1126/science.1225829',
    accessType: 'open access',
    abstract:
      'CRISPR/Cas systems provide bacteria and archaea with adaptive immunity against viruses and plasmids. We show that Cas9 can be programmed with a single guide RNA to introduce site-specific double-stranded breaks in DNA, establishing a versatile tool for genome editing.',
    evidenceStrength: 4,
    scores: score(7.2, 9.9, 9.7, 9.5),
    explainer: explainer(),
  },
  {
    id: 'alphafold-2021',
    inDB: true,
    title: 'Highly Accurate Protein Structure Prediction with AlphaFold',
    authors: ['John Jumper', 'Richard Evans', 'Alexander Pritzel', 'Demis Hassabis'],
    authorIds: ['a-jumper', 'a-evans', 'a-pritzel', 'a-hassabis'],
    year: 2021,
    journal: 'Nature',
    field: 'Biology',
    citations: 28104,
    doi: '10.1038/s41586-021-03819-2',
    arxivId: null,
    link: 'https://www.nature.com/articles/s41586-021-03819-2',
    accessType: 'open access',
    abstract:
      'Predicting a protein’s three-dimensional structure from its amino acid sequence has been a grand challenge in biology. AlphaFold provides atomic-accuracy predictions even where no homologous structure is known, transforming structural biology.',
    evidenceStrength: 4,
    scores: score(9.6, 9.9, 9.8, 9.4),
    explainer: explainer(),
  },
  {
    id: 'climate-tipping-2022',
    inDB: true,
    title: 'Exceeding 1.5°C Could Trigger Multiple Climate Tipping Points',
    authors: ['David Armstrong McKay', 'Arie Staal', 'Jesse Abrams', 'Timothy Lenton'],
    authorIds: ['a-mckay', 'a-staal', 'a-abrams', 'a-lenton'],
    year: 2022,
    journal: 'Science',
    field: 'Climate Science',
    citations: 1893,
    doi: '10.1126/science.abn7950',
    arxivId: null,
    link: 'https://www.science.org/doi/10.1126/science.abn7950',
    accessType: 'open access',
    abstract:
      'We synthesize evidence for climate tipping elements and their temperature thresholds. Several may be triggered within the Paris Agreement range of 1.5–2°C of warming, underscoring the urgency of emissions reductions.',
    evidenceStrength: 3,
    scores: score(9.3, 9.7, 8.9, 7.8),
    explainer: explainer(),
  },
  {
    id: 'gut-microbiome-2019',
    inDB: true,
    title: 'The Gut Microbiome Modulates Host Response to Immunotherapy',
    authors: ['Vancheswaran Gopalakrishnan', 'Christine Spencer', 'Jennifer Wargo'],
    authorIds: ['a-gopal', 'a-spencer', 'a-wargo'],
    year: 2019,
    journal: 'Cell',
    field: 'Immunology',
    citations: 4211,
    doi: '10.1016/j.cell.2019.01.001',
    arxivId: null,
    link: 'https://www.cell.com/',
    accessType: 'open access',
    abstract:
      'Gut microbial composition is associated with response to immune checkpoint blockade in melanoma patients. We characterize taxa enriched in responders and demonstrate causal effects in germ-free mouse models.',
    evidenceStrength: 3,
    scores: score(8.1, 9.2, 8.4, 7.1),
    explainer: explainer(),
  },
  {
    id: 'dark-matter-2020',
    inDB: true,
    title: 'Constraints on Dark Matter Self-Interaction from Galaxy Cluster Collisions',
    authors: ['Maruša Bradač', 'Steven Allen', 'Andrew Robertson'],
    authorIds: ['a-bradac', 'a-allen', 'a-robertson'],
    year: 2020,
    journal: 'The Astrophysical Journal',
    field: 'Astrophysics',
    citations: 642,
    doi: '10.3847/1538-4357/ab1234',
    arxivId: '2004.05678',
    link: 'https://arxiv.org/abs/2004.05678',
    accessType: 'arXiv',
    abstract:
      'Merging galaxy clusters offer a laboratory for testing dark matter self-interaction. We place upper bounds on the self-interaction cross-section using weak-lensing mass reconstructions of six merging systems.',
    evidenceStrength: 2,
    scores: score(8.8, 8.6, 8.0, 6.7),
    explainer: explainer(),
  },
  {
    id: 'sleep-memory-2018',
    inDB: true,
    title: 'Slow-Wave Sleep Consolidates Declarative Memory via Hippocampal Replay',
    authors: ['Björn Rasch', 'Jan Born'],
    authorIds: ['a-rasch', 'a-born'],
    year: 2018,
    journal: 'Nature Neuroscience',
    field: 'Neuroscience',
    citations: 3320,
    doi: '10.1038/s41593-018-0210-5',
    arxivId: null,
    link: 'https://www.nature.com/neuro/',
    accessType: 'open access',
    abstract:
      'Targeted memory reactivation during slow-wave sleep enhances retention of declarative memories. We review the electrophysiological signatures of hippocampal replay and their causal role in systems consolidation.',
    evidenceStrength: 3,
    scores: score(8.4, 9.0, 8.7, 7.5),
    explainer: explainer(),
  },
  {
    id: 'battery-2023',
    inDB: true,
    title: 'Solid-State Electrolytes Enabling Fast-Charging Lithium-Metal Batteries',
    authors: ['Yuki Tanaka', 'Priya Raman', 'Wei Chen'],
    authorIds: ['a-tanaka', 'a-raman', 'a-chen'],
    year: 2023,
    journal: 'Nature Energy',
    field: 'Materials Science',
    citations: 512,
    doi: '10.1038/s41560-023-01234-x',
    arxivId: null,
    link: 'https://www.nature.com/nenergy/',
    accessType: 'open access',
    abstract:
      'We report a garnet-type solid electrolyte with high ionic conductivity that suppresses dendrite formation, enabling lithium-metal anodes to charge to 80% in under 12 minutes over 1,000 cycles.',
    evidenceStrength: 2,
    scores: score(9.5, 8.9, 7.9, 6.8),
    explainer: explainer(),
  },
  {
    id: 'nlp-bias-2021',
    inDB: true,
    title: 'Measuring and Mitigating Social Bias in Large Language Models',
    authors: ['Aisha Khan', 'Marco Rossi', 'Elena Petrova'],
    authorIds: ['a-khan', 'a-rossi', 'a-petrova'],
    year: 2021,
    journal: 'ACL',
    field: 'Artificial Intelligence',
    citations: 1740,
    doi: '10.18653/v1/2021.acl-long.001',
    arxivId: '2106.01234',
    link: 'https://arxiv.org/abs/2106.01234',
    accessType: 'arXiv',
    abstract:
      'We introduce a benchmark for quantifying social bias in language model outputs and evaluate several debiasing interventions, finding trade-offs between fairness metrics and downstream task performance.',
    evidenceStrength: 3,
    scores: score(8.9, 8.2, 7.6, 7.0),
    explainer: explainer(),
  },
  {
    id: 'vaccine-2020',
    inDB: true,
    title: 'Safety and Efficacy of an mRNA Vaccine Against a Respiratory Virus',
    authors: ['Lindsey Baden', 'Hana El Sahly', 'Brandon Essink'],
    authorIds: ['a-baden', 'a-elsahly', 'a-essink'],
    year: 2020,
    journal: 'New England Journal of Medicine',
    field: 'Public Health',
    citations: 9820,
    doi: '10.1056/NEJMoa2035389',
    arxivId: null,
    link: 'https://www.nejm.org/',
    accessType: 'open access',
    abstract:
      'In a randomized, placebo-controlled phase 3 trial, an mRNA vaccine demonstrated high efficacy in preventing symptomatic disease with an acceptable safety profile across 30,000 participants.',
    evidenceStrength: 4,
    scores: score(9.1, 9.8, 9.0, 9.3),
    explainer: explainer(),
  },
  // A couple of NOT-in-DB fresh items (used to exercise upload/link flows).
  {
    id: 'fresh-upload-1',
    inDB: false,
    title: 'Emergent Coordination in Multi-Agent Reinforcement Learning',
    authors: ['Unknown Author'],
    authorIds: [],
    year: 2024,
    journal: 'Preprint',
    field: 'Machine Learning',
    citations: 0,
    doi: null,
    arxivId: null,
    link: null,
    accessType: 'arXiv',
    abstract:
      'A recently uploaded preprint exploring how cooperative behavior emerges among independent learning agents without explicit communication channels.',
    evidenceStrength: 1,
    scores: null, // insufficient metadata
    explainer: explainer(),
  },
];

export const paperById = (id) => PAPERS.find((p) => p.id === id);

export function relatedPapers(id, n = 10) {
  const p = paperById(id);
  if (!p) return [];
  const sameField = PAPERS.filter((x) => x.id !== id && x.field === p.field);
  const others = PAPERS.filter((x) => x.id !== id && x.field !== p.field);
  return [...sameField, ...others].slice(0, n);
}
