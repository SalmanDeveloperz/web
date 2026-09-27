---
title: "GSoC 2025 at FOSSology, week by week"
description: "Thirteen weeks of reviving a 2021 microservices branch: CrashLoopBackOff, a Make to CMake migration, and 26 Kustomize manifests."
date: 2025-09-12
tags: [gsoc, kubernetes, fossology, open-source]
---

In 2025 I was selected for **Google Summer of Code** with [FOSSology](https://www.fossology.org/), the open source license compliance toolkit. The project: take a microservices branch started by Omar AbdelSamea in 2021, bring it back to life on 2025 infrastructure, and get FOSSology's scheduler, database, web UI and agents running as separate services on Kubernetes.

This is the honest log. The full reports live in the [FOSSology GSoC docs](https://fossology.github.io/gsoc/docs/2025/microservices-infrastructure/) and my [final report](https://github.com/SalmanDeveloperz/GSoC-2025).

## Weeks 1 to 3: getting a UI on screen

The first job was simply building everything. I set up Docker, Minikube and kubectl on Ubuntu 24.04 and rebased the original branch. Out of the gate: Docker build failures, an outdated etcd image, and a web container proudly serving the default Debian Apache page instead of FOSSology.

I evaluated `bookworm-slim`, rolled back to `buster-slim` after compatibility issues, and fixed the Apache page by correcting file paths. Then `db-0` got stuck in `Init`. A missing `libcurl` broke the scheduler build. The web pod started before PostgreSQL was ready.

By week 3 I had a readiness gate on the web pod, a reset database, and the FOSSology UI loading for the first time.

## Weeks 4 to 7: the scheduler that would not stay up

I switched from Minikube to Kind for a faster local loop and learned the project's rebase workflow from my mentors. The scheduler sat in `CrashLoopBackOff` for most of this stretch.

Week 5 fixed it for good. Immediately after, the web pod started resolving PostgreSQL through `localhost` instead of the Kubernetes service. Classic.

My mentors and I agreed to migrate the build from **Make to CMake**. By week 7 most components built under CMake, the scheduler was isolated as the last failing image, and I passed the midterm evaluation.

## Weeks 8 to 11: filling the gaps

- Rebuilt everything with CMake on Debian Bookworm and synced with upstream `master`.
- Wrote missing Docker and Kubernetes manifests for four agents.
- Added database columns that were blocking the web agent.
- Implemented a `curl`-based health check for the scheduler.
- Designed a **Kustomize** base with development and production overlays across 26 manifests.

I also reached out to the original 2021 contributor for historical context. That one conversation saved days.

## Weeks 12 and 13: what was left

The remaining scheduler instability traced back to installation path mismatches, plus upstream database migrations and agent changes that landed after 2021. I compared the legacy and modern scheduler implementations, documented the gap, and submitted the closing report.

## What it actually taught me

Distributed systems are mostly configuration and ordering. But the biggest lesson was about **observability**. I spent whole afternoons correlating logs across containers by hand to figure out why the scheduler kept dying. That pain is the direct reason I later built [PoS-OTel](/writing/cutting-ci-trace-volume-81-percent/).

Thanks to my mentors [Avinal Kumar](https://github.com/avinal), [Shaheem Azmal M MD](https://github.com/shaheemazmalmmd) and [Gaurav Mishra](https://github.com/gmishx).
