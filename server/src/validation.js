function invalid(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function validateText(value, label, maxLength, required = false) {
  if (value == null && !required) return null;
  if (typeof value !== 'string') throw invalid(`${label} must be text.`);
  const text = value.trim();
  if (required && !text) throw invalid(`${label} is required.`);
  if (text.length > maxLength) throw invalid(`${label} must be at most ${maxLength} characters.`);
  return text || null;
}

function positiveId(value, label) {
  const validType = typeof value === 'number' || typeof value === 'string';
  const id = validType && /^\d+$/.test(value) ? Number(value) : 0;
  if (id < 1 || id > 2147483647) {
    throw invalid(`${label} must be a positive integer.`);
  }
  return id;
}

module.exports = { invalid, validateText, positiveId };
