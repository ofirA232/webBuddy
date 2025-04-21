import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Define a simple API endpoint for contact form
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      // Validate input
      if (!name || !email || !message) {
        return res.status(400).json({ 
          message: 'All fields are required'
        });
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({
          message: 'Invalid email format'
        });
      }
      
      // For now, just acknowledge receipt - in production would store in DB
      return res.status(200).json({
        success: true,
        message: 'Message received'
      });
    } catch (error) {
      console.error('Error processing contact submission:', error);
      return res.status(500).json({
        message: 'Server error processing contact form'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
