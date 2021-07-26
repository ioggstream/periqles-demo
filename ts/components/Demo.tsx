import React, {useState} from "react";
import GQLTable from "./GQLTable";

import {gql, ApolloClient, NormalizedCacheObject, ApolloProvider} from "@apollo/client";
import {cache} from "../apolloCache";

let URI = "";
URI = "http://172.29.0.3:8000/";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({cache, uri: URI});

const Example = (props) => {
  const [implementation, setImplementation] = useState(props.value);
  const handleKeyDown = (e) => {
    console.log("value", e.target.value, props);
    if (e.key === "Enter") {
      console.log("do validate", e.target.value, implementation);
      props.value = implementation;
      props.onChange(implementation); // trigger callback
    }
  };

  return (<div id="implementation-query">
    Ciao:
    <label>
      Implementation:
      <input type="text" value={implementation} onChange={e => setImplementation(e.target.value)} onKeyDown={handleKeyDown}/>
    </label>
  </div>);
};

const Demo = (): JSX.Element => {
  const [relay, setRelay] = useState(true);

  const queries = {
    activities: {
      query: gql `
        query Activities($done: Int) {
          activities(done: $done) {
            done
            name
            dimension
            subdimension
          }
        }
      `,
      options: {
        variables: {
          done: relay
            ? 1
            : 0
        }
      }
    },
    dimensions: {
      query: gql `
        query Dimensions {
          dimension {
            name
          }
        }
      `,
      options: {}
    }
  };

  const [qname, setQname] = useState("activities");
  function handleQname(q) {
    console.log("qname", q);
    setQname(q);
  }
  return (<main className="Demo">
    {
      relay
        ? <h1>Done</h1>
        : <h1>Undone</h1>
    }
    <div id="client-switch">
      Show undone
      <label className="switch">
        <input type="checkbox" checked={relay} onChange={e => setRelay(e.target.checked)}/>
        <span className="slider round"></span>
      </label>
      Show done
    </div>

    <p>
      <small>
        <i>
          This site is just for demonstration purposes. Please don't enter personal information.
        </i>
      </small>
    </p>
    <ApolloProvider client={client}>
      <GQLTable query={queries[qname]["query"]} options={queries[qname]["options"]}/>
    </ApolloProvider>
    <Example value={qname} onChange={handleQname}/>
  </main>);
};

export default Demo;
