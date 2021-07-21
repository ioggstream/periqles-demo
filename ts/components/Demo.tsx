import React, {useState} from 'react';
import DimensionTree from './DimensionTree';
import GQLTable from './GQLTable';

import {
  gql,
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider
} from '@apollo/client';
import { cache } from '../apolloCache';

let URI = '';
URI = 'http://172.29.0.3:8000/';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: URI,
});

const Demo = (): JSX.Element => {
  const [relay, setRelay] = useState(true);

  const activities = gql`
    query Activities($done: Int) {
      activities(done: $done) {
        done
        name
        dimension
        subdimension
      }
    }
`;
  const options = {"variables": {"done": relay? 1:0 }};
  return (
    <main className="Demo">
      {relay 
        ? <h1>Done</h1> 
        : <h1>Undone</h1>
      }
      <div id="client-switch">
        Show undone
        <label className="switch">
          <input type="checkbox" 
          checked={relay}
          onChange={(e) => setRelay(e.target.checked)}/>
          <span className="slider round"></span>
        </label>
        Show done
      </div>
      <p><small><i>This site is just for demonstration purposes. Please don't enter personal information.</i></small></p>
      <ApolloProvider client={client}>
        <GQLTable query={activities} options={options}/>
      </ApolloProvider>
            
      
    </main>
  )
}

export default Demo;