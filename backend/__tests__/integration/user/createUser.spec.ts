import { describe, expect, test } from '@jest/globals';

import request from 'supertest';
import { app } from '../../../src';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
  await client.connect();
  await client.query('delete from users');
  await client.end();
});

describe('Create a user', () => {
  test('should create a user', async () => {
    const response = await request(app).post('/register').send({
      username: 'test user',
      email: 'new-email@test.com',
      password: 'password',
      confirmPassword: 'password',
    });

    expect(response.body).toHaveProperty('token');
  });

  test('should not create a user if email already exists', async () => {
    await request(app).post('/register').send({
      username: 'test user',
      email: 'new-email@test.com',
      password: 'password',
      confirmPassword: 'password',
    });

    const response = await request(app).post('/register').send({
      username: 'user already exists',
      email: 'new-email@test.com',
      password: 'password',
      confirmPassword: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  test('should not create a user with invalid username', async () => {
    const response = await request(app).post('/register').send({
      username: 'u',
      email: 'new-email@test.com',
      password: 'password',
      confirmPassword: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.body.issues[0].code).toBe('too_small');
  });

  test('should not create a user with invalid email', async () => {
    const response = await request(app).post('/register').send({
      username: 'invalid-email',
      email: 'new-email&test-com',
      password: 'password',
      confirmPassword: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.body.issues[0].message).toBe('Invalid email');
  });

  test('should not create a user with invalid password', async () => {
    const response = await request(app).post('/register').send({
      username: 'invalid-password',
      email: 'test-password@test.com',
      password: '123',
      confirmPassword: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Passwords do not match');
  });

  test('should not create a user if passwords are less than 6 characters', async () => {
    const response = await request(app).post('/register').send({
      username: 'invalid-password',
      email: 'test-password@test.com',
      password: '123',
      confirmPassword: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.issues[0].code).toBe('too_small');
  });
});
