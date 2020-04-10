import React from 'react';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
       id
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

class List extends React.Component {
    render() {
        const { link, index, id, updateVotesInStore } = this.props;
        const authToken = localStorage.getItem(AUTH_TOKEN);
        return (
            <div className="flex mt2 items-start">
                <div className="flex items-center">
                    <span className="gray">{index + 1}.</span>
                    {authToken && (
                        <Mutation
                            mutation={VOTE_MUTATION}
                            variables={{ linkId: id }}
                            update={(store, { data: { votes }}) => updateVotesInStore(store, votes)}
                        >
                            {voteMutation => (
                                <div className="ml1 gray f11" onClick={voteMutation}>
                                    ▲
                                </div>
                            )}
                        </Mutation>
                    )}
                </div>
                <div className="ml1">
                    <div>
                        {link.description} ({link.url})
                     </div>
                    <div className="f6 lh-copy gray">
                        {link.votes.length} votes | by{' '}
                        {link.postedBy
                            ? link.postedBy.name
                            : 'Unknown'}{' '}
                        {timeDifferenceForDate(link.createdAt)}
                    </div>
                </div>
            </div>
        )
    }
}

export default List;