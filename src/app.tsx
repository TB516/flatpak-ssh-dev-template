import { AdwApplication, AdwApplicationWindow, AdwHeaderBar, AdwToolbarView } from "@gtkx/jsx/adw";
import { GtkLabel } from "@gtkx/jsx/gtk";
import { quit } from "@gtkx/react";

const MainWindow = () => (
  <AdwApplicationWindow
    title="GTKX App"
    defaultWidth={720}
    defaultHeight={480}
    onCloseRequest={quit}
  >
    <AdwToolbarView topBar={<AdwHeaderBar />}>
      <GtkLabel cssClasses={["title-1"]}>Hello from GTKX</GtkLabel>
    </AdwToolbarView>
  </AdwApplicationWindow>
);

export const App = () => (
  <AdwApplication>
    <MainWindow />
  </AdwApplication>
);

export default App;
