from fastapi import APIRouter, Depends, Response, HTTPException, status
from fastapi.responses import RedirectResponse

from app.dto.group import GroupDto
from app.dto.group import GroupCreateDto
from app.dto.group import GroupJoinDto
from app.dto.member import MemberDto
from app.dto.member import MemberOnlyDto
from app.api.dependencies import get_current_user_id
from app.api.dependencies import get_group_service
from app.dto.result import ResultDto

router = APIRouter(prefix="/groups",
                   tags=["groups"],
                   )


@router.post("/create/{name}", response_model=GroupDto)
async def create_group(name: str, admin_id: int = Depends(get_current_user_id)):
    dto = GroupCreateDto(name=name, admin_id=admin_id)
    group = await get_group_service().create_group(dto)    
    return group


@router.get("/all", response_model=list[GroupDto])
async def get_all_groups(user_id: int = Depends(get_current_user_id)):
    groups = await get_group_service().get_all_groups(user_id)
    return groups


@router.get("/my", response_model=list[GroupDto])
async def get_all_owned_groups(admin_id: int = Depends(get_current_user_id)):
    groups = await get_group_service().get_all_owned_groups(admin_id)
    return groups


@router.get("/{id}/members", response_model=list[MemberDto])
async def get_group_members(id: int, user_id: int = Depends(get_current_user_id)):
    members = await get_group_service().get_members(user_id, id)
    return members


@router.get("/join/{group_token}")
async def join_group(group_token: str, user_id: int = Depends(get_current_user_id)):
    dto = GroupJoinDto(user_id=user_id, token=group_token)
    await get_group_service().join_group_by_token(dto)
    return RedirectResponse(url="http://localhost:3000/me/groups")


@router.get("/{id}/token")
async def get_group_token(id: int, user_id: int = Depends(get_current_user_id)):
    token = await get_group_service().get_group_token(id, user_id)
    return token


@router.get("/{id}", response_model=GroupDto)
async def get_group_info(id: int, user_id: int = Depends(get_current_user_id)):
    info = await get_group_service().get_group_info(id, user_id)
    return info


@router.get("/{id}/history", response_model=list[ResultDto])
async def get_group_history(id: int, user_id: int = Depends(get_current_user_id)):
    history = await get_group_service().get_history(id, user_id)
    return history


@router.post("/{id}/ban/{user_id}", response_model=MemberOnlyDto)
async def ban_user_in_group(id: int, user_id: int, admin_id: int = Depends(get_current_user_id)):
    member = await get_group_service().ban_user(id, user_id, admin_id)
    return member


@router.post("/{id}/unban/{user_id}", response_model=MemberOnlyDto)
async def unban_user_in_group(id: int, user_id: int, admin_id: int = Depends(get_current_user_id)):
    member = await get_group_service().unban_user(id, user_id, admin_id)
    return member