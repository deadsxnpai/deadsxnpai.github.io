import { gql } from '@apollo/client';

export const ME = gql(`
  query getME {
    me 
  }
`);
