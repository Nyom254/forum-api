const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { threadId: thread } = request.params;
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const useCasePayload = { content, owner, thread };
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { commentId: id } = request.params;
    const { id: user } = request.auth.credentials;
    const useCasePayload = { id, user };
    await deleteCommentUseCase.execute(useCasePayload);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
