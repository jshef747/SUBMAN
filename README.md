# SUBMAN — Subscription Manager

A fully self-contained subscription management app. Runs entirely inside a Kubernetes cluster — no external services, no credentials, no configuration needed.

**Stack:** NestJS · Prisma · PostgreSQL · React 19 · Nginx · Helm

---

## Prerequisites

| Tool | Install |
|---|---|
| Docker Desktop (includes kubectl) | https://www.docker.com/products/docker-desktop |
| Minikube (local cluster) | https://minikube.sigs.k8s.io/docs/start |
| Helm 3 | https://helm.sh/docs/intro/install |

---

## Quick Start

### macOS

```bash
# 1. Start a local cluster
minikube start

# 2. Install the app
helm upgrade --install subman \
  oci://registry-1.docker.io/jsheffer747/subman \
  --version 0.1.0

# 3. Wait for all pods to be Running
kubectl get pods -w

# 4. Open the app in your browser
minikube service subman-client
```

---

### Linux

```bash
# 1. Start a local cluster
minikube start

# 2. Install the app
helm upgrade --install subman \
  oci://registry-1.docker.io/jsheffer747/subman \
  --version 0.1.0

# 3. Wait for all pods to be Running
kubectl get pods -w

# 4. Open the app (tunnel in background)
minikube service subman-client
```

---

### Windows (PowerShell)

```powershell
# 1. Start a local cluster
minikube start

# 2. Install the app
helm upgrade --install subman `
  oci://registry-1.docker.io/jsheffer747/subman `
  --version 0.1.0

# 3. Wait for all pods to be Running
kubectl get pods -w

# 4. Open the app
minikube service subman-client
```

---

## Alternative: Install from Source

Clone this repo and install from the local chart:

```bash
git clone https://github.com/jsheffer747/SUBMAN.git
cd SUBMAN
helm upgrade --install subman k8s/helm-chart/subman/
```

---

## Verifying Pods are Ready

```bash
kubectl get pods
```

All three should show `1/1 Running`:

```
NAME                           READY   STATUS    RESTARTS
postgres-0                     1/1     Running   0
subman-api-xxx                 1/1     Running   0
subman-client-xxx              1/1     Running   0
```

The API pod has two init containers that run first:
1. `wait-for-postgres` — waits until the database is accepting connections
2. `db-migration` — runs `prisma migrate deploy` to set up the schema

---

## Usage

1. Visit the app URL from `minikube service subman-client`
2. Click **Login** or **Sign Up** — any email/password is accepted
3. You land on the dashboard
4. Click **Add Subscription** to track a service
5. Subscriptions are persisted in the in-cluster PostgreSQL database

---

## Custom Namespace

```bash
kubectl create namespace subman
helm upgrade --install subman \
  oci://registry-1.docker.io/jsheffer747/subman \
  --version 0.1.0 \
  -n subman
```

---

## Configuration

All defaults live in `k8s/helm-chart/subman/values.yaml`.

| Value | Default | Description |
|---|---|---|
| `api.image.tag` | `latest` | API image tag |
| `client.image.tag` | `latest` | Frontend image tag |
| `postgres.dbPassword` | `DefaultPassword123!` | Postgres password |
| `postgres.dbUser` | `subman_user` | Postgres username |
| `postgres.dbName` | `subman_db` | Database name |
| `postgres.storageSize` | `1Gi` | PVC size |

Override at install time:

```bash
helm upgrade --install subman \
  oci://registry-1.docker.io/jsheffer747/subman \
  --version 0.1.0 \
  --set postgres.dbPassword=mysecret
```

---

## Uninstall

```bash
helm uninstall subman
```

To also delete the persistent volume (removes all subscription data):

```bash
kubectl delete pvc -l app=postgres
```

---

## Building and Publishing Images (maintainer)

```bash
# Build and push Docker images
docker build -t jsheffer747/subman-api:latest ./api
docker push jsheffer747/subman-api:latest

docker build -t jsheffer747/subman-client:latest ./frontend/subman-client
docker push jsheffer747/subman-client:latest

# Package and push Helm chart
helm package k8s/helm-chart/subman/
helm push subman-0.1.0.tgz oci://registry-1.docker.io/jsheffer747
```
