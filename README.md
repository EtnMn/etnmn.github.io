# EtnMn Resume [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/EtnMn/etnmn.github.io/blob/main/LICENSE) [![Deploy to GitHub Pages](https://github.com/EtnMn/etnmn.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/EtnMn/etnmn.github.io/actions/workflows/deploy.yml)

## Overview

A static resume website, powered by [Astro](https://astro.build/) and GitHub pages.

[View Demo](https://www.menou.fr/)

## Features

- Astro v4
- TailwindCSS utility classes
- ESLint / Prettier pre-installed and pre-configured
- Responsive & SEO-friendly
- Dark / Light mode
- [Astro Assets Integration](https://docs.astro.build/en/guides/assets/) for optimised images
- Optionnal blog section

## Credits

- [modern-resume-theme](https://github.com/sproogen/modern-resume-theme) for resume homepage design

## Installation and setup

To run the application locally, follow these steps:

1. **Clone the repository**:

    ```sh
    git clone https://github.com/EtnMn/etnmn.github.io.git
    cd etnmn.github.io/front
    ```

2. **Install dependencies**:

    ```sh
    pnpm install
    ```

3. **(Optionnal) Run the project in VS Code and Reopen it in the container**

4. **Run the application**:

    ```sh
    pnpm run dev
    ```

    Or in the container, hit `F5` or

    ```sh
    pnpm run dev --host
    ```

## Usage

### Site info

To edit site info such as site title and description, edit the `src/config.json` file.

### Experience contents

To add an experience, insert `.md` files in `src/content/experience`.

### Education contents

To add an experience, insert `.md` files in `src/content/education`.

### Certifications components

Certification full list can be edited in `src/assets/certifications.json`.

### Blog

Enable blog section in the `src/config.json` file. To add a post, insert `.md` files in `src/content/posts`.

### Layouts

To edit the base layouts of all pages, edit the `src/layouts/base-layout.astro` file.

To edit the blog layouts of blog pages, edit the `src/layouts/blog-layout.astro` file. Blog layout inherit from base layout.

To edit the layout of the errors pages, edit the `src/layouts/error-layout.astro` file.

## Deploy

You can deploy an Astro site to GitHub Pages by using GitHub Actions to automatically build and deploy your site. To do this, your source code must be hosted on GitHub.

Astro maintains the official withastro/action to deploy your project with very little configuration. Follow [Astro's instructions](https://docs.astro.build/en/guides/deploy/github/) to deploy your site to GitHub pages. You can set up your own custom domain by editing the CNAME file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
