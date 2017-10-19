import moment from 'moment';
import request from '../utils/request';


const universeApi = {
  // 获取吉他物价
  getPriceInJita(typeId, page = 1) {
    return request
      .getFromESI('/markets/10000002/orders/', {
        order_type: 'all',
        page,
        type_id: typeId,
      })
      .then((result) => {
        const target = result
          .filter(p => p.location_id === 60003760 && !p.is_buy_order)
          .sort((a, b) => a.price - b.price)[0];
        target.issuedDate = moment(target.issued).format('YYYY-MM-DD HH:mm:ss');
        return target;
      });
  },
};

export default universeApi;
