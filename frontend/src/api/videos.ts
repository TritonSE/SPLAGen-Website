import { APIResult, handleAPIError } from "./requests";

type YoutubeAPISearchResult = {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      thumbnails: {
        high: {
          url: string;
        };
      };
    };
  }[];
};

export type YoutubeVideo = {
  id: string;
  thumbnail: string;
};

export const SPLAGEN_CHANNEL_ID = "UCX8nRKvDufoRG-U8nKiwSTw";

export const getYoutubeVideos = async (): Promise<APIResult<YoutubeVideo[]>> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${SPLAGEN_CHANNEL_ID}&maxResults=10&order=date&type=video&key=AIzaSyCDok-Bv5XRhMlJsPMTMFEf82ZgIK04-54`,
    );
    const data = (await response.json()) as YoutubeAPISearchResult;
    const videos = data.items.map((video) => ({
      id: video.id.videoId,
      thumbnail: video.snippet.thumbnails.high.url,
    }));
    // Display the first 4 videos
    return { success: true, data: videos.slice(0, 4) };
  } catch (error) {
    return handleAPIError(error);
  }
};
