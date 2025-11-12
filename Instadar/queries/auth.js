import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($body: LoginForm!) {
    login(body: $body) {
      token
      user {
        _id
        username
        email
        name
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
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($body: RegisterForm!) {
    register(body: $body) {
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
