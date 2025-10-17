import assert from "assert";
import axios from "axios";
import http from "http";
import app from "../express.js";

// Simple helper to perform a GET request against the express app
const request = (path) =>
  new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, async () => {
      const port = server.address().port;
      const url = `http://127.0.0.1:${port}${path}`;
      try {
        const res = await fetch(url);
        const body = await res.json();
        resolve({ status: res.status, body });
      } catch (err) {
        reject(err);
      } finally {
        server.close();
      }
    });
  });

// Save original axios.get
const originalAxiosGet = axios.get;

async function runTests() {
  console.log("Test: multiple requests return new cat facts (no caching)");

  // Mock axios.get to return different facts on subsequent calls and capture options
  const calls = [];
  axios.get = async (url, options) => {
    calls.push({ url, options });
    const fact = `cat-fact-${calls.length}-${Date.now()}`;
    return { status: 200, data: { fact } };
  };

  // First request
  const r1 = await request("/api/me");
  assert.strictEqual(r1.status, 200, "first request should be 200");
  assert.ok(
    r1.body.fact && r1.body.fact.startsWith("cat-fact-"),
    "first fact present"
  );

  // Second request
  const r2 = await request("/api/me");
  assert.strictEqual(r2.status, 200, "second request should be 200");
  assert.ok(
    r2.body.fact && r2.body.fact.startsWith("cat-fact-"),
    "second fact present"
  );

  // Ensure facts differ
  assert.notStrictEqual(
    r1.body.fact,
    r2.body.fact,
    "facts should be different between requests"
  );

  // Ensure axios was called twice and timeout was set to 5000ms
  assert.strictEqual(calls.length, 2, "axios.get should be called twice");
  calls.forEach((call) => {
    assert.ok(
      call.options && call.options.timeout === 5000,
      "axios.get timeout must be 5000ms"
    );
  });

  console.log(
    "PASS: multiple requests returned different cat facts and timeout is 5000ms"
  );

  // Restore axios.get
  axios.get = originalAxiosGet;
}

runTests().catch((err) => {
  console.error("TEST FAILED", err);
  // Restore axios.get on failure as well
  axios.get = originalAxiosGet;
  process.exit(1);
});
