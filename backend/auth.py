from fastapi import Header, HTTPException

def verify_token(authorization: str = Header(...)):
    if authorization != "Bearer mysecrettoken":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return "authenticated_user"
