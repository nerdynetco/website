import matter from "gray-matter";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const frontmatterOptions = {
  engines: {
    yaml: {
      parse: parseYaml,
      stringify: stringifyYaml,
    },
  },
};

export function parseFrontmatter(source: string) {
  return matter(source, frontmatterOptions);
}
