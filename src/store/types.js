import eveSDE from '../../static/eve-online-sde';

let searchTypes = [];
let allTypes = {};

const types = {
  load() {
    return eveSDE
      .types()
      .then(list => {
        allTypes = list;
        Object
          .keys(list)
          .forEach(key => {
            const item = list[key];
            if (item.name['en'] && !item.name['en'].includes('♦')) {
              searchTypes.push({
                id: key,
                en: item.name['en'],
                zh: item.name['zh'],
                searchStr: `${item.name['en']}\t${item.name['zh']}`.toLowerCase(),
              });
            }
          });
      });
  },

  search(keyword) {
    const filteredList = searchTypes
      .filter(p => p.searchStr.includes(keyword))
      .sort((a, b) => {
        return a.searchStr.length - b.searchStr.length;
      });

    return {
      list: filteredList.slice(0, 10),
      count: filteredList.length,
    }
  },

  getType(id) {
    const target = allTypes[id];
    target.typeId = id;
    console.log(target);
    return target;
  }
};

export default types;
