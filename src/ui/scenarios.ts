export const scenarios = [
  {
    id: 'D',
    group: 'Address transformation problems',
    name: 'Building number and suite placed in Street Name',
    crossBorder: true,
  },
  {
    id: 'C',
    group: 'Address transformation problems',
    name: 'Structured address merged into one line',
    crossBorder: true,
  },
  {
    id: 'E',
    group: 'Address transformation problems',
    name: 'Party name shortened during conversion',
    crossBorder: true,
  },
  {
    id: 'F',
    group: 'Address transformation problems',
    name: 'Suite information disappears',
    crossBorder: true,
  },
  {
    id: 'J',
    group: 'Address transformation problems',
    name: 'Target contains a value with no identified source',
    crossBorder: true,
  },
  {
    id: 'A',
    group: 'Real message conversion',
    name: 'Clean MT103 → pacs.008 conversion',
    crossBorder: undefined,
  },
  {
    id: 'P1',
    group: 'Address-guidance examples',
    name: 'Fully structured address',
    crossBorder: true,
  },
  {
    id: 'P2',
    group: 'Address-guidance examples',
    name: 'Hybrid address — structured location + free text',
    crossBorder: true,
  },
  {
    id: 'P3',
    group: 'Address-guidance examples',
    name: 'Hybrid address missing town',
    crossBorder: true,
  },
  {
    id: 'P4',
    group: 'Address-guidance examples',
    name: 'Hybrid address with too many address lines',
    crossBorder: true,
  },
  {
    id: 'P5',
    group: 'Address-guidance examples',
    name: 'Town repeated in an address line',
    crossBorder: true,
  },
] as const;
