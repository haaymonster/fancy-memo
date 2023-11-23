from fastapi import FastAPI,UploadFile,Form,Response,Depends
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Annotated
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
import sqlite3
import time

con = sqlite3.connect('db.db',check_same_thread=False)
cur = con.cursor()

cur.execute(f"""
            CREATE table IF NOT EXISTS profile (
                id integer primary key,
                avatar blob,
                description text,
                createTime integer not null
            )
            """)

class Memo(BaseModel):
    id:int
    content:str

memos = []

app = FastAPI()

SECRET = 'super-coding'
manager = LoginManager(SECRET,'/login.html')


@app.post('/updateProfile')
async def update_profile(
    description:Annotated[str,Form()],
    image:UploadFile):
    
    image_bytes = await image.read()
    cur.execute(f"""
                INSERT INTO profile(avatar,description,createTime)
                VALUES ('{image_bytes.hex()}', '{description}',{time.time() * 1000})
                """)
    con.commit()
    return 'your bio updated!'

@app.get('/getProfile')
async def read_profile(user=Depends(manager)):
    # get colum names
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                       SELECT * from profile ORDER BY createTime DESC LIMIT 1;
                       """).fetchall()
    return JSONResponse(
        jsonable_encoder(dict(row) for row in rows)
    )

@app.post('/createMemo')
def create_memo(memo:Memo):
    memos.append(memo)
    return {'message':'add successfully!'}

@app.get('/getMemo')
def read_memo(sortBy:str=''):
    
    if len(memos) > 0:
        if sortBy == 'createTime' :
            return sorted(memos, key=lambda x: x.id, reverse=True)
        if sortBy == 'name':
            return sorted(memos, key=lambda x: x.content)
    return memos


@app.put('/updateMemo')
def update_memo(memo: Memo):
    for m in memos:
        if m.id == memo.id:
            m.content = memo.content
            return 'updated!'
    return 'error!'

@app.delete('/deleteMemo')
def delete_memo(memo:Memo):
    for m in memos:
        if m.id == memo.id:
            memos.remove(m)
            return 'deleted!'
    return 'error'

@app.post('/signUp')
def sign_up(
    userName:Annotated[str,Form()],
    passWord:Annotated[str,Form()]
    ):
    con.execute(f"""
                    INSERT INTO user (id,passWord,createTime)
                    VALUES ('{userName}','{passWord}',{time.time() * 1000})
                """)
    con.commit()
    return  'sign up successfully!'

@manager.user_loader()
def exist_user(data):
    WHERE_STATEMENTS = f'id = "{data}"'
    if type(data) == dict:
        WHERE_STATEMENTS = f'''id="{data['id']}"'''
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    user = con.execute(f"""
                    SELECT * from user WHERE {WHERE_STATEMENTS}
                """).fetchone()
    
    return (user)
    
    
@app.post('/login')
def login(
    userName:Annotated[str,Form()],
    passWord:Annotated[str,Form()]
):
    user = exist_user(userName)
    if not user:
        raise InvalidCredentialsException
    elif passWord != user['passWord']:
        raise InvalidCredentialsException
    
    token = manager.create_access_token(data=  {
        'sub' : {
        'id': user['id'],
        'Password' : user['passWord']
    }
    })
    return {'token':token}

app.mount('/', StaticFiles(directory="static",html=True), name="static")