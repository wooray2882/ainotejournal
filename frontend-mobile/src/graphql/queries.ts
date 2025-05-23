/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      title
      content
      tags
      isPinned
      createdAt
      updatedAt
    }
  }
`;

export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        content
        tags
        isPinned
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const searchNotes = /* GraphQL */ `
  query SearchNotes(
    $filter: SearchableNoteFilterInput
    $sort: [SearchableNoteSortInput]
    $limit: Int
    $nextToken: String
  ) {
    searchNotes(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        content
        tags
        isPinned
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`; 