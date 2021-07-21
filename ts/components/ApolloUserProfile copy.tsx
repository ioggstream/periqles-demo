/* eslint-disable*/
import React, {useState} from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import PeriqlesForm from 'periqles';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);

export const GET_DIMENSIONS = gql`
  fragment UserData on Dimension {
    name
    count
  }
`;

export const GET_USER = gql`
  query DimensionCount {
    dimension {
      ...UserData
    }
  }
  ${GET_DIMENSIONS}
`;

export const TOGGLE_ACTIVITY = gql`
mutation toggleActivity($activity: String!) {
  toggleActivity(activity: $activity){
      name
      done
    }
}
`;

const ApolloUserProfile = () => {
  const [updated, setUpdate] = useState(false);
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(GET_USER);
  const [
    toggleActivity,
    respObj
   ] = useMutation(
     TOGGLE_ACTIVITY,
  );

  const specifications: PeriqlesSpecifications = {
    header: 'Sign Up',
    fields: {
    },
  };

  const args = {clientMutationId: '0000'};

  const onSuccess = (response) => {
    refetch(GET_USER);
  };

  const onFailure = (error) => {
    alert(`Problem submitting form: ${error.toString()}`);
  };
  
  const renderUser = (dimension) => {
    console.log(dimension);
    return (
      <div>
        <p><label>Dimension:</label> {dimension.name}</p>
        <p><label>Subdimension no.:</label> {dimension.count}</p>
      </div>
    )
  }
 
    return (
      <div>
      <section className="UserProfile">
          <PeriqlesForm
            mutationName={'toggleActivity'}
            callbacks={{onSuccess, onFailure}}
            specifications={specifications}
            args={args}
            useMutation={toggleActivity}
          />
          <main className="UserProfile-main">
              <h2>Most Recently Added User</h2>
              {loading ? <p>Loading data...</p> : null}
              {error ? <p>ERROR: {JSON.stringify(error)}</p> : null}
              {data && data.dimension ? renderUser(data.dimension[0]): <p>Sign up...</p>}
          </main>
      </section>
    </div>
    );
};

export default ApolloUserProfile;
