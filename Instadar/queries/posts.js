import { gql } from "@apollo/client";

export const GET_POST = gql`
    query GetPostById($id: ID!) {
  getPostById(_id: $id) {
    _id
    content
    imgUrl
    tags
    createdAt
    author {
      email
      username
      name
    }
    likes {
      username
    }
    comments {
      content
      username
    }
  }
}
`

export const GET_POSTS = gql`
query GetPosts {
  getPosts {
    _id
    content
    imgUrl
    tags
    authorId
    author {
      name
      username
    }
    likes {
      username
    }
    comments {
      username
      content
    }
  }
}
`

export const ADD_POST = gql`
mutation AddPost($body: PostForm) {
  addPost(body: $body) {
    _id
    tags
    imgUrl
    content
  }
}
`

export const COMMENT_POST = gql`
mutation CommentPost($id: ID!, $body: CommentForm) {
  commentPost(_id: $id, body: $body) {
    _id
    comments {
      content
    }
  }
}
`
export const LIKE_POST = gql`
mutation LikePost($id: ID!) {
  likePost(_id: $id) {
    message
  }
}
`
