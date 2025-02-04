# sdk-experiment

This repository is a playground for experimenting with a new SDK for [Nhost](https://nhost.io).

## Background

### Motivation

Currently, our SDKs are manually written and maintained. This is a tedious process and leads to inconsistencies and a mismatch between the SDKs and the API.

In addition, our Auth SDK is extemely complex and hard to maintain and extend due to the complexity in the state machine.

### Goal

The goal of this project is to automatically generate SDKs for Nhost based on the API schema. This will ensure that the SDKs are always up-to-date and consistent with the API.

In addition, we want to make sure that our SDKs are easy to use and understand and that can be extended easily to accomodate different environments. This is specially important in the Javascript/Typescript SDKs as those need to run across a variety of environments (Node.js, React Native, Browser).

## Objectives

### Languages

To begin with we want to start supporting the following languages:

- Javascript/Typescript
- Go
- Dart

As the project progresses, we can add support for more languages but to keep things simple and focused we will start with these three. The variety in languages will help us understand the different challenges and requirements to support different languages.

### Requirements

- The SDKs should be automatically generated based on the API schema
- The SDKs should be easy to use and understand and include documentation generated from the API schema
- The SDKs should be consistent with the API
- The SDKs should be easy to extend, specially when it relates to managing the session and authentication
- The SDKs should be idiomatic to the language they are written for
The SDKs should feel similar across different languages e.g., the function to signup with email/password should be named the same across SDKs. 
## Approach

### Code Generation

We will start by testing different code generation tools to generate the SDKs and ensuring the code generated supports the requirements outlined above and the code generated correctly reflects the API schema.

### Examples

We will design an example to test each generated SDK and ensure it meets the requirements. This will help us understand how the generated SDK feels, how easy it is to use and understand, and how easy it is to extend.

### Community

We want to involve the community in the development of the SDKs. This will ensure that the SDKs are easy to use and understand and that they cover as many use cases as possible. In the end, the SDKs are for the community and, thus, should be developed with the community.

## Contributing

We are currently looking for code generation tools that can help us generate the SDKs. If you have experience with code generation tools and would like to propose one, please open an issue with the details of the tool and why you think it would be a good fit for this project. If you see a tool that has been proposed and you have experience with it, please, don't hesitate to share your experience and thoughts on the tool.

As we generate some sample SDKs with the proposed tools we will create issues on GitHub asking for help writing examples and asking for feedback on the generated code and the examples themselves. If you have a different environment from the ones we are testing, don't hesitate to open an issue to let us know.

GitHub labels to follow:

- [`lang:js/ts`](https://github.com/nhost/sdk-experiment/labels/lang%3Ajs%2Fts) - Issues related to Javascript/Typescript SDKs
- [`lang:go`](https://github.com/nhost/sdk-experiment/labels/lang%3Ago) - Issues related to Go SDKs
- [`lang:dart`](https://github.com/nhost/sdk-experiment/labels/lang%3Adart) - Issues related to Dart SDKs
- [`tool:codegen`](https://github.com/nhost/sdk-experiment/labels/tool%3Acodegen) - Issues related to code generation tools
- [`examples`](https://github.com/nhost/sdk-experiment/issues?q=is%3Aopen%20label%3Aexamples) - Issues related to examples

Feel free to keep an eye for these labels and help us out with the project.

If you have any other ideas or suggestions, please open an issue and let us know. We are open to any suggestions and ideas that can help us achieve our goals.

## Discord

You can also join our Discord server to discuss the project and get involved in the development of the SDKs. You can join the server [here](https://discord.gg/ZUg87u5a). We have a sdk-experiment channel where we discuss the project and share updates.
