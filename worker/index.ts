import Redis from "ioredis";

const redisClient = new Redis({
  host: "redis",
  port: 6379,
  // retryStrategy: () => 1000,
});
const sub = redisClient.duplicate();
sub.on("connect", () => console.log("Redis connected !!"));

const fib: (i: number) => number = (i: number) => {
  if (i < 2) return 1;
  return fib(i - 1) + fib(i - 2);
};

sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(+message));
});
sub.subscribe("insert");
