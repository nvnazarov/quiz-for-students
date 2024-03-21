from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()

from app.api.routers import all_routers

app = FastAPI(title="Quiz app",
              )

app.add_middleware(CORSMiddleware,
                   allow_origins=[
                       "http://localhost:3000",  # frontend
                       ],
                   allow_credentials=False,
                   allow_methods=[
                       "GET",
                       "POST",
                       ],
                   allow_headers=[
                       "*",
                       ]
                   )

for router in all_routers:
    app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="app.main:app", reload=True)