import React from 'react';
import List from './List';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { LINKS_PER_PAGE } from '../constants';

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;

export const GET_LINKS = gql`
{
    feed (skip: 0) {
      links{
        id,
        description,
        url,
        createdAt,
        postedBy {
            id
            name
        }
        votes {
            id
            user {
              id
            }
        }
      }
    }
}  
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

class ListAllLinks extends React.Component {
    updateVotesInStore = (store, createVote, linkId) => {
        // const data = store.readQuery({ query: GET_LINKS });
        const isNewPage = this.props.location.pathname.includes('new');
        const page = parseInt(this.props.match.params.page, 10);

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const first = isNewPage ? LINKS_PER_PAGE : 100;
        const orderBy = isNewPage ? 'createdAt_DESC' : null;
        const data = store.readQuery({
          query: FEED_QUERY,
          variables: { first, skip, orderBy }
        });

        const votedLink = data.feed.links.find(link => link.id === linkId);
        votedLink.votes = createVote.link.votes;
        store.writeQuery({ query: GET_LINKS, data });
    }

    subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
          document: NEW_LINKS_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev
            const newLink = subscriptionData.data.newLink
            const exists = prev.feed.links.find(({ id }) => id === newLink.id);
            if (exists) return prev;
      
            return Object.assign({}, prev, {
              feed: {
                links: [newLink, ...prev.feed.links],
                count: prev.feed.links.length + 1,
                __typename: prev.feed.__typename
              }
            })
          }
        })
    };

    // Sec-WebSocket-Protocol: graphql-ws (A ws link)
    _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION,
        });
    }

    _getQueryVariables = () => {
        const isNewPage = this.props.location.pathname.includes('new');
        const page = parseInt(this.props.match.params.page, 10);
      
        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const first = isNewPage ? LINKS_PER_PAGE : 100;
        const orderBy = isNewPage ? 'createdAt_DESC' : null;
        return { first, skip, orderBy };
    };

    _getLinksToRender = data => {
        const isNewPage = this.props.location.pathname.includes('new');
        if (isNewPage) {
          return data.feed.links;
        }
        const rankedLinks = data.feed.links.slice();
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
        return rankedLinks;
    }

    _nextPage = data => {
        const page = parseInt(this.props.match.params.page, 10);
        if (page <= data.feed.count / LINKS_PER_PAGE) {
          const nextPage = page + 1;
          this.props.history.push(`/new/${nextPage}`);
        }
    };
 
    _previousPage = () => {
        const page = parseInt(this.props.match.params.page, 10);
        if (page > 1) {
          const previousPage = page - 1;
          this.props.history.push(`/new/${previousPage}`);
        }
    };

    render() {
        return (
            // <Query query={GET_LINKS}>
            <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
                {({ loading, error, data, subscribeToMore }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    this.subscribeToNewLinks(subscribeToMore);
                    this._subscribeToNewVotes(subscribeToMore);

                    // const linksToRender = data.feed.links;
                    const linksToRender = this._getLinksToRender(data);
                    const isNewPage = this.props.location.pathname.includes('new');
                    const pageIndex = this.props.match.params.page ? (this.props.match.params.page - 1) * LINKS_PER_PAGE : 0;

                    return (
                        <>
                            {linksToRender.map((link, index) => (
                                <List
                                    key={link.id}
                                    link={link}
                                    id={link.id}
                                    index={index + pageIndex}
                                    updateVotesInStore={this.updateVotesInStore}
                                />
                            ))}
                            {isNewPage && (
                                <div className="flex ml4 mv3 gray">
                                    <div className="pointer mr2" onClick={this._previousPage}>
                                    Previous
                                    </div>
                                    <div className="pointer" onClick={() => this._nextPage(data)}>
                                    Next
                                    </div>
                                </div>
                            )}
                        </>
                    )
                }}
            </Query>
        )
    }
}

export default ListAllLinks;