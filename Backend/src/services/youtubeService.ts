import { env } from "../config/env";
import { HttpError } from "../utils/httpError";
import { memo } from "./memoCache";

export type PlaylistVideo = { id: string; title: string; thumbnail: string; publishedAt: string };

type PlaylistPage = {
  nextPageToken?: string;
  items?: {
    snippet: {
      title: string;
      publishedAt: string;
      resourceId?: { videoId?: string };
      thumbnails?: Record<string, { url: string } | undefined>;
    };
  }[];
};

/** Fetches a playlist via the YouTube Data API, cached for 30 minutes (stale copy served if YouTube fails). */
export const getPlaylistVideos = (playlistId: string) =>
  memo(`yt:${playlistId}`, 30 * 60 * 1000, async () => {
    if (!env.youtubeApiKey) throw new HttpError(503, "YouTube is not configured");
    const videos: PlaylistVideo[] = [];
    let pageToken = "";
    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.search = new URLSearchParams({
        part: "snippet",
        maxResults: "50",
        playlistId,
        key: env.youtubeApiKey,
        ...(pageToken ? { pageToken } : {})
      }).toString();
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new HttpError(502, `YouTube error ${res.status}`);
      const page = (await res.json()) as PlaylistPage;
      for (const item of page.items ?? []) {
        const id = item.snippet.resourceId?.videoId;
        if (!id || item.snippet.title === "Private video" || item.snippet.title === "Deleted video") continue;
        const t = item.snippet.thumbnails ?? {};
        videos.push({
          id,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
          thumbnail: (t.medium ?? t.high ?? t.default)?.url ?? `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
        });
      }
      pageToken = page.nextPageToken ?? "";
    } while (pageToken && videos.length < 300);
    return videos.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  });
