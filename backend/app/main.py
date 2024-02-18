from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users, groups, quizzes

app = FastAPI()

origins = [
    "http://localhost:3000",  # frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"])

app.include_router(users.router)
app.include_router(groups.router)
app.include_router(quizzes.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)