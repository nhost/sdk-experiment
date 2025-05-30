import { gql } from "@apollo/client";

export const GET_NINJA_TURTLES_WITH_COMMENTS = gql`
  query GetNinjaTurtlesWithComments {
    ninjaTurtles {
      id
      name
      description
      createdAt
      updatedAt
      comments {
        id
        comment
        createdAt
        user {
          id
          displayName
          email
        }
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($ninjaTurtleId: uuid!, $comment: String!) {
    insertComment(
      object: { ninjaTurtleId: $ninjaTurtleId, comment: $comment }
    ) {
      id
      comment
      createdAt
      ninjaTurtleId
    }
  }
`;
