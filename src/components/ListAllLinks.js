import React from 'react';
import List from './List';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_LINKS = gql`
{
    feed(skip: 0) {
      links{
        id,
        description,
        url
      }
    }
}  
`;

class ListAllLinks extends React.Component {
    render() {
        return (
            <Query query={GET_LINKS}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    return data.feed.links.map(link => <List {...link} key={link.id} />)
                }}
            </Query>
        )
    }
}

export default ListAllLinks;