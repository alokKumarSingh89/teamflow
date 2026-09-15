import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserLoader } from './user.loader';
import { UserRepository } from './repositories/user.repository';

describe('UserLoader', () => {
  let loader: UserLoader;
  let userRepository: {
    findManyByIds: vi.Mock;
  };

  beforeEach(() => {
    userRepository = {
      findManyByIds: vi.fn(),
    };

    loader = new UserLoader(userRepository as unknown as UserRepository);
  });

  it('should batch multiple user loads into one repository call', async () => {
    const alice = {
      id: 'alice',
      email: 'alice@example.com',
      name: 'Alice',
    };

    const bob = {
      id: 'bob',
      email: 'bob@example.com',
      name: 'Bob',
    };

    userRepository.findManyByIds.mockResolvedValue([bob, alice]);

    const [aliceResult, bobResult] = await Promise.all([
      loader.byId.load('alice'),
      loader.byId.load('bob'),
    ]);

    expect(userRepository.findManyByIds).toHaveBeenCalledTimes(1);

    expect(userRepository.findManyByIds).toHaveBeenCalledWith(['alice', 'bob']);

    expect(aliceResult).toEqual(alice);
    expect(bobResult).toEqual(bob);
  });

  it('should preserve the requested key order', async () => {
    const alice = {
      id: 'alice',
      email: 'alice@example.com',
      name: 'Alice',
    };

    const bob = {
      id: 'bob',
      email: 'bob@example.com',
      name: 'Bob',
    };

    userRepository.findManyByIds.mockResolvedValue([bob, alice]);

    const results = await Promise.all([
      loader.byId.load('alice'),
      loader.byId.load('bob'),
    ]);

    expect(results).toEqual([alice, bob]);
  });

  it('should return null for a missing user', async () => {
    const alice = {
      id: 'alice',
      email: 'alice@example.com',
      name: 'Alice',
    };

    userRepository.findManyByIds.mockResolvedValue([alice]);

    const [aliceResult, missingResult] = await Promise.all([
      loader.byId.load('alice'),
      loader.byId.load('missing'),
    ]);

    expect(aliceResult).toEqual(alice);
    expect(missingResult).toBeNull();
  });

  it('should cache duplicate loads within the same request', async () => {
    const alice = {
      id: 'alice',
      email: 'alice@example.com',
      name: 'Alice',
    };

    userRepository.findManyByIds.mockResolvedValue([alice]);

    const [first, second] = await Promise.all([
      loader.byId.load('alice'),
      loader.byId.load('alice'),
    ]);

    expect(first).toEqual(alice);
    expect(second).toEqual(alice);

    expect(userRepository.findManyByIds).toHaveBeenCalledTimes(1);

    expect(userRepository.findManyByIds).toHaveBeenCalledWith(['alice']);
  });
});
