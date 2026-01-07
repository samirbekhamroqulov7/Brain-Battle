// Socket.io event handlers for real-time game synchronization

import type { Socket } from "socket.io"
import type { Room, GameMove } from "@/lib/types/game-types"

export class GameSocketHandler {
  private activeRooms: Map<string, Room> = new Map()
  private playerSockets: Map<string, string> = new Map() // userId -> socketId

  handleConnection(socket: Socket) {
    console.log(`[Socket] Player connected: ${socket.id}`)

    socket.on("join-room", (data: { roomId: string; userId: string }) => {
      this.handleJoinRoom(socket, data)
    })

    socket.on("game-move", (data: { roomId: string; move: GameMove }) => {
      this.handleGameMove(socket, data)
    })

    socket.on("leave-room", (data: { roomId: string }) => {
      this.handleLeaveRoom(socket, data)
    })

    socket.on("send-message", (data: { roomId: string; message: string }) => {
      this.handleMessage(socket, data)
    })

    socket.on("disconnect", () => {
      this.handleDisconnect(socket)
    })
  }

  private handleJoinRoom(socket: Socket, data: { roomId: string; userId: string }) {
    socket.join(data.roomId)
    this.playerSockets.set(data.userId, socket.id)

    const room = this.activeRooms.get(data.roomId)
    if (room) {
      socket.emit("room-state", room)
      socket.to(data.roomId).emit("player-joined", {
        userId: data.userId,
        playersCount: room.players.length,
      })
    }
  }

  private handleGameMove(socket: Socket, data: { roomId: string; move: GameMove }) {
    const room = this.activeRooms.get(data.roomId)
    if (!room) return

    // Validate move on server side
    const isValid = this.validateMove(room, data.move)

    if (isValid) {
      room.moves.push(data.move)
      socket.to(data.roomId).emit("move-made", {
        move: data.move,
        gameState: this.getGameState(room),
      })
    } else {
      socket.emit("invalid-move", { message: "Move validation failed" })
    }
  }

  private handleLeaveRoom(socket: Socket, data: { roomId: string }) {
    socket.leave(data.roomId)
    socket.to(data.roomId).emit("player-left", {
      socketId: socket.id,
    })
  }

  private handleMessage(socket: Socket, data: { roomId: string; message: string }) {
    socket.to(data.roomId).emit("chat-message", {
      senderSocketId: socket.id,
      message: data.message,
      timestamp: Date.now(),
    })
  }

  private handleDisconnect(socket: Socket) {
    console.log(`[Socket] Player disconnected: ${socket.id}`)
    // Clean up player socket mapping
    for (const [userId, socketId] of this.playerSockets.entries()) {
      if (socketId === socket.id) {
        this.playerSockets.delete(userId)
        break
      }
    }
  }

  private validateMove(room: Room, move: GameMove): boolean {
    // This will be overridden per game type
    return move.validationStatus === "pending"
  }

  private getGameState(room: Room): Record<string, any> {
    return {
      moves: room.moves,
      players: room.players.map((p) => ({ id: p.id, username: p.username })),
      status: room.status,
    }
  }

  addRoom(roomId: string, room: Room) {
    this.activeRooms.set(roomId, room)
  }

  removeRoom(roomId: string) {
    this.activeRooms.delete(roomId)
  }
}
