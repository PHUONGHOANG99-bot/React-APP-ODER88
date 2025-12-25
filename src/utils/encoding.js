// ==================== FIX TEXT ENCODING (MOJIBAKE) ====================
// Nhiều file JSON bị lỗi kiểu: "Quáº§n dÃ i..." hoặc giá "Â¥2402"
// Nguyên nhân phổ biến: chuỗi UTF-8 bị đọc nhầm theo Latin-1 (ISO-8859-1) rồi lưu lại.
// Convert string that was (wrongly) decoded as a single-byte encoding back to bytes.
// Supports ISO-8859-1 AND Windows-1252 (needed because bytes 0x80-0x9F map to chars like ™, ƒ,...)
const WIN1252_CHAR_TO_BYTE = {
  "\u20AC": 0x80, // €
  "\u201A": 0x82, // ‚
  "\u0192": 0x83, // ƒ
  "\u201E": 0x84, // „
  "\u2026": 0x85, // …
  "\u2020": 0x86, // †
  "\u2021": 0x87, // ‡
  "\u02C6": 0x88, // ˆ
  "\u2030": 0x89, // ‰
  "\u0160": 0x8a, // Š
  "\u2039": 0x8b, // ‹
  "\u0152": 0x8c, // Œ
  "\u017D": 0x8e, // Ž
  "\u2018": 0x91, // '
  "\u2019": 0x92, // '
  "\u201C": 0x93, // "
  "\u201D": 0x94, // "
  "\u2022": 0x95, // •
  "\u2013": 0x96, // –
  "\u2014": 0x97, // —
  "\u02DC": 0x98, // ˜
  "\u2122": 0x99, // ™
  "\u0161": 0x9a, // š
  "\u203A": 0x9b, // ›
  "\u0153": 0x9c, // œ
  "\u017E": 0x9e, // ž
  "\u0178": 0x9f, // Ÿ
};

function singleByteBytesFromString(str) {
  if (typeof str !== "string") return null;
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 255) {
      bytes[i] = code;
      continue;
    }
    const mapped = WIN1252_CHAR_TO_BYTE[str[i]];
    if (mapped === undefined) return null;
    bytes[i] = mapped;
  }
  return bytes;
}

export function repairUtf8Mojibake(input) {
  if (typeof input !== "string") return input;

  // Quick checks để tránh tốn CPU trên dữ liệu sạch
  const looksBroken =
    /Ã|Â|Ä|Å|Æ|Ç|Ð|Ñ|Ø|Þ/.test(input) ||
    input.includes("áº") ||
    input.includes("á»") ||
    input.includes("\uFFFD");
  if (!looksBroken) return input;

  try {
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const bytes = singleByteBytesFromString(input);

    let decoded = "";
    if (bytes) {
      decoded = decoder.decode(bytes);
    } else {
      let out = "";
      let chunk = [];
      for (let i = 0; i < input.length; i++) {
        const code = input.charCodeAt(i);
        const mapped =
          code <= 255 ? code : WIN1252_CHAR_TO_BYTE[input[i]];
        if (mapped !== undefined) {
          chunk.push(mapped);
        } else {
          if (chunk.length) {
            out += decoder.decode(Uint8Array.from(chunk));
            chunk = [];
          }
          out += input[i];
        }
      }
      if (chunk.length) {
        out += decoder.decode(Uint8Array.from(chunk));
      }
      decoded = out;
    }

    if (!decoded || decoded === input) return input;

    // Heuristic: nếu decoded giảm "dấu hiệu lỗi" thì nhận
    const score = (s) =>
      (s.match(/Ã/g) || []).length +
      (s.match(/Â/g) || []).length +
      (s.match(/áº/g) || []).length +
      (s.match(/á»/g) || []).length +
      (s.includes("\uFFFD") ? 10 : 0);
    return score(decoded) < score(input) ? decoded : input;
  } catch (e) {
    return input;
  }
}

export function normalizeWhitespace(str) {
  if (typeof str !== "string") return str;
  // NBSP (U+00A0) hay gây ra "Â " khi bị sai encoding.
  return str
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePriceString(price) {
  if (price === undefined || price === null) return price;
  let s = normalizeWhitespace(repairUtf8Mojibake(String(price)));

  // Chỉ xoá "Â" khi nó xuất hiện như ký tự rác trước ký hiệu tiền tệ
  // (tránh xoá chữ "Â" hợp lệ trong tiếng Việt nếu có)
  s = s.replace(/Â(?=\s*[¥₫đ])/g, "");

  return s;
}

export function sanitizeProduct(product) {
  if (!product || typeof product !== "object") return product;
  return {
    ...product,
    name: normalizeWhitespace(repairUtf8Mojibake(product.name ?? "")),
    categoryName: normalizeWhitespace(
      repairUtf8Mojibake(product.categoryName ?? "")
    ),
    keywords: normalizeWhitespace(
      repairUtf8Mojibake(product.keywords ?? "")
    ),
    price: normalizePriceString(product.price ?? ""),
  };
}

