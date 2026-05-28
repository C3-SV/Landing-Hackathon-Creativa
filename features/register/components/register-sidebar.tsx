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
    <aside className="space-y-2 rounded-3xl border border-brand-electric/40 bg-brand-surface/70 p-3 shadow-[0_0_0_1px_rgba(26,130,255,0.12)] lg:sticky lg:top-6 lg:self-start">
      {REGISTER_SECTIONS.map((section) => (
        <SidebarItem
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          active={activeSection === section.id}
          complete={Boolean(completeMap[section.id]) && !Boolean(errorMap[section.id])}
          hasError={Boolean(errorMap[section.id])}
          onClick={() => onSelect(section.id)}
        />
      ))}
    </aside>
  );
}
