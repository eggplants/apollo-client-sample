import { ApolloClient, ApolloLink, NormalizedCacheObject } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import ApolloLinkTimeout from 'apollo-link-timeout';
import { HttpLink } from "@apollo/client/link/http";
import { URI } from "../constraints/config";

export const getClient = (endpoint?: string): ApolloClient<NormalizedCacheObject> => {
  const httpLink = new HttpLink({
    uri: endpoint || URI,
    fetch: fetch,
  });
  const cache = new InMemoryCache();
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
  const timeoutLink = new ApolloLinkTimeout(10000);
  const link = ApolloLink.from([errorLink, httpLink, timeoutLink]);
  const client = new ApolloClient({ link, cache });
  return client;
};