import logging
import os

import requests

logger = logging.getLogger(__name__)
print(logging.DEBUG)

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")


class MovieService:
    def _get_comments_thread(self, video_id: str):
        try:
            endpoint = f"https://www.googleapis.com/youtube/v3/commentThreads?key={GOOGLE_API_KEY}&videoId={video_id}&part=snippet,replies&maxResults=100&order=relevance"
            response = requests.get(endpoint)
            return response.json()
        except Exception as e:
            print(f"Error getting comments thread: {str(e)}")
            return {}

    def _get_comment_soup(self, comments: dict):
        try:
            comment_soups = []
            for thread in comments.get("items", []):
                try:
                    top_comment_text = f"<comment>{thread['snippet']['topLevelComment']['snippet']['textOriginal']}</comment>"
                    replies_text = "<replies>No replies</replies>"
                    if thread.get("replies"):
                        reply_texts = [
                            f"<reply>{comment['snippet']['textOriginal']}</reply>"
                            for comment in thread["replies"]["comments"]
                        ]
                        replies_text = "\n".join(reply_texts)
                    thread_soup = f"{top_comment_text}\n\n{replies_text}"
                    comment_soups.append(thread_soup)
                except AttributeError as e:
                    print(f"Error parsing comment thread: {str(e)}")
                    continue
            return "\n\n".join(comment_soups)
        except Exception as e:
            print(f"Error generating comment soup: {str(e)}")
            return ""

    def perform_rag(self, video_id):
        try:
            print(f"Performing RAG for video {video_id}")
            comments = self._get_comments_thread(video_id)
            print(f"Comments retrieved: {len(comments.get('items'))}")
            comment_soup = self._get_comment_soup(comments)
            print("Comment soup generated")
            return comment_soup
        except Exception as e:
            print(f"Error performing RAG: {str(e)}")
            return ""
