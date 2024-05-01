from urllib.parse import unquote
from sqlmodel import Session, create_engine, SQLModel, select
from app import config
from app.models import StravaOAuthToken, User

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)

def create_session():
    session = Session(engine)
    return session

def create_user(user: User):
    session = create_session()
    session.add(user)
    session.commit()
    session.refresh(user)
    session.close()
    return user

def get_token_info(email: str):
    session = create_session()
    statement = select(User).where(User.email==email)
    results = session.exec(statement)
    user = results.first()
    statement_strava = select(StravaOAuthToken).where(StravaOAuthToken.user_id==user["id"])
    results = session.exec(statement_strava)
    token_info = results.first()
    session.close()
    return token_info

def get_user_by_email(email: str):
    session = create_session()
    email = unquote(email)
    statement = select(User).where(User.email==email)
    results = session.exec(statement)
    user = results.first()
    session.close()
    existing_token = session.query(StravaOAuthToken).filter_by(user_id=user.id).first()
    user.strava= True if existing_token else False    
    return user

import datetime

def update_token_strava(token: dict):
    session = create_session()
    existing_token = session.query(StravaOAuthToken).filter_by(user_id=token['user_id']).first()
    
    if existing_token:
        existing_token.access_token = token['access_token']
        existing_token.refresh_token = token['refresh_token']
        existing_token.expires_at = datetime.datetime.utcfromtimestamp(token['expires_at'])
        existing_token.token_type = "STRAVA"
        existing_token.scope = "read,activity:read_all,profile:read_all"
        session.commit()
        session.refresh(existing_token)
        updated_token = existing_token
    else:
        token['token_type'] = "STRAVA"
        token["scope"] = "read,activity:read_all,profile:read_all"
        new_token = StravaOAuthToken(**token)
        new_token.expires_at = datetime.datetime.utcfromtimestamp(token['expires_at'])
        session.add(new_token)
        session.commit()
        session.refresh(new_token)
        updated_token = new_token
    
    session.close()
    return updated_token
