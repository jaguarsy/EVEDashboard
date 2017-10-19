import request from '../utils/request';


const universeApi = {
  // 获取星系的信息
  getSystemInfo(systemId) {
    return request
      .getFromESI(`/universe/systems/${systemId}/`);
  },

  // 获取空间站信息
  getStationInfo(stationId) {
    return request
      .getFromESI(`/universe/stations/${stationId}/`);
  },

  // 获取建筑信息
  getStructureInfo(structureId) {
    return request
      .getFromESI(`/universe/structures/${structureId}/`);
  },
};

export default universeApi;
