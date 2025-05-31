## 🌟 Overview
Welcome to ByteBeasts Tamagotchi Game! 🎮 This interactive web-based game brings to life the magical creatures of Etheria known as ByteBeast. 🐾 Players act as guardians responsible for nurturing and caring for their Beasts, building a unique bond, and ensuring their companion grows strong and healthy. 💖

## 💻 Client Setup (with HTTPS)

To run the frontend locally over HTTPS (required for Controller), follow these steps:

### 1️⃣ Install mkcert  

Open a terminal and run:

```bash
brew install mkcert
```

> _mkcert_ is a simple tool for making locally-trusted development certificates.

---

### 2️⃣ Generate Local Certificates  

Run the following commands in the project root (or in the `client` folder):

```bash
mkcert -install
mkcert localhost
```

This will generate the files:  
- `localhost.pem` (certificate)  
- `localhost-key.pem` (private key)

---

### 3️⃣ Update Vite Configuration  

In your `vite.config.ts`, add the following `server` configuration:

```ts
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
});
```

---

### 4️⃣ Run the Development Server  

Make sure you're inside the `client` directory, then install dependencies and run the app:

```bash
cd client
pnpm install
pnpm run dev
```

> Ensure the HTTPS certificates (`localhost.pem` and `localhost-key.pem`) are present in the root of the `client` project.

---

### 🧱 Client Dependencies

- Node.js (make sure it’s installed)
- pnpm (recommended for managing dependencies)
