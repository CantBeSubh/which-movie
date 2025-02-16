import time

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from src.services import MovieService

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.get("/")
@limiter.limit("10/minute")
def hello_world(request: Request):
    return {"hello": "there!"}


@router.post("/movie")
@limiter.limit("5/minute")
async def get_movie(request: Request):
    body = await request.json()
    openai_key = body.get("openai_key")
    video_id = body.get("video_id")
    try:
        assert openai_key, "openai_key key is required"
        assert video_id, "video_id is required"

        start_time = time.time()
        movie_service = MovieService(openai_api_key=openai_key)
        movie_name = await movie_service.perform_rag(video_id)
        time_taken = time.time() - start_time
        time_taken_str = f"{time_taken:.2f}s"
        return {"movie_name": movie_name, "time_taken": time_taken_str}

    except AssertionError as e:
        print(f"Error getting movie: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error getting movie: {str(e)}")
        raise HTTPException(
            status_code=500, detail="An error occurred while getting the movie"
        )
