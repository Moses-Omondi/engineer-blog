---
title: "Complete Guide to Kubernetes Monitoring with Prometheus and Grafana"
date: "September 2, 2025"
category: "Kubernetes"
excerpt: "Build a comprehensive monitoring stack for your Kubernetes cluster with Prometheus, Grafana, and AlertManager. Includes practical examples and production-ready configurations."
---

# Complete Guide to Kubernetes Monitoring with Prometheus and Grafana

Monitoring your Kubernetes clusters is critical for maintaining reliability, performance, and security. In this comprehensive guide, we'll build a production-ready monitoring stack using **Prometheus**, **Grafana**, and **AlertManager**.

## Why Kubernetes Monitoring Matters

Kubernetes environments are complex, with multiple layers of abstraction:

* **Cluster-level metrics** (nodes, pods, deployments)
* **Application metrics** (custom business logic)
* **Infrastructure metrics** (CPU, memory, network, storage)
* **Security events** (failed authentications, privilege escalations)

Without proper monitoring, issues can cascade quickly, leading to outages and performance degradation.

## Architecture Overview

Our monitoring stack will consist of:

### Core Components
- **Prometheus** - Metrics collection and storage
- **Grafana** - Visualization and dashboarding  
- **AlertManager** - Alert routing and management
- **Node Exporter** - Host-level metrics
- **kube-state-metrics** - Kubernetes object metrics

### Data Flow
1. Exporters collect metrics from various sources
2. Prometheus scrapes and stores metrics
3. Grafana queries Prometheus for visualization
4. AlertManager handles alerting rules and notifications

## Setting Up Prometheus

### Installation via Helm

First, add the Prometheus community Helm repository:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

Create a custom values file for production configuration:

```yaml
# prometheus-values.yaml
prometheus:
  prometheusSpec:
    retention: 15d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: fast-ssd
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 100Gi

alertmanager:
  alertmanagerSpec:
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: fast-ssd
          accessModes: ["ReadWriteOnce"]  
          resources:
            requests:
              storage: 10Gi

grafana:
  adminPassword: "secure-admin-password"
  persistence:
    enabled: true
    storageClassName: fast-ssd
    size: 10Gi
```

Install the monitoring stack:

```bash
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values prometheus-values.yaml
```

## Essential Monitoring Metrics

### Cluster Health Metrics

Monitor these critical cluster indicators:

```promql
# Cluster node availability
up{job="kubernetes-nodes"}

# Pod restart rates
rate(kube_pod_container_status_restarts_total[5m])

# Resource utilization
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100

# Disk usage
(node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100
```

### Application Performance

Track application-specific metrics:

```promql
# HTTP request rates
rate(http_requests_total[5m])

# Request duration percentiles  
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rates
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])
```

## Creating Effective Dashboards

### Grafana Dashboard Best Practices

1. **Start with Overview** - High-level cluster health
2. **Drill Down Capability** - Link to detailed views
3. **Consistent Time Ranges** - Synchronize across panels
4. **Appropriate Visualizations** - Choose the right chart types

### Sample Dashboard JSON

Here's a starter dashboard for Kubernetes monitoring:

```json
{
  "dashboard": {
    "title": "Kubernetes Cluster Overview",
    "panels": [
      {
        "title": "Cluster Nodes Status",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(up{job=\"kubernetes-nodes\"})",
            "legendFormat": "Available Nodes"
          }
        ]
      },
      {
        "title": "Pod Status Distribution", 
        "type": "piechart",
        "targets": [
          {
            "expr": "sum by (phase) (kube_pod_status_phase)",
            "legendFormat": "{{phase}}"
          }
        ]
      }
    ]
  }
}
```

## Alerting Rules Configuration

### Critical Alerts

Set up essential alerts for production environments:

```yaml
# high-priority-alerts.yaml
groups:
  - name: kubernetes-critical
    rules:
      - alert: KubernetesNodeDown
        expr: up{job="kubernetes-nodes"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Kubernetes node {{ $labels.instance }} is down"
          
      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) * 60 * 15 > 0
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is crash looping"
          
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
```

## Advanced Configuration

### Custom Metrics Collection

For application-specific monitoring, expose metrics in your applications:

```go
// Example Go application with Prometheus metrics
package main

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequests = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "status"},
    )
)

func init() {
    prometheus.MustRegister(httpRequests)
}

func handler(w http.ResponseWriter, r *http.Request) {
    httpRequests.WithLabelValues(r.Method, "200").Inc()
    // Your handler logic here
}
```

### ServiceMonitor Configuration

Tell Prometheus how to scrape your application:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: my-application
  endpoints:
  - port: metrics
    path: /metrics
    interval: 30s
```

## Security Considerations

### RBAC Configuration

Ensure proper permissions for monitoring components:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus-server
rules:
- apiGroups: [""]
  resources: ["nodes", "nodes/proxy", "services", "endpoints", "pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["extensions"]
  resources: ["ingresses"]
  verbs: ["get", "list", "watch"]
```

### Network Policies

Restrict network access to monitoring components:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: prometheus-netpol
  namespace: monitoring
spec:
  podSelector:
    matchLabels:
      app: prometheus
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: monitoring
```

## Performance Optimization

### Storage Optimization

- **Use SSDs** for Prometheus storage
- **Configure retention** based on your needs
- **Consider remote storage** for long-term data

### Query Optimization

- **Use recording rules** for frequently-used queries
- **Limit cardinality** of metrics labels
- **Configure appropriate scrape intervals**

## Troubleshooting Common Issues

### High Cardinality Problems

```promql
# Check series count by metric
topk(10, count by (__name__)({__name__=~".+"}))

# Identify high-cardinality labels
topk(10, count by (job)({__name__!=""}))
```

### Performance Issues

1. **Monitor Prometheus itself** - Check memory and CPU usage
2. **Review query performance** - Use query analyzer
3. **Optimize dashboard queries** - Reduce time ranges and frequency

## Production Checklist

- [ ] Persistent storage configured for all components
- [ ] Resource limits and requests set appropriately  
- [ ] Backup strategy implemented for Grafana dashboards
- [ ] AlertManager notifications configured (Slack, email, PagerDuty)
- [ ] Security policies applied (RBAC, NetworkPolicies)
- [ ] Monitoring for the monitoring stack itself
- [ ] Documentation and runbooks created
- [ ] Team training completed

## Conclusion

A well-configured monitoring stack is essential for running production Kubernetes workloads. By following this guide, you'll have:

- **Comprehensive visibility** into your cluster health
- **Proactive alerting** for critical issues  
- **Historical data** for capacity planning
- **Security monitoring** for compliance and threat detection

Remember: **Monitoring is not just about collecting data—it's about actionable insights that help you maintain reliable systems.**

## Next Steps

1. **Customize dashboards** for your specific applications
2. **Set up log aggregation** with tools like Fluentd or Fluent Bit
3. **Implement distributed tracing** with Jaeger or Zipkin
4. **Automate runbook procedures** based on common alerts

Happy monitoring! 🚀
