import type { ChatFile } from "@/entities/chat/types";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageFile(file?: ChatFile): boolean {
  if (!file) return false;
  return (
    file.fileType === 'image' ||
    file.mimeType?.startsWith('image/') ||
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
  );
}

export function isDocumentFile(file?: ChatFile): boolean {
  if (!file) return false;
  return (
    file.fileType === 'document' ||
    file.mimeType?.startsWith('application/') ||
    /\.(pdf|doc|docx|txt|xls|xlsx)$/i.test(file.name || '')
  );
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMessageWithLinks(text: string, linkClassName?: string): React.ReactNode {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  urlRegex.lastIndex = 0;

  while ((match = urlRegex.exec(text)) !== null) {
    if (lastIndex < match.index) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
