from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/")
def root():
    return {"status": "ok", "service": "subman-api"}


@router.get("/healthz")
def healthz():
    return "OK"


@router.get("/readinessz")
def readinessz():
    return "OK"
