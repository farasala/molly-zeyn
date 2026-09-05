/* Level registry. Add a level here + a courses/<id>.js file that sets window.EF_COURSES[id]. */
window.EF_LEVELS = [
  { id: 'elementary',   name: 'Elementary',        cefr: 'A1–A2', status: 'ready',    units: 12, blurb: 'Foundations: be, present simple, past simple, everyday topics.' },
  { id: 'pre-int',      name: 'Pre-Intermediate',  cefr: 'A2–B1', status: 'planned',  units: 12, blurb: 'Tense contrast, modals, future forms, longer speaking turns.' },
  { id: 'intermediate', name: 'Intermediate',      cefr: 'B1–B2', status: 'planned',  units: 12, blurb: 'Perfect aspect, conditionals, opinion language.' },
  { id: 'upper-int',    name: 'Upper-Intermediate',cefr: 'B2',    status: 'planned',  units: 12, blurb: 'Nuance, hypotheticals, discourse markers.' },
  { id: 'advanced',     name: 'Advanced',          cefr: 'C1',    status: 'planned',  units: 12, blurb: 'Register, idiom, precision and fluency work.' },
  { id: 'ielts',        name: 'IELTS Course',      cefr: 'B1–C1', status: 'planned',  units: 8,  blurb: 'Four papers, band descriptors, timed practice.' }
];
window.EF_COURSES = window.EF_COURSES || {};
