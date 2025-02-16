import time

from fastapi import APIRouter, Body, HTTPException

from src.services import MovieService

router = APIRouter()


@router.get("/")
def hello_world():
    return {"message": "OK"}


@router.post("/movie")
async def get_movie(
    video_id: str = Body(embed=True), openai_key: str = Body(embed=True)
):
    try:
        start_time = time.time()
        movie_service = MovieService(openai_api_key=openai_key)
        movie_name = await movie_service.perform_rag(video_id)
        time_taken = time.time() - start_time
        time_taken_str = f"{time_taken:.2f}s"
        return {"movie_name": movie_name, "time_taken": time_taken_str}

    except Exception as e:
        print(f"Error getting movie: {str(e)}")
        raise HTTPException(
            status_code=500, detail="An error occurred while getting the movie"
        )
