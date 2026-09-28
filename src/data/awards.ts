// Awards and scholarships. `badges` renders as medal chips.
export type Award = { year: string; title: string; body: string; badges?: string[] };

export const awards: Award[] = [
  { year: 'Jul 2025', title: 'Linux Foundation LiFT Scholar', body: 'Full scholarship for the Kubernetes (LFD259) course and certification exam.' },
  { year: 'May 2025', title: 'Google Summer of Code 2025', body: 'Selected for FOSSology in a program that accepts under 5% of applicants.' },
  { year: 'Mar 2025', title: 'Byte & Battle Hackathon', body: 'Speed programming. Won the university round, then placed 3rd against teams from across the district.', badges: ['1st · university', '3rd · district'] },
  { year: '2022–26', title: 'PEEF Scholarship', body: '80% fee scholarship from the Government of Punjab, on merit.' },
];
