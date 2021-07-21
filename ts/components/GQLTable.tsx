/* eslint-disable*/
import React, {useState} from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
import TableComponent from './TableComponent';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);


export default function GQLTable({query, options={}}){
  const [updated, setUpdate] = useState(false);
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(query, options);
    console.log("auery", query, "options", options);
    return (
      <div>
      <section className="UserProfile">
          <main className="UserProfile-main">
              {loading ? <p>Loading data...</p> : null}
              {error ? <p>ERROR: {JSON.stringify(error)}</p> : null}
              {data &&  Object.entries(data)
              ? Object.entries(data).map((k,v) => 
                (<TableComponent data={k[1]} />))
              : (<p>Sign up...</p>)}
          </main>
      </section>
    </div>
    );
};

