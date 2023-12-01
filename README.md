
# Nodejs Bug Repro Environments

## Requirements
Requires [devbox](https://www.jetpack.io/devbox/) cli.
```
curl -fsSL https://get.jetpack.io/devbox | bash
```

Alternatively, you can develop in a preconfigured container environment using 
[an editor or service that supports the devcontainer standard](https://containers.dev/supporting#editors)
such as [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
or Github Codespaces.


## Usage
To repro a from an existing bug/branch:
```
git checkout <branchname>
devbox shell
```

To create a new repro environment:
```
git branch repo-name-issueNumber master
devbox shell
```

Modify index.ts and install dependencies with npm as needed.
