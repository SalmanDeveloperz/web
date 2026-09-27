---
title: "Closing a 2017 issue in the official Jenkins Docker image"
description: "Opt-in environment variable substitution for containerized Jenkins, now shipping in Weekly 2.565 and LTS 2.568.1, on Linux and Windows."
date: 2026-07-10
tags: [jenkins, docker, powershell, open-source]
---

Some issues stay open for years because the fix is small but the blast radius is not. Environment variable substitution in the official [Jenkins Docker image](https://github.com/jenkinsci/docker) was one of them, open since 2017.

## The problem

On startup the image copies reference configuration from `/usr/share/jenkins/ref` into `JENKINS_HOME`. If you run Jenkins in containers across environments, you want those files to pick up values like hostnames or URLs from the environment, not hard-code them per image.

Without substitution, people either baked one image per environment or wrote their own entrypoint wrappers.

## The fix, Linux first

[jenkinsci/docker#2250](https://github.com/jenkinsci/docker/pull/2250) adds **opt-in** environment variable substitution for reference configuration files. Opt-in was the key design decision. Existing users whose files happen to contain `$` characters see zero change in behavior unless they turn it on.

## Then Windows parity

Jenkins also ships Windows container images, and a feature that only works on Linux is half a feature. I opened [#2350](https://github.com/jenkinsci/docker/issues/2350) to track it and followed up with [#2365](https://github.com/jenkinsci/docker/pull/2365):

- A new `Invoke-EnvVarSubstitution` function in `jenkins-support.psm1`.
- Substitution for `.xml`, `.conf`, `.properties` and `.groovy` files.
- Three new **Pester** tests covering the behavior.

## Shipped

Both changes are in official releases: **Weekly 2.565** and **LTS 2.568.1**. Every team pulling the official image gets them.

The lesson I keep relearning in large projects: the code is rarely the hard part. Backward compatibility, cross-platform parity, and tests that convince a maintainer are the real work.
