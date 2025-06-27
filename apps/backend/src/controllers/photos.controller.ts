import { Request, Response } from "express";
import unsplash from "../config/unsplash";

export const getPhotos = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.q as string;
    const result = await unsplash.search.getPhotos({
      query: searchQuery,
      page: 1,
      perPage: 10,
    });

    if (result.type === "success") {
      res.status(200).json(result.response);
    } else {
      res.status(500).json({ error: "Unsplash error", details: result.errors });
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
};
