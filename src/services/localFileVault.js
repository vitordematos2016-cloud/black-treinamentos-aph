/**
 * ============================================================================
 * COFRE LOCAL DE ARQUIVOS (IndexedDB) — BOLETOS PDF & ATESTADOS (FOTOS/PDFs)
 * ============================================================================
 * Por que IndexedDB com ArrayBuffer?
 * - `localStorage` tem limite pequeno (~5MB) e URLs `blob:` morrem ao trocar de aba.
 * - Salvar o conteúdo binário (`ArrayBuffer`) + MIME type no IndexedDB garante
 *   compatibilidade 100% em qualquer navegador, mesmo após limpar `<input type="file">`,
 *   recarregar a página ou alternar entre Painel Admin e Portal do Aluno.
 * - Aceita PDF, PNG, JPG, JPEG, WEBP e qualquer documento de até dezenas de MB.
 * - Quando conectarmos o Supabase Storage, basta trocar estas 3 funções pelo upload
 *   no bucket do Supabase — nenhuma tela React precisa mudar!
 */

const DB_NAME = 'black_aph_file_vault_v1';
const STORE_NAME = 'files';
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

function detectMimeFromMagicBytes(buffer) {
  const bytes = new Uint8Array(buffer.slice(0, 12));
  // %PDF-
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'application/pdf';
  }
  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }
  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  // WEBP (RIFF....WEBP)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  return '';
}

function openVaultDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function inferMimeType(name = '', rawType = '') {
  if (rawType) return rawType;
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

/**
 * Salva os bytes reais (ArrayBuffer) de um File/Blob (PDF ou Imagem) no IndexedDB.
 */
export async function saveFileToVault(fileId, file) {
  if (!file || file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Arquivo excede o limite seguro de 15 MB.');
  }
  // Lê os bytes imediatamente antes de qualquer reset do input file
  const buffer = await file.arrayBuffer();
  const detectedMime = detectMimeFromMagicBytes(buffer);
  const declaredMime = inferMimeType(file.name, file.type);
  const mimeType = detectedMime || declaredMime;
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error('Formato não permitido. Envie apenas PDF, PNG, JPG ou WEBP.');
  }
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(
      {
        buffer,
        name: file.name || 'arquivo',
        type: mimeType,
        size: file.size || buffer.byteLength || 0,
        savedAt: Date.now(),
      },
      fileId
    );
    tx.oncomplete = () => resolve(fileId);
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Recupera os bytes do IndexedDB, recria um Blob fresco com MIME correto
 * e devolve uma Object URL válida nesta aba!
 */
export async function loadFileUrlFromVault(fileId) {
  if (!fileId) return null;
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(fileId);
    req.onsuccess = () => {
      const record = req.result;
      if (!record) {
        resolve(null);
        return;
      }
      const mimeType = inferMimeType(record.name, record.type || record.blob?.type);
      const blob = record.buffer
        ? new Blob([record.buffer], { type: mimeType })
        : record.blob
        ? new Blob([record.blob], { type: mimeType })
        : null;
      if (!blob) {
        resolve(null);
        return;
      }
      const objectUrl = URL.createObjectURL(blob);
      resolve({
        url: objectUrl,
        name: record.name,
        type: mimeType,
      });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteFileFromVault(fileId) {
  if (!fileId) return;
  try {
    const db = await openVaultDB();
    await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(fileId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignora
  }
}
