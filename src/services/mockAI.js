// Swappable AI service. Every function is async with a short delay so the UI
// exercises real loading states. Replace bodies with real API calls later.
import { PAPERS } from '../data/papers.js';
import { EXPLAINER_SECTIONS } from '../data/fields.js';

const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms));

export async function translatePaper(paper) {
  await delay(1100);
  return paper.explainer;
}

export async function relevel(sectionText, level) {
  await delay(500);
  return sectionText[level] ?? Object.values(sectionText)[0];
}

export async function askAI(question, context = '') {
  await delay(900);
  const src = Math.floor(Math.random() * 8) + 1;
  const ctx = context ? ` Regarding “${context.slice(0, 60)}${context.length > 60 ? '…' : ''}”: ` : ' ';
  return {
    text:
      `${ctx}Based on the paper, ${lower(question)} comes down to the methodology the authors chose and how they controlled for confounds. ` +
      `In short: the evidence supports the main claim, with the usual caveats about sample size and external validity.`,
    source: `Source: p.${src}`,
  };
}

export async function searchPapers(query, filters = {}) {
  await delay(650);
  let out = PAPERS.filter((p) => p.inDB);
  const q = query.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.field.toLowerCase().includes(q) ||
        p.authors.join(' ').toLowerCase().includes(q)
    );
    if (out.length === 0) out = PAPERS.filter((p) => p.inDB); // fall back so results are never empty in demo
  }
  if (filters.field) out = out.filter((p) => p.field === filters.field);
  if (filters.minCitations) out = out.filter((p) => p.citations >= filters.minCitations);
  if (filters.yearFrom) out = out.filter((p) => p.year >= filters.yearFrom);
  if (filters.yearTo) out = out.filter((p) => p.year <= filters.yearTo);
  if (filters.access) out = out.filter((p) => p.accessType === filters.access);
  return out;
}

export async function needsClarification(query) {
  await delay(300);
  // "Unclear" if very short / vague.
  return query.trim().split(/\s+/).length < 2;
}

export async function compareSections(a, b) {
  await delay(1200);
  const rows = EXPLAINER_SECTIONS.map((section) => {
    const agree = Math.random() > 0.4;
    return {
      section,
      left: a.explainer[section]['Domain Expert'],
      right: b.explainer[section]['Domain Expert'],
      agreement: agree ? 'agree' : Math.random() > 0.5 ? 'differ' : 'partial',
    };
  });
  const similarity = +(
    (rows.filter((r) => r.agreement === 'agree').length / rows.length) * 10
  ).toFixed(1);
  return { rows, similarity };
}

export async function generateProjectOverview(roughIdeas, category) {
  await delay(1400);
  const seed = roughIdeas?.trim() || 'the proposed research direction';
  return {
    title: titleCase(seed.split(/[.\n]/)[0].slice(0, 60)) || 'Untitled Research Project',
    rationale:
      `This project investigates ${lower(seed)}. Existing work leaves a gap in how the mechanism generalizes across settings, ` +
      `and a focused study could resolve competing accounts in the ${category || 'field'} literature.`,
    hypothesis:
      `We hypothesize that the effect described in the rough notes holds under controlled conditions and is mediated by an identifiable mechanism.`,
    solution:
      `The solution is a staged research program. First, we establish a baseline using existing datasets; ` +
      `second, we run a targeted intervention to isolate the mechanism; third, we validate against an independent cohort. ` +
      `This fits the problem because it directly tests the causal claim rather than a correlational proxy. ` +
      `Supporting research from adjacent fields suggests the mechanism is plausible. What is novel is the combination of ` +
      `methods not previously applied together here. The main challenge is recruiting a sufficiently powered sample and ` +
      `controlling for known confounds.`,
  };
}

export async function generateFollowups() {
  await delay(600);
  return [
    'What is the primary goal of this project?',
    'What population or system are you studying?',
    'Which methodological angle do you prefer?',
  ];
}

export async function generateIdeas(field) {
  await delay(1500);
  const base = field || 'your area';
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `idea-${i}`,
    title: `Idea ${i + 1}: An untried angle in ${base}`,
    gap: `Existing work covers the common cases but leaves ${['underserved populations', 'rare conditions', 'cross-domain transfer', 'long-horizon effects', 'edge deployments', 'low-resource settings'][i]} understudied.`,
    existing: 'Prior studies establish the baseline but stop short of a controlled test.',
    solutions: 'Combine an established method with a dataset it has not been applied to; run a focused intervention.',
    why: 'High potential impact with a tractable scope for a single research program.',
  }));
}

export async function generateSolutionDirections(idea) {
  await delay(1200);
  return Array.from({ length: 4 }).map((_, i) => ({
    id: `sol-${i}`,
    approach: `Approach ${i + 1} for “${idea.title}”`,
    why: 'Works because it isolates the mechanism while controlling for the main confound.',
    support: 'Supported by adjacent findings in the literature.',
    untried: 'Not previously applied to this exact population.',
    novelty: 'Novel combination of method and setting.',
  }));
}

export async function generatePaper(sections, sources) {
  await delay(1800);
  const cite = (i) => `[${(i % Math.max(sources.length, 1)) + 1}]`;
  return sections.map((s, i) => ({
    section: s,
    text:
      `${s}. This section is written from the selected sources only ${cite(i)}. ` +
      `The evidence indicates a consistent effect ${cite(i + 1)}, though one source reports a contested result ${cite(i + 2)}. ` +
      `Further work should confirm the mechanism under varied conditions.`,
    flags:
      s === 'Introduction'
        ? [{ sentence: 2, why: 'This claim asserts a prevalence figure without a citation.' }]
        : [],
  }));
}

export async function evaluateCredibility() {
  await delay(900);
  return true; // signals "scored" — actual numbers come from the paper record
}

// ---- Literature rigor: supporting/contradicting detector ----
// Contradictions are documented with both sides retained, never silently
// resolved (adopted from OpenScience's literature-review pipeline).
export async function detectStances(project) {
  await delay(1000);
  const refs = project.references || [];
  const contested =
    refs.length >= 2
      ? [
          {
            claim: 'The central mechanism transfers across settings without adaptation.',
            supports: refs.filter((r) => r.stance === 'supports').length,
            contradicts: refs.filter((r) => r.stance === 'contradicts').length,
            note: 'Both sides retained — contradictions are documented, not resolved.',
          },
        ]
      : [];
  return { contested };
}

// ---- Literature rigor: gap detector ----
export async function detectGaps(project) {
  await delay(1100);
  const topic = project.overview?.title || 'this area';
  return [
    {
      id: 'gap-1',
      title: `No controlled comparison across populations in ${topic.toLowerCase()}`,
      why: 'Existing references study single settings; none test the mechanism across typologically distinct groups.',
      basis: `${(project.references || []).length} project references screened`,
    },
    {
      id: 'gap-2',
      title: 'Long-horizon effects are unstudied',
      why: 'All screened studies measure immediate outcomes; none follow up beyond the initial window.',
      basis: 'Cross-checked against related work in the field',
    },
    {
      id: 'gap-3',
      title: 'An established method from an adjacent field is unapplied here',
      why: 'Methods with strong results in adjacent literature have not been tried on this problem.',
      basis: 'Method-transfer scan',
    },
  ];
}

// ---- Advisory review agent ----
// Adopted from OpenScience's critique sub-agent, reframed as advisory: it
// surfaces findings the author can act on or dismiss — it never blocks.
export async function reviewDraft(generated, sources) {
  await delay(1300);
  const findings = [];
  let id = 0;
  const unverified = sources.filter((p) => !(p.doi || p.arxivId));
  for (const p of unverified) {
    findings.push({
      id: `f${id++}`,
      category: 'Citation integrity',
      severity: 'warning',
      text: `“${p.title.slice(0, 48)}…” could not be verified against DOI/arXiv records.`,
      where: 'References',
    });
  }
  for (const g of generated || []) {
    for (const f of g.flags || []) {
      findings.push({
        id: `f${id++}`,
        category: 'Claim verification',
        severity: 'warning',
        text: `${g.section}: ${f.why}`,
        where: g.section,
      });
    }
  }
  findings.push(
    {
      id: `f${id++}`,
      category: 'Claim verification',
      severity: 'warning',
      text: 'Discussion: a comparative claim (“more effective than prior approaches”) has no baseline citation.',
      where: 'Discussion',
    },
    {
      id: `f${id++}`,
      category: 'Statistical validity',
      severity: 'observation',
      text: 'Results reports point estimates without confidence intervals; consider adding uncertainty.',
      where: 'Results',
    },
    {
      id: `f${id++}`,
      category: 'Logical consistency',
      severity: 'observation',
      text: 'Conclusion generalizes beyond the population described in Methodology; consider scoping the claim.',
      where: 'Conclusion',
    }
  );
  const passed = [
    'Section structure is complete and internally ordered',
    'In-text citations resolve to the numbered source list',
    'No fabricated quantities detected in generated text',
  ];
  return { findings, passed };
}

// ---- Artifact-first project chat ----
// The chatbot treats the project's documents as its working memory: replies
// are grounded in artifacts and can write back to them.
export async function projectChatReply(project, text) {
  await delay(900);
  const refs = project.references || [];
  const grounded = ['Background', `References (${refs.length})`];
  if (project.notes) grounded.push('Notes');

  const lower = text.toLowerCase();

  // "note:" or "add a note" → writes to the project's Notes artifact.
  const noteMatch = text.match(/note[:\s]+(.+)/i);
  if (lower.includes('note') && noteMatch) {
    return {
      text: `Noted. I've appended that to the project's Notes so it survives this conversation.`,
      grounded,
      action: { type: 'note', value: noteMatch[1].trim() },
    };
  }

  // hypothesis talk → proposes an edit to the Background artifact.
  if (lower.includes('hypothes')) {
    return {
      text:
        `Your current hypothesis is: “${project.overview?.hypothesis}”. ` +
        `Based on the ${refs.length} references (${refs.filter((r) => r.stance === 'contradicts').length} contradicting), ` +
        `I'd suggest narrowing it to the population your strongest Tier 1 sources actually cover. Want me to apply that to the Background?`,
      grounded,
      proposal: {
        type: 'hypothesis',
        value: `${project.overview?.hypothesis} — scoped to the populations covered by Tier 1 evidence.`,
      },
    };
  }

  return {
    text:
      `Working from the project's artifacts: the Background frames “${project.overview?.title}”, ` +
      `and the reference list currently holds ${refs.length} papers ` +
      `(${refs.filter((r) => r.stance === 'supports').length} supporting, ${refs.filter((r) => r.stance === 'contradicts').length} contradicting). ` +
      `${lower.includes('gap') ? 'The gap detector suggests the cross-population comparison is your strongest opening.' : 'Ask about the hypothesis, gaps, or say “note: …” to write to the project memory.'}`,
    grounded,
  };
}

function lower(s) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}
function titleCase(s) {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));
}
