import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const API_URL = 'https://userdashboard-backend-x12r.onrender.com/api';

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    
    if (body.email === 'john.doe@example.com' && body.password === 'SecurePass123') {
      return HttpResponse.json({
        token: 'test-jwt-token-123',
        user: {
          id: '0827b88d-e45b-4f3d-85e7-6edc3c704a78',
          email: 'john.doe@example.com',
          fullName: 'John Doe',
          role: 'admin',
          status: 'active',
          createdAt: '2025-12-29T15:45:44.330484',
          updatedAt: '2025-12-30T06:05:29.351538',
          lastLoginAt: '2025-12-30T06:05:29.349051',
        }
      });
    }
    
    return HttpResponse.json(
      { error: { code: 'unauthorized', message: 'Invalid credentials' } },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/auth/signup`, async ({ request }) => {
    const body = await request.json();
    
    if (body.email && body.fullName && body.password) {
      return HttpResponse.json({
        token: 'test-jwt-token-new',
        user: {
          id: 'new-user-id',
          email: body.email,
          fullName: body.fullName,
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: null,
        }
      });
    }
    
    return HttpResponse.json(
      { error: { code: 'bad_request', message: 'Invalid input' } },
      { status: 400 }
    );
  }),

  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json({
      id: '0827b88d-e45b-4f3d-85e7-6edc3c704a78',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      role: 'admin',
      status: 'active',
      createdAt: '2025-12-29T15:45:44.330484',
      updatedAt: '2025-12-30T06:05:29.351538',
      lastLoginAt: '2025-12-30T06:05:29.349051',
    });
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out' });
  }),

  http.get(`${API_URL}/profile`, () => {
    return HttpResponse.json({
      id: '0827b88d-e45b-4f3d-85e7-6edc3c704a78',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      role: 'admin',
      status: 'active',
      createdAt: '2025-12-29T15:45:44.330484',
      updatedAt: '2025-12-30T06:05:29.351538',
      lastLoginAt: '2025-12-30T06:05:29.349051',
    });
  }),

  http.put(`${API_URL}/profile`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: '0827b88d-e45b-4f3d-85e7-6edc3c704a78',
      email: body.email,
      fullName: body.fullName,
      role: 'admin',
      status: 'active',
      createdAt: '2025-12-29T15:45:44.330484',
      updatedAt: new Date().toISOString(),
      lastLoginAt: '2025-12-30T06:05:29.349051',
    });
  }),

  http.put(`${API_URL}/profile/password`, async ({ request }) => {
    const body = await request.json();
    
    if (body.currentPassword === 'SecurePass123') {
      return HttpResponse.json({ message: 'Password updated' });
    }
    
    return HttpResponse.json(
      { error: { code: 'bad_request', message: '400 Bad Request: Current password incorrect' } },
      { status: 400 }
    );
  }),

  http.get(`${API_URL}/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;

    return HttpResponse.json({
      items: [
        {
          id: '76c901ec-4040-41ed-8d9c-a60e875a445c',
          email: 'abhishek001@gmail.com',
          fullName: 'Abhishek',
          role: 'user',
          status: 'active',
          createdAt: '2025-12-30T06:06:26.162394',
          updatedAt: '2025-12-30T06:06:37.154520',
          lastLoginAt: '2025-12-30T06:06:37.151257',
        },
        {
          id: '0827b88d-e45b-4f3d-85e7-6edc3c704a78',
          email: 'john.doe@example.com',
          fullName: 'John Doe',
          role: 'admin',
          status: 'active',
          createdAt: '2025-12-29T15:45:44.330484',
          updatedAt: '2025-12-30T06:21:13.454222',
          lastLoginAt: '2025-12-30T06:05:29.349051',
        },
      ],
      page,
      pages: 1,
      limit,
      total: 2,
    });
  }),

  http.post(`${API_URL}/users/:userId/activate`, ({ params }) => {
    return HttpResponse.json({
      id: params.userId || '76c901ec-4040-41ed-8d9c-a60e875a445c',
      email: 'abhisheksingh@gmail.com',
      fullName: 'Abhishek Singh',
      role: 'admin',
      status: 'active',
      createdAt: '2025-12-30T06:06:26.162394',
      updatedAt: new Date().toISOString(),
      lastLoginAt: '2025-12-30T07:00:24.763425',
    });
  }),

  http.post(`${API_URL}/users/:userId/deactivate`, ({ params }) => {
    return HttpResponse.json({
      id: params.userId || '76c901ec-4040-41ed-8d9c-a60e875a445c',
      email: 'abhisheksingh@gmail.com',
      fullName: 'Abhishek Singh',
      role: 'admin',
      status: 'inactive',
      createdAt: '2025-12-30T06:06:26.162394',
      updatedAt: new Date().toISOString(),
      lastLoginAt: '2025-12-30T07:00:24.763425',
    });
  }),
];

export const server = setupServer(...handlers);
