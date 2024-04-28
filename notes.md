"client": "npm run dev --prefix frontend",
"start": "node server/server.js",
"server": "nodemon server/server.js",    
"dev": "concurrently \"npm run server\" \"npm run client\""