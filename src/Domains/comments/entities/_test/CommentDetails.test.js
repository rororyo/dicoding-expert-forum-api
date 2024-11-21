const CommentDetails = require("../CommentDetails");

describe("a CommentDetails entities", () => {
  it('should throw error when comment is not an array', () => {
    const payload = {
      comments: {
        id: "comment-_pby2_tmXV6bcvcdev8xk",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
      },
    };
    expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "comment-123",
      fullname: "Dicoding Indonesia",
    };
    expect(() => new CommentDetails(payload)).toThrowError(
      "COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it('should throw error when comment attributes did not contain needed property', () => {
    const payload = {
      comments: [{
        test:'halohalo'
      }]
    }
    expect(() => new CommentDetails(payload)).toThrowError(
      "COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  })

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      comments: [
        {
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          username: true, 
          date: "2021-08-08T07:22:33.555Z",
          content: 123412, 
          is_delete: false,
        },
      ],
    };
    expect(() => new CommentDetails(payload)).toThrowError(
      "COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it('should return empty array when comments is empty', () => {
    const payload = {
      comments: [],
    };
    const { comments } = new CommentDetails(payload);
    expect(comments).toHaveLength(0);
  });

  it("should soft delete correctly", () => {
    const payload = {
      comments: [
        {
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
          is_delete: 0,
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO-qVD",
          username: "dicoding",
          date: "2021-08-08T07:26:21.338Z",
          content: "**komentar telah dihapus**",
          is_delete: 1,
        },
      ],
    };

    // Action
    const { comments } = new CommentDetails(payload);

    // Assert
    expect(comments[1].content).toEqual("**komentar telah dihapus**");
    const expectedComments = [
      {
        id: "comment-_pby2_tmXV6bcvcdev8xk",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
      },
      {
        id: "comment-yksuCoxM2s4MMrZJO-qVD",
        username: "dicoding",
        date: "2021-08-08T07:26:21.338Z",
        content: "**komentar telah dihapus**",
      },
    ];
    expect(comments).toEqual(expectedComments);
  });

  it("should create CommentDetails object correctly", () => {
    const payload = {
      comments: [
        {
          id: "comment-_pby2_tmXV6bcvcdev8xk",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO-qVD",
          username: "dicoding",
          date: "2021-08-08T07:26:21.338Z",
          content: "**komentar telah dihapus**",
        },
      ],
    };

    // Action
    const commentDetails = new CommentDetails(payload);

    // Assert
    expect(commentDetails.comments).toEqual(payload.comments);
  });
});
