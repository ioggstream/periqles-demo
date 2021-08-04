import React, {useState} from "react";
import GQLTable from "./GQLTable";

import {gql, ApolloClient, NormalizedCacheObject, ApolloProvider} from "@apollo/client";
import {cache} from "../apolloCache";

let URI = "";
URI = "http://172.29.0.3:8000/";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({cache, uri: URI});

const PostForm = (props) => {
  const [qform, setQForm] = useState({qname: "activities", qfilter: ""});

  const submit = (e) => {
    e.preventDefault();
    props.handleSubmit(qform);
  };
  console.log(props);

  return (<form onSubmit={submit}>
    <label>
      qname:
      <input type="text" value={qform.qname} onChange={e => setQForm({
          ...qform,
          qname: e.target.value
        })
}/>
    </label>
    <label>
      qfilter
      <input type="text" value={qform.qfilter} onChange={e => setQForm({
          ...qform,
          qfilter: e.target.value
        })
}/>
    </label>
    <input type="submit" value={"Cerca"}/>
    <h1>
      {qform.qname}
      / {qform.qfilter}
    </h1>
  </form>);
};

const renderQuery = (qform) => {
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
        variables: {}
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
    },
    implementations: {
      query: gql `
        query Implementations($name: String) {
          implementations(name: $name) {
            name
            url
            topics
            tags
          }
        }
      `,
      options: {}
    }
  };
  return (<ApolloProvider client={client}>
    <GQLTable query={queries[qform.qname]["query"]}/>
  </ApolloProvider>);
};
const Demo = (): JSX.Element => {
  const [done, setDone] = useState(true);
  let qfilter = "";

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
          done: done
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
    },
    implementations: {
      query: gql `
        query Implementations($name: String) {
          implementations(name: $name) {
            name
            url
            topics
            tags
          }
        }
      `,
      options: {
        variables: {
          name: qfilter || ""
        }
      }
    }
  };
  const [data, setData] = useState({qname: "activities", qfilter: ""});

  return (<main className="Demo">
    {
      done
        ? <h1>Done</h1>
        : <h1>Undone</h1>
    }
    <div id="client-switch">
      Show undone
      <label className="switch">
        <input type="checkbox" checked={done} onChange={e => setDone(e.target.checked)}/>
        <span className="slider round"></span>
      </label>
      Show done
    </div>

    <PostForm queries={queries} handleSubmit={formData => {
        console.log(formData);
        setData(formData);
      }}></PostForm>
    {data && renderQuery(data)}
  </main>);
};

export default Demo;
