"use client";

import type { RegisterSectionId } from "@/features/register/constants";
import { REGISTER_SECTIONS } from "@/features/register/constants";
import { SidebarItem } from "@/lib/ui";

type RegisterSidebarProps = {
  activeSection: RegisterSectionId;
  completeMap: Partial<Record<RegisterSectionId, boolean>>;
  errorMap: Partial<Record<RegisterSectionId, boolean>>;
  onSelect: (section: RegisterSectionId) => void;
};

export function RegisterSidebar({
  activeSection,
  completeMap,
  errorMap,
  onSelect,
}: RegisterSidebarProps) {
  return (
    <aside className="space-y-2">
      {REGISTER_SECTIONS.map((section) => (
        <SidebarItem
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          active={activeSection === section.id}
          complete={Boolean(completeMap[section.id])}
          hasError={Boolean(errorMap[section.id])}
          onClick={() => onSelect(section.id)}
        />
      ))}
    </aside>
  );
}
