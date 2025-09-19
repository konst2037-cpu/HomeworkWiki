const gradeLevels = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: i + 1,
}));
const classChar = [
  { id: 1, label: "A" },
  { id: 2, label: "B" },
  { id: 3, label: "C" },
  { id: 4, label: "D" },
  { id: 5, label: "E" },
  { id: 6, label: "F" },
];

export { gradeLevels, classChar };
