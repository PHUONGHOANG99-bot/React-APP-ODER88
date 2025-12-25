// ==================== SEARCH UTILITIES ====================

// Hàm bỏ dấu tiếng Việt
export function removeVietnameseTones(str) {
  if (!str) return "";
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}

// Hàm tạo từ khóa tìm kiếm cho sản phẩm
export function getProductSearchKeywords(product) {
  if (!product) return "";

  let keywords = [];

  // Thêm category và categoryName
  if (product.category) keywords.push(product.category);
  if (product.categoryName) keywords.push(product.categoryName);
  if (product.keywords) keywords.push(product.keywords);

  // Keywords theo category
  const categoryKeywords = {
    "quan-dai-nu": [
      "quần",
      "quan",
      "dài",
      "dai",
      "nữ",
      "nu",
      "quần dài",
      "quan dai",
      "quần dài nữ",
      "quan dai nu",
      "pants",
      "trousers",
    ],
    "quan-nam": ["quần", "quan", "nam", "quần nam", "quan nam", "pants"],
    "ao-nam": [
      "áo",
      "ao",
      "nam",
      "áo nam",
      "ao nam",
      "shirt",
      "tshirt",
      "t-shirt",
    ],
    "ao-nu": [
      "áo",
      "ao",
      "nữ",
      "nu",
      "áo nữ",
      "ao nu",
      "shirt",
      "blouse",
    ],
    "giay-nam": [
      "giày",
      "giay",
      "nam",
      "giày nam",
      "giay nam",
      "shoes",
      "sneakers",
    ],
    "giay-nu": [
      "giày",
      "giay",
      "nữ",
      "nu",
      "giày nữ",
      "giay nu",
      "shoes",
      "heels",
    ],
    vay: [
      "váy",
      "vay",
      "đầm",
      "dam",
      "váy đầm",
      "vay dam",
      "dress",
      "skirt",
    ],
    "chan-vay": [
      "chân",
      "chan",
      "váy",
      "vay",
      "chân váy",
      "chan vay",
      "skirt",
      "mini skirt",
      "maxi skirt",
    ],
    "set-do-nu": [
      "set",
      "đồ",
      "do",
      "nữ",
      "nu",
      "set đồ",
      "set do",
      "bộ",
      "bo",
      "outfit",
      "combo",
    ],
  };

  const relatedKeywords = categoryKeywords[product.category] || [];
  keywords.push(...relatedKeywords);

  // Tách từ trong tên sản phẩm
  const nameWords = (product.name || "").toLowerCase().split(/\s+/);
  keywords.push(...nameWords);
  keywords.push(...nameWords.map((w) => removeVietnameseTones(w)));

  // Loại bỏ các từ quá ngắn và trùng lặp
  const uniqueKeywords = [...new Set(keywords)]
    .filter((k) => k && k.length > 1)
    .join(" ");

  return uniqueKeywords.toLowerCase();
}

// Hàm kiểm tra sản phẩm có khớp với từ khóa tìm kiếm không
export function productMatchesSearch(product, searchQuery) {
  if (!searchQuery) return true;

  const query = removeVietnameseTones(searchQuery.toLowerCase().trim());
  const searchKeywords = getProductSearchKeywords(product);

  // Tìm kiếm trong tất cả từ khóa
  if (searchKeywords.includes(query)) return true;

  // Tìm kiếm từng từ trong query
  const queryWords = query.split(/\s+/).filter((w) => w.length > 1);
  if (queryWords.length > 0) {
    const allWordsMatch = queryWords.every((word) =>
      searchKeywords.includes(word)
    );
    if (allWordsMatch) return true;
  }

  // Tìm kiếm một phần của từ
  if (query.length >= 2) {
    const searchableText = searchKeywords;
    if (searchableText.includes(query)) return true;
  }

  return false;
}

