const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const container = require('../../container')
const createServer = require("../createServer");

describe('a /threads endpoint', () => { 
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  })
  describe('when POST /threads', () => { 
    it('should return 401 when not authenticated', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const res = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'dicoding',
          body: 'Dicoding Indonesia'
        }
      })
      const resJson = JSON.parse(res.payload)

      // Assert
      expect(res.statusCode).toEqual(401)
      expect(resJson.error).toEqual('Unauthorized')
      expect(resJson.message).toEqual('Missing authentication')
    })
    it('should return 400 if payload not contain needed property', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'password123'
      }
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'password123',
          fullname: 'Dicoding Indonesia',
        },
      })
      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      })
      const resAuth = JSON.parse(authentication.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
        headers: {
          Authorization: `Bearer ${resAuth.data.accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('payload tidak lengkap')
    })
    it('should return 400 if payload not meet data type specification', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'password123'
      }
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'password123',
          fullname: 'Dicoding Indonesia',
        },
      })
      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      })
      const resAuth = JSON.parse(authentication.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 123,
          body: 'Dicoding Indonesia'
        },
        headers: {
          Authorization: `Bearer ${resAuth.data.accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })
    it('should return 201 and create thread', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'password123'
      }
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'password123',
          fullname: 'Dicoding Indonesia',
        },
      })
      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      })
      const resAuth = JSON.parse(authentication.payload)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'dicoding',
          body: 'Dicoding Indonesia'
        },
        headers: {
          Authorization: `Bearer ${resAuth.data.accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread.title).toStrictEqual('dicoding')
    })
   })
   describe('when GET /threads/{threadId}', () => { 
    it('should return 404 when thread not found', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'password123'
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url:'/users',
        payload:{
          username: 'dicoding',
          password: 'password123',
          fullname: 'Dicoding Indonesia'
        }
      })
      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload
      })
      const resAuth = JSON.parse(authentication.payload)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
        headers: {
          Authorization: `Bearer ${resAuth.data.accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)

      // Assert
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
    it('should return 200 and return thread', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'password123'
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url:'/users',
        payload:{
          username: 'dicoding',
          password: 'password123',
          fullname: 'Dicoding Indonesia'
        }
      })
      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload
      })
      const resAuth = JSON.parse(authentication.payload)
      
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'lorem ipsum dolorr sit amet',
        },
        headers: { Authorization: `Bearer ${resAuth.data.accessToken}` },
      });
      const threadResponse = JSON.parse(thread.payload);
      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadResponse.data.addedThread.id}`,
        headers: {
          Authorization: `Bearer ${resAuth.data.accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      // Assert
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread.title).toEqual(threadResponse.data.addedThread.title)
    })
    })
 })