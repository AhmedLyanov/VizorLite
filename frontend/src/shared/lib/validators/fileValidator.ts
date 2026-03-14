export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      error: "Файл не выбран",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Файл слишком большой. Максимум 5MB",
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Поддерживаются только JPEG, PNG, GIF, WEBP",
    };
  }

  return {
    valid: true,
  };
}
