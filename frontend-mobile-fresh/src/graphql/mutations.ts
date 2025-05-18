/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const generateTitleFromContent = /* GraphQL */ `mutation GenerateTitleFromContent($content: String!) {
  generateTitleFromContent(content: $content)
}
` as GeneratedMutation<
  APITypes.GenerateTitleFromContentMutationVariables,
  APITypes.GenerateTitleFromContentMutation
>;
export const expandContent = /* GraphQL */ `mutation ExpandContent($content: String!) {
  expandContent(content: $content)
}
` as GeneratedMutation<
  APITypes.ExpandContentMutationVariables,
  APITypes.ExpandContentMutation
>;
export const createTodo = /* GraphQL */ `mutation CreateTodo(
  $input: CreateTodoInput!
  $condition: ModelTodoConditionInput
) {
  createTodo(input: $input, condition: $condition) {
    id
    name
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTodoMutationVariables,
  APITypes.CreateTodoMutation
>;
export const updateTodo = /* GraphQL */ `mutation UpdateTodo(
  $input: UpdateTodoInput!
  $condition: ModelTodoConditionInput
) {
  updateTodo(input: $input, condition: $condition) {
    id
    name
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTodoMutationVariables,
  APITypes.UpdateTodoMutation
>;
export const deleteTodo = /* GraphQL */ `mutation DeleteTodo(
  $input: DeleteTodoInput!
  $condition: ModelTodoConditionInput
) {
  deleteTodo(input: $input, condition: $condition) {
    id
    name
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTodoMutationVariables,
  APITypes.DeleteTodoMutation
>;
export const createNote = /* GraphQL */ `
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      id
      title
      content
      tags
      isPinned
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateNote = /* GraphQL */ `
  mutation UpdateNote($input: UpdateNoteInput!) {
    updateNote(input: $input) {
      id
      title
      content
      tags
      isPinned
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote($input: DeleteNoteInput!) {
    deleteNote(input: $input) {
      id
      title
      content
      tags
      isPinned
      createdAt
      updatedAt
      owner
    }
  }
`;
