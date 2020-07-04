// Imports
import { GraphQLString, GraphQLInt } from 'graphql'

// App Imports
import { UserType } from './types'
import { create, remove } from './resolvers'
// add update to imports

// Create
export const userSignup = {
  type: UserType,
  args: {
    name: {
      name: 'name',
      type: GraphQLString
    },

    email: {
      name: 'email',
      type: GraphQLString
    },

    password: {
      name: 'password',
      type: GraphQLString
    }
  },
  resolve: create
}

// Remove
export const userRemove = {
  type: UserType,
  args: {
    id: {
      name: 'id',
      type: GraphQLInt
    }
  },
  resolve: remove
}

// Place mutation to update User model for styleSummary here
// Add Style
// export const userStyle = {
  // type: UserType,
  // args: {
    // styleSummary: {
      // name: 'styleSummary',
      // type: GraphQLString
    // }
  // },
  // resolve: update
// }
