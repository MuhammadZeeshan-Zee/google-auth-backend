import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
console.log("YOUTUBE_API_KEY",YOUTUBE_API_KEY);

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const youtubeSearch=async (req, res) => {
    try {
      const { query } = req.query; // Get search query from frontend
  
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
  
      const response = await axios.get(YOUTUBE_SEARCH_URL, {
        params: {
          part: "snippet",
          maxResults: 12, // Number of results
          q: query,
          key: YOUTUBE_API_KEY,
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error("YouTube API Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch YouTube videos" });
    }
  }
  export {youtubeSearch}