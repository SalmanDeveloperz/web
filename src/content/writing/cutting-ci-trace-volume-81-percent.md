---
title: "Cutting CI trace volume by 81% with tail sampling"
description: "How an OpenTelemetry Collector in front of Jenkins keeps every failure and slow build while dropping most of the noise."
date: 2026-03-20
tags: [opentelemetry, jenkins, observability, prometheus]
---

After GSoC I wanted one thing: never again correlate container logs by hand to understand a broken pipeline. So I built [PoS-OTel](https://github.com/SalmanDeveloperz/PoS-OTel), a local observability stack for CI/CD. It runs with a single `docker compose up`.

## The shape of it

```text
Jenkins (OTLP traces)
        |
        v
 OpenTelemetry Collector --- tail_sampling --- spanmetrics
        |                                          |
        v                                          v
      Jaeger                                  Prometheus ---> Grafana
```

A **pipeline simulator** written in Python emits realistic success, failure and slow-job metrics, so the Grafana dashboards are never empty on day one.

## The sampling policy

Most CI traces are boring: a green build that took the usual time. Storing every one of them is expensive and buries the traces you actually open. Head sampling does not help, because it decides before you know whether the build failed.

Tail sampling waits for the whole trace, then decides. The collector keeps:

1. **Every trace with an error.** A failed build is always worth keeping.
2. **Every slow trace**, over 30 seconds.
3. **20% of everything else**, as a baseline.

```yaml
processors:
  tail_sampling:
    policies:
      - name: errors
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: slow
        type: latency
        latency: { threshold_ms: 30000 }
      - name: baseline
        type: probabilistic
        probabilistic: { sampling_percentage: 20 }
```

Across 9 pipeline runs, that policy alone cut stored trace volume by **81%**, without losing a single failed or slow build.

## Metrics without a second pipeline

The `spanmetrics` connector turns spans into RED metrics (rate, errors, duration) before sampling throws anything away. Prometheus scrapes them, so the dashboards stay statistically honest even though Jaeger keeps only a fraction of traces.

The provisioned **Pipeline Observability** dashboard shows success rate, failure rate, slow jobs, throughput, p50 and p95 duration by job type, and collector ingestion.

## Alerts that mean something

Three Prometheus rules ship with the stack:

- `PipelineFailureRateHigh`
- `PipelineSlowJobsDetected`
- `OTelCollectorDroppingSpans`, because an observability pipeline that silently drops data is worse than none.

The code, dashboards and alert rules are all in the [repository](https://github.com/SalmanDeveloperz/PoS-OTel).
