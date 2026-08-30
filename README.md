# Flatpak SSH development template

This repository is a language-neutral starting point for developing inside a Flatpak SDK with VS Code Remote-SSH. The host only needs VS Code, Flatpak, flatpak-builder, OpenSSH client tools, `flock`, `ss`, and a systemd user session.

Project-specific templates should customize the manifests and profile or build on this repository. Keep the host orchestration here instead of maintaining a separate launcher implementation for each toolkit or language.

The development manifest builds OpenSSH inside the SDK and installs the checked-in [`flatpak/.profile`](flatpak/.profile). The launcher builds the manifest into `.flatpak-dev`, creates project-local SSH keys and a persistent development home, then runs the sandbox as a transient systemd user service. It does not install the Flatpak application.

## Use this template

1. Replace `io.github.example.TemplateApp` in the manifests and launcher with the application ID.
2. Replace the placeholder [`flatpak/app`](flatpak/app) command and update [`flatpak/modules/app.yml`](flatpak/modules/app.yml) for the application build.
3. Add language SDK extensions or build modules to both manifests where needed. Add development shell paths and tool settings to [`flatpak/.profile`](flatpak/.profile).
4. Add the application's production permissions to `finish-args` in the production manifest. Keep development-only permissions in the development manifest.

The production manifest uses a local directory source. Pin that source to a repository and commit when preparing a published manifest.

## Development

Install the runtime, SDK, and SDK extensions declared by the development manifest before the first build. The launcher does not install or update Flatpak dependencies.

Start the environment from the host:

```sh
./scripts/flatpak-dev
```

On the first run, add the printed `Include` line near the top of the host `~/.ssh/config`, before broad `Host *` blocks. Connect with Remote-SSH to the printed host and open the printed repository path.

The SSH host defaults to `<repository-directory>-flatpak`. Override it with `FLATPAK_DEV_SSH_HOST` if needed.

To run a one-off command in the development Flatpak from the host, use:

```sh
./scripts/flatpak-dev run /bin/sh -c 'your-command'
```

When the SSH service is inactive, `run` rebuilds the development image using Flatpak Builder's module cache. When the service is active, it leaves the image and SSH session alone. Both paths run the command with `flatpak build`, the persistent development home, and the same environment. Build the image without running a command or starting SSH with:

```sh
./scripts/flatpak-dev build
```

Flatpak Builder reuses its normal module cache. Changes to development manifest modules, OpenSSH, SDK extensions, or files installed into `/app` rebuild the affected modules. Project source, package manifests, and lockfiles do not rebuild the development image unless a manifest declares them as sources. Install project dependencies with the project's package manager inside the development Flatpak.

The manifest installs one profile at `/app/share/flatpak-dev/.profile`. The launcher links both `$HOME/.profile` and `$HOME/.bashrc` to it so login and interactive Bash shells use the same configuration. Non-interactive Bash commands use the same file through `BASH_ENV`. Keep host-specific values such as `HOME`, the Flatpak architecture, display sockets, and persistent XDG directories in the launcher.

### Optional automatic startup

Remote-SSH can run the launcher before connecting. Add this optional host user setting with the repository's actual path and generated SSH host:

```json
"remote.SSH.preconnect": {
  "flatpak-ssh-dev-template-flatpak": "/absolute/path/to/flatpak-ssh-dev-template/scripts/flatpak-dev"
}
```

Remote-SSH currently marks this setting as experimental. Without it, run the launcher before connecting.

The transient service stops 30 seconds after the remote window disconnects, or after 120 seconds if no connection arrives. Control it manually with:

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

## Production build

Build and run the placeholder application directly from a build directory:

```sh
flatpak-builder --user --force-clean \
  .flatpak-dev/app-build \
  flatpak/io.github.example.TemplateApp.yml

flatpak-builder --run \
  --state-dir=.flatpak-dev/prod-builder-state \
  .flatpak-dev/app-build \
  flatpak/io.github.example.TemplateApp.yml \
  template-app
```
