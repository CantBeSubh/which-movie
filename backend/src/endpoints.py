from fastapi import APIRouter, Body

from src.services import MovieService

router = APIRouter()


@router.get("/")
def hello_world():
    return {"message": "OK"}


@router.post("/movie")
async def get_movie(
    video_id: str = Body(embed=True), openai_key: str = Body(embed=True)
):
    print(video_id)
    print(openai_key)
    movie_service = MovieService(openai_api_key=openai_key)
    comment_soup = await movie_service.perform_rag(video_id)
    return {"message": f"Movie for {video_id}", "comment soup": comment_soup}
