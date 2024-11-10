---
title: "Host and deploy apps following Trunk-Based development"
published: 2024-11-12
subTitle: "Create a GitHub CI/CD pipeline to deploy a .NET Web App"
tags: [".NET", "Entity Framework", "Azure", "GitHub"]
draft: false
---

[Trunk-based Development](https://trunkbaseddevelopment.com/) is a version control management practice where developers integrate small, frequent updates into a shared <mark>main branch</mark>. This approach minimizes merge conflicts and ensures a continuously deployable state. It promotes collaboration and accelerates the delivery of high-quality software. In this context, creating a <mark>CI/CD pipeline</mark> can be challenging since it deploys to every environment from the same branch.

The following procedure illustrates how to deploy a .NET Web App and its database using <mark>GitHub Actions</mark>.

## Prerequisites

Ensure you have the following:

- A GitHub repository with your application.
- An Azure account with the necessary permissions to create resources.
- _SQL Server Management Studio (SSMS)_ or [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio?tabs=win-install%2Cwin-user-install%2Credhat-install%2Cwindows-uninstall%2Credhat-uninstall#download-azure-data-studio) for database management.

## Setting up GitHub Actions

In your repository, create a `.github/workflows/build.yml` file with the following content:

```yaml
name: Build & deploy

on:
  push:
    branches:
      - main
    paths:
      - "src/**"
      - "Directory.**.props"
      - "global.json"
  workflow_dispatch:

jobs:
  build:
    name: Build .NET projects
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up .NET
        uses: actions/setup-dotnet@v4
        with:
          global-json-file: ./global.json

      - name: Set up dependency caching for faster builds
        uses: actions/cache@v4
        with:
          path: ~/.nuget/packages
          key: ${{ runner.os }}-nuget-${{ hashFiles('**/packages.lock.json') }}
          restore-keys: |
            ${{ runner.os }}-nuget-

      - name: Build with dotnet
        run: dotnet build --configuration Release

      - name: dotnet publish
        run: dotnet publish -c Release --property:PublishDir=${{env.DOTNET_ROOT}}/myapp

      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v4
        with:
          name: web-app
          path: ${{env.DOTNET_ROOT}}/myapp

      - name: Restore Tools
        run: dotnet tool restore

      - name: Bundle EF bundle
        run: |
          dotnet ef migrations bundle \
          --startup-project src/Server \
          --project src/Infrastructure \
          --configuration Release \
          --self-contained \
          --no-build \
          --force

      - name: Publish database bundle artifact
        uses: actions/upload-artifact@v4
        with:
          name: efbundle
          path: ./efbundle

  deploy:
    strategy:
      matrix:
        target: [Development, Production]
    name: ${{ matrix.target }}
    permissions:
      id-token: write #This is required for requesting the JWT
    needs: build
    uses: ./.github/workflows/deploy.yml
    with:
      environment: ${{ matrix.target }}
    secrets: inherit

```

 The workflow is triggered on pushes to the main branch, it can also be manually triggered using `workflow_dispatch`. The first job builds .NET projects and bundles the database, then uploads both artifacts. The second job handles the deployment process by leveraging a reusable workflow and running it for both _Development_ and _Production_ environments, ensuring that the application is deployed consistently across different stages.

Then create the `.github/workflows/deploy.yml` reusable workflow:

```yaml
name: Deploy

on:
  workflow_call:
      inputs:
        environment:
          required: true
          type: string

jobs:
  deploy:
    name: Deploy to Azure
    runs-on: ubuntu-latest
    environment:
      name: ${{ inputs.environment }}
      url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}
    permissions:
      id-token: write #This is required for requesting the JWT

    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v4
        with:
          name: web-app
          path: ./web-app

      - name: Download Database artifact
        uses: actions/download-artifact@v4
        with:
          name: efbundle
          path: ./efbundle

      - name: Login to Azure
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZUREAPPSERVICE_CLIENTID }}
          tenant-id: ${{ secrets.AZUREAPPSERVICE_TENANTID }}
          subscription-id: ${{ secrets.AZUREAPPSERVICE_SUBSCRIPTIONID }}

      - name: Run Database migrations
        env:
          ConnectionStrings__Default: ${{ secrets.AZURE_SQL_CONNECTION_STRING }}
        run: |
          chmod +x ./efbundle/efbundle
          ./efbundle/efbundle

      - name: Deploy to Azure Web App
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'web-app'
          slot-name: 'Production'
          package: ./web-app
```

## Setting up Azure resources

Note that resources must be created for each environment.

1. **Create a Resource Group**:
2. **Create a Web App**:
3. **Create a User-Assigned Managed Identity**:
    Allow _GitHub Actions_ to [connect](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure-openid-connect) to _Azure_
4. **Create a SQL Database and set permissions**:
    - Enable Microsoft Entra-only authentication.
    - Set the database as owner.
    - Allow public network access to the database.
    - Connect to the database and add `read/write` roles to the web app identity.
    - Add `read/write/ddladmin` roles to the  federated identity credential.

## Add secrets to GitHub

To securely connect your GitHub Actions workflow to Azure, you need to add tthe secrets to your GitHub repository:

1. **Access Repository Settings**:
2. **Go to Environments**:
3. **Create a New Environment (e.g., Development, Production)**:
4. **Add Secrets to the Environment**:
    Click on `Add secret` and provide the name and value for each secret. For example:
    - `AZUREAPPSERVICE_CLIENTID`: The client ID of federated identity credential.
    - `AZUREAPPSERVICE_TENANTID`: The tenant ID of your Azure Active Directory.
    - `AZUREAPPSERVICE_SUBSCRIPTIONID`: The subscription ID of your Azure account.
    - `AZURE_SQL_CONNECTION_STRING`: The connection string for your Azure SQL Database. The format should be: `Server=tcp:{database_server},{port};Initial Catalog={database_name};Authentication=Active Directory Default`

## Adding a trigger for Production deployment

You can activate the **Required reviewers** configuration for your production environment. This ensures that the application will not be deployed without a review by an authorized person. In the environment settings, scroll down to the Deployment protection rules section and click on `Required reviewers`.
