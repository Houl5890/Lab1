const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

jest.mock('jsonwebtoken'); //замінюємо справжню бібліотеку мок-версією

const createMockReqResNext = (authHeader = '') => {
  const req = { headers: { authorization: authHeader } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();
  return { req, res, next };
};

describe('authMiddleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('повертає 401 якщо токен відсутній', async () => {
    const { req, res, next } = createMockReqResNext();
    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Немає токена' });
    expect(next).not.toHaveBeenCalled();
  });

  test('повертає 401 якщо токен недійсний', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    const { req, res, next } = createMockReqResNext('Bearer invalidtoken');
    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Недійсний токен' });
    expect(next).not.toHaveBeenCalled();
  });

  test('продовжує далі при валідному токені', async () => {
    jwt.verify.mockReturnValue({ id: '123abc' });

    const { req, res, next } = createMockReqResNext('Bearer validtoken');
    await authMiddleware(req, res, next);

    expect(req.userId).toBe('123abc');
    expect(next).toHaveBeenCalled();
  });
});
