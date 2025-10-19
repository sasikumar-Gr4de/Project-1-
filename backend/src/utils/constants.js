export const auth_stats = {
  total_users: 150,
  active_users: 142,
  new_users_today: 3,
  new_users_this_week: 15,
  users_by_role: {
    admin: 2,
    "data-reviewer": 5,
    annotator: 25,
    coach: 45,
    scout: 28,
    client: 45,
  },
  verification_stats: {
    verified: 135,
    unverified: 15,
  },
};

export const fileTypeMap = {
  // Images
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  ico: "image",

  // Documents
  pdf: "document",
  doc: "document",
  docx: "document",
  txt: "document",
  xls: "document",
  xlsx: "document",
  ppt: "document",
  pptx: "document",

  // Videos
  mp4: "video",
  avi: "video",
  mov: "video",
  wmv: "video",
  flv: "video",
  mkv: "video",
  webm: "video",

  // Audio
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  aac: "audio",
  flac: "audio",
  m4a: "audio",

  // Archives
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  tar: "archive",
  gz: "archive",
};

export const allowedRoles = [
  "admin",
  "data-reviewer",
  "annotator",
  "coach",
  "scout",
  "client",
];
