import logging
import os

import requests
from langchain import hub
from langchain_openai import ChatOpenAI
from langsmith import traceable
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")
prompt = hub.pull("get_movie_prompt")


class MovieResponse(BaseModel):
    movie_name: str = Field(description="The name of the movie")


class MovieService:
    def __init__(self, openai_api_key):
        self.llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
            api_key=openai_api_key,
        ).with_structured_output(MovieResponse)

    def _get_comments_thread(self, video_id: str):
        try:
            endpoint = f"https://www.googleapis.com/youtube/v3/commentThreads?key={GOOGLE_API_KEY}&videoId={video_id}&part=snippet,replies&maxResults=100&order=relevance"
            response = requests.get(endpoint)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error getting comments thread: {str(e)}")
            return e

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
            raise e

    @traceable(name="perform_movie_rag", run_type="chain")
    async def perform_rag(self, video_id):
        try:
            comments = self._get_comments_thread(video_id)
            comment_soup = self._get_comment_soup(comments)
            messages = await prompt.ainvoke({"comment_soup": comment_soup})
            response = await self.llm.ainvoke(messages)
            return response.movie_name
        except Exception as e:
            print(f"Error performing RAG: {str(e)}")
            raise e
