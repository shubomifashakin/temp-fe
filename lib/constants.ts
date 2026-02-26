export const MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
};

export const MAX_FILE_SIZE_MB = 150;
export const MAX_FILE_SIZE_IN_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const ALLOWED_EXTENSIONS = [
  // images
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",

  // documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",

  // audio
  "mp3",
  "wav",
  "ogg",

  // video
  "mp4",
  "mov",
];
