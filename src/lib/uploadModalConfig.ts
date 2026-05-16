export type UploadModalMode = "dark" | "light";
export type UploadItemStatus = "uploading" | "queued" | "error" | "complete";

export interface UploadItem {
  id: string;
  name: string;
  sizeLabel: string;
  type: "image" | "document" | "archive" | "generic";
  progress: number;
  status: UploadItemStatus;
  message?: string;
}

export interface UploadModalConfig {
  modalWidth: number;
  borderRadius: number;
  panelBackground: string;
  panelBorderColor: string;
  overlayColor: string;
  titleColor: string;
  subtitleColor: string;
  closeButtonColor: string;
  dropzoneBackground: string;
  dropzoneBorderColor: string;
  dropzoneActiveBackground: string;
  dropzoneIconBackground: string;
  dropzoneIconColor: string;
  dropzoneTitleColor: string;
  dropzoneTextColor: string;
  browseButtonBackground: string;
  browseButtonTextColor: string;
  sectionLabelColor: string;
  clearActionColor: string;
  itemBackground: string;
  itemBorderColor: string;
  itemIconBackground: string;
  itemIconColor: string;
  itemTitleColor: string;
  itemMetaColor: string;
  progressTrackColor: string;
  progressFillColor: string;
  errorBackground: string;
  errorBorderColor: string;
  errorTextColor: string;
  footerBackground: string;
  footerTextColor: string;
  cancelButtonTextColor: string;
  cancelButtonBackground: string;
  actionButtonBackground: string;
  actionButtonTextColor: string;
  quotaUsed: number;
  quotaTotal: number;
  animateOpen: boolean;
  showShadow: boolean;
  pendingUploads: UploadItem[];
}

const demoUploads: UploadItem[] = [
  {
    id: "1",
    name: "Campaign_Banner_Final.jpg",
    sizeLabel: "8.4 MB",
    type: "image",
    progress: 65,
    status: "uploading",
    message: "65% completed",
  },
  {
    id: "2",
    name: "Project_Brief_2024.docx",
    sizeLabel: "1.2 MB",
    type: "document",
    progress: 0,
    status: "queued",
    message: "Waiting...",
  },
  {
    id: "3",
    name: "Database_Backup_Nov.zip",
    sizeLabel: "22.1 MB",
    type: "archive",
    progress: 0,
    status: "error",
    message: "Connection timeout. Please retry.",
  },
];

export const darkUploadModalConfig: UploadModalConfig = {
  modalWidth: 640,
  borderRadius: 24,
  panelBackground: "#1c1c22",
  panelBorderColor: "#2a2a38",
  overlayColor: "rgba(6, 6, 10, 0.72)",
  titleColor: "#f0f0f5",
  subtitleColor: "#9090a8",
  closeButtonColor: "#c0c0d8",
  dropzoneBackground: "#16161b",
  dropzoneBorderColor: "#3a3a4d",
  dropzoneActiveBackground: "#1f1a38",
  dropzoneIconBackground: "rgba(124, 108, 252, 0.12)",
  dropzoneIconColor: "#9d91fd",
  dropzoneTitleColor: "#f0f0f5",
  dropzoneTextColor: "#9090a8",
  browseButtonBackground: "#242430",
  browseButtonTextColor: "#f0f0f5",
  sectionLabelColor: "#9090a8",
  clearActionColor: "#9d91fd",
  itemBackground: "#17171d",
  itemBorderColor: "#2f2f3d",
  itemIconBackground: "#242430",
  itemIconColor: "#c0c0d8",
  itemTitleColor: "#f0f0f5",
  itemMetaColor: "#9090a8",
  progressTrackColor: "#2a2a38",
  progressFillColor: "#7c6cfc",
  errorBackground: "rgba(248, 113, 113, 0.08)",
  errorBorderColor: "rgba(248, 113, 113, 0.24)",
  errorTextColor: "#fca5a5",
  footerBackground: "#18181e",
  footerTextColor: "#9090a8",
  cancelButtonTextColor: "#c0c0d8",
  cancelButtonBackground: "#242430",
  actionButtonBackground: "#7c6cfc",
  actionButtonTextColor: "#ffffff",
  quotaUsed: 42.5,
  quotaTotal: 50,
  animateOpen: true,
  showShadow: true,
  pendingUploads: demoUploads,
};

export const lightUploadModalConfig: UploadModalConfig = {
  modalWidth: 640,
  borderRadius: 24,
  panelBackground: "#ffffff",
  panelBorderColor: "#d4d4e0",
  overlayColor: "rgba(14, 18, 32, 0.2)",
  titleColor: "#1a1a2e",
  subtitleColor: "#6f6f86",
  closeButtonColor: "#4a4a60",
  dropzoneBackground: "#fafafe",
  dropzoneBorderColor: "#d4d4e0",
  dropzoneActiveBackground: "#f1efff",
  dropzoneIconBackground: "rgba(108, 92, 231, 0.12)",
  dropzoneIconColor: "#6c5ce7",
  dropzoneTitleColor: "#1a1a2e",
  dropzoneTextColor: "#6f6f86",
  browseButtonBackground: "#f4f4f8",
  browseButtonTextColor: "#1a1a2e",
  sectionLabelColor: "#6f6f86",
  clearActionColor: "#6c5ce7",
  itemBackground: "#ffffff",
  itemBorderColor: "#e2e2ec",
  itemIconBackground: "#f4f4f8",
  itemIconColor: "#4f4f68",
  itemTitleColor: "#1a1a2e",
  itemMetaColor: "#6f6f86",
  progressTrackColor: "#ececf4",
  progressFillColor: "#6c5ce7",
  errorBackground: "rgba(248, 113, 113, 0.08)",
  errorBorderColor: "rgba(248, 113, 113, 0.24)",
  errorTextColor: "#dc2626",
  footerBackground: "#fafafe",
  footerTextColor: "#6f6f86",
  cancelButtonTextColor: "#4a4a60",
  cancelButtonBackground: "#f4f4f8",
  actionButtonBackground: "#6c5ce7",
  actionButtonTextColor: "#ffffff",
  quotaUsed: 42.5,
  quotaTotal: 50,
  animateOpen: true,
  showShadow: true,
  pendingUploads: demoUploads,
};

export const uploadModalModePresets: Record<
  UploadModalMode,
  UploadModalConfig
> = {
  dark: darkUploadModalConfig,
  light: lightUploadModalConfig,
};

export const defaultUploadModalConfig = darkUploadModalConfig;
