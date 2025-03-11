import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { setupAuth } from "./auth";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/face-auth", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { faceDescriptor } = req.body;
    const user = await storage.updateUser(req.user.id, { faceDescriptor });
    res.json(user);
  });

  app.post("/api/pair-device", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { deviceId } = req.body;
    const user = await storage.updateUser(req.user.id, { deviceId, isPaired: true });
    res.json(user);
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time device pairing with specific path
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'  // Specific path to avoid conflicts
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');

    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        // Broadcast device pairing requests
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}