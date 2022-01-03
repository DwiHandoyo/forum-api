const ServerTestHelper = {
  async getAccessToken(server, username) {
    const userPayload = {
      username,
      password: 'secret',
    };
    const requestPayload = {
      username,
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };
    // Action
    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });
    const { id: userId } = (JSON.parse(responseUser.payload)).data.addedUser;
    const { accessToken } = (JSON.parse(responseAuth.payload)).data;
    return {accessToken, userId};
  },
};

module.exports = ServerTestHelper;