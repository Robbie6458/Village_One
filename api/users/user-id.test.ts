import test from 'node:test';
import assert from 'node:assert/strict';

process.env.SUPABASE_URL = 'https://example.com';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';

const profile = { id: '123', firstName: 'John' };

const supabaseMock = {
  auth: {
    getUser: async () => ({ data: { user: { id: 'user-1' } }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: profile, error: null }),
      }),
    }),
    update: (updates: any) => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: { id: 'user-1', ...updates }, error: null }),
        }),
      }),
    }),
  }),
};

// Expose the mock to the stubbed supabase module
(globalThis as any).__supabaseMock = supabaseMock;

const handlerPromise = import('./[id]/index.ts');

function createRes() {
  return {
    statusCode: 0,
    jsonData: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.jsonData = data;
      return this;
    },
  };
}

test('GET returns user profile', async () => {
  const { default: handler } = await handlerPromise;
  const req = { method: 'GET', query: { id: '123' }, headers: {} } as any;
  const res = createRes();
  await handler(req, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.jsonData, profile);
});

test('PATCH updates user profile', async () => {
  const { default: handler } = await handlerPromise;
  const req = {
    method: 'PATCH',
    headers: { authorization: 'Bearer token' },
    body: { firstName: 'New' },
  } as any;
  const res = createRes();
  await handler(req, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.jsonData, { id: 'user-1', firstName: 'New' });
});
