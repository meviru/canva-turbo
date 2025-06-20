import { Separator } from "@/components/ui/separator";
import {
  IconBackground,
  IconClipboardTypography,
  IconClipboardTypographyFilled,
  IconCloud,
  IconCloudCheck,
  IconCloudUpload,
  IconDownload,
  IconEye,
  IconFrame,
  IconMessageCircle,
  IconPencil,
  IconPhoto,
  IconPhotoFilled,
  IconSettings,
  IconSettingsFilled,
  IconSortAscendingShapes,
  IconSortAscendingShapesFilled,
  IconSparkles,
  IconTable,
  IconTableFilled,
  IconTrash
} from "@tabler/icons-react";

export const fileMenuItems = [
  {
    name: "Create new design",
    icon: IconFrame,
    shortcut: "Ctrl+N",
  },
  {
    name: "Upload files",
    icon: IconCloudUpload,
  },
  {
    component: Separator,
  },
  {
    name: "Settings",
    icon: IconSettings,
  },
  {
    component: Separator,
  },
  {
    name: "Save",
    icon: IconCloudCheck,
    shortcut: "Ctrl+S",
  },
  {
    name: "Download",
    icon: IconDownload,
  },
  {
    name: "Move to trash",
    icon: IconTrash,
  },
];

export const editMenuItems = [
  {
    name: "Editing",
    description: "Make changes",
    icon: IconPencil,
  },
  {
    name: "Commenting",
    description: "Add feedback",
    icon: IconMessageCircle,
  },
  {
    name: "Viewing",
    description: "Read-only",
    icon: IconEye,
  },
];

export const sideBarMenu = [
  {
    name: "Designs",
    icon: IconTable,
    iconFilled: IconTableFilled,
    iconColor: "#13a3b5",
  },
  {
    name: "Elements",
    icon: IconSortAscendingShapes,
    iconFilled: IconSortAscendingShapesFilled,
    iconColor: "#4a53fa",
  },
  {
    name: "Text",
    icon: IconClipboardTypography,
    iconFilled: IconClipboardTypographyFilled,
    iconColor: "#992bff",
  },
  {
    name: "Uploads",
    icon: IconCloudUpload,
    iconFilled: IconCloud,
    iconColor: "#ff6105",
  },
  {
    name: "Photos",
    icon: IconPhoto,
    iconFilled: IconPhotoFilled,
    iconColor: "#0ba84a",
  },
  {
    name: "Background",
    icon: IconBackground,
    iconFilled: IconBackground,
    iconColor: "#ff3b4b",
  },
  {
    name: "AI",
    icon: IconSparkles,
    iconFilled: IconSparkles,
    iconColor: "#ff6105",
  },
  {
    name: "Settings",
    icon: IconSettings,
    iconFilled: IconSettingsFilled,
    iconColor: "#138eff",
  },
];
