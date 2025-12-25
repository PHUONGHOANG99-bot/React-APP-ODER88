// Gallery utilities

// Helper function to detect if URL is YouTube
export function isYouTubeUrl(url) {
  if (!url) return false;
  return /youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=/.test(url);
}

// Helper function to convert YouTube URL to embed format with autoplay
export function convertToYouTubeEmbed(url, autoplay = true, mute = false) {
  if (!url) return url;

  // Extract video ID from various YouTube URL formats
  let videoId = null;

  // youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embedMatch) {
    videoId = embedMatch[1];
  }
  // youtu.be/VIDEO_ID
  else {
    const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }
    // youtube.com/watch?v=VIDEO_ID
    else {
      const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
      if (watchMatch) {
        videoId = watchMatch[1];
      }
    }
  }

  if (videoId) {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: mute ? "1" : "0",
      rel: "0",
      modestbranding: "1",
      controls: "1",
      fs: "1",
      cc_load_policy: "0",
      iv_load_policy: "3",
      playsinline: "1",
      enablejsapi: "1",
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  return url;
}

// Get product images
export function getProductImages(product) {
  if (!product) return [];

  // Nếu có mảng images, dùng nó
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  // Nếu không có mảng images, chỉ trả về ảnh chính
  if (product.image) {
    return [product.image];
  }

  return [];
}

