export interface FilePreview {
    type: 'Image' | 'Video' | 'Document';
  file: File;
  url: string;
  error?: string | null;
}
