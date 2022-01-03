const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailsUseCase = require('../../../../Applications/use_case/GetThreadDetailsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailsHandler = this.getThreadDetailsHandler.bind(this);
  }

  async postThreadHandler(request, h) {

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const auth = request.headers.authorization;
    const { id } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({...request.payload,auth, owner: id});
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailsHandler(request, h) {
    
    const getThreadDetails = this._container.getInstance(GetThreadDetailsUseCase.name);
    const { threadId } = request.params;
    console.log(threadId);
    const thread = await getThreadDetails.execute({...request.payload, threadId});
    console.log('handler3');
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
