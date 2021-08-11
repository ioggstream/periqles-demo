import React, {useState} from "react";
import GQLTable from "./GQLTable";

import {gql, ApolloClient, NormalizedCacheObject, ApolloProvider} from "@apollo/client";
import {cache} from "../apolloCache";
import TableSearch from "./TableSearch";
import {queries} from "./queries";

let URI = "";
URI = "http://172.29.0.3:8000/";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({cache, uri: URI});

const renderQuery = (qform) => {
  var options = {};
  if (qform.done) {
    options = {
      variables: {
        done: qform.done
          ? 1
          : 0
      }
    };
  }
  return (<ApolloProvider client={client}>
    <GQLTable query={queries[qform.name]["query"]} options={options}/>
  </ApolloProvider>);
};


const PostForm = (props) => {
  const [qform, setQForm] = useState({name: "activities", filter: "", done: false});

  const submit = (e) => {
    e.preventDefault();
    props.handleSubmit(qform);
  };
  console.log(props);

  return (<form onSubmit={submit}>
    <h1>
      {qform.name}/ {qform.filter}/ {qform.done}
      {
        qform.done
          ? <h1>Done</h1>
          : <h1>Undone</h1>
      }
    </h1>
    <label>
      qname:
      <input type="text" value={qform.name} onChange={e => setQForm({
          ...qform,
          name: e.target.value
        })
}/>
    </label>
    <label>
      qfilter
      <input type="text" value={qform.filter} onChange={e => setQForm({
          ...qform,
          filter: e.target.value
        })
}/>
    </label>

    <label className="switch">
      <input type="checkbox" checked={qform.done} onChange={e => setQForm({
          ...qform,
          done: e.target.checked
        })
}/>
      <span className="slider round"></span>
    </label>

    <input type="submit" value={"Cerca"}/>
  </form>);
};


const Demo = (): JSX.Element => {
  const [data, setData] = useState({name: "activities_implementation", filter: ""});

  const testdata = [
    {
      __typename: "Activity",
      done: 1,
      name: "Building and testing of artifacts in virtual environments",
      dimension: "Build and Deployment",
      subdimension: "Build",
      implementation: [{
        name: "foo",
        __typename: "Implementation"
      }]
    }, {
      __typename: "Activity",
      done: 0,
      name: "Defined build process",
      dimension: "Build and Deployment",
      subdimension: "Build",
      implementation: [{
        name: "foo",
        __typename: "Implementation"
      }]
    }, {
      __typename: "Activity",
      done: 0,
      name: "Signing of artifacts",
      dimension: "Build and Deployment",
      subdimension: "Build",
      implementation: [{
        name: "foo",
        __typename: "Implementation"
      }]
    }
  ];

  const InputButton = ({query_name}) => {
    return (<input type="button" 
            onClick={() => setData({name: query_name, filter: ""})} 
            value={query_name}/>
          )
  }

  return (<main className="Demo">
    <div>
      { Object.keys(queries).map((e) =>  {
        return <InputButton query_name={e}/>}) }
      <br/>
    </div>
    <PostForm handleSubmit={formData => {
        console.log(formData);
        setData(formData);
      }}></PostForm>

    {/*<TableSearch data={testdata}/>*/}
     {data && renderQuery(data)}
  </main>);
};

export default Demo;
