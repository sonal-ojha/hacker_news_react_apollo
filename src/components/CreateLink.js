import React from 'react';
import List from './List';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

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
            <Mutation mutation={POST_NEW_LINK} variables={{ description, url }}>
                {postMutation => <button onClick={postMutation}>Submit</button>}
            </Mutation>
        </div>
    )}
}

export default CreateLink;