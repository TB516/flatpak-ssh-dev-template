import gtkx from "@gtkx/cli/vitest-plugin";
import gtkxVitest from "@gtkx/vitest";
import { defineConfig } from "vitest/config";

const plugins = gtkx().filter((plugin) => plugin.name !== "gtkx:vitest");

export default defineConfig({
  plugins: [...plugins, gtkxVitest({ compositor: "weston" })],
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    bail: 1,
  },
});
