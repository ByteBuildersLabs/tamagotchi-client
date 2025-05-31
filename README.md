## 🌟 Overview  
Welcome to ByteBeasts Tamagotchi Game! 🎮 This interactive web-based game brings to life the magical creatures of Etheria known as ByteBeast. 🐾 Players act as guardians responsible for nurturing and caring for their Beasts, building a unique bond, and ensuring their companion grows strong and healthy. 💖

---

## 💻 Client Setup (with HTTPS)

To run the frontend locally over HTTPS (required for Controller), follow these steps:

### 1️⃣ Install mkcert  

Open a terminal and run:

```bash
brew install mkcert
````

> *mkcert* is a simple tool for making locally-trusted development certificates.

---

### 2️⃣ Generate Local Certificates

Run the following commands in the project root (or in the `client` folder):

```bash
mkcert -install
mkcert localhost
```

This will generate the certificate files:

* `localhost.pem`
* `localhost-key.pem`

Rename them as follows to match your desired filenames:

```bash
mv localhost.pem mkcert+1.pem
mv localhost-key.pem mkcert+1-key.pem
```

---

### 3️⃣ Update Vite Configuration

In your `vite.config.ts`, update the `server` configuration to use the renamed certificate files:

```ts
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('mkcert+1-key.pem'),
      cert: fs.readFileSync('mkcert+1.pem'),
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

> Ensure the HTTPS certificates (`mkcert+1.pem` and `mkcert+1-key.pem`) are present in the root of the `client` project.

---

### 🧱 Client Dependencies

* Node.js (make sure it’s installed)
* pnpm (recommended for managing dependencies)
