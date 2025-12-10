export const getYearFromTime = (timestamp: number | string): number => {
  return new Date(parseInt(timestamp.toString())).getUTCFullYear();
};

export const formatText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (match) => match.toUpperCase())
    .replace(/\b(Of)\b/g, (match) => match.toLowerCase());
};

export const getColorByGroupId = (groupId: number): string => {
  const colors: { [key: number]: string } = {
    1: "rgba(255, 0, 0, 1)",
    2: "rgba(0, 255, 0, 1)",
    3: "rgba(0, 0, 255, 1)",
    4: "rgba(255, 165, 0, 1)",
    5: "rgba(128, 0, 128, 1)",
    6: "rgba(0, 255, 255, 1)",
    7: "rgba(255, 192, 203, 1)",
    8: "rgba(165, 42, 42, 1)",
  };
  return colors[groupId] || "rgba(255, 255, 0, 1)";
};
