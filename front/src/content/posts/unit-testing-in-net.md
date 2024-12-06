---
title: "Unit testing in .NET"
published: 2024-12-06
subTitle: "Testing frameworks and basic assertions"
tags: [".NET", "Visual Studio", "VS Code"]
draft: false
---

I will not go over the importance of testing, explain the different types of tests, or what TDD is, but rather focus on the tools available for unit testing in .NET.

## FIRST

Writing unit tests requires as much rigor as writing the rest of the source code. To ensure good quality unit tests, it is useful to follow the <mark>FIRST</mark> principles:

* Fast: Unit tests should be quick to execute so they can be run as often as possible. For this reason, it is important to eliminate costly dependencies such as database access
* Isolated: Tests should not depend on each other. A test should be able to run independently
* Repeatable: A test should yield the same result every time it is run. There should be no external dependencies influencing the result
* Self-validating: There should be no interpretation required for the results of a test. No intervention should be necessary to analyze the result of a unit test
* Timely: Unit tests can be written at any time, but it is advisable to stick to a routine and write tests as development progresses

## Test Methods

### Example-Based Tests

The most common unit tests. The goal is to test:

* The standard case
* The specific cases identified by the specifications
* The edge cases

### Invariant Testing

Invariant testing ensures that certain conditions or properties remain true throughout the execution of a program. Instead of testing expected values, we verify the state of the object. For example, to calculate the area of a rectangle, you could assert that `length * width = 8`, or you can:

* Verify that the area is equal to `length * width`
* Verifies that the area is non-negative for a given width and height
* Verifies that the area is zero when either the width or height is zero

## Create tests with xUnit

A test class is a fundamental component of unit testing that contains test methods to verify the functionality of the code. It uses assertions to check for expected outcomes and ensures that tests run in isolation. Test classes are an essential part of automated testing frameworks like <mark>xUnit</mark>. [xUnit](https://xunit.net/) is a popular open-source unit testing framework for .NET languages, here are some of its features:

* `[Fact]`: Marks a method as a test method that does not take any parameters
* `[Theory]`: Marks a method as a parameterized test method that can take multiple sets of data
* Assertions: Provides a rich set of assertion methods to verify conditions in your tests, such as: `Assert.Equal, Assert.True, Assert.Throws...`
* Share context setup and cleanup code between tests: `Constructor, IClassFixture<T>, ICollectionFixture<T>...`
* Parameterised tests: `[InlineData], [MemberData], [ClassData]`

_Here is an example of a test class using xUnit:_

```csharp
using Xunit;

public class Rectangle
{
    public double Width { get; set; }
    public double Height { get; set; }

    public double CalculateArea()
    {
        return Width * Height;
    }
}

public class RectangleTests
{
    [Fact]
    public void CalculateArea_ShouldReturnCorrectArea()
    {
        // Arrange
        var rectangle = new Rectangle { Width = 5, Height = 10 };

        // Act
        double area = rectangle.CalculateArea();

        // Assert
        Assert.Equal(5*10, area);
    }

    [Theory]
    [InlineData(5, 10)]
    [InlineData(3, 4)]
    [InlineData(0, 10)]
    public void CalculateArea_ShouldReturnCorrectArea_ForGivenDimensions(double width, double height)
    {
        // Arrange
        var rectangle = new Rectangle { Width = width, Height = height };

        // Act
        double area = rectangle.CalculateArea();

        // Assert
        Assert.Equal(width*height, area);
    }
}
```

The `[InlineData]` attribute is ideal for scenarios where your method parameters are constants and you have a limited number of test cases. For more complex scenarios or when you have numerous test cases, consider using `[ClassData]` or `[MemberData]` to provide data to your `[Theory]` tests.

```csharp
public class RectangleTests
{
    [Theory]
    [MemberData(nameof(GetRectangles))]
    public void CalculateArea_ShouldReturnCorrectArea(Rectangle rectangle)
    {
        // Act
        double area = rectangle.CalculateArea();

        // Assert
        Assert.Equal(rectangle.Width * rectangle.Height, area);
    }

    public static IEnumerable<object[]> GetRectangles()
    {
        return [
            [new Rectangle() { Width = 5, Height = 10 }],
            [new Rectangle() { Width = 10, Height = 0 }],
        ];
    }
}
```

To check for __exceptions__ in xUnit, you can use the `Assert.Throws<T>` method:

```csharp
using Xunit;

public class Calculator
{
    public int Divide(int numerator, int denominator)
    {
        if (denominator == 0)
        {
            throw new DivideByZeroException("Denominator cannot be zero.");
        }
        return numerator / denominator;
    }
}

public class CalculatorTests
{
    [Fact]
    public void Divide_ShouldThrowDivideByZeroException_WhenDenominatorIsZero()
    {
        // Arrange
        var calculator = new Calculator();

        // Act & Assert
        var exception = Assert.Throws<DivideByZeroException>(() => calculator.Divide(10, 0));

        // Additional Assert (optional)
        Assert.Equal("Denominator cannot be zero.", exception.Message);
    }
}
```

To run test in <mark>Visual Studio</mark> you need to install the package [xunit.runner.visualstudio](https://www.nuget.org/packages/xunit.runner.visualstudio). It allows you to run xUnit tests directly within the Visual Studio IDE, providing a seamless and integrated testing experience with __Text Explorer__ and __Live Unit Testing__. For <mark>VS Code</mark> the extensions [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) or [.NET Core Test Explorer](https://marketplace.visualstudio.com/items?itemName=formulahendry.dotnet-test-explorer) are availables, or you can simply execute `dotnet test`.

## Fluent assertion

[Fluent Assertions](https://fluentassertions.com/introduction) is a library that provides a more readable and expressive way to write assertions in unit tests compared to classic assertions. It enhances the readability and maintainability of test code by allowing assertions to be written in a fluent, chainable style.

* Readability: it allows you to write assertions in a way that reads more like natural language:

```csharp
// Classic Assert
Assert.Equal(expected, actual);

// Fluent Assertions
actual.Should().Be(expected);

// Classic Exception Assert
Assert.Throws<DivideByZeroException>(() => calculator.Divide(10, 0));

// Fluent Exception Assertions
Action act = () => calculator.Divide(10, 0);
act.Should().Throw<DivideByZeroException>().WithMessage("Denominator cannot be zero.");
```

* Expressiveness: it provides a set of extension methods that offer more expressive and descriptive assertions:

```csharp
// Classic Assert
Assert.True(collection.Contains(item));

// Fluent Assertions
collection.Should().Contain(item);
```

* Chainable Assertions: it supports chaining multiple assertions together, reducing the need for multiple Assert statements:

```csharp
// Classic Assert
Assert.NotNull(result);
Assert.Equal(expectedValue, result.Value);

// Fluent Assertions
result.Should().NotBeNull().And.Be(expectedValue);
```

## Generate test data

[AutoFixture](https://autofixture.github.io/) and [Bogus](https://github.com/bchavez/Bogus) are two popular libraries used in .NET for <mark>generating test data</mark>. They help simplify the process of creating test data, making unit tests easier to write and maintain.

### AutoFixture

__AutoFixture__ focuses on minimizing the _Arrange_ phase of unit tests by automatically generating objects with random data.

```csharp
using AutoFixture;
using Xunit;

public class CalculatorTests
{
    [Fact]
    public void Add_ShouldReturnSumOfTwoNumbers()
    {
        // Arrange
        var fixture = new Fixture();
        var calculator = new Calculator();
        int a = fixture.Create<int>();
        int b = fixture.Create<int>();

        // Act
        int result = calculator.Add(a, b);

        // Assert
        Assert.Equal(a + b, result);
    }
}
```

_AutoFixture_'s Build method allows you to customize the creation of objects in a more controlled manner. This is useful when you need to set specific properties or apply custom rules to the generated objects.

```csharp
using AutoFixture;
using Xunit;

public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
}

using AutoFixture;
using Xunit;

public class UserTests
{
    [Fact]
    public void CreateUser_ShouldReturnValidUser()
    {
        // Arrange
        var fixture = new Fixture();
        var user = fixture.Build<User>()
            .With(u => u.Name, "John Doe")
            .With(u => u.Email, "john.doe@example.com")
            .With(u => u.Age, 30)
            .Create();

        // Act & Assert
        Assert.Equal("John Doe", user.Name);
        Assert.Equal("john.doe@example.com", user.Email);
        Assert.Equal(30, user.Age);
    }
}
```

The `CreateMany<T>()` method in AutoFixture is used to generate multiple instances of a specified type. This is particularly useful when you need a collection of objects for testing purposes.

```csharp
IEnumerable<User> projects = this.fixture.CreateMany<User>(3);
```

### Bogus

__Bogus__ is designed to generate realistic and meaningful fake data, such as names, addresses, and phone numbers. It is often used for creating more human-readable test data.

```csharp
using Bogus;
using Xunit;

public class UserTests
{
    [Fact]
    public void CreateUser_ShouldReturnValidUser()
    {
        // Arrange
        var faker = new Faker<User>()
            .RuleFor(u => u.Name, f => f.Name.FullName())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Age, f => f.Random.Int(18, 99));

        var user = faker.Generate();

        // Act & Assert
        Assert.NotNull(user.Name);
        Assert.NotNull(user.Email);
        Assert.InRange(user.Age, 18, 99);
    }
}
```

## Mock & Stub

 A <mark>mock</mark> is a test double that is used to <mark>verify interactions</mark> between the system under test and its dependencies. Mocks are typically used to assert that certain methods were called with specific arguments. A <mark>stub</mark> provides <mark>predefined responses</mark> to method calls. Stubs are used to isolate the system under test from its dependencies by providing controlled responses. Popular packages are [Moq](https://github.com/devlooped/moq) and [NSubstitute](https://nsubstitute.github.io/). The following example describes a repository stub with _NSubstitute_:

```csharp
IUserService userService = Substitute.For<IUserService>();
userService.GetById(Arg.Any<int>()).Returns(c => new User() {Id = c.Arg<int>()});
```
