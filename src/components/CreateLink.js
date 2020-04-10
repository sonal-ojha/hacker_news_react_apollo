import React from 'react';
import List from './List';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { GET_LINKS, FEED_QUERY } from './ListAllLinks';
import { LINKS_PER_PAGE } from '../constants';

const POST_NEW_LINK = gql`
  mutation PostLink ($description: String!, $url: String!,) {
    post(description: $description, url: $url){
      id,
      createdAt,
      description,
      url
    }
  }
`;

class CreateLink extends React.Component {
    state = {
      description: '',
      url: '',
    }
  
    render() {
      const { description, url } = this.state
      return (
        <div>
            <div className="flex flex-column mt3">
                <input
                  className="mb2"
                  value={description}
                  onChange={e => this.setState({ description: e.target.value })}
                  type="text"
                  placeholder="A description for the link"
                />
                <input
                  className="mb2"
                  value={url}
                  onChange={e => this.setState({ url: e.target.value })}
                  type="text"
                  placeholder="The URL for the link"
                />
            </div>
            <Mutation
              mutation={POST_NEW_LINK}
              variables={{ description, url }}
              onCompleted={() => this.props.history.push('/new/1')}
              update={(store, { data: { post } }) => {
                const first = LINKS_PER_PAGE;
                const skip = 0;
                const orderBy = 'createdAt_DESC';
                // readQuery always reads data from the local cache while 'query' might retrieve data either from the cache or remotely
                const data = store.readQuery({
                  // query: GET_LINKS,
                  query: FEED_QUERY,
                  variables: { first, skip, orderBy },
                })
                data.feed.links.unshift(post);
                store.writeQuery({
                  // query: GET_LINKS,
                  query: FEED_QUERY,
                  data,
                  variables: { first, skip, orderBy },
                })
              }}
            >
                {postMutation => <button onClick={postMutation}>Submit</button>}
            </Mutation>
        </div>
    )}
}

export default CreateLink;
