import dotenv from "dotenv";
import { createApi } from "unsplash-js";
import fetch from "cross-fetch";

dotenv.config();

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
  fetch,
});

export default unsplash;
