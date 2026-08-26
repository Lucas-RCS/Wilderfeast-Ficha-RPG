export const formatRelativeTime = (isoString?: string) => {
  if (!isoString) return "Recentemente";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 2) return "Atualizado agora mesmo";
    if (diffMin < 60) return `Atualizado há ${diffMin} min`;
    if (diffHours === 1) return "Atualizado há 1 hora";
    if (diffHours < 24) return `Atualizado há ${diffHours} horas`;
    if (diffDays === 1) return "Atualizado ontem";
    return `Atualizado há ${diffDays} dias`;
  } catch {
    return "Recentemente";
  }
};
