import axios from "axios";
import * as cacheUsersModule from './cache-users';
import { cacheUsers, fetchUsers, filterValidUsers, storageUsers } from "./cache-users";
import { User } from "./domains";

jest.mock('axios');


describe('cacheUsers test', function () {
  
  beforeAll(() => {
    global.localStorage = {
      setItem(_: string, __: string) {
      }
    } as Storage;
  });
  
  const getAxiosGetMock = () => (axios.get as unknown as jest.Mock);
  
  describe('fetchUsers test', function () {
    
    
    it('should throw error when get api error', function () {
      getAxiosGetMock()
        .mockRejectedValueOnce('');
      expect(fetchUsers()).rejects.toThrow('api error');
    });
    
    it('should get a empty array when api return null', function () {
      getAxiosGetMock().mockResolvedValueOnce({
        data: null
      });
      expect(fetchUsers()).resolves.toMatchObject([]);
    });
    
    it('should called axios.get', async function () {
      const spy = jest.spyOn(axios, 'get');
      spy.mockResolvedValueOnce({ data: null });
      await fetchUsers();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    
    it('should get user list when called success', async function () {
      
      const mockData: User[] = [
        { id: 1, name: "1", status: 1 },
        { id: 2, name: "2", status: 1 },
        { id: 3, name: "3", status: 1 }
      ];
      getAxiosGetMock().mockResolvedValueOnce({
        data: mockData
      });
      expect(await fetchUsers()).toMatchObject(mockData);
    });
  });
  
  describe('filterUsers test', function () {
    
    it('should throw error when has dirty data', function () {
      expect(() => filterValidUsers(
        [ { name: '1', id: 1, status: 1 }, null as unknown as User ])
      ).toThrow('has dirty data,index at 1');
    });
    
    it('should get correctly result when status is all equal to 1 ', function () {
      const mockData: User[] = [
        { id: 1, name: "1", status: 1 },
        { id: 2, name: "2", status: 1 },
        { id: 3, name: "3", status: 1 }
      ];
      expect(filterValidUsers(mockData)).toMatchObject(mockData);
    });
    it('should get correctly result when some status is equal to 1', function () {
      const mockData: User[] = [
        { id: 1, name: "1", status: 1 },
        { id: 2, name: "2", status: 2 },
        { id: 3, name: "3", status: 2 }
      ];
      const exceptData: User[] = [
        { id: 1, name: "1", status: 1 }
      ];
      
      expect(filterValidUsers(mockData)).toMatchObject(exceptData);
    });
  });
  
  describe('storageUsers test', function () {
    
    it('should called localStorage.setItem with right params', function () {
      const spy = jest.spyOn(global.localStorage, 'setItem');
      
      const mockData: User[] = [
        { id: 1, name: "1", status: 1 },
        { id: 2, name: "2", status: 1 },
        { id: 3, name: "3", status: 1 }
      ];
      storageUsers(mockData);
      expect(spy).toHaveBeenNthCalledWith(1, 'users', JSON.stringify(mockData));
    });
    
  });
  
  describe('cache test by order', function () {
    
    let fetchUsersSpy: jest.SpyInstance;
    let filterUsersSpy: jest.SpyInstance;
    
    beforeEach(async () => {
      getAxiosGetMock().mockResolvedValue({ data: [] });
      fetchUsersSpy = jest.spyOn(cacheUsersModule, 'fetchUsers');
      filterUsersSpy = jest.spyOn(cacheUsersModule, 'filterValidUsers');
    });
    
    it('should called fetchUsers', async function () {
      await cacheUsers();
      expect(fetchUsersSpy).toHaveBeenCalledTimes(1);
      fetchUsersSpy.mockClear();
    });
    
    it('should called filter with empty array', async function () {
      fetchUsersSpy.mockResolvedValueOnce([]);
      await cacheUsers();
      expect(filterUsersSpy).toHaveBeenCalledWith([]);
      filterUsersSpy.mockClear();
    });
    
    it('should called storageUsersSpy at last time', async function () {
      const mockData:User[] = [ { id: 1, name: "12", status: 1 } ];
      const storageUsersSpy = jest.spyOn(cacheUsersModule, 'storageUsers');
      filterUsersSpy.mockReturnValue(mockData)
      await cacheUsers();
      expect(storageUsersSpy).toHaveBeenCalledWith(
        mockData
      );
    });
    
  });
  
});
