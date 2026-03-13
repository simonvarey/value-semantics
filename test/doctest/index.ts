import type { PluginOption } from "vite";
import { transform as markdown } from "./markdown";

export type Options = { markdownSetup?: string };
export const doctest = (options: Options = {}): PluginOption => {
  return {
    name: "vite-plugin-doctest",
    enforce: "pre",
    transform(code, id) {
      if (process.env.VITEST !== "true") return code;
      if (id.match(/\.md$/))
        return markdown(code, id, {
          markdownSetup: options.markdownSetup ?? "",
        });
    },
  };
};

export default doctest;
