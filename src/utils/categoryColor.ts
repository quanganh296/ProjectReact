export const getCategoryColor = (category: string): string => {
  switch (category.trim()) {
    case "Daily Journal": return "purple";
    case "Work & Career": return "cyan";
    case "Personal Thoughts": return "green";
    case "Emotions & Feelings": return "magenta";
    default: return "blue";
  }
};