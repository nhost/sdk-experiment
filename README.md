# sdk-experiment

This repository is a playground for experimenting with a new SDK for [Nhost](https://nhost.io).

## Background

### Motivation

Currently, our SDKs are manually written and maintained. This is a tedious process and leads to inconsistencies and a mismatch between the SDKs and the API.

In addition, our Auth SDK is extremely complex and hard to maintain and extend due to the complexity in the state machine.

### Goal

The goal of this project is to automatically generate SDKs for Nhost based on the API schema. This will ensure that the SDKs are always up-to-date and consistent with the API.

In addition, we want to make sure that our SDKs are easy to use and understand and that can be extended easily to accommodate different environments. This is specially important in the Javascript/Typescript SDKs as those need to run across a variety of environments (Node.js, React Native, Browser).

## Objectives

### Languages

To begin with we want to start supporting the following languages:

- Javascript/Typescript
- Dart (soon)
- Go (soon)

As the project progresses, we can add support for more languages but to keep things simple and focused we will start with these three. The variety in languages will help us understand the different challenges and requirements to support different languages.

### Requirements

- The SDKs should be automatically generated based on the API schema
- The SDKs should be easy to use and understand and include documentation generated from the API schema
- The SDKs should be consistent with the API
- The SDKs should be easy to extend, specially when it relates to managing the session and authentication
- The SDKs should be idiomatic to the language they are written for
- The SDKs should feel similar across different languages e.g., the function to signup with email/password should be named the same across SDKs.

## Approach

### Code Generation

We will start by testing different code generation tools to generate the SDKs and ensuring the code generated supports the requirements outlined above and the code generated correctly reflects the API schema.

### Examples

We will design an example to test each generated SDK and ensure it meets the requirements. This will help us understand how the generated SDK feels, how easy it is to use and understand, and how easy it is to extend.

### Community

We want to involve the community in the development of the SDKs. This will ensure that the SDKs are easy to use and understand and that they cover as many use cases as possible. In the end, the SDKs are for the community and, thus, should be developed with the community.

## Structure

- `/backend`: This folder contains an Nhost backend for testing purposes.
- `/demos`: This folder contains various demos. Each demo is a separate folder and contains a README file with instructions on how to run it, what it does and where the interesting parts are. The demos are meant to test the SDKs and show how to use them.
- `/docs`: This folder contains Nhost's documentation. This is the the same as https://docs.nhost.io but modified for the new SDK and with guides on how to leverage the to build various workflows. The README contains instructions on how to run the documentation locally and which documents are new and need to be reviewed.
- `/packages`: This folder contains the SDKs. Each SDK is in its own folder and contains a README file with details and instructions.

## To Do

- [ ] Add instructions on how to use the vanilla JS SDK, error handling, etc.
- [x] Next.js SSR example
  - [ ] Add at least one example using a social provider
  - [ ] Integrate with functions
  - [ ] Integrate with GraphQL codegen
- [ ] React example
- [ ] Svelte example
- [ ] Vue example
- [ ] React Native example

## Contributing

The best way to contribute is by providing feedback and attempting to build something with the SDKs, specially if you feel you have a use-case not covered in the examples. Feel free to open a new issue or a discussion to share your thoughts and ideas.

## Discord

You can also join our Discord server to discuss the project and get involved in the development of the SDKs. You can join the server [here](https://discord.gg/ZUg87u5a). We have a sdk-experiment channel where we discuss the project and share updates.
