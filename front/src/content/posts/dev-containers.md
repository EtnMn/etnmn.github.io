---
title: "VS Code and Dev Containers"
published: 2024-10-01
subTitle: "How to say 'It works on our machines'"
source: https://github.com/EtnMn/etnmn.github.io
tags: ["VS Code", "Docker"]
draft: false
---

<mark>Dev Container</mark> offer a consistent and reproducible development environment, ensuring uniformity across all developers’ setups. By isolating the development environment from the host machine, they help prevent conflicts and enhance security. Additionally, they ensure that all necessary tools, libraries, and dependencies are available and properly configured

## Requirements

1. [Docker](https://docs.docker.com/desktop/install/windows-install/): used to create and manage the containerized development environment
2. [VS Code](https://code.visualstudio.com/download) with [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
3. [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install). Optional but offers benefits like improved file system performance, Linux compatibility, and seamless integration with Docker. You can also check your [git configuration](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-git).

## Configuration

You need a `.devcontainer` folder in your project with a `devcontainer.json` file that defines the development environment. You can create one from scratch or use a predefined dev container configuration. To do this, access the <mark>Visual Studio Code</mark> Command Palette (_Ctrl+Shift+P_) then type _Add Dev Container Configuration Files_ and choose the definition you want to use. Note that for performance and compatibility issues, it is better to running a <mark>WSL</mark> project from the home folder.

_Example of devcontainer.json_:

```json
{
    "name": "EtnMn website",
    "build": {
        "dockerfile": "Dockerfile"
    },
    "remoteUser": "node",
    "features": {
        "ghcr.io/devcontainers-contrib/features/pnpm:2": {}
    },
    "customizations": {
        "vscode": {
            "extensions": [
                "astro-build.astro-vscode",
                "EditorConfig.EditorConfig",
                "dbaeumer.vscode-eslint",
                "esbenp.prettier-vscode",
                "bradlc.vscode-tailwindcss"
            ]
        }
    },
    "mounts": [
        "type=bind,source=${localEnv:HOME}${localEnv:USERPROFILE}/.ssh,target=/home/node/.ssh,readonly"
    ]
}
```

Let's break down the different parts of this JSON object:

- _name_: Specifies the name of the development container. This name is displayed by _VS Code_
- _build_: Specifies the Dockerfile to use for building the development container. For simplicity and faster setup, you can instead use the property _image_ to use a pre-built image
- _remoteUser_: Specifies the user's name development container
- _features_: Installs tools and languages from a pre-defined set of [Features](https://github.com/devcontainers/features) or even your own.
- _customizations/vscode_: Customizes to the Visual Studio Code editor inside the development container. In this case, it includes a list of extensions to install.
- _mount_: Defines file system mappings to be used in the development container. In this case, it mounts the local SSH directory to the `.ssh` directory inside the container. This allows the container to access MSL [SSH keys](https://logfetch.com/git-ssh-keys/) in order to commit on <mark>Github</mark> by SSH.

## Run the container

Once you start _VS Code_ from _WSL_, you'll see a message about `Installing VS Code Server`. It allows you to use Visual Studio Code on your _Windows_ machine while seamlessly interacting with the _WSL_ environment.

You can run the container by selecting _VS Code_ command `Dev Containers: Reopen in Container`. A shortcut is also available in the bottom left corner of the IDE. Once the build is complete, _VS Code_ will reopen the project inside the container and install extensions. You can now start coding.
