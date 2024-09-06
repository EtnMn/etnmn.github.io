# EtnMn Resume [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/withastro/astro/blob/main/LICENSE) [![Astro](https://badge.fury.io/js/astro.svg)](https://badge.fury.io/js/astro)

## Overview

A static resume template theme. Powered by [Astro](https://astro.build/) and GitHub pages.

[View Demo](https://www.menou.fr/)

## Features

-   Astro v4
-   TailwindCSS utility classes
-   ESLint / Prettier pre-installed and pre-configured
-   Responsive & SEO-friendly
-   Dark / Light mode
-   [Astro Assets Integration](https://docs.astro.build/en/guides/assets/) for optimised images

## Credits

-   [modern-resume-theme](https://github.com/sproogen/modern-resume-theme) for resume homepage design

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

    Or in the container

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

### Layouts

To edit the base layouts of all pages, edit the `src/layouts/BaseLayout.astro` file.

To edit the layout of a blog article, edit the `src/layouts/BlogPost.astro` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
