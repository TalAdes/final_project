import axios from "axios";

// Methods of this class are used to simulate calls to server.
const Api = {
  updateUsersDataToDB                   : (user) =>   axios.post('/authorized_updateUsersDataToDB',{user}),
  updateFlowerDataToDB                  : (flower) => axios.post('/authorized_updateFlowersDataToDB',{flower}),
  getUserDataUsingID                    : (id) =>     axios.post('/authorized_getUserDataUsingID',{id}),
  getUserData                           : () =>     axios.get('/getUserData'),
  deleteUserData                        : (user) =>     axios.post('/authorized_deleteUserData',{user}),
  deleteFlowerData                      : (flower) =>     axios.post('/authorized_deleteFlowerData',{flower}),
  getFlowerDataUsingID                  : (id) =>     axios.post('/authorized_getFlowerDataUsingID',{id}),
  getUsersDataFromDB                    : () =>       axios.get('/authorized_read_list'),
  getFlowersData                        : () =>       axios.get('/unauthorized_flowers_list'),
  isLoged                               : () =>       axios.get('/is_loged'),
  whoIsLoged                            : () =>       axios.get('/who_is_loged'),
  menuData                              : () =>       axios.get('/menuData'),
  menuWarehouseData                     : () =>       axios.get('/menuWarehouseData'),
  filterData                            : () =>       axios.get('/filterData'),
  
  chatsList                             : () =>       axios.get('/chat_back/chatsList'),
  otherChatsList                        : () =>       axios.get('/chat_back/otherChatsList'),
  otherChatsWithPasswordList            : () =>       axios.get('/chat_back/otherChatsWithPasswordList'),
  managedChatsList                      : () =>       axios.get('/chat_back/managedChatsList'),
  newOpenChatRequestsList               : () =>       axios.get('/chat_back/newOpenChatRequestsList'),
  existingChatRoomsList                 : () =>       axios.get('/chat_back/existingChatRoomsList'),
  getChatByID                           : (id) =>     axios.post('/chat_back/getChatByID',{id}),
  showChatMemberList                    : (id) =>     axios.post('/chat_back/showChatMemberList',{id}),
  
  tryyyy                                : () =>      axios.get('/chat/get_PK_and_random'),
  getHisLastOrders                      : (id) =>      axios.post('/getHisLastOrders',{id}),
  getMyLastOrders                       : (user) =>      axios.post('/getMyLastOrders',{user}),
  getCartItemsMongoDB                   : () =>      axios.get('/cart/getCartItemsMongoDB'),
  addItemInCartMongoDB                  : (flower) =>      axios.post('/cart/addItemInCartMongoDB',{flower}),
  deleteCartItemMongoDB                 : (id) =>     axios.post('/cart/deleteCartItemMongoDB',{id}),
  updateCartItemQntMongoDB              : (data) =>  axios.post('/cart/updateCartItemQntMongoDB',data),
  setCartItemsMongoDB                   : (empty_arry) =>       axios.post('/cart/setCartItemsMongoDB',{empty_arry}),
  getItemUsingID(id) {
    return this.getFlowersData().then(res =>{
      let data = res.data
      data = data.filter(x => x.id === parseInt(id, 10));
      return (data.length === 0 ? null : data[0]);
    })
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
