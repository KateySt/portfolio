import { getDictionary, type Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";
import { certifications, educationData, person, projectData, skillGroups } from "./data";

/** Facts + translations merged into ready-to-render content for one locale. */
export function buildContent(dict: Dictionary) {
  const profile = { ...person, ...dict.profile };
  const skills = skillGroups.map((g) => ({ ...g, title: dict.skills.groups[g.id] }));
  const projects = projectData.map((p) => {
    const { metricValue, metricLabel, ...text } = dict.projects.items[p.slug];
    return { ...p, ...text, metric: { value: metricValue, label: metricLabel } };
  });
  const education = educationData.map((e) => ({ ...e, ...dict.education.items[e.id] }));
  return { dict, profile, skills, projects, education, certifications };
}

export type Content = ReturnType<typeof buildContent>;

/** Single entry point for pages, routes and the agent layer. */
export async function getContent(locale?: Locale): Promise<Content> {
  return buildContent(await getDictionary(locale));
}
