import { defineConfig } from "@gtkx/config";

export default defineConfig({
  libraries: ["Gtk-4.0", "Adw-1"],
  girPath: ["/app/share/gir-1.0", "/usr/share/gir-1.0"],
  applicationId: "io.github.example.GtkxApp",
});
