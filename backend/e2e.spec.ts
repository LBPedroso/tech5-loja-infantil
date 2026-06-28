import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

// ===== AUTH TESTS =====
test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ request }) => {
    // Create user first
    await request.post(`${BASE_URL}/api/auth/signup`, {
      data: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }
    });

    // Login with valid credentials
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('token');
    expect(data.data.user.email).toBe('test@example.com');
  });

  test('should fail login with invalid credentials', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      }
    });

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.error).toContain('inválidas');
  });

  test('should fail login with missing email', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        password: 'password123'
      }
    });

    expect(response.status()).toBe(400);
  });
});

// ===== USER REGISTRATION TESTS =====
test.describe('User Registration', () => {
  test('should create user successfully', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: {
        email: `user${Date.now()}@example.com`,
        password: 'password123',
        name: 'New User'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.email).toBeDefined();
    expect(data.name).toBe('New User');
  });

  test('should fail user creation with missing fields', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: {
        email: 'test@example.com'
        // missing password and name
      }
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});

// ===== CATEGORIAS CRUD =====
test.describe('Categorias CRUD', () => {
  let categoriaId: string;

  test('CREATE: should create categoria successfully', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/categorias`, {
      data: {
        nome: `Categoria ${Date.now()}`
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.nome).toBeDefined();
    expect(data.id).toBeDefined();
    categoriaId = data.id.toString();
  });

  test('READ: should get all categorias', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/categorias`);

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('READ: should get specific categoria by id', async ({ request }) => {
    // Create a categoria first
    const createRes = await request.post(`${BASE_URL}/api/categorias`, {
      data: { nome: `Get Test ${Date.now()}` }
    });
    const created = await createRes.json();

    // Get the categoria
    const getRes = await request.get(`${BASE_URL}/api/categorias/${created.id}`);
    expect(getRes.status()).toBe(200);
    const data = await getRes.json();
    expect(data.id).toBe(created.id);
  });

  test('UPDATE: should update categoria', async ({ request }) => {
    // Create a categoria
    const createRes = await request.post(`${BASE_URL}/api/categorias`, {
      data: { nome: `Update Test ${Date.now()}` }
    });
    const created = await createRes.json();

    // Update it
    const updateRes = await request.put(`${BASE_URL}/api/categorias/${created.id}`, {
      data: { nome: 'Updated Categoria' }
    });

    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json();
    expect(updated.nome).toBe('Updated Categoria');
  });

  test('DELETE: should delete categoria', async ({ request }) => {
    // Create a categoria
    const createRes = await request.post(`${BASE_URL}/api/categorias`, {
      data: { nome: `Delete Test ${Date.now()}` }
    });
    const created = await createRes.json();

    // Delete it
    const deleteRes = await request.delete(`${BASE_URL}/api/categorias/${created.id}`);
    expect(deleteRes.status()).toBe(200);

    // Verify it's deleted
    const getRes = await request.get(`${BASE_URL}/api/categorias/${created.id}`);
    expect(getRes.status()).toBe(404);
  });

  test('CREATE: should fail with missing nome', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/categorias`, {
      data: {}
    });

    expect(response.status()).toBe(400);
  });
});

// ===== PRODUTOS CRUD =====
test.describe('Produtos CRUD', () => {
  test('CREATE: should create produto successfully', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/produtos`, {
      data: {
        nome: `Produto ${Date.now()}`,
        preco: 99.99
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.nome).toBeDefined();
    expect(data.preco).toBe(99.99);
  });

  test('READ: should get all produtos', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/produtos`);

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('READ: should get specific produto by id', async ({ request }) => {
    // Create a produto first
    const createRes = await request.post(`${BASE_URL}/api/produtos`, {
      data: { nome: `Get Test ${Date.now()}`, preco: 50.00 }
    });
    const created = await createRes.json();

    // Get the produto
    const getRes = await request.get(`${BASE_URL}/api/produtos/${created.id}`);
    expect(getRes.status()).toBe(200);
    const data = await getRes.json();
    expect(data.id).toBe(created.id);
  });

  test('UPDATE: should update produto', async ({ request }) => {
    // Create a produto
    const createRes = await request.post(`${BASE_URL}/api/produtos`, {
      data: { nome: `Update Test ${Date.now()}`, preco: 75.00 }
    });
    const created = await createRes.json();

    // Update it
    const updateRes = await request.put(`${BASE_URL}/api/produtos/${created.id}`, {
      data: { nome: 'Updated Produto', preco: 150.00 }
    });

    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json();
    expect(updated.nome).toBe('Updated Produto');
    expect(updated.preco).toBe(150.00);
  });

  test('DELETE: should delete produto', async ({ request }) => {
    // Create a produto
    const createRes = await request.post(`${BASE_URL}/api/produtos`, {
      data: { nome: `Delete Test ${Date.now()}`, preco: 25.00 }
    });
    const created = await createRes.json();

    // Delete it
    const deleteRes = await request.delete(`${BASE_URL}/api/produtos/${created.id}`);
    expect(deleteRes.status()).toBe(200);

    // Verify it's deleted
    const getRes = await request.get(`${BASE_URL}/api/produtos/${created.id}`);
    expect(getRes.status()).toBe(404);
  });

  test('CREATE: should fail with missing preco', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/produtos`, {
      data: { nome: 'Incomplete Product' }
    });

    expect(response.status()).toBe(400);
  });
});

// ===== HEALTH CHECK =====
test('should health check pass', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/health`);

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.status).toBe('ok');
});
