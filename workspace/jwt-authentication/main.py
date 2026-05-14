from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from auth import create_access_token, verify_token
from models import User, Token

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock user database
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "password": "secret"
    }
}

def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user or user["password"] != password:
        return False
    return user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    username = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    return {"username": username}