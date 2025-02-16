from fastapi import APIRouter

from src.services import MovieService

router = APIRouter()


@router.get("/")
def hello_world():
    return {"message": "OK"}


@router.get("/movie/{video_id}")
def get_movie(video_id: str):
    movie_service = MovieService()
    comment_soup = movie_service.perform_rag(video_id)
    return {"message": f"Movie for {video_id}", "comment soup": comment_soup}
