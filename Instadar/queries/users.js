import { gql } from "@apollo/client"

export const GET_USER = gql`
query Users {
  users {
    _id
    username
    name
    email
  }
}
`
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      _id
      name
      username
      email
      followers {
        _id
        username
        name
      }
      followings {
        _id
        username
        name
      }
    }
  }
`;


export const SEARCH_USER = gql`
query SearchUser($username: String!) {
  searchUser(username: $username) {
    _id
    name
    username
    email
  }
}
`

export const FOLLOW_USER = gql`
mutation FollowUser($followingId: ID!) {
  followUser(followingId: $followingId) {
    followingId
    followerId
  }
}
`   