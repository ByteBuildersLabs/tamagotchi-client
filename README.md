## 🌟 Overview

Welcome to ByteBeasts Tamagotchi Game! 🎮 This interactive web-based game brings to life the magical creatures of Etheria known as ByteBeasts. 🐾 Players act as guardians responsible for nurturing and caring for their Beasts, building a unique bond, and ensuring their companion grows strong and healthy. 💖

---

## 💻 Client Setup

### 🧱 Prerequisites

* **Node.js**
* **pnpm** (recommended for managing dependencies)
* **mkcert** (for HTTPS development)

Install mkcert (if you don’t have it):

```bash
brew install mkcert
mkcert -install
```

> *mkcert* is a simple tool for creating locally-trusted development certificates.

---

## ⚡ Development Scenarios

### 🌐 Run with HTTP (default)

No HTTPS, simple local development:

```bash
pnpm dev
```

or explicitly:

```bash
pnpm dev:http
```

> This starts the Vite dev server on HTTP.

---

### 🔐 Run with HTTPS

To develop with HTTPS (required for certain features like Controller or Service Worker testing):

#### 1️⃣ Generate certificates

Run:

```bash
pnpm mkcert
```

This will generate:

* `dev.pem`
* `dev-key.pem`

These files will be automatically used by Vite if you run the HTTPS script.

---

#### 2️⃣ Run dev server with HTTPS

```bash
pnpm dev:https
```

> This will start your app at `https://localhost:3002` (or your configured port), using the generated certificates.

---

## ⚙️ Scripts summary

| Command          | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `pnpm dev`       | Run dev server over HTTP                                      |
| `pnpm dev:http`  | Force HTTP dev server                                         |
| `pnpm dev:https` | Run dev server with HTTPS (using mkcert certificates)         |
| `pnpm mkcert`    | Generate local HTTPS certificates (`dev.pem` + `dev-key.pem`) |
| `pnpm build`     | Build production assets                                       |
| `pnpm preview`   | Preview production build locally                              |
