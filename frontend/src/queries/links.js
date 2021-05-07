/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const NEW_LINKS_SUBSCRIPTION = gql`
    subscription {
        newLink {
            id
            url
            description
            createdAt
            postedBy {
                id
                name
            }
            votes {
                id
                user {
                id
                }
            }
        }
    }
`;
