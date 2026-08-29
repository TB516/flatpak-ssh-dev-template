import { defineConfig } from "@gtkx/config";

export default defineConfig({
  girPath: ["/app/share/gir-1.0", "/usr/share/gir-1.0"],
  applicationId: "io.github.example.GtkxApp",
  agents: {
    reference: false,
    rules: false,
  },
  future: {
    v2ByteArrays: true,
    v2ValueReturns: true,
    v2FinishResults: true,
    v2InoutReturns: true,
    v2ResourceImports: true,
    v2DefaultLibraries: true,
    v2TreeShaking: true,
  },
});
