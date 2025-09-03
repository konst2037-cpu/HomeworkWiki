const gradeLevels = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, label: i + 1 }));
const classChar = [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
    { id: "c", label: "C" },
    { id: "d", label: "D" },
    { id: "e", label: "E" },
    { id: "f", label: "F" },
];

export { gradeLevels, classChar };