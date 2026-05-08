/**
 * Canonical demo applications (~18 rows) — bundled seed for first load & “Reset demo”.
 * Dates are relative to “today” so dashboards stay realistic.
 */
export function createDemoApplicationDocs() {
  const now = new Date()
  const daysAgo = (n) => {
    const d = new Date(now)
    d.setDate(d.getDate() - n)
    return d.toISOString().slice(0, 10)
  }

  return [
    {
      company: 'Google',
      role: 'Software Engineering Intern',
      status: 'Interview',
      dateApplied: daysAgo(18),
      notes: 'HC scheduled — prep system design & graphs.',
      createdAt: daysAgo(18),
    },
    {
      company: 'Amazon',
      role: 'Frontend Engineer Intern',
      status: 'Applied',
      dateApplied: daysAgo(4),
      notes: 'OA link pending; tracking recruiter thread.',
      createdAt: daysAgo(4),
    },
    {
      company: 'Microsoft',
      role: 'Software Development Engineer Intern',
      status: 'Offer',
      dateApplied: daysAgo(52),
      notes: 'Accepted returning offer — team Azure.',
      createdAt: daysAgo(52),
    },
    {
      company: 'Meta',
      role: 'Software Engineer Intern',
      status: 'Interview',
      dateApplied: daysAgo(11),
      notes: 'Virtual onsite next week.',
      createdAt: daysAgo(11),
    },
    {
      company: 'Apple',
      role: 'ML Intern — Siri',
      status: 'Applied',
      dateApplied: daysAgo(6),
      notes: '',
      createdAt: daysAgo(6),
    },
    {
      company: 'Netflix',
      role: 'Software Engineer Intern',
      status: 'Rejected',
      dateApplied: daysAgo(38),
      notes: 'No after recruiter screen.',
      createdAt: daysAgo(38),
    },
    {
      company: 'Tesla',
      role: 'Firmware Engineering Intern',
      status: 'Applied',
      dateApplied: daysAgo(9),
      notes: 'Applied via referral.',
      createdAt: daysAgo(9),
    },
    {
      company: 'Shopify',
      role: 'Backend Developer Intern',
      status: 'Interview',
      dateApplied: daysAgo(15),
      notes: 'Live coding round completed.',
      createdAt: daysAgo(15),
    },
    {
      company: 'MongoDB',
      role: 'Developer Intern',
      status: 'Applied',
      dateApplied: daysAgo(2),
      notes: 'Greenhouse submission.',
      createdAt: daysAgo(2),
    },
    {
      company: 'Oracle',
      role: 'Cloud Infrastructure Intern',
      status: 'Rejected',
      dateApplied: daysAgo(44),
      notes: 'Automated rejection after OA.',
      createdAt: daysAgo(44),
    },
    {
      company: 'Cisco',
      role: 'Software Engineer Intern',
      status: 'Interview',
      dateApplied: daysAgo(22),
      notes: 'Waiting on hiring manager feedback.',
      createdAt: daysAgo(22),
    },
    {
      company: 'JPMorgan Chase',
      role: 'Software Engineer Program Intern',
      status: 'Applied',
      dateApplied: daysAgo(7),
      notes: 'HireVue completed.',
      createdAt: daysAgo(7),
    },
    {
      company: 'Stripe',
      role: 'Software Engineering Intern',
      status: 'Interview',
      dateApplied: daysAgo(21),
      notes: 'Take-home due Friday. Recruiter: Jordan.',
      createdAt: daysAgo(21),
    },
    {
      company: 'Notion',
      role: 'Product Engineering Intern',
      status: 'Applied',
      dateApplied: daysAgo(5),
      notes: 'Referral from alum — follow up in a week.',
      createdAt: daysAgo(5),
    },
    {
      company: 'Linear',
      role: 'Frontend Intern',
      status: 'Offer',
      dateApplied: daysAgo(45),
      notes: 'Accepted! Start June 2. Team: core product.',
      createdAt: daysAgo(45),
    },
    {
      company: 'Figma',
      role: 'Engineering Intern',
      status: 'Rejected',
      dateApplied: daysAgo(30),
      notes: 'Ghosted after OA. Moving on.',
      createdAt: daysAgo(30),
    },
    {
      company: 'Anthropic',
      role: 'Research Engineering Intern',
      status: 'Applied',
      dateApplied: daysAgo(3),
      notes: '',
      createdAt: daysAgo(3),
    },
    {
      company: 'Databricks',
      role: 'Software Engineer Intern',
      status: 'Interview',
      dateApplied: daysAgo(14),
      notes: 'Phone screen completed — waiting on virtual onsite.',
      createdAt: daysAgo(14),
    },
  ]
}
