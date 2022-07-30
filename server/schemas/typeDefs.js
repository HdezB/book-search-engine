const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id
        username
        email
        bookCount
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    input booksCredentials {
        authors: [Authors]
        description: String!
        bookTitle: String!
        bookId: ID!
        image: String!
        bookLink: String!
    }
    type Auth {
        token
        user: User
    }
    type Query {
        me: User
    }
    
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(criteria: booksCredentials!): User
        removeBook(bookId: ID!): User
    }`