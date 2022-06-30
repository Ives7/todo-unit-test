import axios from "axios";
import { fetchUsers, filterValidUsers, storageUsers } from "./cache-users";
import { User } from "./domains";

jest.mock('axios');


describe('cacheUsers test', function () {
  
  describe('fetchUsers test', function () {
  
    const getAxiosGetMock = () => (axios.get as unknown as jest.Mock);
  
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
      const exceptData:User[] = [
        { id: 1, name: "1", status: 1 },
      ]
  
      expect(filterValidUsers(mockData)).toMatchObject(exceptData);
    });
  });
  
  describe('storageUsers test', function () {
    beforeAll(() => {
      global.localStorage = {
        setItem(_: string, __: string) {
        }
      } as Storage
    })
    it('should called localStorage.setItem with right params', function () {
      const spy = jest.spyOn(global.localStorage,'setItem');
      
      const mockData: User[] = [
        { id: 1, name: "1", status: 1 },
        { id: 2, name: "2", status: 1 },
        { id: 3, name: "3", status: 1 }
      ];
      storageUsers(mockData)
      expect(spy).toHaveBeenNthCalledWith(1,'users',JSON.stringify(mockData));
    });
    
  });
  
});
