# GTKX Flatpak app template

A small GTKX application with its editor, package manager, compiler, tests, and language servers running inside a Flatpak SDK. The host does not need Node.js, pnpm, GTK development packages, or Weston.

## Customize the app

1. Replace `io.github.example.GtkxApp` throughout the repository with the application ID.
2. Change the package name and description in [`package.json`](package.json).
3. Replace the starter window in [`src/app.tsx`](src/app.tsx).
4. Update the desktop file, metainfo, icon, command, and Flatpak permissions for the application.

The production manifest uses the local repository as its source. Pin it to a repository and commit when preparing a published manifest.

## Development

The host needs:

- VS Code with Remote - SSH
- Flatpak and flatpak-builder
- A systemd user session
- `flock`, `ssh`, `ssh-keygen`, and `ss`

Install the runtime, SDK, and SDK extensions declared by the development manifest before the first build. The launcher does not install or update Flatpak dependencies.

Start the development environment from a host terminal:

```sh
./scripts/flatpak-dev
```

On the first run, add the printed `Include` line near the top of the host `~/.ssh/config`, before broad `Host *` blocks. Connect with Remote-SSH to the printed host and open the printed repository path.

The SSH host defaults to `<repository-directory>-flatpak`. Override it with `FLATPAK_DEV_SSH_HOST` if needed.

Inside the remote VS Code window:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Use `pnpm check` to run code generation, type checking, linting, formatting checks, and tests.

To run a one-off command in the development Flatpak from the host, use:

```sh
./scripts/flatpak-dev run pnpm check
```

When the SSH service is inactive, `run` rebuilds the development image using Flatpak Builder's module cache. When the service is active, it leaves the image and SSH session alone. Both paths run the command with `flatpak build`, the persistent development home, and the same environment. Build the image without running a command or starting SSH with:

```sh
./scripts/flatpak-dev build
```

Flatpak Builder reuses its normal module cache. Changes to development manifest modules, OpenSSH, SDK extensions, or files installed into `/app` rebuild the affected modules. Project source, package manifests, and the lockfile do not rebuild the development image because the development manifest does not declare them as sources. Install dependencies with pnpm inside the development Flatpak.

The manifest installs [`flatpak/.profile`](flatpak/.profile) at `/app/share/flatpak-dev/.profile`. The launcher links both `$HOME/.profile` and `$HOME/.bashrc` to it so login and interactive Bash shells use the same configuration. Non-interactive Bash commands use it through `BASH_ENV`.

The launcher builds directly into `.flatpak-dev` and does not install the Flatpak application. It runs as a transient systemd user service, so the launcher does not need an open terminal. The service stops 30 seconds after the remote window disconnects, or after 120 seconds if no connection arrives.

Control or inspect it manually with:

```sh
./scripts/flatpak-dev start
./scripts/flatpak-dev stop
./scripts/flatpak-dev status
./scripts/flatpak-dev logs
```

`start` rebuilds the image before starting SSH. If the service is already running, it reports that state and leaves the image alone. `build` holds `.flatpak-dev/build.lock` while rebuilding. `start` holds it while rebuilding and launching the service, then releases it before waiting for SSH. An inactive-service `run` holds the lock only while rebuilding. An active-service `run` skips the rebuild. `build` still refuses to update `.flatpak-dev/build` while the service is active.

Use another port when `22222` is occupied:

```sh
FLATPAK_DEV_SSH_PORT=22223 ./scripts/flatpak-dev
```

### Optional automatic startup

Remote-SSH can run the launcher before connecting. Add this optional host user or profile setting with the repository's actual path and generated SSH host:

```json
"remote.SSH.preconnect": {
  "gtkx-app-template-flatpak": "/absolute/path/to/gtkx-app-template/scripts/flatpak-dev"
}
```

Remote-SSH currently marks this setting as experimental. Without it, run the launcher before connecting.

## Production build

Build and run the application from a build directory without installing it:

```sh
flatpak-builder --user --force-clean \
  --state-dir=.flatpak-dev/prod-builder-state \
  .flatpak-dev/app-build \
  flatpak/io.github.example.GtkxApp.yml

flatpak-builder --run \
  --state-dir=.flatpak-dev/prod-builder-state \
  .flatpak-dev/app-build \
  flatpak/io.github.example.GtkxApp.yml \
  gtkx-app
```

## License

MIT. See [`LICENSE`](LICENSE).
