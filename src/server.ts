import "dotenv/config";
import app from "./app";


declare var process: {
  env: {
    NODE_ENV: string;
    DB_NAME: string;
    PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    JWT_SECRET: string;
  };
};

// Run our server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app running on the port ${port}`);
});
