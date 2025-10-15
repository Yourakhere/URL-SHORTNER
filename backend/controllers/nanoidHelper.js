async function generateNanoId(length = 8) {
  const { nanoid } = await import('nanoid');
  return nanoid(length);
}

module.exports = { generateNanoId };
