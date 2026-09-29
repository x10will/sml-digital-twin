// Runtime reader for the optional Producer twin-lineage asset.
export const TWIN_LINEAGE_SCHEMA = 'dt-twin-lineage/1';

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Parse and validate a lineage index. Bad optional data degrades to no index. */
export function loadTwinLineageIndex(text, warn = console.warn) {
  let document;
  try {
    document = JSON.parse(text);
  } catch (error) {
    warn(`[dt] twin-lineage index is invalid JSON: ${error.message}`);
    return null;
  }
  if (!isRecord(document) || document.schema !== TWIN_LINEAGE_SCHEMA
      || !isRecord(document.twins)) {
    warn(`[dt] twin-lineage index has an unsupported or malformed schema (expected ${TWIN_LINEAGE_SCHEMA})`);
    return null;
  }
  return document;
}

/** Return the first exact candidate key found in a validated index. */
export function resolveTwinLineageEntry(index, candidateIds) {
  if (!index || !isRecord(index.twins) || !Array.isArray(candidateIds)) return null;
  for (const twinId of candidateIds) {
    if (typeof twinId !== 'string' || twinId === '') continue;
    const entry = index.twins[twinId];
    if (isRecord(entry)) return { twinId, entry };
  }
  return null;
}
