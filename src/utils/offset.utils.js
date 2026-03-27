export function applyDayOffset(startDateIso, startOffset = 0) {
  const date = new Date(startDateIso);
  date.setDate(date.getDate() + Number(startOffset || 0));
  return date.toISOString();
}
