const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        info: () => 'This is the API of a Hackernews Clone',
        feed: async (parent, args, context) => context.prisma.link.findMany(),
    },
    Mutation: {
        post: (parent, args, context) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            });
            return newLink;
        },
        updateLink: (parent, args, context) => {
            const updatedLink = context.prisma.link.update({
                data: {
                    id: args.id,
                    description: args.description,
                    url: args.url,
                },
            });
            return updatedLink;
        },
        deleteLink: (parent, args, context) => {
            const link = context.prisma.link.deleteLink({
                where: {
                    id: args.id,
                },
            });
            return link;
        },
    },
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8',
    ),
    resolvers,
    context: {
        prisma,
    },
});

server
    .listen()
    .then(({ url }) => console.log(`Server is running on ${url}`));
