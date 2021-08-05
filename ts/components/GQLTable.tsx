/* eslint-disable */
import React, {useState} from "react";
import {gql, useQuery, useMutation} from "@apollo/client";
import {PrismLight as SyntaxHighlighter} from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import js from "react-syntax-highlighter/dist/esm/languages/prism/graphql";
import TableComponent from "./TableComponent";
import TableSearch from "./TableSearch";
import styled from "styled-components";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("js", js);

export default function GQLTable({
  query,
  options = {}
}) {
  const [updated, setUpdate] = useState(false);
  const {data, loading, error, refetch} = useQuery(query, options);
  console.log("query", query, "options", options);

  const Styles = styled.div `
    padding: 1rem;

    table {
      border-spacing: 0;
      border: 1px solid black;

      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }

      th,
      td {
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;

        :last-child {
          border-right: 0;
        }
      }
    }
  `;
  return (<div>
    <section className="UserProfile">
      <main className="UserProfile-main">
        {
          loading
            ? <p>Loading data...</p>
            : null
        }
        {
          error
            ? <p>ERROR: {JSON.stringify(error)}</p>
            : null
        }
        {
          data && Object.entries(data)
            ? (Object.entries(data).map((k, v) => 
            <Styles><TableSearch data={k[1]}/>
            </Styles>
            ))
            : (<p>Sign up...</p>)
        }
      </main>
    </section>
  </div>);
}
