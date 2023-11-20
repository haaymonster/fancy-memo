from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

class Memo(BaseModel):
    id:int
    content:str

memos = []

app = FastAPI()

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

app.mount('/', StaticFiles(directory="static",html=True), name="static")