# Overview

Simple Social Media Backend

- I am creating this app for learning purposes;

  - basically, you can create posts with multiple images and text, and also comment, react, and reply to your posts .
  - Image Restriction Also Available Depends On Image Content.
  - Other users also able view,react,comment and reply to your posts.

### Technology used

- Nodejs (version - v16.20.1)- Express.js
- 11.1.2-MariaDB Arch Linux, If you have mySql server installed, you are ok.
- ORM-Sequlizer
- Typescript
- TensorFlow/coco-ssd

### Installation and Run

1.  Install npm packages:

```bash
npm i
```

2. Setup environment variables:

Copy `.env.example` to `.env` and you can also replace `.env` configurations with yours.

3. Seed data.

- for creating Database and Seeding Sample Students data run this script

```
ts-node src/seed/data/importData.ts
```

4. Start app

```bash
npm run dev
```

Local address of the app will be `http://127.0.0.1:6006` , if you used my env port.

**Note: Api documentation will updated soon**
