import { createServer } from "node:http";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const PORT = Number.parseInt(process.env.PORT ?? "3001", 10);
const HOST = process.env.HOST ?? "127.0.0.1";
const DB_PATH = resolve(process.cwd(), "db.json");
const DB_EXAMPLE_PATH = resolve(process.cwd(), "db.json.example");

bootstrapDb();

createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const path = url.pathname;

  try {
    if (request.method === "GET" && path === "/") {
      return sendJson(response, 200, {
        status: "ok",
        endpoints: [
          "GET /v1/rooms",
          "GET /v1/me",
          "GET /v1/whiteboards",
          "GET /v1/whiteboards/:id",
          "POST /v1/whiteboards",
          "DELETE /v1/whiteboards/:id",
          "GET /v1/whiteboards/:id/points",
          "GET /v1/chat-messages",
          "POST /login",
          "POST /v1/login",
        ],
      });
    }

    if (request.method === "GET" && path === "/v1/rooms") {
      return sendJson(response, 200, readDb().rooms ?? []);
    }

    if (request.method === "GET" && path === "/v1/me") {
      const db = readDb();
      return sendJson(response, 200, db.mockLogin ?? db.login ?? {});
    }

    if (request.method === "GET" && path === "/v1/whiteboards") {
      const db = readDb();
      const userId = url.searchParams.get("user-id");
      const whiteboards = Array.isArray(db.whiteboards) ? db.whiteboards : [];

      return sendJson(
        response,
        200,
        userId
          ? whiteboards.filter(
              (item) => String(item["user-id"]) === String(userId),
            )
          : whiteboards,
      );
    }

    if (request.method === "POST" && path === "/v1/whiteboards") {
      const db = readDb();
      const payload = await readRequestBody(request);
      const whiteboards = Array.isArray(db.whiteboards) ? db.whiteboards : [];
      const createdWhiteboard = {
        id: nextWhiteboardId(whiteboards),
        name: payload?.name ?? "Untitled Board",
        "user-id": Number(payload?.["user-id"] ?? payload?.userId ?? 1),
      };

      db.whiteboards = [...whiteboards, createdWhiteboard];
      writeDb(db);

      return sendJson(response, 201, createdWhiteboard);
    }

    const whiteboardPointsMatch = path.match(/^\/v1\/whiteboards\/([^/]+)\/points$/);
    if (request.method === "GET" && whiteboardPointsMatch) {
      const whiteboardId = decodeURIComponent(whiteboardPointsMatch[1]);
      const points = Array.isArray(readDb().points) ? readDb().points : [];

      return sendJson(
        response,
        200,
        points.filter(
          (point) => String(point.whiteboard_id) === String(whiteboardId),
        ),
      );
    }

    const whiteboardMatch = path.match(/^\/v1\/whiteboards\/([^/]+)$/);
    if (whiteboardMatch) {
      const whiteboardId = decodeURIComponent(whiteboardMatch[1]);
      const db = readDb();
      const whiteboards = Array.isArray(db.whiteboards) ? db.whiteboards : [];
      const whiteboard = whiteboards.find(
        (item) => String(item.id) === String(whiteboardId),
      );

      if (request.method === "GET") {
        if (!whiteboard) {
          return sendJson(response, 404, { error: "Whiteboard not found" });
        }

        return sendJson(response, 200, whiteboard);
      }

      if (request.method === "DELETE") {
        db.whiteboards = whiteboards.filter(
          (item) => String(item.id) !== String(whiteboardId),
        );
        db.points = Array.isArray(db.points)
          ? db.points.filter(
              (point) => String(point.whiteboard_id) !== String(whiteboardId),
            )
          : [];
        writeDb(db);

        response.writeHead(204);
        response.end();
        return;
      }
    }

    if (request.method === "GET" && path === "/v1/chat-messages") {
      const roomId = url.searchParams.get("room-id");
      const messages = Array.isArray(readDb().chatMessages)
        ? readDb().chatMessages
        : [];

      return sendJson(
        response,
        200,
        roomId
          ? messages.filter((item) => String(item["room-id"]) === String(roomId))
          : messages,
      );
    }

    if (
      request.method === "POST" &&
      (path === "/login" || path === "/v1/login")
    ) {
      const payload = await readRequestBody(request);

      if (!payload?.idtoken) {
        return sendJson(response, 400, {
          error: "Missing idtoken",
        });
      }

      const db = readDb();
      return sendJson(response, 200, db.mockLogin ?? db.login ?? {});
    }

    return sendJson(response, 404, { error: "Not Found" });
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, { error: "Internal Server Error" });
  }
}).listen(PORT, HOST, () => {
  console.log(`Mock server listening on http://${HOST}:${PORT}`);
  console.log(`Using ${DB_PATH}`);
});

function bootstrapDb() {
  if (existsSync(DB_PATH)) {
    return;
  }

  if (!existsSync(DB_EXAMPLE_PATH)) {
    throw new Error(`Missing ${DB_EXAMPLE_PATH}`);
  }

  copyFileSync(DB_EXAMPLE_PATH, DB_PATH);
}

function readDb() {
  return JSON.parse(readFileSync(DB_PATH, "utf8"));
}

function writeDb(data) {
  writeFileSync(DB_PATH, `${JSON.stringify(data, null, 2)}\n`);
}

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(data));
}

function nextWhiteboardId(whiteboards) {
  const numericIds = whiteboards
    .map((item) => String(item.id))
    .map((id) => {
      const match = id.match(/^wb-(\d+)$/);
      return match ? Number.parseInt(match[1], 10) : Number.NaN;
    })
    .filter((value) => !Number.isNaN(value));
  const nextNumber = (numericIds.length > 0 ? Math.max(...numericIds) : 1000) + 1;

  return `wb-${nextNumber}`;
}

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    const params = new URLSearchParams(rawBody);
    return Object.fromEntries(params.entries());
  }
}
