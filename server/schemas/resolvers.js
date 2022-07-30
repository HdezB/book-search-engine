const { AuthenticationError } = require('apollo-server-errors');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData
            }

            throw new AuthenticationError('Not logged In');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect Credentials');
            }
        },
        removeBook: async (parent, { bookdId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBook: bookId } },
                    { new: true }
                )
                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        saveBook: async (parent, { bookdId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookdId } },
                    { new: true }
                ).populate('savedBooks')

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!')
        }
    }
};

module.exports = resolvers;