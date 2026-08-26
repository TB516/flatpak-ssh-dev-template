# Flatpak SSH development template

This repository is a language-neutral starting point for developing inside a Flatpak SDK with VS Code Remote-SSH. The host only needs VS Code, Flatpak, flatpak-builder, OpenSSH client tools, `ss`, and a systemd user session.

The development manifest builds OpenSSH inside the SDK. The launcher builds the manifest into `.flatpak-dev`, creates project-local SSH keys and a development home, then runs the sandbox as a transient systemd user service. It does not install the Flatpak application.

## Use this template

1. Replace `io.github.example.TemplateApp` in the manifests and launcher with the application ID.
2. Replace the placeholder [`flatpak/app`](flatpak/app) command and update [`flatpak/modules/app.yml`](flatpak/modules/app.yml) for the application build.
3. Add language SDK extensions or build modules to both manifests where needed. Add extension tool directories to `DEV_PATH` in [`scripts/flatpak-dev`](scripts/flatpak-dev).
4. Add the application's production permissions to `finish-args` in the production manifest. Keep development-only permissions in the development manifest.

The production manifest uses a local directory source. Pin that source to a repository and commit when preparing a published manifest.

## Development

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

The `run` command uses the development home and its generated profile without starting the application.

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
