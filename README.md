# GTKX Flatpak app template

A starter GTKX desktop app with TypeScript tooling, headless tests, and Flatpak packaging. Development commands and SSH editors use a shared Flatpak SDK sandbox through [flatpak-dev](https://github.com/TB516/flatpak-dev-cli).

## Customize the app

1. Replace `io.github.example.GtkxApp` throughout the repository with your application ID.
2. Change the package name and description in `package.json`.
3. Replace the starter window in `src/app.tsx`.
4. Update the desktop file, metainfo, icon, command, and Flatpak permissions for your application.

The application manifest uses the local checkout as its source. Pin it to a repository and commit when preparing a published manifest.

## Development

The host needs mise, Flatpak, Flatpak Builder, the OpenSSH client tools, and a systemd user session. Install the runtime, SDK, and Node extension:

```sh
flatpak install --user flathub org.gnome.Platform//50 org.gnome.Sdk//50 org.freedesktop.Sdk.Extension.node24//25.08
```

From this checkout, install the CLI pinned in `mise.toml` and run commands inside the SDK:

```sh
mise install
mise exec -- flatpak-dev run -- pnpm install --frozen-lockfile
mise exec -- flatpak-dev run -- pnpm dev
```

Use `pnpm check` to run code generation, type checking, linting, formatting checks, and tests:

```sh
mise exec -- flatpak-dev run -- pnpm check
mise exec -- flatpak-dev run -- pnpm build
```

`flatpak/.profile` configures persistent pnpm directories and disables GTK accessibility for development. Keep SDK extensions and build dependencies in the application manifest. Headless test tools are grouped under `flatpak/modules/gtkx-test-tools.yml` and removed from the packaged app.

### Connect an editor

```sh
mise exec -- flatpak-dev ssh config
```

Add the printed `Include` line near the top of `~/.ssh/config`. Connect to the printed host from Zed, VS Code, or another SSH editor, then open the printed checkout path. Inside the editor's remote terminal, run `pnpm` commands directly.

For a terminal from the host, use `mise exec -- flatpak-dev ssh connect`.

Commands and editors start or reuse the same sandbox. It stops 30 seconds after the last connection closes. After changing manifest dependencies, close the connections, let it stop, and reconnect. After upgrading the CLI, run `ssh config` again.

## Build the Flatpak app

Build the installable Flatpak bundle from the host:

```sh
mise run build
```

The task builds the app inside the SDK, writes `build-flatpak/io.github.example.GtkxApp.flatpak`, and prints its installation command.

## License

MIT. See [LICENSE](LICENSE).
