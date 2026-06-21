# e-whiteboard-client

A React frontend for a collaborative whiteboard app.

It provides:
- room-based whiteboard sessions
- realtime drawing over WebSocket
- room chat and chat history loading
- Google login
- mock API support with `json-server` for local demo data

![Image](https://i.imgur.com/XV8RHdK.gif)

## Overview

This client works with the companion backend in `e-whiteboard-server`.
For local UI development, it can also use `json-server` to serve demo data for
boards, rooms, and chat history.

## Prerequisites

Create a local `.env` file based on `.env.example`.

Typical local setup:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_SERVER_HOST=http://localhost:8080
REACT_APP_WEBSOCKET_DRAW_HOST=ws://localhost:8080/ws/drawing
```

If you want to use mock API data instead of the real backend, point:

```env
REACT_APP_API_SERVER_HOST=http://localhost:3001
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run mock:server`

Starts `json-server` with the local demo dataset in `db.json`.\
This is useful for UI development when you only need mock HTTP data.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Notes

- This project is based on Create React App.
- The drawing room uses WebSocket routes from the backend server.
- The mock server only covers HTTP demo data. It does not replace the drawing WebSocket backend.

## Repositories

The project source code is spread across a number of repos:

| Name                         | Repo Address                                               |
|:-----------------------------|:-----------------------------------------------------------|
| e-whiteboard-server          | https://github.com/kevinliao852/e-whiteboard-server        |
| e-whiteboard-client          | https://github.com/kevinliao852/e-whiteboard-client        |

