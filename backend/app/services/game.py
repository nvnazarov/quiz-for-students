from fastapi import WebSocket


class Game:
    members: list[WebSocket]
    admin: WebSocket
    
    def add_member(self, websocket: WebSocket):
        self.members.append(websocket)


class GameService:
    def init_game():
        pass


    def start_game():
        pass


    def end_game():
        pass


    def connect(websocket: WebSocket):
        pass


    def disconnect():
        pass