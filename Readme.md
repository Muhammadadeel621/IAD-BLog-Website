# Steps to run the project

1. Clone the project

```bash
git clone <project_url>
```

2. Open the project in your favourite code editor and then follow the remaining steps

## Steps to run server

1. Install dependencies

```bash
cd server
npm install
```

2. Add .env variables in server folder itself

```.env
PORT=3500
MONGO_URI=<your_mongo_uri>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
```

3. Run the project

```bash
npm start
```

## Steps to run client

1. Install dependencies

```bash
cd client
npm install
```

2. Add .env variables in client folder itself

```.env
VITE_BACKEND_URL=http://localhost:3500/
```

3. Run the project

```bash
npm run dev
```
