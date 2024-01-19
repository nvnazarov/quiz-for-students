from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.router import router as auth_router

app = FastAPI()

origins = [
    'http://localhost:3000',  # frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=['GET', 'POST'],
    allow_headers=['*'],
)

# include routers
app.include_router(auth_router, prefix='/api')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
