import axios from "axios";

// Methods of this class are used to simulate calls to server.
const Api = {
  updateUsersDataToDB       : (user) =>   axios.post('/authorized_updateUsersDataToDB',{user}),
  updateFlowerDataToDB      : (flower) => axios.post('/authorized_updateFlowersDataToDB',{flower}),
  getUserDataUsingID       : (id) =>     axios.post('/authorized_getUserDataUsingID',{id}),
  deleteUserData       : (user) =>     axios.post('/authorized_deleteUserData',{user}),
  deleteFlowerData       : (flower) =>     axios.post('/authorized_deleteFlowerData',{flower}),
  getFlowerDataUsingID       : (id) =>     axios.post('/authorized_getFlowerDataUsingID',{id}),
  getUsersDataFromDB        : () =>       axios.get('/authorized_read_list'),
  getFlowersData            : () =>       axios.get('/unauthorized_flowers_list'),
  isLoged                   : () =>       axios.get('/is_loged'),
  whoIsLoged                : () =>       axios.get('/who_is_loged'),
  menuData                  : () =>       axios.get('/menuData'),
  menuWarehouseData         : () =>       axios.get('/menuWarehouseData'),
  filterData                : () =>       axios.get('/filterData'),
  sampleProductsAxios       : () =>       axios.get('/sampleProductsAxios'),

  getItemUsingID(id) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        let res = await this.getFlowersData()
        let data = res.data
        data = data.filter(x => x.id === parseInt(id, 10));
        resolve(data.length === 0 ? null : data[0]);
      }, 500);
    });
  },

  _sortData(data, sortval) {
    if (!sortval) return data;

    let items = JSON.parse(JSON.stringify(data));

    if (sortval === "lh") {
      items.sort((a, b) =>
        a.price > b.price ? 1 : b.price > a.price ? -1 : 0
      );
    } else if (sortval === "hl") {
      items.sort((a, b) =>
        a.price < b.price ? 1 : b.price < a.price ? -1 : 0
      );
    }

    return items;
  },

  searchItems({
    category,
    term,
    sortValue,
    itemsPerPage,
    hot,
    usePriceFilter,
    minPrice,
    maxPrice,
    page
  }) {
    return new Promise((resolve, reject) => {
      minPrice = parseInt(minPrice, 0);
      maxPrice = parseInt(maxPrice, 0);

      setTimeout(async () => {
        let res = await this.getFlowersData()
        let data = res.data
        data = data.filter(item => {
          if (
            usePriceFilter &&
            (item.price < minPrice || item.price > maxPrice)
          ) {
            return false;
          }

          if (category === "hot") {
            return item.hot;
          }

          if (category !== "All colors" && category !== item.category)
            return false;

          if (term && !item.name.toLowerCase().includes(term.toLowerCase()))
            return false;

          return true;
        });

        let totalLength = data.length;

        // Sort data if needed
        data = this._sortData(data, sortValue);

        // Get data from the requested page.
        page = parseInt(page, 0);
        data = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        resolve({ data, totalLength });
      }, 500);
    });
  },

  
}

export default Api;
