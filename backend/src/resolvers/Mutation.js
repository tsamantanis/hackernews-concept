const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

async function signup(parent, args, context) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({ data: { ...args, password } });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

async function login(parent, args, context) {
    const user = await context.prisma.user.findUnique({ where: { email: args.email } });
    if (!user) {
        throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

// async function post(parent, args, context) {
//     const { userId } = context;

//     const newPost = context.prisma.link.create({
//         data: {
//             url: args.url,
//             description: args.description,
//             postedBy: { connect: { id: userId } },
//         },
//     });
//     return newPost;
// }

async function post(parent, args, context) {
    const { userId } = context;
    const newLink = await context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } },
        },
    });
    context.pubsub.publish('NEW_LINK', newLink);

    return newLink;
}

async function updateLink(parent, args, context) {
    const updatedLink = context.prisma.link.update({
        data: {
            id: args.id,
            description: args.description,
            url: args.url,
        },
    });
    return updatedLink;
}

async function deleteLink(parent, args, context) {
    context.prisma.link.delete({
        where: {
            id: args.id,
        },
    });

    return { id: args.id };
}

module.exports = {
    signup,
    login,
    post,
    updateLink,
    deleteLink,
};
