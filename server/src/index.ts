import { Hono } from "hono";
import { Redis } from "ioredis";
import { keys } from "../keys";
import { cors } from "hono/cors";
import { Client } from "pg";

// Hono setup
const app = new Hono();
app.use(cors());

// Redis setup
const redisClient = new Redis({
	host: keys.redisHost,
	port: +(keys.redisPort || 3000),
	retryStrategy: () => 1000,
});
redisClient.on("connect", () => console.log("Redis connected !!"));
redisClient.on("error", (err) => console.log("Redis:", err));
const redisPublisher = redisClient.duplicate();

// Pg setup
const pgClient = new Client({
	user: keys.pgUser,
	host: keys.pgHost,
	database: "postgres",
	password: keys.pgPassword,
	port: +(keys.pgPort || 5432),
});

pgClient.on("error", (err) => console.log("PG: ", err));

await pgClient.connect();

pgClient
	.query("CREATE TABLE IF NOT EXISTS values (number INT)")
	.then((result) => console.log("PG connected !!"))
	.catch((err) => console.log(err));

// routes
app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/values/all", async (c) => {
	const values = await pgClient.query("SELECT * FROM values");

	return c.json(values.rows);
});

app.get("/values/current", async (c) => {
	const values = await redisClient.hgetall("values");

	return c.json(values);
});

app.post("/values", async (c) => {
	const xxx = await c.req.json();
	const { index } = xxx;
	if (+index > 40) return c.status(422);
	await redisClient.hset("values", +index, "Nothing yet");
	redisPublisher.publish("insert", index);
	pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

	return c.text("Okey we are doing ...");
});

export default app;
