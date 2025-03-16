# Bedrock

This is the frontend application for the Bedrock.

## Environment Variables

The application uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
# CMS API URL - URL of the Payload CMS backend
NEXT_PUBLIC_CMS_API_URL=http://localhost:3001
```

You can customize these values based on your environment:

- Development: `http://localhost:3001`
- Staging: `https://staging-api.yourdomain.com`
- Production: `https://api.yourdomain.com`

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Homepage with featured/spotlight articles
- Category filtering
- Article detail pages
- Responsive design

## Connecting to the CMS

This frontend connects to a Payload CMS backend. Make sure the CMS is running and accessible at the URL specified in your environment variables. 