---
title: "Secure .NET software supply chain"
published: 2025-03-27
subTitle: "How you can secure your .NET project’s supply chain with best practices"
tags: [".NET", "Nuget"]
draft: false
---

[Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/) highlights the risks of using outdated or insecure third-party dependencies, which are a common vector for supply chain attacks. A dependency is what your software needs to run. It can be code, binaries, or other components, and where they come from, such as a repository or package manager.

Some [tools and techniques](https://learn.microsoft.com/en-us/nuget/concepts/security-best-practices) will help you to address potential risks inside your project.

## NuGet deprecated and vulnerable dependencies

.NET 8 added <mark>NuGetAudit</mark>, which will warn about direct packages with known vulnerabilities during restore. If you're not using _nuget.org_ as a package source, you should add it as an audit source. You can use the _dotnet CLI_ to list any known deprecated or vulnerable dependencies you may have inside your project or solution:

```shell
dotnet list package --deprecated
dotnet list package --vulnerable
```

You will want to ensure that all of your dependencies & tooling are regularly updated to the latest stable version as they will often include the latest functionality and security patches to known vulnerabilities.

## Central Package Management (CPM)

Managing dependencies for multi-project solutions can prove to be difficult as they start to scale in size and complexity. Since _.NET 6_, in situations where you manage common dependencies for many different projects, you can leverage NuGet's <mark>Central Package Management</mark> (CPM) features to do all of this from the ease of a single location.

To get started with central package management, you must create a _Directory.Packages.props_ file at the root of your repository and set the _MSBuild_ property `ManagePackageVersionsCentrally` to true.

```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
  <ItemGroup>
    <PackageVersion Include="Microsoft.EntityFrameworkCore" Version="9.0.0" />
  </ItemGroup>
</Project>
```

For each project, you then define a `<PackageReference />` but omit the Version attribute since the version will be attained from a corresponding `<PackageVersion />` item.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" />
  </ItemGroup>
</Project>
```

When using central package management, you will see a `NU1507` warning if you have more than one package source defined in your configuration. To resolve this warning, map your package sources with package source mapping or specify a single package source.

## Package Source Mapping

_Package Source Mapping_ is a tool that can be used to improve your supply chain security, especially if you use a mix of public and private package sources. By default, _NuGet_ will search all configured package sources when it needs to download a package. When a package exists on multiple sources, it may not be deterministic which source the package will be downloaded from. With Package Source Mapping, you can filter, per package, which source(s) NuGet will search. To opt into this feature, you must have a _nuget.config_ file. Having a single _nuget.config_ at the root of your repository is considered a <mark>best practice</mark>.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <!-- Define the package sources, nuget.org and contoso.com. -->
  <!-- `clear` ensures no additional sources are inherited from another config file. -->
  <packageSources>
    <clear />
    <!-- `key` can be any identifier for your source. -->
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="contoso.com" value="https://contoso.com/packages/" />
  </packageSources>

  <!-- Define mappings by adding package patterns beneath the target source. -->
  <!-- Contoso.* packages and NuGet.Common will be restored from contoso.com,
       everything else from nuget.org. -->
  <packageSourceMapping>
    <!-- key value for <packageSource> should match key values from <packageSources> element -->
    <packageSource key="nuget.org">
      <!-- default sources -->
      <package pattern="*" />
    </packageSource>
    <packageSource key="contoso.com">
      <package pattern="Contoso.*" />
      <package pattern="NuGet.Common" />
    </packageSource>
  </packageSourceMapping>
</configuration>
```

Use package sources that you trust. When using multiple public and private _NuGet_ source feeds, a package can be downloaded from any of the feeds. To ensure your build is <mark>predictable and secure</mark> from known attacks such as [Dependency Confusion](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610), knowing what specific feed(s) your packages are coming from is a best practice.

## Locking dependencies

_NuGet_ tries to always produce the same full closure of package dependencies if the input PackageReference list has not changed. However, there are some scenarios where it is unable to do so. For example:

* When you use floating versions like <PackageReference Include="My.Sample.Lib" Version="4.*"/>
* A newer version of the package matching PackageReference version requirements is published. E.g.

    Day 1: if you specified <PackageReference Include="My.Sample.Lib" Version="4.0.0"/> but the versions available on the NuGet repositories were 4.1.0, 4.2.0 and 4.3.0. In this case, NuGet would have resolved to 4.1.0 (nearest minimum version)

    Day 2: Version 4.0.0 gets published. NuGet will now find the exact match and start resolving to 4.0.0
* A given package version is removed from the repository. Though nuget.org does not allow package deletions, not all package repositories have this constraint. This results in NuGet finding the best match when it cannot resolve to the deleted version.

In order to persist the full closure of package dependencies you can opt-in to the lock file feature by setting the MSBuild property `RestorePackagesWithLockFile` for your project:

```xml
<PropertyGroup>
    <!--- ... -->
    <RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>
    <!--- ... -->
</PropertyGroup>
```

If this property is set, _NuGet_ restore will generate a <mark>lock file</mark> - _packages.lock.json_ file at the project root directory that lists all the package dependencies. If a lock file is present for project, NuGet uses this lock file to run restore. NuGet does a quick check to see if there were any changes in the package dependencies as mentioned in the project file (or dependent projects' files) and if there were no changes it just restores the packages mentioned in the lock file. There is no re-evaluation of package dependencies. If NuGet detects a change in the defined dependencies as mentioned in the project file(s), it re-evaluates the package graph and updates the lock file to reflect the new package closure for the project.

For <mark>CI/CD</mark> and other scenarios, where you would not want to change the package dependencies on the fly, you can do so by setting the _locked mode_ to true: `dotnet restore --locked-mode`.

## Dependency Scanning Tools

If your project is hosted on _GitHub_, you can leverage GitHub Security to find security vulnerabilities and errors in your project and <mark>Dependabot</mark> will fix them by opening up a pull request against your codebase.
