import {
  IconCreditCard,
  IconCreditCardFilled,
  IconFolder,
  IconFolderFilled,
  IconHome,
  IconHomeFilled,
  IconLayout2,
  IconLayout2Filled,
} from "@tabler/icons-react";

export const workspaceMenuItems = [
  {
    name: "Home",
    icon: IconHome,
    iconFilled: IconHomeFilled,
    path: "/workspace",
  },
  {
    name: "Projects",
    icon: IconFolder,
    iconFilled: IconFolderFilled,
    path: "/workspace/projects",
  },
  {
    name: "Templates",
    icon: IconLayout2,
    iconFilled: IconLayout2Filled,
    path: "/workspace/templates",
  },
  {
    name: "Billing",
    icon: IconCreditCard,
    iconFilled: IconCreditCardFilled,
    path: "/workspace/billing",
  },
];
