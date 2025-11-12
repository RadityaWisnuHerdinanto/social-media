import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import * as SecureStore from 'expo-secure-store';

// link: new HttpLink({ uri: "http://localhost:4000" }),
const httpLink = new HttpLink({ uri: "https://instadar.tidarskie.site/" })

const authLink = new SetContextLink(async ({ headers }) => {
  // get the authentication token from local storage if it exists
  const token = await SecureStore.getItemAsync('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
